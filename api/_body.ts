import type { VercelRequest } from "@vercel/node";

/**
 * Vercel's Node runtime normally parses JSON bodies automatically, but if the
 * Content-Type header is missing or the body arrives as a raw string we parse
 * it defensively so a valid submission is never dropped.
 */
export function parseBody(req: VercelRequest): Record<string, unknown> {
  const body = req.body;
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object") return body as Record<string, unknown>;
  return {};
}
