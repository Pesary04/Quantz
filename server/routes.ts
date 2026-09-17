import type { Express, Request, Response } from "express";
import { type Server } from "http";
import {
  handleContact,
  handleAdvisorMessage,
  handleEnquiry,
  handleVehicleQuote,
} from "./form-handlers.js";
import {
  handleCreatePost,
  handleDeletePost,
  handleGetPost,
  handleListPosts,
  handleLogin,
  handleLogout,
  handlePublicGet,
  handlePublicList,
  handleSession,
  handleUpdatePost,
  type HandlerRequest,
  type HandlerResult,
} from "./admin/handlers.js";
import { runBlobUpload } from "./admin/upload.js";
import type { HandleUploadBody } from "@vercel/blob/client";

function toHandlerRequest(req: Request): HandlerRequest {
  const fwd = req.headers["x-forwarded-for"];
  const ip = Array.isArray(fwd)
    ? fwd[0]
    : fwd?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  return {
    method: req.method,
    body: (req.body ?? {}) as Record<string, unknown>,
    cookieHeader: req.headers.cookie ?? null,
    ip,
  };
}

function send(res: Response, result: HandlerResult) {
  if (result.setCookie) res.setHeader("Set-Cookie", result.setCookie);
  res.status(result.status).json(result.body);
}

/**
 * Registers the API routes on the local Express dev server. Each route calls
 * the same framework-agnostic handler used by the Vercel serverless functions
 * (api/*.ts), so development and production behave identically.
 */
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  /* -------------------- Contact / enquiry forms -------------------- */
  app.post("/api/contact", async (req, res) => {
    const { status, body } = await handleContact(req.body);
    res.status(status).json(body);
  });

  app.post("/api/advisor-message", async (req, res) => {
    const { status, body } = await handleAdvisorMessage(req.body);
    res.status(status).json(body);
  });

  app.post("/api/enquiry", async (req, res) => {
    const { status, body } = await handleEnquiry(req.body);
    res.status(status).json(body);
  });

  app.post("/api/vehicle-quote", async (req, res) => {
    const { status, body } = await handleVehicleQuote(req.body);
    res.status(status).json(body);
  });

  /* -------------------------- Admin auth --------------------------- */
  app.post("/api/admin/login", async (req, res) => send(res, await handleLogin(toHandlerRequest(req))));
  app.get("/api/admin/session", async (req, res) => send(res, await handleSession(toHandlerRequest(req))));
  app.delete("/api/admin/session", async (req, res) => send(res, await handleLogout(toHandlerRequest(req))));

  /* ------------------------- Admin content ------------------------- */
  app.get("/api/admin/posts", async (req, res) => send(res, await handleListPosts(toHandlerRequest(req))));
  app.post("/api/admin/posts", async (req, res) => send(res, await handleCreatePost(toHandlerRequest(req))));
  app.get("/api/admin/posts/:id", async (req, res) =>
    send(res, await handleGetPost(toHandlerRequest(req), req.params.id)),
  );
  app.put("/api/admin/posts/:id", async (req, res) =>
    send(res, await handleUpdatePost(toHandlerRequest(req), req.params.id)),
  );
  app.delete("/api/admin/posts/:id", async (req, res) =>
    send(res, await handleDeletePost(toHandlerRequest(req), req.params.id)),
  );

  /* -------------------------- Blob upload -------------------------- */
  app.post("/api/admin/upload", async (req, res) => {
    try {
      const result = await runBlobUpload({
        body: req.body as HandleUploadBody,
        request: req,
        cookieHeader: req.headers.cookie ?? null,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  /* --------------------------- Public API -------------------------- */
  app.get("/api/posts", async (_req, res) => send(res, await handlePublicList()));
  app.get("/api/posts/:slug", async (req, res) => send(res, await handlePublicGet(req.params.slug)));

  return httpServer;
}
