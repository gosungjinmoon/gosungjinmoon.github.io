document.addEventListener("DOMContentLoaded", () => {
  if (!window.__GFW_THEME__) {
    console.error("⚠️ theme-config.js 로드 실패");
    return;
  }
  const activeThemeEl = document.getElementById("activeTheme");
  if (activeThemeEl) activeThemeEl.textContent = window.__GFW_THEME__.activeTheme;
});
