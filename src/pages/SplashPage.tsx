import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBook, fetchBooks } from "../api/booksApi";
import { BookMenuItem } from "../components/BookMenuItem";
import type { Book } from "../types/book";

export function SplashPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks()
      .then(setBooks)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddMore = async () => {
    setAdding(true);
    setError(null);
    try {
      const book = await createBook();
      navigate(`/book/${book.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add book");
      setAdding(false);
    }
  };

  return (
    <div className="page splash-page">
      <header className="splash-header">
        <h1>Book Catalogue</h1>
        <p className="subtitle">A personal record of books you have read</p>
      </header>

      {loading && <p className="status-message">Loading your library…</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && (
        <nav className="book-menu" aria-label="Your books">
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <BookMenuItem book={book} />
              </li>
            ))}
            <li>
              <button
                type="button"
                className="add-more-btn"
                onClick={handleAddMore}
                disabled={adding}
              >
                {adding ? "Adding…" : "Add more"}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
