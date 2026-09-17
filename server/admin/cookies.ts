export const SESSION_COOKIE = "quantz_admin_session";

/** Parse a raw `Cookie` header into a name/value map. */
export function parseCookies(header: string | undefined | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (name) out[name] = decodeURIComponent(value);
  }
  return out;
}

interface CookieOptions {
  maxAgeSeconds?: number;
  expires?: Date;
}

/** Serialize an httpOnly session cookie string for a `Set-Cookie` header. */
export function serializeSessionCookie(value: string, options: CookieOptions = {}): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
  ];
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`);
  if (typeof options.maxAgeSeconds === "number") parts.push(`Max-Age=${options.maxAgeSeconds}`);
  return parts.join("; ");
}

/** A cookie string that immediately clears the session cookie. */
export function clearSessionCookie(): string {
  return serializeSessionCookie("", { maxAgeSeconds: 0, expires: new Date(0) });
}
