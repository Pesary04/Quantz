import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, index, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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

/* ------------------------------------------------------------------ *
 * Editable site content — services, partner logos, banner slides and *
 * team members. One generic table keyed by `collection`, each row     *
 * carrying its fields in a JSON `data` blob and an explicit sort      *
 * order so the admin can reorder items.                               *
 * ------------------------------------------------------------------ */
export const CONTENT_COLLECTIONS = [
  "services",
  "insurers",
  "asset_managers",
  "slides",
  "team",
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export function isContentCollection(value: string): value is ContentCollection {
  return (CONTENT_COLLECTIONS as readonly string[]).includes(value);
}

export const contentItems = pgTable(
  "content_items",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    collection: text("collection").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    collectionIdx: index("content_items_collection_idx").on(table.collection, table.sortOrder),
  }),
);

export type ContentItem = typeof contentItems.$inferSelect;

/* Per-collection field validation for the JSON `data` blob. */
const serviceDataSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  subtitle: z.string().trim().max(160).optional().default(""),
  image: z.string().trim().max(2000).optional().default(""),
  icon: z.string().trim().max(40).optional().default("Shield"),
  theme: z.string().trim().max(40).optional().default("blue"),
  href: z.string().trim().max(300).optional().default(""),
  items: z.array(z.string().max(200)).max(12).optional().default([]),
});

const partnerDataSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  logo: z.string().trim().max(2000).optional().default(""),
  url: z.string().trim().max(500).optional().default(""),
  darkBg: z.boolean().optional().default(false),
});

const slideDataSchema = z.object({
  image: z.string().trim().min(1, "An image is required").max(2000),
  label: z.string().trim().max(120).optional().default(""),
  alt: z.string().trim().max(400).optional().default(""),
  cta: z.string().trim().max(160).optional().default(""),
  href: z.string().trim().max(500).optional().default(""),
  external: z.boolean().optional().default(false),
});

const teamDataSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: z.string().trim().max(160).optional().default(""),
  image: z.string().trim().max(2000).optional().default(""),
  bio: z.string().trim().max(1200).optional().default(""),
});

export const contentDataSchemas: Record<ContentCollection, z.ZodTypeAny> = {
  services: serviceDataSchema,
  insurers: partnerDataSchema,
  asset_managers: partnerDataSchema,
  slides: slideDataSchema,
  team: teamDataSchema,
};

/* ------------------------------------------------------------------ *
 * Enquiries — every website form submission is stored here so it can  *
 * be reviewed in the dashboard as well as emailed.                    *
 * ------------------------------------------------------------------ */
export const enquiries = pgTable(
  "enquiries",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    type: text("type").notNull().default("enquiry"),
    category: text("category").notNull().default(""),
    name: text("name").notNull().default(""),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    message: text("message").notNull().default(""),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("enquiries_created_at_idx").on(table.createdAt),
    isReadIdx: index("enquiries_is_read_idx").on(table.isRead),
  }),
);

export type Enquiry = typeof enquiries.$inferSelect;

/* ------------------------------------------------------------------ *
 * Site settings — a single row (id = "main") of editable contact and  *
 * social details used across the public site.                         *
 * ------------------------------------------------------------------ */
export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default("main"),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type SiteSettingsRow = typeof siteSettings.$inferSelect;

export const siteSettingsSchema = z.object({
  phone: z.string().trim().max(60).optional().default(""),
  email: z.string().trim().max(160).optional().default(""),
  location: z.string().trim().max(200).optional().default(""),
  officeHours: z.string().trim().max(300).optional().default(""),
  whatsappUrl: z.string().trim().max(500).optional().default(""),
  facebookUrl: z.string().trim().max(500).optional().default(""),
  instagramUrl: z.string().trim().max(500).optional().default(""),
  linkedinUrl: z.string().trim().max(500).optional().default(""),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
