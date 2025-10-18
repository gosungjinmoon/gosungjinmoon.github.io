/* assets/js/main.js  v6.4.1_202510180215 */
(() => {
  "use strict";

  // 기본 부트 로깅
  console.log("[site] boot");

  // 언어 자동 설정 (translator.js가 lang 설정을 마친 상태라고 가정)
  const htmlLang = document.documentElement.lang || "ko";
  console.log("[site] lang:", htmlLang);

  // 외부 링크는 새 탭
  document.querySelectorAll('a[href^="http"]').forEach((a) => {
    if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
    if (!a.getAttribute("rel")) a.setAttribute("rel", "noopener noreferrer");
  });

  // 헤더 고정 효과 (예시)
  const header = document.querySelector(".site-header");
  if (header) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (y > lastY && y > 64) header.classList.add("hide");
      else header.classList.remove("hide");
      lastY = y;
    });
  }
})();
