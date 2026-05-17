# Book Catalogue

A personal web app to catalogue books you have read. Browse your library from a splash page, open each book for full details, and add new entries with **Add more**.

Data is stored in `data/books.json` and persisted through a small API (Vite middleware in dev, Express in production).

## Fields per book

- Title, author, rating (not rated or 1–5 stars)
- Reading status (Not Started, In Progress, Completed)
- Location written, location (setting)
- Time period written, time period (setting)
- Standout quotes, summary

## Requirements

Node.js **18 or newer** (20+ recommended).

## Local development

```bash
npm install
npm run dev      # http://localhost:5173 — Vite + API middleware
npm run build    # production build to dist/
npm start        # http://localhost:4173 — production server + API
```

## Deploy to Railway

### 1. Push to GitHub

Ensure this repo is on GitHub (Railway deploys from Git).

### 2. Create a Railway project

1. Go to [railway.app](https://railway.app) and create a new project.
2. Choose **Deploy from GitHub repo** and select this repository.
3. Railway reads [`railway.toml`](railway.toml) automatically:
   - **Build:** `npm run build`
   - **Start:** `npm start`
   - **Health check:** `GET /api/health`

### 3. Add persistent storage (recommended)

Without a volume, book data may reset when the service redeploys.

1. In your Railway service, open **Volumes**.
2. Create a volume and mount it at `/data`.
3. Under **Variables**, add:

   ```
   DATA_PATH=/data/books.json
   ```

On first boot, the app copies the bundled seed from `data/books.json` in the repo if the volume file does not exist yet.

### 4. Environment variables

| Variable    | Required | Description                                      |
|-------------|----------|--------------------------------------------------|
| `PORT`      | No       | Set automatically by Railway                     |
| `DATA_PATH` | No       | Full path to `books.json` (use with a volume)    |

### 5. Generate a public URL

In Railway: **Settings → Networking → Generate domain**.

Open the URL — the app serves the React UI and `/api/books` from the same host.

### Verify deployment

- `https://your-app.up.railway.app/` — splash page
- `https://your-app.up.railway.app/api/health` — should return `{"status":"ok"}`

## Tech stack

- React + TypeScript + Vite
- React Router
- Express (production)
- JSON file storage via `/api/books`
