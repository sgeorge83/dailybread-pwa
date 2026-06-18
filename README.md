# Daily Bread PWA

A multilingual Progressive Web App for [Our Daily Bread](https://odb.org) devotionals, powered by the official ODB Experience API and [Urdu Bible API](https://urdu-bible-api.vercel.app).

**Live demo:** enable GitHub Pages (see below) at `https://sgeorge83.github.io/dailybread-pwa/`

## Features

- Daily devotionals from `https://api.experience.odb.org/devotionals/` (currently ~3 weeks per API window)
- **Scrollable day picker** — only dates the API actually provides (no empty calendar days)
- **English** — full ODB devotional
- **Urdu (Roz Ki Roti / روز کی روٹی)** — auto-translated devotion, insights, reflect & pray + Urdu scripture from Urdu Bible API
- Audio, hero image, dark/light theme, offline PWA, install & share

## Languages

| Language | Devotional text | Scripture |
|----------|-----------------|-----------|
| English  | ODB API (official) | English reference |
| Urdu     | Auto-translated via Google/MyMemory | Urdu Geo Version via Urdu Bible API |

The ODB Experience API currently returns **~21 days** of English devotionals at a time (e.g. Jun 8–28). The date strip is built only from those available dates.

Auto-translation runs when you switch to Urdu. Results are cached locally so repeat visits are faster. A small note appears when content is auto-translated.

## Project structure

```text
dailybread-pwa/
├── index.html
├── manifest.json
├── service-worker.js
├── css/styles.css
├── js/
│   ├── app.js          # UI and state
│   ├── config.js       # API URLs
│   ├── i18n.js         # UI strings (en / ur / hi)
│   ├── odb-api.js      # ODB JSON API client
│   ├── translate.js    # Auto-translate to Urdu (cached)
│   ├── bible-ref.js    # Scripture reference parser
│   └── urdu-bible.js   # Urdu passage fetcher
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
