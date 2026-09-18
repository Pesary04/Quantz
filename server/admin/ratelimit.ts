import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Login rate limiting backed by Upstash Redis (the store formerly known as
 * Vercel KV). Limits are keyed by client IP. If Redis is unreachable we fail
 * open so a transient outage can never lock every admin out.
 */
let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "5 m"),
    prefix: "quantz:login",
    analytics: false,
  });
  return limiter;
}

export interface RateResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export async function checkLoginRate(ip: string): Promise<RateResult> {
  const rl = getLimiter();
  if (!rl) return { allowed: true, retryAfterSeconds: 0 };
  try {
    const { success, reset } = await rl.limit(ip);
    return {
      allowed: success,
      retryAfterSeconds: success ? 0 : Math.max(0, Math.ceil((reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[v0] rate limit check failed, failing open:", (error as Error).message);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}
