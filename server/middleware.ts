import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createBook,
  getAllBooks,
  getBookById,
  parseJsonBody,
  sendJson,
  updateBook,
} from "./api";
import type { Book } from "../src/types/book";
import { isBook } from "../src/types/book";

type Middleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) => void;

export const booksApiMiddleware: Middleware = (req, res, next) => {
  const url = req.url ?? "";
  if (!url.startsWith("/api/books")) {
    next();
    return;
  }

  void handleBooksApi(req, res);
};

async function handleBooksApi(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "", "http://localhost");
  const pathParts = url.pathname.split("/").filter(Boolean);
  // ["api", "books"] or ["api", "books", ":id"]
  const id = pathParts[2];
  const method = req.method ?? "GET";

  try {
    if (method === "GET" && !id) {
      const books = await getAllBooks();
      sendJson(res, 200, { books });
      return;
    }

    if (method === "GET" && id) {
      const book = await getBookById(id);
      if (!book) {
        sendJson(res, 404, { error: "Book not found" });
        return;
      }
      sendJson(res, 200, book);
      return;
    }

    if (method === "POST" && !id) {
      const body = await parseJsonBody<Partial<Book>>(req);
      const book = await createBook(body);
      sendJson(res, 201, book);
      return;
    }

    if (method === "PUT" && id) {
      const body = await parseJsonBody<Book>(req);
      if (!isBook(body)) {
        sendJson(res, 400, { error: "Invalid book payload" });
        return;
      }
      const updated = await updateBook(id, body);
      if (!updated) {
        sendJson(res, 404, { error: "Book not found" });
        return;
      }
      sendJson(res, 200, updated);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch {
    sendJson(res, 500, { error: "Internal server error" });
  }
}
