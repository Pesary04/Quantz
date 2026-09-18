import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleDeletePost,
  handleGetPost,
  handleUpdatePost,
} from "../../../server/admin/handlers.js";
import { routeParam, send, toHandlerRequest } from "../../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  const id = routeParam(req, "id");
  if (req.method === "GET") return send(res, await handleGetPost(hr, id));
  if (req.method === "PUT") return send(res, await handleUpdatePost(hr, id));
  if (req.method === "DELETE") return send(res, await handleDeletePost(hr, id));
  return res.status(405).json({ error: "Method not allowed." });
}
