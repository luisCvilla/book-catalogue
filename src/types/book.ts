export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  writtenLocation: string;
  settingLocation: string;
  writtenPeriod: string;
  settingPeriod: string;
  quotes: string[];
  summary: string;
}

export interface BooksData {
  books: Book[];
}

export function createDefaultBook(partial?: Partial<Book>): Book {
  const id = partial?.id ?? crypto.randomUUID();
  return {
    id,
    title: partial?.title ?? "Untitled",
    author: partial?.author ?? "",
    rating: partial?.rating ?? 3,
    writtenLocation: partial?.writtenLocation ?? "",
    settingLocation: partial?.settingLocation ?? "",
    writtenPeriod: partial?.writtenPeriod ?? "",
    settingPeriod: partial?.settingPeriod ?? "",
    quotes: partial?.quotes ?? [],
    summary: partial?.summary ?? "",
  };
}

export function isBook(value: unknown): value is Book {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.title === "string" &&
    typeof b.author === "string" &&
    typeof b.rating === "number" &&
    b.rating >= 1 &&
    b.rating <= 5 &&
    typeof b.writtenLocation === "string" &&
    typeof b.settingLocation === "string" &&
    typeof b.writtenPeriod === "string" &&
    typeof b.settingPeriod === "string" &&
    Array.isArray(b.quotes) &&
    b.quotes.every((q) => typeof q === "string") &&
    typeof b.summary === "string"
  );
}
