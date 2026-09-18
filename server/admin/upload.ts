import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "./handlers.js";

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

/**
 * Client-side upload flow: the browser calls `upload()` which hits this route
 * to obtain a short-lived token, then streams the file straight to Blob.
 * We only mint a token for an authenticated admin.
 */
export async function runBlobUpload(params: {
  body: HandleUploadBody;
  request: unknown;
  cookieHeader: string | null | undefined;
}) {
  return handleUpload({
    body: params.body,
    request: params.request as Parameters<typeof handleUpload>[0]["request"],
    onBeforeGenerateToken: async () => {
      if (!(await isAuthenticated(params.cookieHeader))) {
        throw new Error("Not authenticated.");
      }
      return {
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: 10 * 1024 * 1024,
      };
    },
    onUploadCompleted: async () => {
      // No-op: the client receives the blob URL directly from `upload()`.
    },
  });
}
