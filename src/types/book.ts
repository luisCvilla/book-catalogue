export type ReadingStatus = "not-started" | "in-progress" | "completed";

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

export const READING_STATUSES: ReadingStatus[] = [
  "not-started",
  "in-progress",
  "completed",
];

export interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  readingStatus: ReadingStatus;
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

/** @deprecated Legacy numeric progress from earlier versions */
type LegacyBook = Book & { progress?: number };

export function createDefaultBook(partial?: Partial<Book>): Book {
  const id = partial?.id ?? crypto.randomUUID();
  return {
    id,
    title: partial?.title ?? "Untitled",
    author: partial?.author ?? "",
    rating: partial?.rating ?? 0,
    readingStatus: partial?.readingStatus ?? "not-started",
    writtenLocation: partial?.writtenLocation ?? "",
    settingLocation: partial?.settingLocation ?? "",
    writtenPeriod: partial?.writtenPeriod ?? "",
    settingPeriod: partial?.settingPeriod ?? "",
    quotes: partial?.quotes ?? [],
    summary: partial?.summary ?? "",
  };
}

export function parseReadingStatus(value: unknown): ReadingStatus | null {
  if (value === "not-started" || value === "in-progress" || value === "completed") {
    return value;
  }
  return null;
}

export function readingStatusFromLegacyProgress(progress: number): ReadingStatus {
  if (progress >= 100) return "completed";
  if (progress <= 0) return "not-started";
  return "in-progress";
}

export function normalizeBook(book: LegacyBook): Book {
  const fromStatus = parseReadingStatus(book.readingStatus);
  const readingStatus =
    fromStatus ??
    (typeof book.progress === "number"
      ? readingStatusFromLegacyProgress(book.progress)
      : "not-started");

  const { progress: _removed, ...rest } = book;
  const rating =
    typeof rest.rating === "number"
      ? Math.min(5, Math.max(0, Math.round(rest.rating)))
      : 0;
  return { ...rest, readingStatus, rating };
}

export function isBook(value: unknown): value is Book {
  if (!value || typeof value !== "object") return false;
  const b = value as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.title === "string" &&
    typeof b.author === "string" &&
    typeof b.rating === "number" &&
    b.rating >= 0 &&
    b.rating <= 5 &&
    parseReadingStatus(b.readingStatus) !== null &&
    typeof b.writtenLocation === "string" &&
    typeof b.settingLocation === "string" &&
    typeof b.writtenPeriod === "string" &&
    typeof b.settingPeriod === "string" &&
    Array.isArray(b.quotes) &&
    b.quotes.every((q) => typeof q === "string") &&
    typeof b.summary === "string"
  );
}
