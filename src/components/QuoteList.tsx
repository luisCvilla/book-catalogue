interface QuoteListProps {
  quotes: string[];
  onChange: (quotes: string[]) => void;
}

export function QuoteList({ quotes, onChange }: QuoteListProps) {
  const updateQuote = (index: number, text: string) => {
    const next = [...quotes];
    next[index] = text;
    onChange(next);
  };

  const addQuote = () => onChange([...quotes, ""]);

  const removeQuote = (index: number) => {
    onChange(quotes.filter((_, i) => i !== index));
  };

  return (
    <div className="quote-list">
      {quotes.length === 0 && (
        <p className="quote-empty">No quotes yet. Add one that stood out to you.</p>
      )}
      {quotes.map((quote, index) => (
        <div key={index} className="quote-row">
          <textarea
            className="quote-input"
            value={quote}
            placeholder="Enter a standout quote…"
            rows={2}
            onChange={(e) => updateQuote(index, e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => removeQuote(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={addQuote}>
        Add quote
      </button>
    </div>
  );
}
