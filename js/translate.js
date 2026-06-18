import {
  applyPostCorrections,
  batchText,
  lockGlossaryTerms,
  protectReferences,
  restoreGlossaryTerms,
  restoreReferences,
} from "./urdu-glossary.js";

const CACHE_PREFIX = "dailybread-tr-v2:";
const CONTEXT_HINT = "Translate this Christian devotional text into natural, respectful Urdu as used in Urdu Bible translations. ";

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

function getCached(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setCached(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage full */
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateViaGoogle(text, targetLang, withContext) {
  const langCode = targetLang === "ur" ? "ur" : targetLang;
  const payload = withContext ? CONTEXT_HINT + text : text;

  const url =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=en&tl=${langCode}&dt=t&dt=bd&ie=UTF-8&oe=UTF-8` +
    `&q=${encodeURIComponent(payload)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Google translate failed");

  const data = await response.json();
  let translated = data[0].map((part) => part[0]).join("");

  if (withContext && translated.startsWith(CONTEXT_HINT.slice(0, 20))) {
    translated = translated.replace(/^[^.]*\.\s*/, "");
  }

  return translated.trim();
}

async function translateViaMyMemory(text, targetLang) {
  const langCode = targetLang === "ur" ? "ur" : targetLang;
  const url =
    "https://api.mymemory.translated.net/get" +
    `?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("MyMemory failed");

  const data = await response.json();
  return data.responseData?.translatedText?.trim() || text;
}

async function translateChunk(text, targetLang, withContext = false) {
  try {
    return await translateViaGoogle(text, targetLang, withContext);
  } catch {
    return translateViaMyMemory(text, targetLang);
  }
}

function polishUrdu(text) {
  return applyPostCorrections(text);
}

export async function translateText(text, targetLang) {
  if (!text?.trim() || targetLang === "en") return text;

  const cacheKey = `${CACHE_PREFIX}${targetLang}:${hashText(text)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { text: refSafe, refs } = protectReferences(text.trim());
  const { text: glossarySafe, locked } = lockGlossaryTerms(refSafe);
  const batches = batchText(glossarySafe, 320);
  const parts = [];

  for (let i = 0; i < batches.length; i += 1) {
    const useContext = i === 0;
    let translated = await translateChunk(batches[i], targetLang, useContext);
    translated = restoreGlossaryTerms(translated, locked);
    translated = restoreReferences(translated, refs);
    translated = polishUrdu(translated);
    parts.push(translated);
    if (batches.length > 1) await delay(150);
  }

  const result = parts.join(" ");
  setCached(cacheKey, result);
  return result;
}

export async function translateDevotional(devotional, targetLang) {
  if (targetLang === "en") return { ...devotional, _translated: false };

  const values = [
    devotional.title,
    devotional.verse,
    devotional.content,
    devotional.insights,
    devotional.response,
    devotional.thought,
    devotional.bibleInYear,
    ...devotional.categories,
  ];

  const translated = await Promise.all(
    values.map((value) => translateText(value, targetLang))
  );

  return {
    ...devotional,
    title: translated[0],
    verse: translated[1],
    content: translated[2],
    insights: translated[3],
    response: translated[4],
    thought: translated[5],
    bibleInYear: translated[6],
    categories: translated.slice(7).filter(Boolean),
    _translated: true,
  };
}
