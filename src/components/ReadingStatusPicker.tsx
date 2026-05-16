import { ProgressMarker } from "./ProgressMarker";
import {
  READING_STATUSES,
  READING_STATUS_LABELS,
  type ReadingStatus,
} from "../types/book";

interface ReadingStatusPickerProps {
  value: ReadingStatus;
  onChange: (status: ReadingStatus) => void;
}

export function ReadingStatusPicker({ value, onChange }: ReadingStatusPickerProps) {
  return (
    <div className="reading-status-picker" role="group" aria-label="Reading status">
      <ProgressMarker status={value} />
      <div className="reading-status-options">
        {READING_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={`reading-status-btn ${value === status ? "reading-status-btn--active" : ""}`}
            aria-pressed={value === status}
            onClick={() => onChange(status)}
          >
            {READING_STATUS_LABELS[status]}
          </button>
        ))}
      </div>
    </div>
  );
}
