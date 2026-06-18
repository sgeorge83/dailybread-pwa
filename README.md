# Daily Bread PWA

A multilingual Progressive Web App for [Our Daily Bread](https://odb.org) devotionals, powered by the official ODB Experience API and [Urdu Bible API](https://urdu-bible-api.vercel.app).

**Live demo:** enable GitHub Pages (see below) at `https://sgeorge83.github.io/dailybread-pwa/`

## Features

- Daily devotionals from `https://api.experience.odb.org/devotionals/`
- Date picker to browse past and upcoming devotionals
- **English** — full ODB devotional (title, devotion, key verse, insights, reflect, pray, Bible in a year)
- **Urdu (اردو)** — RTL UI + Urdu scripture passage from Urdu Bible API
- **Hindi (हिन्दी)** — localized UI (devotional text from ODB is English until Hindi API support is available)
- Audio playback when ODB provides an MP3
- Hero image, categories, and links to ODB.org
- Dark / light theme
- Installable PWA with offline caching
- Web Share support on supported devices

## Languages

| Language | Devotional text | Scripture passage |
|----------|-----------------|---------------------|
| English  | ODB API         | English reference   |
| Urdu     | ODB API (English)* | Urdu Geo Version via Urdu Bible API |
| Hindi    | ODB API (English)* | Urdu passage shown when available |

\*The public ODB Experience API currently returns English devotionals only. Urdu/Hindi devotional *text* can be added when ODB exposes those languages via API, or through a future translation pipeline.

**Suggested future languages:** Spanish (`es`), Arabic (`ar`), Tamil (`ta`), Malayalam (`ml`) — ODB publishes in 40+ languages; the app structure is ready to extend.

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
