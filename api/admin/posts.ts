import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCreatePost, handleListPosts } from "../../server/admin/handlers.js";
import { send, toHandlerRequest } from "../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  if (req.method === "GET") return send(res, await handleListPosts(hr));
  if (req.method === "POST") return send(res, await handleCreatePost(hr));
  return res.status(405).json({ error: "Method not allowed." });
}
