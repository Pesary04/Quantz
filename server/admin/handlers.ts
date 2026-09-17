import { z } from "zod";
import { postInputSchema } from "../../shared/schema.js";
import {
  createSession,
  deleteSession,
  findAdminByEmail,
  getAdminBySession,
  SESSION_TTL_SECONDS,
  verifyPassword,
} from "./auth.js";
import { checkLoginRate } from "./ratelimit.js";
import {
  clearSessionCookie,
  parseCookies,
  SESSION_COOKIE,
  serializeSessionCookie,
} from "./cookies.js";
import {
  createPost,
  deletePost,
  getPostById,
  listAllPosts,
  listPublishedPosts,
  getPublishedPostBySlug,
  updatePost,
} from "./posts-service.js";

export interface HandlerRequest {
  method: string;
  body: Record<string, unknown>;
  cookieHeader?: string | null;
  ip: string;
}

export interface HandlerResult {
  status: number;
  body: unknown;
  setCookie?: string;
}

function tokenFrom(req: HandlerRequest): string | undefined {
  return parseCookies(req.cookieHeader)[SESSION_COOKIE];
}

async function requireAdmin(req: HandlerRequest) {
  const token = tokenFrom(req);
  const admin = await getAdminBySession(token);
  return admin;
}

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function handleLogin(req: HandlerRequest): Promise<HandlerResult> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }

  const rate = await checkLoginRate(req.ip);
  if (!rate.allowed) {
    return {
      status: 429,
      body: {
        error: `Too many login attempts. Try again in ${rate.retryAfterSeconds} seconds.`,
      },
    };
  }

  const admin = await findAdminByEmail(parsed.data.email);
  // Always run a verification to keep timing consistent for unknown emails.
  const ok = admin ? await verifyPassword(parsed.data.password, admin.passwordHash) : false;
  if (!admin || !ok) {
    return { status: 401, body: { error: "Incorrect email or password." } };
  }

  const { token } = await createSession(admin.id);
  return {
    status: 200,
    body: { user: { id: admin.id, email: admin.email, name: admin.name } },
    setCookie: serializeSessionCookie(token, { maxAgeSeconds: SESSION_TTL_SECONDS }),
  };
}

export async function handleSession(req: HandlerRequest): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 200, body: { authenticated: false, user: null } };
  return { status: 200, body: { authenticated: true, user: admin } };
}

export async function handleLogout(req: HandlerRequest): Promise<HandlerResult> {
  await deleteSession(tokenFrom(req));
  return { status: 200, body: { ok: true }, setCookie: clearSessionCookie() };
}

export async function handleListPosts(req: HandlerRequest): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 401, body: { error: "Not authenticated." } };
  return { status: 200, body: { posts: await listAllPosts() } };
}

export async function handleCreatePost(req: HandlerRequest): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 401, body: { error: "Not authenticated." } };
  const parsed = postInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }
  const post = await createPost(parsed.data, admin.id);
  return { status: 201, body: { post } };
}

export async function handleGetPost(req: HandlerRequest, id: string): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 401, body: { error: "Not authenticated." } };
  const post = await getPostById(id);
  if (!post) return { status: 404, body: { error: "Post not found." } };
  return { status: 200, body: { post } };
}

export async function handleUpdatePost(req: HandlerRequest, id: string): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 401, body: { error: "Not authenticated." } };
  const parsed = postInputSchema.safeParse(req.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }
  const post = await updatePost(id, parsed.data);
  if (!post) return { status: 404, body: { error: "Post not found." } };
  return { status: 200, body: { post } };
}

export async function handleDeletePost(req: HandlerRequest, id: string): Promise<HandlerResult> {
  const admin = await requireAdmin(req);
  if (!admin) return { status: 401, body: { error: "Not authenticated." } };
  const ok = await deletePost(id);
  if (!ok) return { status: 404, body: { error: "Post not found." } };
  return { status: 200, body: { ok: true } };
}

export async function handlePublicList(): Promise<HandlerResult> {
  return { status: 200, body: { posts: await listPublishedPosts() } };
}

export async function handlePublicGet(slug: string): Promise<HandlerResult> {
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { status: 404, body: { error: "Article not found." } };
  return { status: 200, body: { post } };
}

/** Whether the request carries a valid admin session (used to gate uploads). */
export async function isAuthenticated(cookieHeader: string | null | undefined): Promise<boolean> {
  const admin = await getAdminBySession(parseCookies(cookieHeader)[SESSION_COOKIE]);
  return admin !== null;
}
