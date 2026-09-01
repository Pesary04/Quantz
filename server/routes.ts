import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/contact", async (req, res) => {
    const { firstName, lastName, phone, insuranceType, message } = req.body;

    if (!firstName || !lastName || !phone || !insuranceType) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured.");
      return res.status(500).json({ error: "Email service is not configured yet. Please contact us directly at info@quantz.com.na." });
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
        to: "info@quantz.com.na",
        cc: "admin@quantz.com.na",
        replyTo: smtpUser,
        subject: `New Quote Request — ${insuranceType} — ${firstName} ${lastName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1E3F72, #2D6FA3); padding: 28px 32px;">
              <h2 style="color: white; margin: 0; font-size: 20px;">New Quote Request Received</h2>
              <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
            </div>
            <div style="padding: 28px 32px; background: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 40%;">Full Name</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Phone Number</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Insurance Type</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #1E3F72; font-size: 14px; font-weight: 700;">${insuranceType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 14px;">${message || "<em style='color:#9ca3af'>No message provided</em>"}</td>
                </tr>
              </table>
            </div>
            <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">This enquiry was submitted from the Quantz Financial Services website. Please respond within 24 hours.</p>
            </div>
          </div>
        `,
      });

      return res.json({ success: true, message: "Your request has been sent! We will be in touch within 24 hours." });
    } catch (err) {
      console.error("Email send error:", err);
      return res.status(500).json({ error: "Failed to send your request. Please call us directly on +264 81 820 1522." });
    }
  });

  app.post("/api/advisor-message", async (req, res) => {
    const { message, contact } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Please enter a message before sending." });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured.");
      return res.status(500).json({ error: "Email service is not configured yet. Please contact us directly at info@quantz.com.na." });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const safeContact = (contact || "").toString().trim();

      await transporter.sendMail({
        from: `"Quantz Website" <${smtpUser}>`,
        to: "info@quantz.com.na",
        cc: "admin@quantz.com.na",
        replyTo: safeContact && safeContact.includes("@") ? safeContact : smtpUser,
        subject: `New Advisor Message${safeContact ? ` — ${safeContact}` : ""}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1E3F72, #00A896); padding: 28px 32px;">
              <h2 style="color: white; margin: 0; font-size: 20px;">Speak to an Advisor — New Message</h2>
              <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 13px;">Submitted via quantz.com.na</p>
            </div>
            <div style="padding: 28px 32px; background: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 40%; vertical-align: top;">Contact Details</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827; font-size: 14px; font-weight: 600;">${safeContact || "<em style='color:#9ca3af; font-weight:400'>Not provided</em>"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 14px; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
            </div>
            <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f3f4f6;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">This message was submitted from the "Speak Directly to an Advisor" form on the Quantz Financial Services website.</p>
            </div>
          </div>
        `,
      });

      return res.json({ success: true, message: "Your message has been sent! Our advisor will be in touch shortly." });
    } catch (err) {
      console.error("Advisor message send error:", err);
      return res.status(500).json({ error: "Failed to send your message. Please call us directly on +264 81 820 1522." });
    }
  });

  app.post("/api/vehicle-quote", async (req, res) => {
    const data = req.body || {};

    if (!data.fullName || !data.idNumber || !data.phone || !data.makeModel) {
      return res.status(400).json({ error: "Please complete the required fields: full name, ID number, contact number and vehicle make & model." });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP credentials not configured.");
      return res.status(500).json({ error: "Email service is not configured yet. Please contact us directly at info@quantz.com.na." });
    }

    const esc = (v: unknown) =>
      String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

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

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const clientEmail = String(data.email || "").trim();

      await transporter.sendMail({
        from: `"Quantz Website" <${smtpUser}>`,
        to: "info@quantz.com.na",
        cc: ["admin@quantz.com.na", "selma@quantz.com.na"],
        replyTo: clientEmail.includes("@") ? clientEmail : smtpUser,
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

      return res.json({ success: true, message: "Your vehicle insurance application has been sent! We will be in touch within 24 hours." });
    } catch (err) {
      console.error("Vehicle quote send error:", err);
      return res.status(500).json({ error: "Failed to send your application. Please call us directly on +264 81 820 1522." });
    }
  });

  return httpServer;
}
