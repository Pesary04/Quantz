import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleLogout, handleSession } from "../../server/admin/handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  if (req.method === "GET") return send(res, await handleSession(hr));
  if (req.method === "DELETE") return send(res, await handleLogout(hr));
  return res.status(405).json({ error: "Method not allowed." });
}
