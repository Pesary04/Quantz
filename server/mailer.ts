import nodemailer, { type Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

/**
 * Shared, pooled SMTP transporter.
 *
 * Previously every form handler called nodemailer.createTransport() and then
 * sendMail() on each request. That meant a full cold TCP + STARTTLS + AUTH
 * handshake to Office 365 on every submission (~3.5s), which frequently
 * outlasted the preview proxy / browser fetch window and surfaced to users as
 * "Could not send your request" — even though the mail often did go out.
 *
 * A single pooled transporter keeps warm connections open and reuses them, so
 * subsequent sends complete in well under a second. Explicit timeouts ensure a
 * genuinely stuck connection fails fast instead of hanging indefinitely.
 */

let transporter: Transporter | null = null;
let cachedKey = "";

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  const host = process.env.SMTP_HOST as string;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER as string;
  const pass = process.env.SMTP_PASS as string;

  // Rebuild the transporter if any credential changed (e.g. env reloaded).
  const key = `${host}:${port}:${user}:${pass}`;
  if (transporter && key === cachedKey) return transporter;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    requireTLS: port !== 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  cachedKey = key;
  return transporter;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Sends an email through the pooled transporter, always to info@ with the
 * shared admin CC, and retries once on a transient failure. Throws if the
 * mail cannot be delivered after the retry so callers can report an error.
 */
export async function sendQuantzMail(options: Mail.Options): Promise<void> {
  const from = `"Quantz Website" <${process.env.SMTP_USER}>`;
  const message: Mail.Options = { from, ...options };

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await getTransporter().sendMail(message);
      return;
    } catch (err) {
      lastErr = err;
      console.error(`[v0] mail send attempt ${attempt} failed:`, err);
      // Drop the pooled transporter so the retry rebuilds a fresh connection.
      try {
        transporter?.close();
      } catch {
        /* ignore */
      }
      transporter = null;
      cachedKey = "";
      if (attempt < 2) await sleep(500);
    }
  }
  throw lastErr;
}

// Warm the pool at startup so the first real submission is already fast, and
// surface credential/connection problems early in the server logs.
export function verifyMailer(): void {
  if (!isMailConfigured()) {
    console.warn("[v0] SMTP not configured — contact forms will report an error until SMTP_* env vars are set.");
    return;
  }
  getTransporter()
    .verify()
    .then(() => console.log("[v0] SMTP transporter verified and ready."))
    .catch((err) => console.error("[v0] SMTP verify failed:", err));
}
