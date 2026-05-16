interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const isRated = value >= 1 && value <= 5;

  return (
    <div className="star-rating" role="group" aria-label="Rating">
      <button
        type="button"
        className={`star-rating-unrated ${!isRated ? "star-rating-unrated--active" : ""}`}
        aria-pressed={!isRated}
        onClick={() => onChange(0)}
      >
        Not rated yet
      </button>
      <div className="star-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${isRated && star <= value ? "star-filled" : ""}`}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={isRated && star <= value}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
