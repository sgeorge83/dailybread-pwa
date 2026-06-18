const BOOK_IDS = {
  genesis: 1,
  exodus: 2,
  leviticus: 3,
  numbers: 4,
  deuteronomy: 5,
  joshua: 6,
  judges: 7,
  ruth: 8,
  "1 samuel": 9,
  "2 samuel": 10,
  "1 kings": 11,
  "2 kings": 12,
  "1 chronicles": 13,
  "2 chronicles": 14,
  ezra: 15,
  nehemiah: 16,
  esther: 17,
  job: 18,
  psalm: 19,
  psalms: 19,
  proverbs: 20,
  ecclesiastes: 21,
  "song of solomon": 22,
  "song of songs": 22,
  isaiah: 23,
  jeremiah: 24,
  lamentations: 25,
  ezekiel: 26,
  daniel: 27,
  hosea: 28,
  joel: 29,
  amos: 30,
  obadiah: 31,
  jonah: 32,
  micah: 33,
  nahum: 34,
  habakkuk: 35,
  zephaniah: 36,
  haggai: 37,
  zechariah: 38,
  malachi: 39,
  matthew: 40,
  mark: 41,
  luke: 42,
  john: 43,
  acts: 44,
  romans: 45,
  "1 corinthians": 46,
  "2 corinthians": 47,
  galatians: 48,
  ephesians: 49,
  philippians: 50,
  colossians: 51,
  "1 thessalonians": 52,
  "2 thessalonians": 53,
  "1 timothy": 54,
  "2 timothy": 55,
  titus: 56,
  philemon: 57,
  hebrews: 58,
  james: 59,
  "1 peter": 60,
  "2 peter": 61,
  "1 john": 62,
  "2 john": 63,
  "3 john": 64,
  jude: 65,
  revelation: 66,
};

function normalizeBookName(name) {
  let normalized = name.trim().toLowerCase().replace(/\./g, " ").replace(/-/g, " ");
  normalized = normalized.replace(/\s+/g, " ");

  const romanPrefixes = [
    ["i ", "1 "],
    ["ii ", "2 "],
    ["iii ", "3 "],
    ["1st ", "1 "],
    ["2nd ", "2 "],
    ["3rd ", "3 "],
  ];

  for (const [prefix, replacement] of romanPrefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = replacement + normalized.slice(prefix.length);
      break;
    }
  }

  return normalized.replace(/^(\d)\s*([a-z])/, "$1 $2").trim();
}

export function bookNameToId(bookName) {
  return BOOK_IDS[normalizeBookName(bookName)] ?? null;
}

export function parseReference(reference) {
  if (!reference) return null;

  const cleaned = reference.replace(/\s+/g, " ").trim();
  const match = cleaned.match(/^(.+?)\s+(\d+)\s*:\s*(.+)$/);
  if (!match) return null;

  const bookName = match[1].trim();
  const chapter = Number.parseInt(match[2], 10);
  const bookId = bookNameToId(bookName);
  if (!bookId || Number.isNaN(chapter)) return null;

  const verses = [];
  for (const part of match[3].split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startRaw, endRaw] = trimmed.split("-");
      const start = Number.parseInt(startRaw, 10);
      const end = Number.parseInt(endRaw, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) continue;
      for (let v = start; v <= end; v += 1) verses.push(v);
    } else {
      const verse = Number.parseInt(trimmed, 10);
      if (!Number.isNaN(verse)) verses.push(verse);
    }
  }

  if (!verses.length) return null;

  return {
    bookName,
    bookId,
    chapter,
    verses: [...new Set(verses)].sort((a, b) => a - b),
    display: cleaned,
  };
}
