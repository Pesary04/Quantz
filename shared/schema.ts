import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Legacy demo table (kept for compatibility with existing storage).  *
 * ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/* ------------------------------------------------------------------ *
 * Admin accounts — used to sign in to the Quantz content dashboard.  *
 * ------------------------------------------------------------------ */
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;

/* ------------------------------------------------------------------ *
 * Server-side sessions. A random token lives in an httpOnly cookie   *
 * and maps to a row here so sessions can be revoked on logout.       *
 * ------------------------------------------------------------------ */
export const adminSessions = pgTable(
  "admin_sessions",
  {
    token: text("token").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("admin_sessions_user_idx").on(table.userId),
  }),
);

export type AdminSession = typeof adminSessions.$inferSelect;

/* ------------------------------------------------------------------ *
 * Content — news / articles authored in the dashboard.              *
 * ------------------------------------------------------------------ */
export const posts = pgTable(
  "posts",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    authorId: varchar("author_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("posts_status_idx").on(table.status),
    publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
  }),
);

export type Post = typeof posts.$inferSelect;

export const postInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens")
    .optional(),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().max(100_000).optional().default(""),
  coverImageUrl: z.string().url().max(2000).nullable().optional(),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

export type PostInput = z.infer<typeof postInputSchema>;
