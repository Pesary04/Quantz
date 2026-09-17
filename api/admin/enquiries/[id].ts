import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  handleDeleteEnquiry,
  handleUpdateEnquiry,
} from "../../../server/admin/content-handlers.js";
import { routeParam, send, toHandlerRequest } from "../../_vercel.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const hr = toHandlerRequest(req);
  const id = routeParam(req, "id");
  if (req.method === "PATCH" || req.method === "PUT") return send(res, await handleUpdateEnquiry(hr, id));
  if (req.method === "DELETE") return send(res, await handleDeleteEnquiry(hr, id));
  return res.status(405).json({ error: "Method not allowed." });
}
