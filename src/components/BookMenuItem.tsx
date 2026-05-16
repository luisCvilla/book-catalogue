import { Link } from "react-router-dom";
import { ProgressMarker } from "./ProgressMarker";
import type { Book } from "../types/book";

interface BookMenuItemProps {
  book: Book;
}

export function BookMenuItem({ book }: BookMenuItemProps) {
  return (
    <Link to={`/book/${book.id}`} className="book-menu-item">
      <span className="book-menu-title">{book.title}</span>
      <span className="book-menu-meta">
        {book.author && <span>{book.author}</span>}
        {book.rating >= 1 ? (
          <span className="book-menu-stars" aria-label={`${book.rating} out of 5 stars`}>
            {"★".repeat(book.rating)}
            <span className="star-dim">{"★".repeat(5 - book.rating)}</span>
          </span>
        ) : (
          <span className="book-menu-unrated">Not rated yet</span>
        )}
      </span>
      <ProgressMarker status={book.readingStatus} />
    </Link>
  );
}
