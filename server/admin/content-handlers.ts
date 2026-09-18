import {
  contentDataSchemas,
  isContentCollection,
  siteSettingsSchema,
  type ContentCollection,
} from "../../shared/schema.js";
import { getAdminBySession } from "./auth.js";
import { parseCookies, SESSION_COOKIE } from "./cookies.js";
import type { HandlerRequest, HandlerResult } from "./handlers.js";
import {
  createItem,
  deleteItem,
  getItem,
  listActiveGrouped,
  listItems,
  reorderItems,
  updateItem,
} from "./content-service.js";
import {
  deleteEnquiry,
  listEnquiries,
  setEnquiryRead,
} from "./enquiries-service.js";
import { getSettings, saveSettings } from "./settings-service.js";

async function requireAdmin(req: HandlerRequest) {
  const token = parseCookies(req.cookieHeader)[SESSION_COOKIE];
  return getAdminBySession(token);
}

const UNAUTH: HandlerResult = { status: 401, body: { error: "Not authenticated." } };

function resolveCollection(collection: string): ContentCollection | null {
  return isContentCollection(collection) ? collection : null;
}

/* --------------------------- Content items --------------------------- */

export async function handleListContent(req: HandlerRequest, collection: string): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const col = resolveCollection(collection);
  if (!col) return { status: 404, body: { error: "Unknown content type." } };
  return { status: 200, body: { items: await listItems(col) } };
}

export async function handleCreateContent(req: HandlerRequest, collection: string): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const col = resolveCollection(collection);
  if (!col) return { status: 404, body: { error: "Unknown content type." } };

  const parsed = contentDataSchemas[col].safeParse((req.body as { data?: unknown }).data);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }
  const isActive = (req.body as { isActive?: boolean }).isActive;
  const item = await createItem(col, parsed.data, { isActive });
  return { status: 201, body: { item } };
}

export async function handleUpdateContent(
  req: HandlerRequest,
  collection: string,
  id: string,
): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const col = resolveCollection(collection);
  if (!col) return { status: 404, body: { error: "Unknown content type." } };

  const body = req.body as { data?: unknown; isActive?: boolean; sortOrder?: number };
  const patch: { data?: Record<string, unknown>; isActive?: boolean; sortOrder?: number } = {};

  if (body.data !== undefined) {
    const parsed = contentDataSchemas[col].safeParse(body.data);
    if (!parsed.success) {
      return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
    }
    patch.data = parsed.data as Record<string, unknown>;
  }
  if (typeof body.isActive === "boolean") patch.isActive = body.isActive;
  if (typeof body.sortOrder === "number") patch.sortOrder = body.sortOrder;

  const item = await updateItem(id, patch);
  if (!item) return { status: 404, body: { error: "Item not found." } };
  return { status: 200, body: { item } };
}

export async function handleDeleteContent(req: HandlerRequest, id: string): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const ok = await deleteItem(id);
  if (!ok) return { status: 404, body: { error: "Item not found." } };
  return { status: 200, body: { ok: true } };
}

export async function handleReorderContent(req: HandlerRequest): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const body = req.body as { collection?: string; ids?: unknown };
  const col = resolveCollection(body.collection ?? "");
  if (!col) return { status: 404, body: { error: "Unknown content type." } };
  if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string")) {
    return { status: 400, body: { error: "A list of ids is required." } };
  }
  await reorderItems(col, body.ids as string[]);
  return { status: 200, body: { ok: true } };
}

/* ------------------------------ Enquiries ---------------------------- */

export async function handleListEnquiries(req: HandlerRequest): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  return { status: 200, body: { enquiries: await listEnquiries() } };
}

export async function handleUpdateEnquiry(req: HandlerRequest, id: string): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const isRead = (req.body as { isRead?: boolean }).isRead;
  if (typeof isRead !== "boolean") {
    return { status: 400, body: { error: "isRead must be a boolean." } };
  }
  const enquiry = await setEnquiryRead(id, isRead);
  if (!enquiry) return { status: 404, body: { error: "Enquiry not found." } };
  return { status: 200, body: { enquiry } };
}

export async function handleDeleteEnquiry(req: HandlerRequest, id: string): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const ok = await deleteEnquiry(id);
  if (!ok) return { status: 404, body: { error: "Enquiry not found." } };
  return { status: 200, body: { ok: true } };
}

/* ------------------------------ Settings ----------------------------- */

export async function handleGetSettings(req: HandlerRequest): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  return { status: 200, body: { settings: await getSettings() } };
}

export async function handleUpdateSettings(req: HandlerRequest): Promise<HandlerResult> {
  if (!(await requireAdmin(req))) return UNAUTH;
  const parsed = siteSettingsSchema.safeParse((req.body as { settings?: unknown }).settings ?? req.body);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid input." } };
  }
  const settings = await saveSettings(parsed.data);
  return { status: 200, body: { settings } };
}

/* ------------------------------- Public ------------------------------ */

export async function handlePublicContent(): Promise<HandlerResult> {
  const grouped = await listActiveGrouped();
  return { status: 200, body: { content: grouped } };
}

export async function handlePublicSettings(): Promise<HandlerResult> {
  return { status: 200, body: { settings: await getSettings() } };
}
