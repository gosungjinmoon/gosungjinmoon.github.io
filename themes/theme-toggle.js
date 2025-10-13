// Theme toggle system
const themeBtn = document.getElementById("themeBtn");
const root = document.documentElement;

// 초기 테마 로드
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = prefersDark ? "dark" : "light";
}

// 클릭 시 테마 전환
themeBtn.addEventListener("click", () => {
  const current = root.dataset.theme;
  const next = current === "light" ? "dark" : "light";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
  themeBtn.textContent = next === "light" ? "🌗" : "☀️";
});

// Language toggle system
const langSelect = document.getElementById("langSelect");
const allLangBlocks = document.querySelectorAll("[lang]");

// 저장된 언어 복원
const savedLang = localStorage.getItem("lang") || "ko";
langSelect.value = savedLang;
switchLang(savedLang);

langSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  localStorage.setItem("lang", lang);
  switchLang(lang);
});

function switchLang(lang) {
  allLangBlocks.forEach((el) => {
    el.hidden = el.getAttribute("lang") !== lang;
  });
}