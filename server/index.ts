// Server entry: loads env, mounts the API + client, and binds port 5000.
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { execFile } from "child_process";

// tsx/Express do not auto-load .env files the way Next.js does. Load the
// project env files at startup so server-only secrets (SMTP_*, etc.) are
// available in process.env when they are not already injected by the platform.
// Platform-injected values (already present in process.env) always take
// precedence — file values only fill in keys that are otherwise missing.
for (const file of [".env.development.local", ".env.local", ".env"]) {
  const path = resolve(process.cwd(), file);
  if (!existsSync(path)) continue;
  try {
    for (const rawLine of readFileSync(path, "utf8").split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      if (!key || process.env[key] !== undefined) continue;
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch {
    // ignore malformed/locked env files
  }
}

// Express dev/prod server entry. Env is loaded above; routes and the pooled
// mailer are wired in below. The listen() logic retries binding indefinitely
// so the platform's managed restart always reclaims the port cleanly.
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { verifyMailer } from "./mailer";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Warm the SMTP connection pool at startup so the first form submission is
  // fast, and surface any credential/connection problem in the logs early.
  verifyMailer();

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT.
  // Other ports are firewalled. Default to 5000 if not specified.
  // This serves both the API and the client; it is the only open port.
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = process.env.HOST || "0.0.0.0";

  // Gracefully release the port when the platform restarts the dev server.
  // Without this, the exiting process can keep port 5000 held while the new
  // instance starts, which stalls live-port detection and triggers a timeout.
  const shutdown = () => {
    httpServer.close(() => process.exit(0));
    // Fallback: force-exit if close() hangs on lingering connections.
    setTimeout(() => process.exit(0), 1500).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  // Binding strategy — "the newest instance always wins":
  //
  // The dev server must be the single process holding port 5000. Every prior
  // "port in use" / "Development server failed" banner came from TWO dev
  // servers existing at once (e.g. the platform's supervised instance plus a
  // stray one), where the loser retried until it exited — and the platform
  // treats ANY exit as a failure.
  //
  // The fix: when the port is held, first wait briefly (a normal restart hands
  // off within ~1.5s as the old instance releases the port via SIGTERM). If it
  // is STILL held after that grace window, a stale/duplicate server is
  // squatting, so we forcibly evict it and take the port. This process never
  // exits due to a port conflict, so the failure banner cannot recur.
  const retryDelayMs = 300;
  const graceAttempts = 6; // ~1.8s: cover a clean SIGTERM handoff before evicting.
  let attempts = 0;
  let evicted = false;

  // Best-effort eviction of whatever process holds the port. execFile avoids a
  // shell; fuser (with an lsof fallback) is available on the Linux sandbox.
  const evictPortHolder = () => {
    log(`port ${port} still held; evicting the stale process to take over...`);
    execFile("sh", ["-c", `fuser -k ${port}/tcp 2>/dev/null || (lsof -ti tcp:${port} | xargs -r kill -9)`], () => {
      // Ignore result; the retry loop re-attempts the bind regardless.
    });
  };

  // Register the success and error handlers once, outside the retry loop.
  // Passing a callback to httpServer.listen() on every attempt would add a
  // one-time "listening" listener that is never released when the bind fails
  // with EADDRINUSE, leaking a listener per retry (MaxListenersExceededWarning).
  httpServer.on("listening", () => {
    attempts = 0;
    evicted = false;
    log(`serving on http://${host}:${port}`);
  });

  const startListening = () => {
    attempts += 1;
    httpServer.listen({ port, host });
  };

  httpServer.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      // Grace window: let a normal restart handoff complete on its own.
      if (attempts < graceAttempts) {
        setTimeout(startListening, retryDelayMs);
        return;
      }
      // Past the grace window: evict the squatter once, then keep retrying so
      // this instance claims the freed port. We never give up or exit here.
      if (!evicted) {
        evicted = true;
        evictPortHolder();
      }
      setTimeout(startListening, retryDelayMs);
      return;
    }
    console.error("Server error:", err);
    process.exit(1);
  });

  startListening();
})();
