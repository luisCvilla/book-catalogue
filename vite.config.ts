import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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
  ],
});
