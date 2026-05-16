import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBook, updateBook } from "../api/booksApi";
import { QuoteList } from "../components/QuoteList";
import { StarRating } from "../components/StarRating";
import type { Book } from "../types/book";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function BookPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bookRef = useRef<Book | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBook(id)
      .then((b) => {
        setBook(b);
        bookRef.current = b;
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const persist = useCallback(async (next: Book) => {
    setSaveStatus("saving");
    try {
      const saved = await updateBook(next);
      bookRef.current = saved;
      setSaveStatus("saved");
    } catch (e) {
      setSaveStatus("error");
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  }, []);

  const updateField = <K extends keyof Book>(key: K, value: Book[K]) => {
    setBook((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      bookRef.current = next;
      setSaveStatus("idle");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => void persist(next), 500);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="page book-page">
        <p className="status-message">Loading book…</p>
      </div>
    );
  }

  if (error && !book) {
    return (
      <div className="page book-page">
        <Link to="/" className="back-link">
          ← Back to library
        </Link>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="page book-page">
      <div className="book-page-top">
        <Link to="/" className="back-link">
          ← Back to library
        </Link>
        <span className={`save-indicator save-${saveStatus}`}>
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && "Save failed"}
        </span>
      </div>

      <input
        className="book-title-input"
        value={book.title}
        onChange={(e) => updateField("title", e.target.value)}
        aria-label="Book title"
      />

      <section className="field-section">
        <label>Rating</label>
        <StarRating
          value={book.rating}
          onChange={(rating) => updateField("rating", rating)}
        />
      </section>

      <div className="field-grid">
        <Field
          label="Author"
          value={book.author}
          onChange={(v) => updateField("author", v)}
        />
        <Field
          label="Location written"
          value={book.writtenLocation}
          onChange={(v) => updateField("writtenLocation", v)}
        />
        <Field
          label="Location (setting)"
          value={book.settingLocation}
          onChange={(v) => updateField("settingLocation", v)}
        />
        <Field
          label="Time period written"
          value={book.writtenPeriod}
          onChange={(v) => updateField("writtenPeriod", v)}
        />
        <Field
          label="Time period (setting)"
          value={book.settingPeriod}
          onChange={(v) => updateField("settingPeriod", v)}
        />
      </div>

      <section className="field-section">
        <label>Quotes that stand out</label>
        <QuoteList
          quotes={book.quotes}
          onChange={(quotes) => updateField("quotes", quotes)}
        />
      </section>

      <section className="field-section">
        <label htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          className="summary-input"
          value={book.summary}
          rows={8}
          placeholder="Your thoughts on the book…"
          onChange={(e) => updateField("summary", e.target.value)}
        />
      </section>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
