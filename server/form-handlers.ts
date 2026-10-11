import { sendQuantzMail, isMailConfigured } from "./mailer.js";
import { saveEnquirySafe } from "./admin/enquiries-service.js";
import { checkFormRate, verifyFormToken } from "./form-guard.js";
import {
  LIFE_FIELD_LABELS,
  advisorMessageSchema,
  contactSchema,
  firstError,
  insuranceReviewSchema,
  lifeEnquirySchema,
  looksLikeGibberish,
  vehicleQuoteSchema,
} from "../shared/enquiry-validation.js";

/**
 * Framework-agnostic form handlers.
 *
 * Each function validates a submission body, sends the email via the shared
 * pooled mailer, and returns an { status, body } result. Both the local
 * Express dev server (server/routes.ts) and the Vercel serverless functions
 * (api/*.ts) call these, so development and production run identical logic.
 */

export type HandlerResult = { status: number; body: Record<string, unknown> };

const NOT_CONFIGURED: HandlerResult = {
  status: 500,
  body: {
    error:
      "Email service is not configured yet. Please contact us directly at info@quantz.com.na.",
  },
};

const CC = ["admin@quantz.com.na", "selma@quantz.com.na"];
const TO = "info@quantz.com.na";

const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const INVALID_SUBMISSION: HandlerResult = {
  status: 400,
  body: { error: "We couldn't process your enquiry. Please check your details and try again." },
};

const VERIFICATION_FAILED: HandlerResult = {
  status: 400,
  body: { error: "Your session expired. Please refresh the page and try again." },
};

const TOO_FAST: HandlerResult = {
  status: 400,
  body: { error: "That was quick! Please take a moment to check your details, then submit again." },
};

const RATE_LIMITED: HandlerResult = {
  status: 429,
  body: { error: "Too many submissions from your connection. Please wait a few minutes or call us on +264 81 820 1522." },
};

const ENQUIRY_SUCCESS: HandlerResult = {
  status: 200,
  body: { success: true, message: "Thank you! Your enquiry has been sent and our team will be in touch within 24 hours." },
};

type GuardOutcome = { ok: true } | { ok: false; bot: true } | { ok: false; bot: false; result: HandlerResult };

/**
 * Shared spam checks for every public form. A filled honeypot is a bot:
 * callers return a fake success so bots don't learn they were caught.
 */
async function runBotGuards(data: Record<string, unknown>, clientIp?: string): Promise<GuardOutcome> {
  if (typeof data.company === "string" && data.company.trim() !== "") return { ok: false, bot: true };
  const token = await verifyFormToken(data.formToken);
  if (token === "too-fast") return { ok: false, bot: false, result: TOO_FAST };
  if (token === "invalid") return { ok: false, bot: false, result: VERIFICATION_FAILED };
  if (!(await checkFormRate(clientIp))) return { ok: false, bot: false, result: RATE_LIMITED };
  return { ok: true };
}

const asObject = (body: unknown): Record<string, unknown> =>
  body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};

const invalid = (message: string): HandlerResult => ({ status: 400, body: { error: message } });

const MAX_EXTRA_FIELDS = 12;
const MAX_FIELD_LABEL = 80;
const MAX_FIELD_VALUE = 1000;
const MAX_CATEGORY = 60;

