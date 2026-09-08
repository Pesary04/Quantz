import { sendQuantzMail, isMailConfigured } from "./mailer.js";

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
    .replace(/>/g, "&gt;");

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

export async function handleContact(body: any): Promise<HandlerResult> {
  const { firstName, lastName, phone, insuranceType, message } = body || {};

  if (!firstName || !lastName || !phone || !insuranceType) {
    return { status: 400, body: { error: "Please fill in all required fields." } };
  }
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
    return {
      status: 200,
      body: { success: true, message: "Your request has been sent! We will be in touch within 24 hours." },
    };
  } catch (err) {
    console.error("[v0] contact send error:", err);
    return { status: 500, body: { error: "Failed to send your request. Please call us directly on +264 81 820 1522." } };
  }
}

export async function handleAdvisorMessage(body: any): Promise<HandlerResult> {
  const { message, contact } = body || {};

  if (!message || !String(message).trim()) {
    return { status: 400, body: { error: "Please enter a message before sending." } };
  }
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
    return {
      status: 200,
      body: { success: true, message: "Your message has been sent! Our advisor will be in touch shortly." },
    };
  } catch (err) {
    console.error("[v0] advisor message send error:", err);
    return { status: 500, body: { error: "Failed to send your message. Please call us directly on +264 81 820 1522." } };
  }
}

export async function handleEnquiry(body: any): Promise<HandlerResult> {
  const data = body || {};
  const category = String(data.category || "General Enquiry").trim();
  const fullName = String(data.fullName || "").trim();
  const phone = String(data.phone || "").trim();
  const email = String(data.email || "").trim();

  if (!fullName || !phone || !email) {
    return { status: 400, body: { error: "Please provide your name, phone number and email address." } };
  }
  if (!isMailConfigured()) return NOT_CONFIGURED;

  const extraFields: [string, unknown][] = Array.isArray(data.fields)
    ? data.fields
        .filter((f: unknown) => f && typeof f === "object")
        .map((f: { label?: unknown; value?: unknown }) => [String(f.label ?? ""), f.value] as [string, unknown])
    : [];

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

export async function handleVehicleQuote(body: any): Promise<HandlerResult> {
  const data = body || {};

  if (!data.fullName || !data.idNumber || !data.phone || !data.makeModel) {
    return {
      status: 400,
      body: { error: "Please complete the required fields: full name, ID number, contact number and vehicle make & model." },
    };
  }
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
    return {
      status: 200,
      body: { success: true, message: "Your vehicle insurance application has been sent! We will be in touch within 24 hours." },
    };
  } catch (err) {
    console.error("[v0] vehicle quote send error:", err);
    return { status: 500, body: { error: "Failed to send your application. Please call us directly on +264 81 820 1522." } };
  }
}
