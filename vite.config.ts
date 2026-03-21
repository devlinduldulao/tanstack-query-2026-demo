import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function moviePosterProxy() {
  return {
    name: "movie-poster-proxy",
    configureServer(server: {
      middlewares: {
        use: (
          handler: (
            req: { url?: string },
            res: {
              statusCode: number;
              setHeader: (name: string, value: string) => void;
              end: (body?: Buffer | string) => void;
            },
            next: () => void,
          ) => void,
        ) => void;
      };
    }) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/__movie-poster")) {
          next();
          return;
        }

        const requestUrl = new URL(req.url, "http://localhost");
        const targetUrl = requestUrl.searchParams.get("url");

        if (!targetUrl) {
          res.statusCode = 400;
          res.end("Missing url parameter");
          return;
        }

        const target = new URL(targetUrl);

        if (target.protocol !== "https:" || target.hostname !== "m.media-amazon.com") {
          res.statusCode = 403;
          res.end("Unsupported image host");
          return;
        }

        try {
          const response = await fetch(target);

          if (!response.ok) {
            res.statusCode = response.status;
            res.end("Failed to fetch image");
            return;
          }

          res.setHeader("Content-Type", response.headers.get("content-type") ?? "image/jpeg");
          res.setHeader("Cache-Control", "public, max-age=3600");
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          res.statusCode = 502;
          res.end("Image proxy error");
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routeTreeFileHeader: ["/* eslint-disable eslint-comments/no-unlimited-disable */", "/* eslint-disable */"],
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    react(),
    moviePosterProxy(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
