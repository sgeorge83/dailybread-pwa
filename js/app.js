import { CACHE_KEY, STORAGE_LANG, STORAGE_THEME } from "./config.js";
import { applyUiStrings, t } from "./i18n.js";
import {
  cacheDevotionals,
  fetchDevotionals,
  getCachedDevotionals,
} from "./odb-api.js";
import { fetchUrduPassage } from "./urdu-bible.js";

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
  datePicker: document.getElementById("date-picker"),
  langSelect: document.getElementById("lang-select"),
  todayBtn: document.getElementById("today-btn"),
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
  const locale = lang === "ur" ? "ur-PK" : lang === "hi" ? "hi-IN" : "en-US";
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  if (isError) els.status.style.borderColor = "tomato";
}

function hideStatus() {
  els.status.classList.add("hidden");
  els.devotional.classList.remove("hidden");
}

function sortedDates() {
  return [...state.devotionals.keys()].sort();
}

function configureDatePicker() {
  const dates = sortedDates();
  if (!dates.length) return;

  els.datePicker.min = dates.at(-1);
  els.datePicker.max = dates[0];

  if (!state.selectedDate || !state.devotionals.has(state.selectedDate)) {
    state.selectedDate = dates[0];
  }

  els.datePicker.value = state.selectedDate;
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

  const showUrduPassage =
    state.lang === "ur" || state.lang === "hi" || state.lang === "en";

  const languageNotice =
    state.lang === "ur"
      ? `<p class="notice">${escapeHtml(t(state.lang, "urduDevotionNote"))}</p>`
      : state.lang === "hi"
        ? `<p class="notice">${escapeHtml(t(state.lang, "hindiDevotionNote"))}</p>`
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

        ${showUrduPassage ? renderUrduPassage(urduPassage) : ""}
        ${languageNotice}

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
  showStatus("loading");

  const urduPassage = await fetchUrduPassage(devotional.passageReference);

  els.devotional.innerHTML = renderDevotionalCard(devotional, urduPassage);
  hideStatus();
  els.shareBtn.classList.remove("hidden");
}

async function loadDevotionals() {
  showStatus("loading");

  try {
    const map = await fetchDevotionals();
    state.devotionals = map;
    cacheDevotionals(map);
  } catch (error) {
    console.error(error);
    const cached = getCachedDevotionals();
    if (cached?.size) {
      state.devotionals = cached;
      showStatus("offlineCached");
      await new Promise((resolve) => setTimeout(resolve, 900));
    } else {
      showStatus("loadError", true);
      return;
    }
  }

  configureDatePicker();
  await renderSelectedDate();
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
  els.langSelect.value = state.lang;
  applyUiStrings(state.lang);

  els.langSelect.addEventListener("change", async (event) => {
    state.lang = event.target.value;
    localStorage.setItem(STORAGE_LANG, state.lang);
    applyUiStrings(state.lang);
    await renderSelectedDate();
  });

  els.datePicker.addEventListener("change", async (event) => {
    state.selectedDate = event.target.value;
    await renderSelectedDate();
  });

  els.todayBtn.addEventListener("click", async () => {
    const dates = sortedDates();
    if (!dates.length) return;
    state.selectedDate = dates[0];
    els.datePicker.value = state.selectedDate;
    await renderSelectedDate();
  });

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
loadDevotionals();
