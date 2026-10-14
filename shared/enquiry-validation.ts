import { z } from "zod";

export const COVER_AMOUNT_OPTIONS = [
  "Under N$250k",
  "N$250k–500k",
  "N$500k–1m",
  "N$1m–2m",
  "Over N$2m",
] as const;

export const MIN_APPLICANT_AGE = 18;
export const MAX_APPLICANT_AGE = 90;

const NAME_PATTERN = new RegExp("^\\p{L}+(?:['’-]\\p{L}+)*(?: \\p{L}+(?:['’-]\\p{L}+)*)*$", "u");
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Mobile: 081 / 085 + 7 digits. Landline: 06x area code + 6–7 digits.
const NAMIBIAN_LOCAL_PATTERN = /^(?:8[15]\d{7}|6[1-7]\d{6,7})$/;
export const PHONE_MESSAGE = "Please enter a valid Namibian number, e.g. 081 123 4567 or +264 81 123 4567.";

export const normalisePhone = (value: string) => value.trim().replace(/[\s().-]/g, "");

export function isValidNamibianPhone(value: string): boolean {
  const digits = normalisePhone(value);
  const local = digits.match(/^(?:\+264|00264|264|0)(\d+)$/)?.[1];
  return local !== undefined && NAMIBIAN_LOCAL_PATTERN.test(local);
}

const collapseSpaces = (value: string) => value.trim().replace(/\s+/g, " ");

/**
 * Flags keyboard-mash words such as "hjgdtxjtyugi": a long run of consonants,
 * no vowels at all, or one letter repeated. "sch" is collapsed first so German
 * surnames common in Namibia (Hirschfeld, Fleischmann) are not caught.
 */
