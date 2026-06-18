export const UI = {
  en: {
    appTitle: "Daily Bread",
    appSubtitle: "Our Daily Bread Devotional",
    language: "Language",
    selectDate: "Select date",
    today: "Today",
    loading: "Loading today's devotional...",
    loadError: "Could not load devotionals. Showing cached content if available.",
    noDevotional: "No devotional found for this date.",
    installPrompt: "Install Daily Bread for offline reading",
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
    urduDevotionNote:
      "Urdu devotional text is not yet available from the ODB API. English devotion is shown below; the scripture passage appears in Urdu above.",
    hindiDevotionNote:
      "Hindi devotional text is not yet available from the ODB API. English devotion is shown below.",
    shareTitle: "Daily Bread Devotional",
    shareText: "Today's devotional from Daily Bread",
    offlineCached: "You are offline. Showing cached devotional.",
  },
  ur: {
    appTitle: "روزانہ روٹی",
    appSubtitle: "آر ڈیلی بریڈ Devotional",
    language: "زبان",
    selectDate: "تاریخ منتخب کریں",
    today: "آج",
    loading: "آج کا مضمون لوڈ ہو رہا ہے...",
    loadError: "مضامین لوڈ نہیں ہو سکے۔ محفوظ مواد دکھایا جا رہا ہے۔",
    noDevotional: "اس تاریخ کے لیے کوئی مضمون نہیں ملا۔",
    installPrompt: "آف لائن پڑھنے کے لیے Daily Bread انسٹال کریں",
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
    urduDevotionNote:
      "ODB API سے اردو مضمون ابھی دستیاب نہیں۔ نیچے انگریزی مضمون دکھایا گیا ہے؛ اوپر کتاب مقدس کا حوالہ اردو میں ہے۔",
    hindiDevotionNote: "",
    shareTitle: "روزانہ روٹی",
    shareText: "آج کا مضمون",
    offlineCached: "آپ آف لائن ہیں۔ محفوظ مضمون دکھایا جا رہا ہے۔",
  },
  hi: {
    appTitle: "दैनिक रोटी",
    appSubtitle: "Our Daily Bread Devotional",
    language: "भाषा",
    selectDate: "तारीख चुनें",
    today: "आज",
    loading: "आज का devotional लोड हो रहा है...",
    loadError: "Devotional लोड नहीं हो सका। सहेजा हुआ content दिखाया जा रहा है।",
    noDevotional: "इस तारीख के लिए कोई devotional नहीं मिला।",
    installPrompt: "ऑफ़लाइन पढ़ने के लिए Daily Bread इंस्टॉल करें",
    install: "इंस्टॉल",
    sourceCredit: "Devotional स्रोत",
    urduCredit: "उर्दू शास्त्र",
    byAuthor: "लेखक",
    keyVerse: "मुख्य पद",
    passage: "शास्त्र संदर्भ",
    devotion: "आज का Devotional",
    insights: "अंतर्दृष्टि",
    reflect: "चिंतन",
    pray: "प्रार्थना",
    bibleInYear: "वर्ष भर बाइबल",
    listen: "सुनें",
    readFull: "ODB.org पर पढ़ें",
    urduPassage: "उर्दू शास्त्र",
    englishPassage: "अंग्रेज़ी संदर्भ",
    urduDevotionNote: "",
    hindiDevotionNote:
      "ODB API से हिंदी devotional अभी उपलब्ध नहीं है। नीचे अंग्रेज़ी devotional दिखाया गया है।",
    shareTitle: "दैनिक रोटी",
    shareText: "आज का devotional",
    offlineCached: "आप ऑफ़लाइन हैं। सहेजा devotional दिखाया जा रहा है।",
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

  document.documentElement.lang = lang === "ur" ? "ur" : lang === "hi" ? "hi" : "en";
  document.body.dir = lang === "ur" ? "rtl" : "ltr";
  document.body.setAttribute("lang", lang);
}
