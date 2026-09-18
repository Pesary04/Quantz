import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { HandleUploadBody } from "@vercel/blob/client";
import { runBlobUpload } from "../../server/admin/upload.js";
import { parseBody } from "../_body.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }
  try {
    const result = await runBlobUpload({
      body: parseBody(req) as unknown as HandleUploadBody,
      request: req,
      cookieHeader: req.headers.cookie ?? null,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}
