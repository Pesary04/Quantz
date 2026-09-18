import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleLogin } from "../../server/admin/handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  send(res, await handleLogin(toHandlerRequest(req)));
}
