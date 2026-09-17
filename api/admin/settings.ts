import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleGetSettings,
  handleUpdateSettings,
} from "../../server/admin/content-handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  if (req.method === "GET") return send(res, await handleGetSettings(hr));
  if (req.method === "PUT" || req.method === "POST") return send(res, await handleUpdateSettings(hr));
  return res.status(405).json({ error: "Method not allowed." });
}
