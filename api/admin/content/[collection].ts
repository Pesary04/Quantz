import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCreateContent, handleListContent } from "../../../server/admin/content-handlers.js";
import { routeParam, send, toHandlerRequest } from "../../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  const collection = routeParam(req, "collection");
  if (req.method === "GET") return send(res, await handleListContent(hr, collection));
  if (req.method === "POST") return send(res, await handleCreateContent(hr, collection));
  return res.status(405).json({ error: "Method not allowed." });
}
