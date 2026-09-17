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
