# Sherpa Personal P&L Dashboard

Private financial command-center dashboard for Sherpa Digital Agency — cash-basis P&L, accrual/A&R (Wave), personal spending, anomaly tracking, and an AI chat that can answer questions using the live financial data.

## Deploy on Railway

1. Connect this repo to a Railway project (Railway dashboard → New Project → Deploy from GitHub repo → select this repo).
2. Railway runs `npm install` then `npm start` (a small Express server, `server.js`), auto-detected via Nixpacks.
3. **Required:** set the environment variable `ANTHROPIC_API_KEY` in Railway's project settings (Variables tab) — the AI Chat tab won't work without it. Never commit this key to the repo.
4. Every push to `main` auto-redeploys.

## Local development

```bash
npm install
export ANTHROPIC_API_KEY=your-key-here   # only in your own shell, never committed
npm start
```
Then open http://localhost:3000

## Refreshing data

All data lives in one file: **`data.json`**. Refreshing numbers means regenerating this file from the live bookkeeping source and swapping it in — `index.html` and `server.js` never need to change. The dashboard fetches `/data.json` at load time; the chat backend reads the same file for its context on every request.

## Structure

- `index.html` — the dashboard UI (fetches `data.json` at runtime)
- `data.json` — the single source of truth for all figures (swap this file to refresh)
- `server.js` — Express server: serves the static dashboard + the `/api/chat` endpoint
- `package.json` / `railway.json` — Railway deploy config

## AI Chat

The Chat tab sends your question + the full contents of `data.json` to Claude (via the Anthropic API, server-side only — the API key never reaches the browser) and returns an answer grounded in your real numbers. See `Dashboard_Chat_Prompt_Ideas.md` (in the project folder, not this repo) for example questions to try.
