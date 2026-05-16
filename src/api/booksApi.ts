import type { Book } from "../types/book";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchBooks(): Promise<Book[]> {
  const data = await handleResponse<{ books: Book[] }>(
    await fetch("/api/books"),
  );
  return data.books;
}

export async function fetchBook(id: string): Promise<Book> {
  return handleResponse<Book>(await fetch(`/api/books/${id}`));
}

export async function createBook(partial?: Partial<Book>): Promise<Book> {
  return handleResponse<Book>(
    await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial ?? {}),
    }),
  );
}

export async function updateBook(book: Book): Promise<Book> {
  return handleResponse<Book>(
    await fetch(`/api/books/${book.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    }),
  );
}