function looksLikeKeyboardMash(word: string): boolean {
  const letters = word.toLowerCase().replace(/['’-]/g, "");
  if (letters.length < 3) return false;
  if (/(.)\1\1/.test(letters)) return true;
  if (!/[aeiouyàáâäãåèéêëìíîïòóôöõùúûü]/.test(letters)) return true;
  const consonantRun = letters.replace(/sch/g, "s").match(/[^aeiouyàáâäãåèéêëìíîïòóôöõùúûü]+/g) ?? [];
  return consonantRun.some((run) => run.length >= 5);
}

const realName = (value: string) =>
  !looksLikeGibberish(value) && !value.split(" ").some(looksLikeKeyboardMash);

export function ageOn(dateOfBirth: Date, today: Date): number {
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const beforeBirthday =
    today.getMonth() < dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

/**
 * Flags bot filler like "uICUpRcDRqDmuZysuvEHfiJ": a long single run of letters
 * that flips between lower and upper case several times. Real words and names
 * (including "McDonald" or "MacArthur") do not trip this.
 */
export function looksLikeGibberish(value: string): boolean {
  return value
    .split(/\s+/)
    .some((word) => word.length >= 12 && /^[A-Za-z]+$/.test(word) && (word.match(/[a-z][A-Z]/g)?.length ?? 0) >= 3);
}

const GIBBERISH_MESSAGE = "Please write this in plain words.";
const plainText = (value: string) => !looksLikeGibberish(value);

const NAME_LETTERS_MESSAGE = "Names may only contain letters and spaces.";
const REAL_NAME_MESSAGE = "Please enter your real name, not random letters.";

const fullName = z
  .string()
  .transform(collapseSpaces)
  .pipe(
    z
      .string()
      .min(1, "Please enter your full name.")
      .min(3, "Your name must be at least 3 characters.")
      .max(80, "Full name must be 80 characters or fewer.")
      .regex(NAME_PATTERN, NAME_LETTERS_MESSAGE)
      .refine(
        (value) => {
          const words = value.split(" ");
          return words.length >= 2 && words.every((word) => word.length >= 2);
        },
        "Please enter your first name and surname, e.g. Maria Shikongo.",
      )
      .refine(realName, REAL_NAME_MESSAGE),
  );

const namePart = (label: string) =>
  z
    .string()
    .transform(collapseSpaces)
    .pipe(
      z
        .string()
        .min(1, `Please enter your ${label}.`)
        .min(2, `Your ${label} must be at least 2 characters.`)
        .max(40, `${label[0].toUpperCase()}${label.slice(1)} must be 40 characters or fewer.`)
        .regex(NAME_PATTERN, NAME_LETTERS_MESSAGE)
        .refine(realName, REAL_NAME_MESSAGE),
    );

const phone = z
  .string()
  .min(1, "Please enter your phone number.")
  .refine(isValidNamibianPhone, PHONE_MESSAGE)
  .transform(normalisePhone);

const email = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(120, "Email address must be 120 characters or fewer.")
  .email("Please enter a valid email address.");

const dateOfBirth = z
  .string()
  .trim()
  .regex(ISO_DATE_PATTERN, "Please enter your date of birth.")
  .refine((value) => {
    const dob = new Date(`${value}T00:00:00`);
    if (Number.isNaN(dob.getTime())) return false;
    const age = ageOn(dob, new Date());
    return age >= MIN_APPLICANT_AGE && age <= MAX_APPLICANT_AGE;
  }, `Applicants must be between ${MIN_APPLICANT_AGE} and ${MAX_APPLICANT_AGE} years old.`);

const coverAmount = z.enum(COVER_AMOUNT_OPTIONS, {
  errorMap: () => ({ message: "Please select a cover amount." }),
});

const dependents = z
  .string()
  .trim()
  .regex(/^\d{1,2}$/, "Enter a whole number between 0 and 20.")
  .refine((value) => Number(value) <= 20, "Enter a whole number between 0 and 20.");

const notes = z
  .string()
  .trim()
  .max(1000, "Notes must be 1000 characters or fewer.")
  .refine(plainText, GIBBERISH_MESSAGE)
  .optional()
  .default("");

const optionalEmail = z
  .string()
  .trim()
  .max(120, "Email address must be 120 characters or fewer.")
  .refine((value) => value === "" || z.string().email().safeParse(value).success, "Please enter a valid email address.")
  .optional()
  .default("");

export const contactSchema = z.object({
  firstName: namePart("first name"),
  lastName: namePart("last name"),
  phone,
  insuranceType: z.string().trim().min(1, "Please choose the type of cover you need.").max(60),
  message: notes,
});

export const CONTACT_TIME_OPTIONS = ["Morning", "Afternoon"] as const;

export const insuranceReviewSchema = z.object({
  fullName,
  phone,
  email,
  contactTime: z.enum(CONTACT_TIME_OPTIONS, {
    errorMap: () => ({ message: "Please choose a preferred contact time." }),
  }),
  focus: notes,
});

export type InsuranceReview = z.infer<typeof insuranceReviewSchema>;

export const advisorMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message before sending.")
    .max(1000, "Message must be 1000 characters or fewer.")
    .refine(plainText, GIBBERISH_MESSAGE),
  contact: z
    .string()
    .trim()
    .min(1, "Please enter your email or phone number so we can reply.")
    .max(120)
    .refine(
      (value) => z.string().email().safeParse(value).success || isValidNamibianPhone(value),
      "Enter a valid email address or a Namibian phone number.",
    ),
});

const vehicleExtraField = z
  .string()
  .max(1000, "Each field must be 1000 characters or fewer.")
  .refine(plainText, GIBBERISH_MESSAGE);

export const vehicleQuoteSchema = z
  .object({
    fullName,
    phone,
    email: optionalEmail,
    idNumber: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9]{5,20}$/, "Enter a valid ID or passport number (letters and digits only)."),
    makeModel: z
      .string()
      .trim()
      .min(2, "Please enter the vehicle make and model.")
      .max(80, "Make & model must be 80 characters or fewer.")
      .refine(plainText, GIBBERISH_MESSAGE),
  })
  .catchall(vehicleExtraField);

/** First human-readable validation message, for forms that show a single error. */
export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check your details and try again.";
}

export const lifeEnquirySchema = z.object({
  fullName,
  phone,
  email,
  dateOfBirth,
  coverAmount,
  dependents,
  message: notes,
});

export type LifeEnquiry = z.infer<typeof lifeEnquirySchema>;

export const LIFE_FIELD_LABELS: Record<Exclude<keyof LifeEnquiry, "fullName" | "phone" | "email">, string> = {
  dateOfBirth: "Date of Birth",
  coverAmount: "Cover amount interested in",
  dependents: "Number of dependents",
  message: "Message / notes",
};

/** Returns the first validation message per field, keyed by field name. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
