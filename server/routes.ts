import type { Express } from "express";
import { type Server } from "http";
import nodemailer from "nodemailer";

const RECIPIENT = "info@quantz.com.na";
const PHONE = "+264 81 820 1522";

function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value: string, accent = false) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:40%;">${label}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:${accent ? "#1E3F72" : "#111827"};font-size:14px;font-weight:${accent ? 700 : 600};">${value}</td>
    </tr>`;
}

function wrap(title: string, subtitle: string, rows: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#1E3F72,#2D6FA3);padding:28px 32px;">
        <h2 style="color:white;margin:0;font-size:20px;">${title}</h2>
        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">${subtitle}</p>
      </div>
      <div style="padding:28px 32px;background:#ffffff;">
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">This enquiry was submitted from the Quantz Financial Services website. Please respond within 24 hours.</p>
      </div>
    </div>`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/contact", async (req, res) => {
    const { source, firstName, lastName, phone, insuranceType, name, email, message } = req.body || {};
    const kind = source === "advisor" ? "advisor" : "quote";

    if (kind === "quote") {
      if (!firstName || !lastName || !phone || !insuranceType) {
        return res.status(400).json({ error: "Please fill in all required fields." });
      }
    } else if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Please enter a message." });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("[v0] SMTP credentials not configured.");
      return res.status(500).json({ error: `Email service is not configured yet. Please contact us directly at ${RECIPIENT}.` });
    }

    let subject: string;
    let html: string;
    let replyTo: string | undefined;

    if (kind === "advisor") {
      const senderName = name?.trim() || "Website Visitor";
      replyTo = email?.trim() || undefined;
      subject = `New Advisor Message — ${senderName}`;
      html = wrap(
        "New Advisor Message",
        "Submitted via the “Speak to an Advisor” form on quantz.com.na",
        row("Name", esc(senderName)) +
          row("Email", esc(email?.trim() || "Not provided")) +
          `<tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Message</td><td style="padding:10px 0;color:#111827;font-size:14px;white-space:pre-wrap;">${esc(message)}</td></tr>`,
      );
    } else {
      replyTo = email?.trim() || undefined;
      subject = `New Quote Request — ${esc(insuranceType)} — ${esc(firstName)} ${esc(lastName)}`;
      html = wrap(
        "New Quote Request Received",
        "Submitted via quantz.com.na",
        row("Full Name", `${esc(firstName)} ${esc(lastName)}`) +
          row("Phone Number", esc(phone)) +
          row("Insurance Type", esc(insuranceType), true) +
          `<tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Message</td><td style="padding:10px 0;color:#111827;font-size:14px;white-space:pre-wrap;">${message ? esc(message) : "<em style='color:#9ca3af'>No message provided</em>"}</td></tr>`,
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Quantz Website" <${smtpUser}>`,
        to: RECIPIENT,
        replyTo: replyTo || smtpUser,
        subject,
        html,
      });

      return res.json({
        success: true,
        message: kind === "advisor"
          ? "Your message has been sent! Our advisor will be in touch shortly."
          : "Your request has been sent! We will be in touch within 24 hours.",
      });
    } catch (err) {
      console.error("[v0] Email send error:", err);
      return res.status(500).json({ error: `Failed to send your request. Please call us directly on ${PHONE}.` });
    }
  });

  return httpServer;
}
