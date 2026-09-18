import { and, desc, eq } from "drizzle-orm";
import { db } from "../db.js";
import { posts, type Post, type PostInput } from "../../shared/schema.js";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || `post-${Date.now()}`;
  let candidate = root;
  let n = 1;
  // Loop until we find a slug not used by another row.
  while (true) {
    const rows = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, candidate)).limit(1);
    const clash = rows[0];
    if (!clash || clash.id === ignoreId) return candidate;
    n += 1;
    candidate = `${root}-${n}`;
  }
}

export async function listAllPosts(): Promise<Post[]> {
  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function listPublishedPosts(): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0];
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | undefined> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return rows[0];
}

export async function createPost(input: PostInput, authorId: string): Promise<Post> {
  const slug = await uniqueSlug(input.slug || input.title);
  const now = new Date();
  const rows = await db
    .insert(posts)
    .values({
      slug,
      title: input.title,
      excerpt: input.excerpt ?? "",
      content: input.content ?? "",
      coverImageUrl: input.coverImageUrl ?? null,
      status: input.status ?? "draft",
      authorId,
      publishedAt: input.status === "published" ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return rows[0];
}

export async function updatePost(id: string, input: PostInput): Promise<Post | undefined> {
  const existing = await getPostById(id);
  if (!existing) return undefined;

  const slug = input.slug ? await uniqueSlug(input.slug, id) : existing.slug;
  const status = input.status ?? existing.status;
  // Stamp publishedAt the first time a post becomes published.
  const publishedAt =
    status === "published" ? existing.publishedAt ?? new Date() : null;

  const rows = await db
    .update(posts)
    .set({
      slug,
      title: input.title,
      excerpt: input.excerpt ?? "",
      content: input.content ?? "",
      coverImageUrl: input.coverImageUrl ?? null,
      status,
      publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))
    .returning();
  return rows[0];
}

export async function deletePost(id: string): Promise<boolean> {
  const rows = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
  return rows.length > 0;
}
