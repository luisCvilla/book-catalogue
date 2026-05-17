import express from "express";
import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { ensureDataStore } from "./server/dataStore";
import { booksApiMiddleware } from "./server/middleware";

const app = express();
const port = Number(process.env.PORT) || 4173;
const distPath = join(process.cwd(), "dist");

await ensureDataStore();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  booksApiMiddleware(
    req as unknown as IncomingMessage,
    res as unknown as ServerResponse,
    next,
  );
});

app.use(express.static(distPath));

app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Book Catalogue running on port ${port}`);
  if (process.env.DATA_PATH) {
    console.log(`Data file: ${process.env.DATA_PATH}`);
  }
});
