# Daily Bread PWA

A multilingual Progressive Web App for [Our Daily Bread](https://odb.org) devotionals, powered by the official ODB Experience API and [Urdu Bible API](https://urdu-bible-api.vercel.app).

**Live demo:** enable GitHub Pages (see below) at `https://sgeorge83.github.io/dailybread-pwa/`

## Features

- Daily devotionals from `https://api.experience.odb.org/devotionals/` (currently ~3 weeks per API window)
- **Live calendar** — day strip rebuilds automatically when ODB API adds or removes dates
- **English** — full ODB devotional
- **Urdu (Roz Ki Roti / روز کی روٹی)** — auto-translated devotion + Urdu scripture from Urdu Bible API
- Audio, hero image, dark/light theme, share
- **Online-only** — always fetches fresh data from the API (internet required)

## Languages

| Language | Devotional text | Scripture |
|----------|-----------------|-----------|
| English  | ODB API (official) | English reference |
| Urdu     | Auto-translated via Google/MyMemory | Urdu Geo Version via Urdu Bible API |

The calendar **auto-updates** when you open the app, return to the tab, or press Today — it always reflects whatever dates ODB currently exposes (~3 weeks rolling window).

Auto-translation runs when you switch to Urdu. Translation results are cached in the browser for speed; devotional content always comes live from the API.

## Project structure

```text
dailybread-pwa/
├── index.html
├── manifest.json
├── css/styles.css
├── js/
│   ├── app.js
│   ├── config.js
│   ├── i18n.js
│   ├── odb-api.js
│   ├── translate.js
│   ├── urdu-glossary.js
│   ├── bible-ref.js
│   └── urdu-bible.js
└── icons/icon.svg
```

## Run locally

Any static file server works:

```powershell
cd dailybread-pwa
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

> Use a local server (not `file://`) so the service worker and ES modules work correctly.

## Deploy on GitHub Pages

1. Push this repo to `github.com/sgeorge83/dailybread-pwa`
2. In GitHub: **Settings → Pages → Build and deployment → GitHub Actions**
3. The included workflow (`.github/workflows/pages.yml`) publishes on push to `main`

Or manually: **Settings → Pages → Deploy from branch → `main` / root**.

## APIs used

| API | Purpose |
|-----|---------|
| [ODB Experience API](https://api.experience.odb.org/devotionals/) | Daily devotional content |
| [Urdu Bible API](https://urdu-bible-api.vercel.app) | Urdu scripture for the day's passage reference |

## License & attribution

- Devotional content © [Our Daily Bread Ministries](https://odb.org)
- Urdu Bible text © Urdu Geo Version (CC BY-NC-ND 4.0) via [urdu-bible-data](https://github.com/sgeorge83/urdu-bible-data)

## Author

Sharoon George ([@sgeorge83](https://github.com/sgeorge83))
