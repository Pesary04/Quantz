import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleChangePassword } from "../../server/admin/handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  return send(res, await handleChangePassword(toHandlerRequest(req)));
}
