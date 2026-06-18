# Daily Bread — Roz Ki Roti / روز کی روٹی

**Live app:** https://sgeorge83.github.io/dailybread-pwa/

> *Your daily devotional from Our Daily Bread — in English and Urdu.*

---

## About Daily Bread

Daily Bread (Urdu: Roz Ki Roti / روز کی روٹی) is a free installable web app for Our Daily Bread devotionals on your phone, tablet, or desktop — no app store needed.

Read today's devotion, insights, reflection, and prayer. Listen to daily audio. Switch to Urdu for auto-translated devotional text and Urdu Scripture from the Urdu Geo Version.

- Live calendar from the official ODB API
- English & Urdu · audio · dark mode
- Install on Windows, Android, or iPhone/iPad
- Internet required for daily content

### Content sources

- Devotional text, images & audio — [Our Daily Bread (ODB.org)](https://odb.org)
- Urdu Scripture — Urdu Geo Version · [Urdu Bible API](https://urdu-bible-api.vercel.app)
- Urdu devotional — auto-translated when Urdu is selected (not official ODB Urdu)

---

## روز کی روٹی — تعارف

> *Our Daily Bread کا روزانہ مذہبی مضمون — انگریزی اور اردو میں۔*

روز کی روٹی (Daily Bread) ایک مفت انسٹال ایبل ویب ایپ ہے جو Our Daily Bread کے مضامین آپ کے فون، ٹیبلٹ یا کمپیوٹر پر لاتی ہے — ایپ اسٹور کی ضرورت نہیں۔

آج کا مضمون، بصیرت، غور و فکر اور دعا پڑھیں۔ روزانہ آڈیو سنیں۔ اردو میں خودکار ترجمہ شدہ مضمون اور Urdu Geo Version میں کتابِ مقدس کے لیے زبان تبدیل کریں۔

- ODB API سے براہِ راست لائیو کیلنڈر
- انگریزی و اردو · آڈیو · ڈارک موڈ
- Windows، Android یا iPhone/iPad پر انسٹال کریں
- روزانہ مضامین کے لیے انٹرنیٹ ضروری ہے

### مواد کے ماخذ

- مضمون، تصاویر و آڈیو — [Our Daily Bread (ODB.org)](https://odb.org)
- اردو کتابِ مقدس — Urdu Geo Version · [Urdu Bible API](https://urdu-bible-api.vercel.app)
- اردو مضمون — خودکار ترجمہ (ODB کا باضابطہ اردو ترجمہ نہیں)

---

**Developed by** [sgeorge83](https://github.com/sgeorge83) & **E-Geek Creations**

---

## Install the app

| Device | How to install |
|--------|----------------|
| **Windows** | Chrome or Edge → **About** or **↓ Install** in the header |
| **Android** | Chrome → **Install** / *Add to Home screen* |
| **iPhone / iPad** | Safari → **↓ Install** → *Share → Add to Home Screen* |

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
2. GitHub → **Settings → Pages → Build and deployment → GitHub Actions**
3. The workflow in `.github/workflows/pages.yml` publishes on push to `main`

## APIs used

| API | Purpose |
|-----|---------|
| [ODB Experience API](https://api.experience.odb.org/devotionals/) | Daily devotional content |
| [Urdu Bible API](https://urdu-bible-api.vercel.app) | Urdu scripture for the day's passage reference |

## License & attribution

- Devotional content © [Our Daily Bread Ministries](https://odb.org)
- Urdu Bible text © Urdu Geo Version (CC BY-NC-ND 4.0) via [urdu-bible-data](https://github.com/sgeorge83/urdu-bible-data)

## Releases

Create a release: https://github.com/sgeorge83/dailybread-pwa/releases/new

Release notes template: [`docs/RELEASE-v1.0.0.md`](docs/RELEASE-v1.0.0.md)
