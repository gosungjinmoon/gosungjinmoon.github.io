// assets/themes/default/js/translator.js
(function(){
  const current = window.location.pathname.startsWith("/en/") ? "en" : "ko";
  const saved = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("ko") ? "ko" : "en";

  const targetLang = saved || browserLang;
  if (!window.location.pathname.startsWith("/" + targetLang + "/")) {
    window.location.href = "/" + targetLang + "/";
  }

  // 언어 토글 버튼 핸들러
  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("langToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const newLang = current === "ko" ? "en" : "ko";
      localStorage.setItem("lang", newLang);
      window.location.href = "/" + newLang + "/";
    });
  });
})();
