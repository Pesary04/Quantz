import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleEnquiry } from "../server/form-handlers";
import { parseBody } from "./_body";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  const { status, body } = await handleEnquiry(parseBody(req));
  return res.status(status).json(body);
}
