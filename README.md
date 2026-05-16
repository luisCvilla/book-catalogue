# Book Catalogue

A personal web app to catalogue books you have read. Browse your library from a splash page, open each book for full details, and add new entries with **Add more**.

Data is stored in [`data/books.json`](data/books.json) in this repository and persisted through a small API (Vite middleware in dev, Express in preview).

## Fields per book

- Title, author, rating (1–5 stars)
- Location written, location (setting)
- Time period written, time period (setting)
- Standout quotes, summary

## Requirements

Node.js **18 or newer** (20+ recommended).

## Commands

```bash
npm install
npm run dev      # http://localhost:5173 — Vite + API middleware
npm run build    # production build to dist/
npm run preview  # http://localhost:4173 — static app + API
```

## Tech stack

- React + TypeScript + Vite
- React Router
- JSON file storage via `/api/books` endpoints
