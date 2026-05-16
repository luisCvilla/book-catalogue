import express from "express";
import { join } from "node:path";
import { booksApiMiddleware } from "./server/middleware";
import type { IncomingMessage, ServerResponse } from "node:http";

const app = express();
const port = Number(process.env.PORT) || 4173;
const distPath = join(process.cwd(), "dist");

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
  console.log(`Book Catalogue running at http://localhost:${port}`);
});
