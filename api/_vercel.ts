import type { VercelRequest, VercelResponse } from "@vercel/node";
import { parseBody } from "./_body.js";
import type { HandlerRequest, HandlerResult } from "../server/admin/handlers.js";

/** Build the framework-agnostic request object from a Vercel request. */
export function toHandlerRequest(req: VercelRequest): HandlerRequest {
  const fwd = req.headers["x-forwarded-for"];
  const ip = Array.isArray(fwd)
    ? fwd[0]
    : fwd?.split(",")[0]?.trim() ||
      (req.socket as { remoteAddress?: string } | undefined)?.remoteAddress ||
      "unknown";
  return {
    method: req.method || "GET",
    body: parseBody(req),
    cookieHeader: req.headers.cookie ?? null,
    ip,
  };
}

/** Apply a handler result (status, JSON body, optional Set-Cookie) to the response. */
export function send(res: VercelResponse, result: HandlerResult): void {
  if (result.setCookie) res.setHeader("Set-Cookie", result.setCookie);
  res.status(result.status).json(result.body);
}

/** Read the id/slug route param from a Vercel dynamic route. */
export function routeParam(req: VercelRequest, key: string): string {
  const value = req.query[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}
