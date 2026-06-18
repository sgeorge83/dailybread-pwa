import { URDU_BIBLE_API } from "./config.js";
import { parseReference } from "./bible-ref.js";

const chapterCache = new Map();

async function fetchChapter(bookId, chapter) {
  const key = `${bookId}:${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key);

  const response = await fetch(
    `${URDU_BIBLE_API}/books/${bookId}/chapters/${chapter}`
  );
  if (!response.ok) {
    throw new Error(`Urdu Bible API error: ${response.status}`);
  }

  const data = await response.json();
  chapterCache.set(key, data);
  return data;
}

export async function fetchUrduPassage(referenceText) {
  const parsed = parseReference(referenceText);
  if (!parsed) return null;

  try {
    const chapterData = await fetchChapter(parsed.bookId, parsed.chapter);
    const verseMap = new Map(
      (chapterData.verses || []).map((item) => [item.verse, item])
    );

    const verses = parsed.verses
      .map((num) => verseMap.get(num))
      .filter(Boolean)
      .map((item) => ({
        verse: item.verse,
        text: item.text,
        bookName: item.book_name || chapterData.book_name,
      }));

    if (!verses.length) return null;

    return {
      reference: parsed.display,
      bookNameUrdu: verses[0].bookName,
      verses,
    };
  } catch (error) {
    console.warn("Urdu passage fetch failed:", error);
    return null;
  }
}
