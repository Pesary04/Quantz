import { useQuery } from "@tanstack/react-query";
import { upload } from "@vercel/blob/client";

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  status: "draft" | "published";
  authorId: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface PostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string | null;
  status?: "draft" | "published";
}

interface SessionResponse {
  authenticated: boolean;
  user: AdminUser | null;
}

async function readJson(res: Response) {
  return res.json().catch(() => ({}) as Record<string, unknown>);
}

export async function login(email: string, password: string): Promise<AdminUser> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Login failed.");
  return (data as { user: AdminUser }).user;
}

export async function logout(): Promise<void> {
  await fetch("/api/admin/session", { method: "DELETE", credentials: "include" });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch("/api/admin/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to change password.");
}

export async function fetchAdminPosts(): Promise<Post[]> {
  const res = await fetch("/api/admin/posts", { credentials: "include" });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load posts.");
  return (data as { posts: Post[] }).posts;
}

export async function fetchAdminPost(id: string): Promise<Post> {
  const res = await fetch(`/api/admin/posts/${id}`, { credentials: "include" });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Post not found.");
  return (data as { post: Post }).post;
}

export async function savePost(input: PostInput, id?: string): Promise<Post> {
  const res = await fetch(id ? `/api/admin/posts/${id}` : "/api/admin/posts", {
    method: id ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to save post.");
  return (data as { post: Post }).post;
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/admin/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await readJson(res);
    throw new Error((data as { error?: string }).error || "Failed to delete post.");
  }
}

/** Uploads an image straight to Vercel Blob using a token minted by our API. */
export async function uploadImage(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
  });
  return blob.url;
}

export function useSession() {
  return useQuery<SessionResponse>({
    queryKey: ["/api/admin/session"],
    staleTime: 0,
  });
}

/* ----------------------------- Site content ---------------------------- */

export type ContentCollection = "services" | "insurers" | "asset_managers" | "slides" | "team";

export interface ContentItem {
  id: string;
  collection: ContentCollection;
  sortOrder: number;
  isActive: boolean;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function fetchContent(collection: ContentCollection): Promise<ContentItem[]> {
  const res = await fetch(`/api/admin/content/${collection}`, { credentials: "include" });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load content.");
  return (data as { items: ContentItem[] }).items;
}

export async function createContent(
  collection: ContentCollection,
  data: Record<string, unknown>,
): Promise<ContentItem> {
  const res = await fetch(`/api/admin/content/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ data }),
  });
  const body = await readJson(res);
  if (!res.ok) throw new Error((body as { error?: string }).error || "Failed to create item.");
  return (body as { item: ContentItem }).item;
}

export async function updateContent(
  collection: ContentCollection,
  id: string,
  patch: { data?: Record<string, unknown>; isActive?: boolean },
): Promise<ContentItem> {
  const res = await fetch(`/api/admin/content/${collection}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(patch),
  });
  const body = await readJson(res);
  if (!res.ok) throw new Error((body as { error?: string }).error || "Failed to update item.");
  return (body as { item: ContentItem }).item;
}

export async function deleteContent(collection: ContentCollection, id: string): Promise<void> {
  const res = await fetch(`/api/admin/content/${collection}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const body = await readJson(res);
    throw new Error((body as { error?: string }).error || "Failed to delete item.");
  }
}

export async function reorderContent(collection: ContentCollection, ids: string[]): Promise<void> {
  const res = await fetch(`/api/admin/content-reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ collection, ids }),
  });
  if (!res.ok) {
    const body = await readJson(res);
    throw new Error((body as { error?: string }).error || "Failed to reorder items.");
  }
}

/* ------------------------------- Enquiries ------------------------------ */

export interface Enquiry {
  id: string;
  type: string;
  category: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  payload: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const res = await fetch("/api/admin/enquiries", { credentials: "include" });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load enquiries.");
  return (data as { enquiries: Enquiry[] }).enquiries;
}

export async function setEnquiryRead(id: string, isRead: boolean): Promise<void> {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ isRead }),
  });
  if (!res.ok) {
    const data = await readJson(res);
    throw new Error((data as { error?: string }).error || "Failed to update enquiry.");
  }
}

export async function deleteEnquiry(id: string): Promise<void> {
  const res = await fetch(`/api/admin/enquiries/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const data = await readJson(res);
    throw new Error((data as { error?: string }).error || "Failed to delete enquiry.");
  }
}

/* ------------------------------- Settings ------------------------------- */

export interface SiteSettings {
  phone?: string;
  email?: string;
  location?: string;
  officeHours?: string;
  whatsappUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

export async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/admin/settings", { credentials: "include" });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load settings.");
  return (data as { settings: SiteSettings }).settings;
}

export async function saveSettings(settings: SiteSettings): Promise<SiteSettings> {
  const res = await fetch("/api/admin/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ settings }),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to save settings.");
  return (data as { settings: SiteSettings }).settings;
}
