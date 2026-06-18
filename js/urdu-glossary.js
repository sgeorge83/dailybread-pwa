/**
 * Devotional glossary and scripture-reference protection for Urdu translation.
 * Longest phrases first so multi-word terms match before single words.
 */

export const DEVOTIONAL_PHRASES = [
  ["Heavenly Father", "آسمانی باپ"],
  ["Holy Spirit", "روح\u0651 القدس"],
  ["Holy Bible", "کتاب\u0650 مقدس"],
  ["Old Testament", "عہد\u0650 نامہ\u0651 قدیم"],
  ["New Testament", "عہد\u0650 نامہ\u0651 جدید"],
  ["Bible in a Year", "سال بھر میں بائبل"],
  ["Our Daily Bread", "روز\u0651 کی روٹی"],
  ["Daily Bread", "روز\u0651 کی روٹی"],
  ["Lord Jesus", "رب\u0651 یسوع"],
  ["Jesus Christ", "یسوع\u0650 مسیح"],
  ["Son of God", "خدا\u0650 کا بیٹا"],
  ["Word of God", "خدا\u0650 کا کلام"],
  ["Kingdom of God", "خدا\u0650 کی بادشاہی"],
  ["Body of Christ", "مسیح\u0650 کا جسم"],
  ["gift of God", "خدا\u0650 کا تحفہ"],
  ["grace of God", "خدا\u0650 کا فضل"],
  ["will of God", "خدا\u0650 کی مرضی"],
  ["people of God", "خدا\u0650 کے لوگ"],
  ["Scripture", "کلام\u0650 مقدس"],
  ["devotional", "روح\u0651انی مضمون"],
  ["salvation", "نجات"],
  ["forgiveness", "معافی"],
  ["generosity", "سخاوت"],
  ["faithful", "وفادار"],
  ["faith", "ایمان"],
  ["prayer", "دعا"],
  ["pray", "دعا"],
  ["church", "کلیسا"],
  ["apostle", "رسول"],
  ["prophet", "نبی"],
  ["disciple", "شاگرد"],
  ["believers", "ایماندار"],
  ["believer", "ایماندار"],
  ["Christ", "مسیح"],
  ["Jesus", "یسوع"],
  ["Lord", "خداوند"],
  ["God", "خدا"],
  ["Bible", "بائبل"],
  ["Psalm", "زبور"],
  ["Psalms", "زبور"],
  ["Gospel", "انجیل"],
  ["sin", "گناہ"],
  ["grace", "فضل"],
  ["mercy", "رحم"],
  ["heaven", "آسمان"],
  ["angel", "فرشتہ"],
  ["Savior", "نجات\u0650 دہندہ"],
  ["Saviour", "نجات\u0650 دہندہ"],
];

/** Common mistranslations from machine translation → preferred Urdu Christian usage */
export const POST_CORRECTIONS = [
  [/خدائے/g, "خدا"],
  [/خدا کی/g, "خدا\u0650 کی"],
  [/رب کی/g, "خداوند\u0650 کی"],
  [/رب نے/g, "خداوند\u0650 نے"],
  [/یسوع مسیح/g, "یسوع\u0650 مسیح"],
  [/روح القدس/g, "روح\u0651 القدس"],
  [/کتاب مقدس/g, "کتاب\u0650 مقدس"],
  [/انجیل/g, "انجیل"],
  [/\bخدا\b(?=\s+کے)/g, "خدا\u0650"],
  [/\bخدا\b(?=\s+کی)/g, "خدا\u0650"],
  [/\bخدا\b(?=\s+کا)/g, "خدا\u0650"],
  [/\bخدا\b(?=\s+نے)/g, "خدا\u0650"],
  [/\bخداوند\b(?=\s+)/g, "خداوند\u0650"],
];

const REF_PATTERN =
  /\b(?:[1-3]\s)?[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\s\d{1,3}\s*:\s*\d{1,3}(?:\s*[-–—]\s*\d{1,3})?(?:\s*,\s*\d{1,3})*\b/g;

const REF_PATTERN_ALT =
  /\b(?:[1-3]\s)?(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d{1,3}\s*:\s*\d{1,3}(?:\s*[-–—]\s*\d{1,3})?\b/gi;

export function protectReferences(text) {
  if (!text) return { text: "", refs: [] };

  const refs = [];
  let index = 0;

  const combined = new RegExp(
    `${REF_PATTERN.source}|${REF_PATTERN_ALT.source}`,
    "gi"
  );

  const protectedText = text.replace(combined, (match) => {
    const token = `\uE000REF${index}\uE001`;
    refs.push(match.trim());
    index += 1;
    return token;
  });

  return { text: protectedText, refs };
}

export function restoreReferences(text, refs) {
  let result = text;
  refs.forEach((ref, i) => {
    result = result.replaceAll(`\uE000REF${i}\uE001`, ref);
    result = result.replace(new RegExp(`\\bREF${i}\\b`, "g"), ref);
  });
  return result;
}

/** Lock known devotional terms to correct Urdu before machine translation */
export function lockGlossaryTerms(text) {
  const locked = [];
  let result = text;

  const sorted = [...DEVOTIONAL_PHRASES].sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [english, urdu] of sorted) {
    const regex = new RegExp(
      `\\b${english.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );
    result = result.replace(regex, () => {
      const token = `\uE000G${locked.length}\uE001`;
      locked.push(urdu);
      return token;
    });
  }

  return { text: result, locked };
}

export function restoreGlossaryTerms(text, locked) {
  let result = text;
  locked.forEach((urdu, i) => {
    result = result.replaceAll(`\uE000G${i}\uE001`, urdu);
  });
  return result;
}

export function applyPhraseGlossary(text) {
  return text;
}

export function applyPostCorrections(text) {
  let result = text;
  for (const [pattern, replacement] of POST_CORRECTIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function splitSentences(text) {
  const parts = text.match(/[^.!?…]+[.!?…]+(?:\s|$)|[^\s].+$/g);
  return parts?.map((s) => s.trim()).filter(Boolean) || [text.trim()];
}

export function batchSentences(sentences, maxLen = 350) {
  const batches = [];
  let current = "";

  for (const sentence of sentences) {
    if (!current) {
      current = sentence;
    } else if ((current + " " + sentence).length <= maxLen) {
      current += " " + sentence;
    } else {
      batches.push(current);
      current = sentence;
    }
  }

  if (current) batches.push(current);
  return batches.length ? batches : sentences.slice(0, 1);
}

function batchSentencesFromText(text, maxLen) {
  return batchSentences(splitSentences(text), maxLen);
}

export { batchSentencesFromText as batchText };
