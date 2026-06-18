import { ODB_API } from "./config.js";

function dateKeyFromMs(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

export function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export function normalizeDevotional(item) {
  const dateKey = dateKeyFromMs(item.date_id || item.date);
  return {
    dateKey,
    title: item.title || "",
    author: item.author_name || item.lang_author_name || "",
    content: stripHtml(item.content),
    excerpt: stripHtml(item.excerpt),
    insights: stripHtml(item.insights),
    response: stripHtml(item.response),
    thought: stripHtml(item.thought),
    verse: stripHtml(item.verse),
    passageReference: (item.passage_reference || "").trim(),
    passageUrl: item.passage_url || "",
    bibleInYear: item.bible_in_a_year_references || "",
    bibleInYearUrl: item.bible_in_a_year_url || "",
    imageUrl: item.image_url || "",
    audioUrl: item.audio_url || "",
    categories: item.categories || [],
    slug: item.slug || "",
    language: item.language || "en_US",
    odbUrl: item.slug
      ? `https://odb.org/${dateKey.replace(/-/g, "/")}/${item.slug}/`
      : `https://odb.org/${dateKey.replace(/-/g, "/")}/`,
  };
}

export async function fetchDevotionals() {
  const response = await fetch(ODB_API, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`ODB API error: ${response.status}`);
  }

  const data = await response.json();
  const map = new Map();

  for (const item of data) {
    const devotional = normalizeDevotional(item);
    map.set(devotional.dateKey, devotional);
  }

  return map;
}

export function getCachedDevotionals() {
  try {
    const raw = localStorage.getItem("dailybread-devotionals");
    if (!raw) return null;
    const entries = JSON.parse(raw);
    return new Map(Object.entries(entries));
  } catch {
    return null;
  }
}

export function cacheDevotionals(map) {
  const entries = Object.fromEntries(map.entries());
  localStorage.setItem("dailybread-devotionals", JSON.stringify(entries));
  localStorage.setItem("dailybread-devotionals-updated", new Date().toISOString());
}
