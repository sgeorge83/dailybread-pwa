import { STORAGE_LANG, STORAGE_THEME } from "./config.js";
import { applyUiStrings, t } from "./i18n.js";
import {
  cacheDevotionals,
  fetchDevotionals,
  getCachedDevotionals,
  getLastUpdated,
  needsRefresh,
} from "./odb-api.js";
import { fetchUrduPassage } from "./urdu-bible.js";
import { translateDevotional } from "./translate.js";

const state = {
  lang: localStorage.getItem(STORAGE_LANG) || "en",
  devotionals: getCachedDevotionals() || new Map(),
  selectedDate: null,
  current: null,
  deferredPrompt: null,
};

const els = {
  status: document.getElementById("status"),
  devotional: document.getElementById("devotional"),
  dateStrip: document.getElementById("date-strip"),
  dateRange: document.getElementById("date-range"),
  lastSynced: document.getElementById("last-synced"),
  langSelect: document.getElementById("lang-select"),
  todayBtn: document.getElementById("today-btn"),
  prevDay: document.getElementById("prev-day"),
  nextDay: document.getElementById("next-day"),
  themeToggle: document.getElementById("theme-toggle"),
  shareBtn: document.getElementById("share-btn"),
  installBanner: document.getElementById("install-banner"),
  installBtn: document.getElementById("install-btn"),
  installDismiss: document.getElementById("install-dismiss"),
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDisplayDate(dateKey, lang) {
  const locale = lang === "ur" ? "ur-PK" : "en-US";
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRangeLabel(dates, lang) {
  if (!dates.length) return "—";
  const locale = lang === "ur" ? "ur-PK" : "en-US";
  const fmt = (key) =>
    new Date(`${key}T12:00:00`).toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${dates.length} days · ${fmt(dates[0])} – ${fmt(dates.at(-1))}`;
}

function sortedDates() {
  return [...state.devotionals.keys()].sort();
}

function pickDefaultDate(dates) {
  const today = new Date().toISOString().slice(0, 10);
  if (dates.includes(today)) return today;

  const todayMs = new Date(`${today}T12:00:00`).getTime();
  let closest = dates[0];
  let minDiff = Infinity;

  for (const key of dates) {
    const diff = Math.abs(new Date(`${key}T12:00:00`).getTime() - todayMs);
    if (diff < minDiff) {
      minDiff = diff;
      closest = key;
    }
  }

  return closest;
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_THEME, theme);
  els.themeToggle.textContent = theme === "dark" ? "\u263E" : "\u263C";
}

function initTheme() {
  const saved = localStorage.getItem(STORAGE_THEME);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
}

function showStatus(messageKey, isError = false) {
  els.status.classList.remove("hidden");
  els.devotional.classList.add("hidden");
  els.status.innerHTML = `
    <div class="spinner" aria-hidden="true"></div>
    <span>${escapeHtml(t(state.lang, messageKey))}</span>
  `;
  els.status.style.borderColor = isError ? "#c0392b" : "";
}

function hideStatus() {
  els.status.classList.add("hidden");
  els.devotional.classList.remove("hidden");
}

function updateNavButtons() {
  const dates = sortedDates();
  const idx = dates.indexOf(state.selectedDate);
  els.prevDay.disabled = idx <= 0;
  els.nextDay.disabled = idx >= dates.length - 1;
}

function scrollActivePillIntoView() {
  const active = els.dateStrip.querySelector(".day-pill.active");
  active?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function updateSyncHint() {
  const last = getLastUpdated();
  if (!last || !els.lastSynced) return;

  const locale = state.lang === "ur" ? "ur-PK" : "en-US";
  const timeStr = last.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  els.lastSynced.textContent = `${t(state.lang, "lastSynced")}: ${timeStr}`;
}

function buildDateStrip() {
  const dates = sortedDates();
  if (!dates.length) return;

  if (!state.selectedDate || !state.devotionals.has(state.selectedDate)) {
    state.selectedDate = pickDefaultDate(dates);
  }

  els.dateRange.textContent = formatRangeLabel(dates, state.lang);
  updateSyncHint();

  const dayNameFmt = new Intl.DateTimeFormat(state.lang === "ur" ? "ur-PK" : "en-US", {
    weekday: "short",
  });

  els.dateStrip.innerHTML = dates
    .map((key) => {
      const d = new Date(`${key}T12:00:00`);
      const isActive = key === state.selectedDate;
      return `
        <button
          type="button"
          class="day-pill${isActive ? " active" : ""}"
          data-date="${key}"
          role="tab"
          aria-selected="${isActive}"
        >
          <span class="day-name">${escapeHtml(dayNameFmt.format(d))}</span>
          <span class="day-num">${d.getDate()}</span>
        </button>
      `;
    })
    .join("");

  els.dateStrip.querySelectorAll(".day-pill").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.selectedDate = btn.dataset.date;
      buildDateStrip();
      await renderSelectedDate();
    });
  });

  updateNavButtons();
  scrollActivePillIntoView();
}

function renderUrduPassage(urduPassage) {
  if (!urduPassage) return "";

  const verses = urduPassage.verses
    .map(
      (item) =>
        `<p class="verse-item"><span class="verse-num">${item.verse}</span>${escapeHtml(item.text)}</p>`
    )
    .join("");

  return `
    <section class="section">
      <h3>${escapeHtml(t(state.lang, "urduPassage"))}</h3>
      <p class="passage-ref">${escapeHtml(urduPassage.reference)}</p>
      <div class="urdu-text">${verses}</div>
    </section>
  `;
}

function renderDevotionalCard(devotional, urduPassage) {
  const categories = devotional.categories
    .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
    .join("");

  const translateNote = devotional._translated
    ? `<p class="notice">${escapeHtml(t(state.lang, "autoTranslateNote"))}</p>`
    : "";

  return `
    <div class="card">
      ${
        devotional.imageUrl
          ? `<img class="hero-image" src="${escapeHtml(devotional.imageUrl)}" alt="" loading="lazy">`
          : ""
      }
      <div class="card-body">
        <div class="meta-row">
          <span>${escapeHtml(formatDisplayDate(devotional.dateKey, state.lang))}</span>
          ${categories}
        </div>

        <h2>${escapeHtml(devotional.title)}</h2>

        ${
          devotional.passageReference
            ? `<p class="passage-ref">${escapeHtml(t(state.lang, "passage"))}: ${escapeHtml(devotional.passageReference)}</p>`
            : ""
        }

        ${
          devotional.author
            ? `<p class="meta-row">${escapeHtml(t(state.lang, "byAuthor"))} ${escapeHtml(devotional.author)}</p>`
            : ""
        }

        ${
          devotional.audioUrl
            ? `<section class="section">
                <h3>${escapeHtml(t(state.lang, "listen"))}</h3>
                <audio controls preload="none" src="${escapeHtml(devotional.audioUrl)}"></audio>
              </section>`
            : ""
        }

        ${renderUrduPassage(urduPassage)}
        ${translateNote}

        ${
          devotional.verse
            ? `<section class="section">
                <h3>${escapeHtml(t(state.lang, "keyVerse"))}</h3>
                <p>${escapeHtml(devotional.verse)}</p>
              </section>`
            : ""
        }

        ${
          devotional.content
            ? `<section class="section content-block">
                <h3>${escapeHtml(t(state.lang, "devotion"))}</h3>
                ${devotional.content
                  .split(/\n{2,}/)
                  .map((para) => `<p>${escapeHtml(para)}</p>`)
                  .join("")}
              </section>`
            : ""
        }

        ${
          devotional.insights
            ? `<section class="section">
                <h3>${escapeHtml(t(state.lang, "insights"))}</h3>
                <p>${escapeHtml(devotional.insights)}</p>
              </section>`
            : ""
        }

        ${
          devotional.response || devotional.thought
            ? `<section class="section">
                ${
                  devotional.response
                    ? `<h3>${escapeHtml(t(state.lang, "reflect"))}</h3><p>${escapeHtml(devotional.response)}</p>`
                    : ""
                }
                ${
                  devotional.thought
                    ? `<h3>${escapeHtml(t(state.lang, "pray"))}</h3><p>${escapeHtml(devotional.thought)}</p>`
                    : ""
                }
              </section>`
            : ""
        }

        ${
          devotional.bibleInYear
            ? `<section class="section">
                <h3>${escapeHtml(t(state.lang, "bibleInYear"))}</h3>
                <p>${escapeHtml(devotional.bibleInYear)}</p>
              </section>`
            : ""
        }

        <div class="actions">
          <a class="primary-link" href="${escapeHtml(devotional.odbUrl)}" target="_blank" rel="noopener">
            ${escapeHtml(t(state.lang, "readFull"))}
          </a>
          ${
            devotional.passageUrl
              ? `<a class="primary-link" href="${escapeHtml(devotional.passageUrl)}" target="_blank" rel="noopener">
                  ${escapeHtml(t(state.lang, "englishPassage"))}
                </a>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

async function renderSelectedDate() {
  const devotional = state.devotionals.get(state.selectedDate);
  if (!devotional) {
    showStatus("noDevotional", true);
    els.shareBtn.classList.add("hidden");
    return;
  }

  state.current = devotional;
  showStatus(state.lang === "ur" ? "translating" : "loading");

  const [displayDevotional, urduPassage] = await Promise.all([
    translateDevotional(devotional, state.lang),
    fetchUrduPassage(devotional.passageReference),
  ]);

  els.devotional.innerHTML = renderDevotionalCard(displayDevotional, urduPassage);
  hideStatus();
  els.shareBtn.classList.remove("hidden");
  updateNavButtons();
}

async function loadDevotionals(options = {}) {
  const { silent = false } = options;

  if (!silent) showStatus("loading");

  const previousDates = new Set(state.devotionals.keys());

  try {
    const map = await fetchDevotionals();
    state.devotionals = map;
    cacheDevotionals(map);

    const newDates = [...map.keys()].filter((d) => !previousDates.has(d));
    if (newDates.length && !silent) {
      state.selectedDate = pickDefaultDate(sortedDates());
    }
  } catch (error) {
    console.error(error);
    const cached = getCachedDevotionals();
    if (cached?.size) {
      state.devotionals = cached;
      if (!silent) {
        showStatus("offlineCached");
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    } else if (!silent) {
      showStatus("loadError", true);
      return false;
    }
    return false;
  }

  buildDateStrip();
  await renderSelectedDate();
  return true;
}

function setupAutoRefresh() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && needsRefresh()) {
      loadDevotionals({ silent: true });
    }
  });

  /* Re-check every hour while app stays open (e.g. overnight tab) */
  setInterval(() => {
    if (document.visibilityState === "visible" && needsRefresh()) {
      loadDevotionals({ silent: true });
    }
  }, 60 * 60 * 1000);
}

function navigateDay(offset) {
  const dates = sortedDates();
  const idx = dates.indexOf(state.selectedDate);
  const next = dates[idx + offset];
  if (!next) return;
  state.selectedDate = next;
  buildDateStrip();
  renderSelectedDate();
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(console.error);
  }
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredPrompt = event;
    els.installBanner.classList.remove("hidden");
  });

  els.installBtn.addEventListener("click", async () => {
    if (!state.deferredPrompt) return;
    state.deferredPrompt.prompt();
    await state.deferredPrompt.userChoice;
    state.deferredPrompt = null;
    els.installBanner.classList.add("hidden");
  });

  els.installDismiss.addEventListener("click", () => {
    els.installBanner.classList.add("hidden");
  });
}

function setupShare() {
  els.shareBtn.addEventListener("click", async () => {
    if (!state.current || !navigator.share) return;

    await navigator.share({
      title: t(state.lang, "shareTitle"),
      text: `${state.current.title} — ${t(state.lang, "shareText")}`,
      url: state.current.odbUrl,
    });
  });

  if (!navigator.share) {
    els.shareBtn.classList.add("hidden");
  }
}

function bindEvents() {
  if (state.lang === "hi") {
    state.lang = "en";
    localStorage.setItem(STORAGE_LANG, "en");
  }

  els.langSelect.value = state.lang;
  applyUiStrings(state.lang);

  els.langSelect.addEventListener("change", async (event) => {
    state.lang = event.target.value;
    localStorage.setItem(STORAGE_LANG, state.lang);
    applyUiStrings(state.lang);
    buildDateStrip();
    await renderSelectedDate();
  });

  els.todayBtn.addEventListener("click", async () => {
    const dates = sortedDates();
    if (!dates.length) return;
    state.selectedDate = pickDefaultDate(dates);
    buildDateStrip();
    await renderSelectedDate();
  });

  els.prevDay.addEventListener("click", () => navigateDay(-1));
  els.nextDay.addEventListener("click", () => navigateDay(1));

  els.themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
}

initTheme();
bindEvents();
setupInstallPrompt();
setupShare();
registerServiceWorker();
setupAutoRefresh();
loadDevotionals();
