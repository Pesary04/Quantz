import { desc, eq, sql } from "drizzle-orm";
import { db } from "../db.js";
import { enquiries, type Enquiry } from "../../shared/schema.js";

export interface NewEnquiry {
  type: string;
  category?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  payload?: Record<string, unknown>;
}

export async function listEnquiries(): Promise<Enquiry[]> {
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
}

export async function countUnread(): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(enquiries)
    .where(eq(enquiries.isRead, false));
  return rows[0]?.count ?? 0;
}

export async function createEnquiry(input: NewEnquiry): Promise<Enquiry> {
  const rows = await db
    .insert(enquiries)
    .values({
      type: input.type,
      category: input.category ?? "",
      name: input.name ?? "",
      phone: input.phone ?? "",
      email: input.email ?? "",
      message: input.message ?? "",
      payload: input.payload ?? {},
    })
    .returning();
  return rows[0];
}

/**
 * Store an enquiry without ever throwing — form submissions must keep working
 * (and still send email) even if the database write fails for some reason.
 */
export async function saveEnquirySafe(input: NewEnquiry): Promise<void> {
  try {
    await createEnquiry(input);
  } catch (err) {
    console.error("[v0] failed to store enquiry:", err);
  }
}

export async function setEnquiryRead(id: string, isRead: boolean): Promise<Enquiry | undefined> {
  const rows = await db
    .update(enquiries)
    .set({ isRead })
    .where(eq(enquiries.id, id))
    .returning();
  return rows[0];
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const rows = await db
    .delete(enquiries)
    .where(eq(enquiries.id, id))
    .returning({ id: enquiries.id });
  return rows.length > 0;
}
