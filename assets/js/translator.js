/* assets/js/translator.js  v6.4.1_202510180200 */

(() => {
  const lang = location.pathname.startsWith("/en/") ? "en" : "ko";
  document.documentElement.setAttribute("lang", lang);
  console.log("[translator] current lang:", lang);
})();
