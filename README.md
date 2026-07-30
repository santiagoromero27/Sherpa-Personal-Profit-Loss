# Sherpa Personal P&L Dashboard

Private financial command-center dashboard for Sherpa Digital Agency — cash-basis P&L, accrual/A&R (Wave), personal spending, and anomaly tracking.

## Deploy

This repo is a static single-page dashboard served via a tiny Node process (`npm start`), which Railway will auto-detect via Nixpacks.

1. Connect this repo to a Railway project (Railway dashboard → New Project → Deploy from GitHub repo → select this repo).
2. Railway will run `npm install` then `npm start`, which serves `index.html` on Railway's assigned `$PORT`.
3. Every push to `main` auto-redeploys.

## Refreshing data

All data lives in one isolated block inside `index.html` (see the `DATA` object near the top of the file). Refreshing numbers means regenerating that block from the live bookkeeping source and swapping it in — the rest of the file never needs to change.

## Structure

- `index.html` — the dashboard (currently a placeholder; real build in progress)
- `package.json` / `railway.json` — minimal static-serve config for Railway
