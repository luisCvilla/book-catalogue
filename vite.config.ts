import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { booksApiMiddleware } from "./server/middleware";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "books-api",
      configureServer(server) {
        server.middlewares.use(booksApiMiddleware);
      },
    },
    {
      name: "copy-data",
      writeBundle() {
        const src = join(process.cwd(), "data", "books.json");
        const dest = join(process.cwd(), "dist", "data", "books.json");
        mkdirSync(join(process.cwd(), "dist", "data"), { recursive: true });
        copyFileSync(src, dest);
      },
    },
  ],
});
