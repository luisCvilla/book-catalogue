import {
  READING_STATUS_LABELS,
  type ReadingStatus,
} from "../types/book";

interface ProgressMarkerProps {
  status: ReadingStatus;
}

export function ProgressMarker({ status }: ProgressMarkerProps) {
  const label = READING_STATUS_LABELS[status];

  return (
    <span
      className={`progress-marker progress-marker--${status}`}
      aria-label={`Reading status: ${label}`}
    >
      {label}
    </span>
  );
}
