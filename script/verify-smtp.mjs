import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = parseInt(process.env.SMTP_PORT || "587");
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

console.log("[v0] host:", host, "port:", port, "user:", user, "pass length:", pass ? pass.length : 0);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

try {
  await transporter.verify();
  console.log("[v0] SUCCESS: SMTP authentication works.");
} catch (err) {
  console.log("[v0] FAILED:", err.message);
}
