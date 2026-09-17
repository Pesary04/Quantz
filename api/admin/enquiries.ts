import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleListEnquiries } from "../../server/admin/content-handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  return send(res, await handleListEnquiries(toHandlerRequest(req)));
}
