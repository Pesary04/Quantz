import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Invisible bot protection for every public form (no visible widget, so
 * nothing depends on Cloudflare hostname settings).
 *
 * 1. The page fetches a signed, timestamped form token when it loads.
 * 2. On submit the server checks the signature, that the form was open for at
 *    least MIN_FILL_MS (bots post instantly), that it isn't stale, and that the
 *    token hasn't been used before.
 * 3. Submissions are rate limited per IP.
 */

const MIN_FILL_MS = 3_000;
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

const signingSecret = () =>
  process.env.FORM_SIGNING_SECRET || process.env.TURNSTILE_SECRET_KEY || process.env.KV_REST_API_TOKEN || "";

let redis: Redis | null | undefined;
function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

let limiter: Ratelimit | null | undefined;
function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const r = getRedis();
  limiter = r
    ? new Ratelimit({ redis: r, limiter: Ratelimit.slidingWindow(6, "10 m"), prefix: "quantz:forms", analytics: false })
    : null;
  return limiter;
}

const sign = (payload: string) => createHmac("sha256", signingSecret()).update(payload).digest("base64url");

export function issueFormToken(): string {
  const payload = `${Date.now()}.${randomUUID()}`;
  return `${payload}.${sign(payload)}`;
}

export type FormTokenResult = "ok" | "too-fast" | "invalid";

export async function verifyFormToken(token: unknown): Promise<FormTokenResult> {
  if (!signingSecret() || typeof token !== "string" || token.length > 200) return "invalid";
  const parts = token.split(".");
  if (parts.length !== 3) return "invalid";
  const [issuedAt, nonce, signature] = parts;

  const expected = Buffer.from(sign(`${issuedAt}.${nonce}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return "invalid";

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age > MAX_AGE_MS || age < 0) return "invalid";
  if (age < MIN_FILL_MS) return "too-fast";

  const r = getRedis();
  if (r) {
    try {
      const firstUse = await r.set(`quantz:formtok:${nonce}`, 1, { nx: true, px: MAX_AGE_MS });
      if (firstUse !== "OK") return "invalid";
    } catch (err) {
      console.error("form token replay check failed, allowing:", (err as Error).message);
    }
  }
  return "ok";
}

export async function checkFormRate(ip: string | undefined): Promise<boolean> {
  const rl = getLimiter();
  if (!rl || !ip) return true;
  try {
    return (await rl.limit(ip)).success;
  } catch (err) {
    console.error("form rate limit failed, allowing:", (err as Error).message);
    return true;
  }
}
