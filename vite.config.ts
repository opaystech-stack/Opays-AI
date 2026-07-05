import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { searchCompass, getCompassMetrics } from "./scripts/compass-memory.mjs";

function compassApiDevPlugin() {
  return {
    name: "opays-compass-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const url = new URL(req.url, "http://localhost");
        if (url.pathname !== "/api/compass/ask") {
          next();
          return;
        }

        if (req.method !== "GET" && req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        try {
          let query = url.searchParams.get("q")?.trim() || "";

          if (!query && req.method === "POST") {
            const body = await new Promise<string>((resolve, reject) => {
              let raw = "";
              req.on("data", (chunk) => {
                raw += chunk;
              });
              req.on("end", () => resolve(raw));
              req.on("error", reject);
            });

            if (body) {
              try {
                const parsed = JSON.parse(body);
                if (typeof parsed?.query === "string") {
                  query = parsed.query.trim();
                }
              } catch {
                query = "";
              }
            }
          }

          if (!query) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({ error: "Missing query", hint: "Use ?q=... or POST { query }" }),
            );
            return;
          }

          const result = await searchCompass(query);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(JSON.stringify(result));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify({
              error: "Compass search failed",
              detail: error instanceof Error ? error.message : String(error),
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    TanStackRouterVite({
      autoCodeSplitting: true,
      routeFileIgnorePattern: "\\.test\\.tsx?$",
    }),
    compassApiDevPlugin(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
