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

const NAME_PATTERN = new RegExp("^\\p{L}[\\p{L}\\s'’-]*$", "u");
const NAMIBIAN_PHONE_PATTERN = /^(\+264|0)\d{8,9}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const normalisePhone = (value: string) => value.replace(/[\s()-]/g, "");

export function ageOn(dateOfBirth: Date, today: Date): number {
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const beforeBirthday =
    today.getMonth() < dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

const fullName = z
  .string()
  .trim()
  .min(2, "Please enter your full name (at least 2 characters).")
  .max(80, "Full name must be 80 characters or fewer.")
  .regex(NAME_PATTERN, "Name may only contain letters, spaces, hyphens and apostrophes.");

const phone = z
  .string()
  .transform(normalisePhone)
  .pipe(
    z
      .string()
      .regex(
        NAMIBIAN_PHONE_PATTERN,
        "Enter a Namibian number starting with +264 or 0, e.g. +264 81 123 4567.",
      ),
  );

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

const notes = z.string().trim().max(1000, "Notes must be 1000 characters or fewer.").optional().default("");

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
