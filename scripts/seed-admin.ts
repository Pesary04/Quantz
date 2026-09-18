import { randomBytes } from "crypto";
import { db } from "../server/db.js";
import { adminUsers } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "../server/admin/auth.js";

/**
 * Creates the first admin account if one does not already exist.
 * Email/password can be provided via ADMIN_EMAIL / ADMIN_PASSWORD env vars,
 * otherwise a default email and a strong random password are used and printed.
 */
async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@quantz.com.na").toLowerCase().trim();
  const name = process.env.ADMIN_NAME || "Quantz Admin";

  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existing[0]) {
    console.log(`[v0] admin already exists: ${email} (no changes made)`);
    process.exit(0);
  }

  const password = process.env.ADMIN_PASSWORD || `Quantz-${randomBytes(6).toString("base64url")}`;
  const passwordHash = await hashPassword(password);
  await db.insert(adminUsers).values({ email, name, passwordHash });

  console.log("[v0] ===== ADMIN ACCOUNT CREATED =====");
  console.log(`[v0] email:    ${email}`);
  console.log(`[v0] password: ${password}`);
  console.log("[v0] ================================");
  process.exit(0);
}

main().catch((err) => {
  console.error("[v0] seed failed:", err);
  process.exit(1);
});
