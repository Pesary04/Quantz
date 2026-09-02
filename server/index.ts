import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

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

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
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

  // Retry binding indefinitely: a previous dev server instance may still be
  // releasing the port during a restart. We must NEVER permanently give up —
  // if we did, this process would linger as a zombie that never binds even
  // after the port frees, which stalls live-port detection and breaks the
  // preview. Instead we retry forever with a short, capped backoff so the
  // server always claims the port the moment it becomes available.
  const minRetryDelayMs = 200;
  const maxRetryDelayMs = 1000;
  let attempts = 0;

  // Register the success and error handlers once, outside the retry loop.
  // Passing a callback to httpServer.listen() on every attempt would add a
  // one-time "listening" listener that is never released when the bind fails
  // with EADDRINUSE, leaking a listener per retry (MaxListenersExceededWarning).
  httpServer.on("listening", () => {
    attempts = 0;
    log(`serving on http://${host}:${port}`);
  });

  const startListening = () => {
    attempts += 1;
    httpServer.listen({ port, host });
  };

  httpServer.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      // Back off gradually but keep retrying forever.
      const delay = Math.min(minRetryDelayMs * attempts, maxRetryDelayMs);
      if (attempts === 1 || attempts % 10 === 0) {
        log(`port ${port} in use, retrying (attempt ${attempts})...`);
      }
      setTimeout(startListening, delay);
      return;
    }
    console.error("Server error:", err);
  });

  startListening();
})();
