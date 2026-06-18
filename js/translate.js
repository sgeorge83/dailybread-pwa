const CACHE_PREFIX = "dailybread-tr-v1:";
const CHUNK_SIZE = 400;

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
    /* storage full — skip cache */
  }
}

function chunkText(text, maxLen) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  const paragraphs = text.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    if ((current + para).length <= maxLen) {
      current = current ? `${current}\n\n${para}` : para;
    } else {
      if (current) chunks.push(current);
      if (para.length <= maxLen) {
        current = para;
      } else {
        for (let i = 0; i < para.length; i += maxLen) {
          chunks.push(para.slice(i, i + maxLen));
        }
        current = "";
      }
    }
  }

  if (current) chunks.push(current);
  return chunks.length ? chunks : [text];
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateChunk(text, targetLang) {
  const langCode = targetLang === "ur" ? "ur" : targetLang;

  const gtxUrl =
    "https://translate.googleapis.com/translate_a/single" +
    `?client=gtx&sl=en&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(gtxUrl);
    if (!response.ok) throw new Error("gtx failed");
    const data = await response.json();
    return data[0].map((part) => part[0]).join("");
  } catch {
    const myMemoryUrl =
      "https://api.mymemory.translated.net/get" +
      `?q=${encodeURIComponent(text)}&langpair=en|${langCode}`;

    const response = await fetch(myMemoryUrl);
    if (!response.ok) throw new Error("translation failed");
    const data = await response.json();
    return data.responseData?.translatedText || text;
  }
}

export async function translateText(text, targetLang) {
  if (!text?.trim() || targetLang === "en") return text;

  const cacheKey = `${CACHE_PREFIX}${targetLang}:${hashText(text)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const chunks = chunkText(text.trim(), CHUNK_SIZE);
  const parts = [];

  for (const chunk of chunks) {
    parts.push(await translateChunk(chunk, targetLang));
    if (chunks.length > 1) await delay(120);
  }

  const result = parts.join("\n\n");
  setCached(cacheKey, result);
  return result;
}

export async function translateDevotional(devotional, targetLang) {
  if (targetLang === "en") return { ...devotional, _translated: false };

  const [
    title,
    verse,
    content,
    insights,
    response,
    thought,
    bibleInYear,
    ...categoryResults
  ] = await Promise.all([
    translateText(devotional.title, targetLang),
    translateText(devotional.verse, targetLang),
    translateText(devotional.content, targetLang),
    translateText(devotional.insights, targetLang),
    translateText(devotional.response, targetLang),
    translateText(devotional.thought, targetLang),
    translateText(devotional.bibleInYear, targetLang),
    ...devotional.categories.map((item) => translateText(item, targetLang)),
  ]);

  return {
    ...devotional,
    title,
    verse,
    content,
    insights,
    response,
    thought,
    bibleInYear,
    categories: categoryResults.filter(Boolean),
    _translated: true,
  };
}
