import pg from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema.js";

/**
 * The connection is created lazily on first use rather than at import time.
 * The Express entry point (server/index.ts) loads .env files in its module
 * body, which — because ES module imports are evaluated first — runs *after*
 * this file is imported. Reading DATABASE_URL eagerly here would therefore see
 * an empty value. A single pooled connection is then reused across warm
 * serverless invocations and for the lifetime of the dev server.
 */
type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __quantzPool?: pg.Pool;
  __quantzDb?: Db;
};

function init(): Db {
  if (globalForDb.__quantzDb) return globalForDb.__quantzDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — the database is not provisioned.");
  }

  const pool =
    globalForDb.__quantzPool ??
    new pg.Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    });
  globalForDb.__quantzPool = pool;

  const instance = drizzle(pool, { schema });
  globalForDb.__quantzDb = instance;
  return instance;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = init();
    return Reflect.get(instance as object, prop, receiver);
  },
});
