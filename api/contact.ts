import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, phone, insuranceType, message } = req.body ?? {};

  if (!firstName || !lastName || !phone || !insuranceType) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error("SMTP credentials not configured.");
    return res.status(500).json({
      error:
        "Email service is not configured yet. Please contact us directly at info@quantz.com.na.",
    });
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

    return res.json({
      success: true,
      message: "Your request has been sent! We will be in touch within 24 hours.",
    });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({
      error:
        "Failed to send your request. Please call us directly on +264 81 820 1522.",
    });
  }
}
