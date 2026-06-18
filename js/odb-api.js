import { ODB_API } from "./config.js";

const SYNC_KEY = "dailybread-last-sync";

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
  const response = await fetch(ODB_API, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) {
    throw new Error(`ODB API error: ${response.status}`);
  }

  const data = await response.json();
  const map = new Map();

  for (const item of data) {
    const devotional = normalizeDevotional(item);
    map.set(devotional.dateKey, devotional);
  }

  sessionStorage.setItem(SYNC_KEY, new Date().toISOString());
  return map;
}

export function getLastUpdated() {
  const raw = sessionStorage.getItem(SYNC_KEY);
  return raw ? new Date(raw) : null;
}

/** Re-fetch when a new calendar day starts or data is older than 4 hours */
export function needsRefresh() {
  const last = getLastUpdated();
  if (!last) return true;

  const now = new Date();
  const sameDay =
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate();

  if (!sameDay) return true;

  return (now - last) / (1000 * 60 * 60) >= 4;
}
