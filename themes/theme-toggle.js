// 🌗 테마 전환 및 언어 토글 스크립트
document.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeBtn");
  const langSelect = document.getElementById("langSelect");

  // 저장된 테마/언어 불러오기
  const savedTheme = localStorage.getItem("theme") || "light";
  const savedLang = localStorage.getItem("lang") || "ko";

  document.documentElement.dataset.theme = savedTheme;
  langSelect.value = savedLang;

  // 언어 반영
  document.querySelectorAll("[lang]").forEach(el => {
    el.hidden = el.getAttribute("lang") !== savedLang;
  });

  // 🌗 테마 전환
  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    const next = current === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  // 🌐 언어 전환
  langSelect.addEventListener("change", e => {
    const lang = e.target.value;
    localStorage.setItem("lang", lang);
    document.querySelectorAll("[lang]").forEach(el => {
      el.hidden = el.getAttribute("lang") !== lang;
    });
  });
});
