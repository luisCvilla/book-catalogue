interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="star-rating" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? "star-filled" : ""}`}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          aria-pressed={star <= value}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
