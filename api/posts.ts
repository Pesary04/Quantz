import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handlePublicList } from "../server/admin/handlers.js";
import { send } from "./_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  send(res, await handlePublicList());
}
