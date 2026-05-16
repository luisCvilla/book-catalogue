import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Book, BooksData } from "../src/types/book";
import { createDefaultBook, isBook, normalizeBook } from "../src/types/book";

const DATA_PATH = join(process.cwd(), "data", "books.json");

let writeChain: Promise<void> = Promise.resolve();

async function readData(): Promise<BooksData> {
  const raw = await readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(raw) as BooksData;
  return {
    books: data.books.map((book) =>
      normalizeBook(book as Book & { progress?: number; readingStatus?: string }),
    ),
  };
}

async function writeData(data: BooksData): Promise<void> {
  writeChain = writeChain.then(() =>
    writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8"),
  );
  await writeChain;
}

export async function getAllBooks(): Promise<Book[]> {
  const data = await readData();
  return data.books;
}

export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getAllBooks();
  return books.find((b) => b.id === id);
}

export async function createBook(partial?: Partial<Book>): Promise<Book> {
  const data = await readData();
  const book = createDefaultBook(partial);
  data.books.push(book);
  await writeData(data);
  return book;
}

export async function updateBook(id: string, book: Book): Promise<Book | null> {
  if (!isBook(book) || book.id !== id) {
    return null;
  }
  const data = await readData();
  const index = data.books.findIndex((b) => b.id === id);
  if (index === -1) {
    return null;
  }
  const normalized = normalizeBook(book);
  data.books[index] = normalized;
  await writeData(data);
  return normalized;
}

export function sendJson(
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: string) => void },
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export async function parseJsonBody<T>(req: { on: (e: string, h: (c?: Buffer) => void) => void }): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk?: Buffer) => {
      if (chunk) chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf-8");
        resolve(text ? (JSON.parse(text) as T) : ({} as T));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}