const rows = (fields: [string, unknown][]) =>
  fields
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 9px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 42%; vertical-align: top;">${esc(label)}</td>
          <td style="padding: 9px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600; white-space: pre-wrap;">${
            esc(value).trim() || "<em style='color:#9ca3af; font-weight:400'>Not provided</em>"
          }</td>
        </tr>`
    )
    .join("");

const CONTACT_SUCCESS: HandlerResult = {
  status: 200,
  body: { success: true, message: "Your request has been sent! We will be in touch within 24 hours." },
};

export async function handleContact(body: unknown, clientIp?: string): Promise<HandlerResult> {
  const data = asObject(body);
  const guard = await runBotGuards(data, clientIp);
  if (!guard.ok) return guard.bot ? CONTACT_SUCCESS : guard.result;

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) return invalid(firstError(parsed.error));
  const { firstName, lastName, phone, insuranceType, message } = parsed.data;

  await saveEnquirySafe({
    type: "contact",
    category: String(insuranceType),
    name: `${firstName} ${lastName}`.trim(),
    phone: String(phone),
    message: String(message ?? ""),
    payload: { firstName, lastName, phone, insuranceType, message: message ?? "" },
  });

  if (!isMailConfigured()) return NOT_CONFIGURED;

  try {
    await sendQuantzMail({
      to: TO,
      cc: CC,
      replyTo: process.env.SMTP_USER,
      subject: `New Quote Request — ${insuranceType} — ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1E3F72, #2D6FA3); padding: 28px 32px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">New Quote Request Received</h2>
            <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
          </div>
          <div style="padding: 28px 32px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rows([
                ["Full Name", `${firstName} ${lastName}`],
                ["Phone Number", phone],
                ["Insurance Type", insuranceType],
                ["Message", message || ""],
              ])}
            </table>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">This enquiry was submitted from the Quantz Financial Services website. Please respond within 24 hours.</p>
          </div>
        </div>
      `,
    });
    return CONTACT_SUCCESS;
  } catch (err) {
    console.error("contact send error:", err);
    return { status: 500, body: { error: "Failed to send your request. Please call us directly on +264 81 820 1522." } };
  }
}

const REVIEW_SUCCESS: HandlerResult = {
  status: 200,
  body: { success: true, message: "Thank you. We have received your request and will be in touch shortly." },
};

export async function handleInsuranceReview(body: unknown, clientIp?: string): Promise<HandlerResult> {
  const data = asObject(body);
  const guard = await runBotGuards(data, clientIp);
  if (!guard.ok) return guard.bot ? REVIEW_SUCCESS : guard.result;

  const parsed = insuranceReviewSchema.safeParse(data);
  if (!parsed.success) return invalid(firstError(parsed.error));
  const { fullName, phone, email, contactTime, focus } = parsed.data;

  await saveEnquirySafe({
    type: "insurance-review",
    category: "Insurance Cover Review",
    name: fullName,
    phone,
    email,
    message: focus,
    payload: { fullName, phone, email, contactTime, focus },
  });

  if (!isMailConfigured()) return NOT_CONFIGURED;

  try {
    await sendQuantzMail({
      to: TO,
      cc: CC,
      replyTo: email,
      subject: `New Insurance Review Request — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1E3F72, #2D6FA3); padding: 28px 32px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">New Insurance Review Request</h2>
            <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Booked via the Quantz Insights newsletter CTA</p>
          </div>
          <div style="padding: 28px 32px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rows([
                ["Full Name", fullName],
                ["Cell Number", phone],
                ["Email Address", email],
                ["Preferred Contact Time", contactTime],
                ["Focus Areas", focus],
              ])}
            </table>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">This review request was submitted from the Quantz Financial Services website. Please respond within 24 hours.</p>
          </div>
        </div>
      `,
    });
    return REVIEW_SUCCESS;
  } catch (err) {
    console.error("insurance review send error:", err);
    return { status: 500, body: { error: "Failed to send your request. Please call us directly on +264 81 820 1522." } };
  }
}

const ADVISOR_SUCCESS: HandlerResult = {
  status: 200,
  body: { success: true, message: "Your message has been sent! Our advisor will be in touch shortly." },
};

export async function handleAdvisorMessage(body: unknown, clientIp?: string): Promise<HandlerResult> {
  const data = asObject(body);
  const guard = await runBotGuards(data, clientIp);
  if (!guard.ok) return guard.bot ? ADVISOR_SUCCESS : guard.result;

  const parsed = advisorMessageSchema.safeParse(data);
  if (!parsed.success) return invalid(firstError(parsed.error));
  const { message, contact } = parsed.data;

  const contactStr = contact;
  await saveEnquirySafe({
    type: "advisor",
    category: "Advisor Message",
    email: contactStr.includes("@") ? contactStr : "",
    phone: contactStr.includes("@") ? "" : contactStr,
    message: String(message),
    payload: { contact: contactStr, message },
  });

  if (!isMailConfigured()) return NOT_CONFIGURED;

  try {
    const safeContact = (contact || "").toString().trim();
    await sendQuantzMail({
      to: TO,
      cc: CC,
      replyTo: safeContact && safeContact.includes("@") ? safeContact : process.env.SMTP_USER,
      subject: `New Advisor Message${safeContact ? ` — ${safeContact}` : ""}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1E3F72, #00A896); padding: 28px 32px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">Speak to an Advisor — New Message</h2>
            <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
          </div>
          <div style="padding: 28px 32px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              ${rows([
                ["Contact Details", safeContact || ""],
                ["Message", message],
              ])}
            </table>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">This message was submitted from the "Speak Directly to an Advisor" form on the Quantz Financial Services website.</p>
          </div>
        </div>
      `,
    });
    return ADVISOR_SUCCESS;
  } catch (err) {
    console.error("advisor message send error:", err);
    return { status: 500, body: { error: "Failed to send your message. Please call us directly on +264 81 820 1522." } };
  }
}

function parseGenericExtraFields(raw: unknown): [string, string][] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > MAX_EXTRA_FIELDS) return null;
  const fields: [string, string][] = [];
  for (const f of raw) {
    if (!f || typeof f !== "object") return null;
    const label = String((f as { label?: unknown }).label ?? "").trim();
    const value = String((f as { value?: unknown }).value ?? "").trim();
    if (!label || label.length > MAX_FIELD_LABEL || value.length > MAX_FIELD_VALUE) return null;
    if (looksLikeGibberish(value)) return null;
    fields.push([label, value]);
  }
  return fields;
}

export async function handleEnquiry(body: any, clientIp?: string): Promise<HandlerResult> {
  const data: Record<string, any> = asObject(body);
  const guard = await runBotGuards(data, clientIp);
  if (!guard.ok) return guard.bot ? ENQUIRY_SUCCESS : guard.result;

  const category = String(data.category || "General Enquiry").trim().slice(0, MAX_CATEGORY);
  const isLifeCover = category === "Life Cover";

  let fullName: string;
  let phone: string;
  let email: string;
  let extraFields: [string, string][];
  let payload: Record<string, unknown>;

  if (isLifeCover) {
    const parsed = lifeEnquirySchema.safeParse({
      ...data,
      ...(data.details && typeof data.details === "object" ? data.details : {}),
    });
    if (!parsed.success) return INVALID_SUBMISSION;
    const life = parsed.data;
    ({ fullName, phone, email } = life);
    extraFields = [
      [LIFE_FIELD_LABELS.dateOfBirth, life.dateOfBirth],
      [LIFE_FIELD_LABELS.coverAmount, life.coverAmount],
      [LIFE_FIELD_LABELS.dependents, life.dependents],
      [LIFE_FIELD_LABELS.message, life.message],
    ];
    payload = { category, ...life };
  } else {
    const parsedBase = lifeEnquirySchema
      .pick({ fullName: true, phone: true, email: true })
      .safeParse(data);
    const parsedExtra = parseGenericExtraFields(data.fields);
    if (!parsedBase.success || !parsedExtra) return INVALID_SUBMISSION;
    ({ fullName, phone, email } = parsedBase.data);
    extraFields = parsedExtra;
    payload = { category, fullName, phone, email, fields: extraFields.map(([label, value]) => ({ label, value })) };
  }

  await saveEnquirySafe({
    type: "enquiry",
    category,
    name: fullName,
    phone,
    email,
    payload,
  });

  if (!isMailConfigured()) return NOT_CONFIGURED;

  const baseFields: [string, unknown][] = [
    ["Full Name", fullName],
    ["Phone Number", phone],
    ["Email Address", email],
  ];

  try {
    await sendQuantzMail({
      to: TO,
      cc: CC,
      replyTo: email.includes("@") ? email : process.env.SMTP_USER,
      subject: `New ${category} Enquiry — ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1E3F72, #2D6FA3); padding: 28px 32px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">New ${esc(category)} Enquiry</h2>
            <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
          </div>
          <div style="padding: 26px 32px; background: #ffffff;">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #0d2e52; text-transform: uppercase; letter-spacing: 0.05em;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">${rows(baseFields)}</table>
            ${
              extraFields.length
                ? `<h3 style="margin: 26px 0 12px; font-size: 15px; color: #0d2e52; text-transform: uppercase; letter-spacing: 0.05em;">Enquiry Details</h3>
                   <table style="width: 100%; border-collapse: collapse;">${rows(extraFields)}</table>`
                : ""
            }
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">This enquiry was submitted from the Quantz Financial Services website. Please respond within 24 hours. Client information is confidential and used solely to assess needs and provide suitable options.</p>
          </div>
        </div>
      `,
    });
    return {
      status: 200,
      body: { success: true, message: "Thank you! Your enquiry has been sent and our team will be in touch within 24 hours." },
    };
  } catch (err) {
    console.error("[v0] enquiry send error:", err);
    return { status: 500, body: { error: "Failed to send your enquiry. Please call us directly on +264 81 820 1522." } };
  }
}

const VEHICLE_SUCCESS: HandlerResult = {
  status: 200,
  body: { success: true, message: "Your vehicle insurance application has been sent! We will be in touch within 24 hours." },
};

const MAX_VEHICLE_FIELDS = 40;

export async function handleVehicleQuote(body: unknown, clientIp?: string): Promise<HandlerResult> {
  const raw = asObject(body);
  const guard = await runBotGuards(raw, clientIp);
  if (!guard.ok) return guard.bot ? VEHICLE_SUCCESS : guard.result;

  const { company: _honeypot, formToken: _token, turnstileToken: _legacy, ...fields } = raw;
  if (Object.keys(fields).length > MAX_VEHICLE_FIELDS) return INVALID_SUBMISSION;
  const parsed = vehicleQuoteSchema.safeParse(fields);
  if (!parsed.success) return invalid(firstError(parsed.error));
  const data: Record<string, string> = parsed.data as Record<string, string>;

  await saveEnquirySafe({
    type: "vehicle",
    category: "Vehicle Insurance",
    name: String(data.fullName),
    phone: String(data.phone ?? ""),
    email: String(data.email ?? ""),
    payload: data,
  });

  if (!isMailConfigured()) return NOT_CONFIGURED;

  const clientFields: [string, unknown][] = [
    ["Full Name", data.fullName],
    ["Date of Birth", data.dateOfBirth],
    ["ID Number", data.idNumber],
    ["Nationality", data.nationality],
    ["Gender", data.gender],
    ["Marital Status", data.maritalStatus],
    ["Licence Obtained (Year)", data.licenceYear],
    ["Licence Code", data.licenceCode],
    ["Occupation", data.occupation],
    ["Postal Address", data.postalAddress],
    ["Residential Address", data.residentialAddress],
    ["Contact Number", data.phone],
    ["Email Address", data.email],
  ];

  const vehicleFields: [string, unknown][] = [
    ["Make & Model", data.makeModel],
    ["Year", data.vehicleYear],
    ["Vehicle Description", data.vehicleDescription],
    ["Engine Capacity", data.engineCapacity],
    ["MM Code", data.mmCode],
    ["Value (Approximate)", data.vehicleValue],
    ["Car Hire Required", data.carHire],
    ["Insurance History", data.insuranceHistory],
    ["Claim History", data.claimHistory],
  ];

  try {
    const clientEmail = String(data.email || "").trim();
    await sendQuantzMail({
      to: TO,
      cc: CC,
      replyTo: clientEmail.includes("@") ? clientEmail : process.env.SMTP_USER,
      subject: `New Vehicle Insurance Application — ${esc(data.fullName)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e7bc4, #0d2e52); padding: 28px 32px;">
            <h2 style="color: white; margin: 0; font-size: 20px;">Vehicle Insurance Application</h2>
            <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
          </div>
          <div style="padding: 26px 32px; background: #ffffff;">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #0d2e52; text-transform: uppercase; letter-spacing: 0.05em;">Client Information</h3>
            <table style="width: 100%; border-collapse: collapse;">${rows(clientFields)}</table>
            <h3 style="margin: 26px 0 12px; font-size: 15px; color: #0d2e52; text-transform: uppercase; letter-spacing: 0.05em;">Vehicle Details</h3>
            <table style="width: 100%; border-collapse: collapse;">${rows(vehicleFields)}</table>
          </div>
          <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">Client information is confidential and used solely to assess insurance needs and provide a quotation. Quantz Financial Services CC is an authorised financial services provider regulated by NAMFISA.</p>
          </div>
        </div>
      `,
    });
    return VEHICLE_SUCCESS;
  } catch (err) {
    console.error("vehicle quote send error:", err);
    return { status: 500, body: { error: "Failed to send your application. Please call us directly on +264 81 820 1522." } };
  }
}
