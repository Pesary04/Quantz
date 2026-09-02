// Vercel serverless entry for the API.
//
// On Vercel (production) there is no long-running Node process — the Express
// server in server/index.ts (which listens on a port) is only used for local
// development. This function wraps the SAME Express route registration so that
// every /api/* endpoint (contact, enquiry, vehicle-quote, advisor-message)
// works identically when deployed.
//
// vercel.json rewrites /api/(.*) -> /api so all API subpaths reach this
// function; Express still sees the original request URL (e.g. /api/contact)
// and matches the routes registered in registerRoutes().
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

// Register all /api/* routes once per cold start. registerRoutes takes an
// http.Server (used only for its return value here); we pass a non-listening
// server instance so no port is ever bound in the serverless environment.
const ready: Promise<void> = (async () => {
  await registerRoutes(createServer(app), app);

  // JSON error handler so failures always return parseable JSON (never an
  // HTML error page that would break the client's response.json() call).
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    console.error("[v0] API error:", err);
    if (res.headersSent) return next(err);
    res.status(status).json({ error: err?.message || "Internal Server Error" });
  });
})();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ready;
  // Express accepts the Node req/res that Vercel provides and matches the
  // original request URL (e.g. /api/contact) against the registered routes.
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
