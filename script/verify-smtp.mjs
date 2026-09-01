import nodemailer from "nodemailer";

const port = parseInt(process.env.SMTP_PORT || "587");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

try {
  await transporter.verify();
  console.log("[v0] SMTP auth OK against", process.env.SMTP_HOST, "port", port);

  const info = await transporter.sendMail({
    from: `"Quantz Website" <${process.env.SMTP_USER}>`,
    to: "info@quantz.com.na",
    cc: "admin@quantz.com.na",
    replyTo: process.env.SMTP_USER,
    subject: "Quantz website email test — please ignore",
    text: "This is an automated test confirming the website contact/quote forms can send email and CC admin@quantz.com.na.",
  });
  console.log("[v0] Test email sent. messageId:", info.messageId);
  console.log("[v0] accepted:", info.accepted);
  console.log("[v0] rejected:", info.rejected);
} catch (err) {
  console.log("[v0] SMTP error:", err.message);
  process.exitCode = 1;
}
