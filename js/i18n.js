export const UI = {
  en: {
    appTitle: "Daily Bread",
    appSubtitle: "Our Daily Bread Devotional",
    language: "Language",
    selectDate: "Choose a day",
    today: "Today",
    loading: "Loading devotional...",
    translating: "Translating to Urdu...",
    loadError: "Could not load devotionals. Showing cached content if available.",
    noDevotional: "No devotional found for this date.",
    installPrompt: "Install on your device — devotionals stay available offline",
    installHelp: "Saves the app to your home screen. After you read once, cached devotionals work without Wi‑Fi or mobile data.",
    install: "Install",
    sourceCredit: "Devotional content from",
    urduCredit: "Urdu scripture from",
    byAuthor: "By",
    keyVerse: "Key Verse",
    passage: "Scripture Passage",
    devotion: "Today's Devotion",
    insights: "Insights",
    reflect: "Reflect",
    pray: "Pray",
    bibleInYear: "Bible in a Year",
    listen: "Listen",
    readFull: "Read on ODB.org",
    urduPassage: "Urdu Scripture",
    englishPassage: "English Reference",
    autoTranslateNote: "Devotional text translated to Urdu using Bible-standard terms (auto-generated).",
    developerCredit: "Developed by",
    shareTitle: "Daily Bread Devotional",
    shareText: "Today's devotional from Daily Bread",
    offlineCached: "You are offline. Showing cached devotional.",
    availableRange: "Available devotionals",
    lastSynced: "Last synced",
    autoUpdates: "Checks ODB API for new devotionals each time you open the app",
    prevDay: "Previous day",
    nextDay: "Next day",
  },
  ur: {
    appTitle: "روز کی روٹی",
    appSubtitle: "Roz Ki Roti — Our Daily Bread",
    language: "زبان",
    selectDate: "دن منتخب کریں",
    today: "آج",
    loading: "مضمون لوڈ ہو رہا ہے...",
    translating: "اردو میں ترجمہ ہو رہا ہے...",
    loadError: "مضامین لوڈ نہیں ہو سکے۔ محفوظ مواد دکھایا جا رہا ہے۔",
    noDevotional: "اس تاریخ کے لیے کوئی مضمون نہیں ملا۔",
    installPrompt: "اپنے فون/کمپیوٹر پر انسٹال کریں — آف لائن پڑھیں",
    installHelp: "ایپ ہوم اسکرین پر محفوظ ہو جاتی ہے۔ ایک بار پڑھنے کے بعد انٹرنیٹ کے بغیر بھی مضامین دستیاب رہتے ہیں۔",
    install: "انسٹال",
    sourceCredit: "مضمون کا ماخذ",
    urduCredit: "اردو کلام مقدس",
    byAuthor: "مصنف",
    keyVerse: "اہم آیت",
    passage: "کتاب مقدس کا حوالہ",
    devotion: "آج کا مضمون",
    insights: "بصیرت",
    reflect: "غور کریں",
    pray: "دعا",
    bibleInYear: "سال بھر میں بائبل",
    listen: "سنیں",
    readFull: "ODB.org پر پڑھیں",
    urduPassage: "اردو کتاب مقدس",
    englishPassage: "انگریزی حوالہ",
    autoTranslateNote: "مضمون بائبل کے معیار کے مطابق اردو میں ترجمہ کیا گیا ہے (خودکار)۔",
    developerCredit: "تیار کردہ",
    shareTitle: "روز کی روٹی",
    shareText: "آج کا مضمون",
    offlineCached: "آپ آف لائن ہیں۔ محفوظ مضمون دکھایا جا رہا ہے۔",
    availableRange: "دستیاب مضامین",
    lastSynced: "آخری مطابقت",
    autoUpdates: "ہر بار کھولنے پر ODB API سے نئے مضامین چیک ہوتے ہیں",
    prevDay: "پچھلا دن",
    nextDay: "اگلا دن",
  },
};

export function t(lang, key) {
  return UI[lang]?.[key] ?? UI.en[key] ?? key;
}

export function applyUiStrings(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(lang, key);
  });

  document.documentElement.lang = lang === "ur" ? "ur" : "en";
  document.body.dir = lang === "ur" ? "rtl" : "ltr";
  document.body.setAttribute("lang", lang);
}
