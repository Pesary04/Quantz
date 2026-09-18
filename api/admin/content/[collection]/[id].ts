import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleDeleteContent,
  handleUpdateContent,
} from "../../../../server/admin/content-handlers.js";
import { routeParam, send, toHandlerRequest } from "../../../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  const collection = routeParam(req, "collection");
  const id = routeParam(req, "id");
  if (req.method === "PUT") return send(res, await handleUpdateContent(hr, collection, id));
  if (req.method === "DELETE") return send(res, await handleDeleteContent(hr, id));
  return res.status(405).json({ error: "Method not allowed." });
}
