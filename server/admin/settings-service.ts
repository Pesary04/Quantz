import { eq } from "drizzle-orm";
import { db } from "../db.js";
import { siteSettings } from "../../shared/schema.js";

const ROW_ID = "main";

export async function getSettings(): Promise<Record<string, unknown>> {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, ROW_ID)).limit(1);
  return rows[0]?.data ?? {};
}

export async function saveSettings(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const rows = await db
    .insert(siteSettings)
    .values({ id: ROW_ID, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteSettings.id, set: { data, updatedAt: new Date() } })
    .returning();
  return rows[0]?.data ?? {};
}
