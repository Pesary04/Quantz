import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../db.js";
import {
  contentItems,
  type ContentCollection,
  type ContentItem,
} from "../../shared/schema.js";

export async function listItems(collection: ContentCollection): Promise<ContentItem[]> {
  return db
    .select()
    .from(contentItems)
    .where(eq(contentItems.collection, collection))
    .orderBy(asc(contentItems.sortOrder), asc(contentItems.createdAt));
}

/** All active items across every collection, grouped for the public site. */
export async function listActiveGrouped(): Promise<Record<string, ContentItem[]>> {
  const rows = await db
    .select()
    .from(contentItems)
    .where(eq(contentItems.isActive, true))
    .orderBy(asc(contentItems.sortOrder), asc(contentItems.createdAt));

  const grouped: Record<string, ContentItem[]> = {};
  for (const row of rows) {
    (grouped[row.collection] ||= []).push(row);
  }
  return grouped;
}

export async function getItem(id: string): Promise<ContentItem | undefined> {
  const rows = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
  return rows[0];
}

async function nextSortOrder(collection: ContentCollection): Promise<number> {
  const rows = await db
    .select({ max: sql<number>`coalesce(max(${contentItems.sortOrder}), -1)` })
    .from(contentItems)
    .where(eq(contentItems.collection, collection));
  return (rows[0]?.max ?? -1) + 1;
}

export async function createItem(
  collection: ContentCollection,
  data: Record<string, unknown>,
  opts: { isActive?: boolean } = {},
): Promise<ContentItem> {
  const now = new Date();
  const rows = await db
    .insert(contentItems)
    .values({
      collection,
      data,
      sortOrder: await nextSortOrder(collection),
      isActive: opts.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return rows[0];
}

export async function updateItem(
  id: string,
  patch: { data?: Record<string, unknown>; isActive?: boolean; sortOrder?: number },
): Promise<ContentItem | undefined> {
  const existing = await getItem(id);
  if (!existing) return undefined;

  const rows = await db
    .update(contentItems)
    .set({
      data: patch.data ?? existing.data,
      isActive: patch.isActive ?? existing.isActive,
      sortOrder: patch.sortOrder ?? existing.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(contentItems.id, id))
    .returning();
  return rows[0];
}

export async function deleteItem(id: string): Promise<boolean> {
  const rows = await db
    .delete(contentItems)
    .where(eq(contentItems.id, id))
    .returning({ id: contentItems.id });
  return rows.length > 0;
}

/** Persist a new ordering: each id's index becomes its sort order. */
export async function reorderItems(
  collection: ContentCollection,
  orderedIds: string[],
): Promise<void> {
  await Promise.all(
    orderedIds.map((id, index) =>
      db
        .update(contentItems)
        .set({ sortOrder: index, updatedAt: new Date() })
        .where(and(eq(contentItems.id, id), eq(contentItems.collection, collection))),
    ),
  );
}
