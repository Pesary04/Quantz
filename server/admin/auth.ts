import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { and, eq, gt, ne } from "drizzle-orm";
import { db } from "../db.js";
import { adminSessions, adminUsers, type AdminUser } from "../../shared/schema.js";

const scryptAsync = promisify(scrypt);

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
export const SESSION_TTL_SECONDS = SESSION_TTL_MS / 1000;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuffer = Buffer.from(key, "hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return keyBuffer.length === derived.length && timingSafeEqual(keyBuffer, derived);
}

export type PublicAdmin = Pick<AdminUser, "id" | "email" | "name">;

export async function findAdminByEmail(email: string): Promise<AdminUser | undefined> {
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return rows[0];
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(adminSessions).values({ token, userId, expiresAt });
  return { token, expiresAt };
}

export async function getAdminBySession(token: string | undefined | null): Promise<PublicAdmin | null> {
  if (!token) return null;
  const rows = await db
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
    .where(and(eq(adminSessions.token, token), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] ?? null;
}

export async function deleteSession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  await db.delete(adminSessions).where(eq(adminSessions.token, token));
}

export async function findAdminById(id: string): Promise<AdminUser | undefined> {
  const rows = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return rows[0];
}

export async function updateAdminPassword(id: string, passwordHash: string): Promise<void> {
  await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, id));
}

/** Revoke every session for a user except the one making the request. */
export async function deleteOtherSessions(userId: string, keepToken: string): Promise<void> {
  await db
    .delete(adminSessions)
    .where(and(eq(adminSessions.userId, userId), ne(adminSessions.token, keepToken)));
}
