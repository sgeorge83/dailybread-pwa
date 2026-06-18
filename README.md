# Daily Bread — Roz Ki Roti / روز کی روٹی

**Live app:** https://sgeorge83.github.io/dailybread-pwa/

---

## About Daily Bread

**Daily Bread** (Urdu: **Roz Ki Roti / روز کی روٹی**) is a free installable web app that brings [Our Daily Bread](https://odb.org) devotionals to your phone, tablet, or desktop — no app store required.

Read today's devotion, insights, reflection, and prayer. Listen to daily audio. Switch to Urdu for auto-translated devotional text and Urdu Scripture from the **Urdu Geo Version** via the [Urdu Bible API](https://urdu-bible-api.vercel.app).

The calendar updates automatically from the official ODB Experience API. Install it on Windows, Android, or iPhone/iPad and open it like a native app from your home screen.

### Highlights

- Live calendar from the official ODB API (~3-week rolling window)
- English & Urdu · audio · dark/light theme
- Tabs: Devotion · Insights · Reflect · Scripture
- Installable PWA — Windows, Android, iPhone/iPad
- Responsive layout — desktop website view + compact mobile app view
- Internet required for daily content

### Content sources

| Content | Source |
|---------|--------|
| Devotional text, images & audio | [Our Daily Bread Ministries](https://odb.org) |
| Urdu Scripture | Urdu Geo Version · [Urdu Bible API](https://urdu-bible-api.vercel.app) |
| Urdu devotional text | Auto-translated when Urdu is selected (not official ODB Urdu) |

**Developed by** [sgeorge83](https://github.com/sgeorge83) & **E-Geek Creations**

---

## Install the app

| Device | How to install |
|--------|----------------|
| **Windows** | Open in Chrome or Edge → click **About** or **↓ Install** in the header |
| **Android** | Chrome → **Install** banner or menu → *Add to Home screen* |
| **iPhone / iPad** | Safari only → tap **↓ Install** → follow *Share → Add to Home Screen* |

## Languages

| Language | Devotional text | Scripture |
|----------|-----------------|-----------|
| English  | ODB API (official) | English reference |
| Urdu     | Auto-translated | Urdu Geo Version via Urdu Bible API |

## Project structure

```text
dailybread-pwa/
├── index.html
├── manifest.json
├── service-worker.js
├── css/styles.css
├── docs/
│   ├── ABOUT.md
│   └── RELEASE-v1.0.0.md
├── js/
│   ├── app.js
│   ├── config.js
│   ├── i18n.js
│   ├── odb-api.js
│   ├── translate.js
│   ├── urdu-glossary.js
│   ├── bible-ref.js
│   └── urdu-bible.js
└── icons/
```

## Run locally

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

## APIs used

| API | Purpose |
|-----|---------|
| [ODB Experience API](https://api.experience.odb.org/devotionals/) | Daily devotional content |
| [Urdu Bible API](https://urdu-bible-api.vercel.app) | Urdu scripture for the day's passage reference |

## License & attribution

- Devotional content © [Our Daily Bread Ministries](https://odb.org)
- Urdu Bible text © Urdu Geo Version (CC BY-NC-ND 4.0) via [urdu-bible-data](https://github.com/sgeorge83/urdu-bible-data)

## Releases

Create a release at: https://github.com/sgeorge83/dailybread-pwa/releases/new

Release notes template: see [`docs/RELEASE-v1.0.0.md`](docs/RELEASE-v1.0.0.md)
