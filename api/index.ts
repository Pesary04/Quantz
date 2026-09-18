import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes.js";

// Single serverless entry for the whole API. A rewrite in vercel.json forwards
// every /api/* request (any depth) to this one function, which dispatches via
// the same Express route table used by the local dev server (server/routes.ts),
// so development and production behave identically.
//
// This replaces the previous one-file-per-endpoint layout under api/, which
// created ~20 Serverless Functions and exceeded the deployment function limit.
// The explicit rewrite is required because a bare filesystem catch-all only
// reliably matched single-segment paths (e.g. /api/content), leaving nested
// routes like /api/admin/login returning a platform 404.

const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

let routesReady: Promise<void> | null = null;
function ensureRoutes(): Promise<void> {
  if (!routesReady) {
    const httpServer = createServer(app);
    routesReady = registerRoutes(httpServer, app).then(() => undefined);
  }
  return routesReady;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureRoutes();
  } catch (error) {
    console.error("Failed to initialize API routes:", error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
  // Express app instances are valid Node request listeners; hand off to it.
  (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
