import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

// Tailwind CSS v3 parses its own `preflight.css` (and arbitrary-value rules)
// with `postcss.parse()` without a `from` option, which makes PostCSS 8.5+
// print "A PostCSS plugin did not pass the `from` option to postcss.parse".
// It is an upstream warning we cannot pass options into, and it is harmless for
// our setup (we never import assets from inside Tailwind's own stylesheets), so
// filter out just that one message instead of leaving it in every dev log.
const POSTCSS_FROM_WARNING = "did not pass the `from` option to `postcss.parse`";
const originalWarn = console.warn.bind(console);
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes(POSTCSS_FROM_WARNING)) {
    return;
  }
  originalWarn(...args);
};

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      // Log build/transform errors instead of killing the dev server. A single
      // bad import or CSS error should surface in the console and the error
      // overlay, not take the whole process down and drop the preview.
      error: (msg, options) => {
        viteLogger.error(msg, options);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
