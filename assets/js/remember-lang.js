// v20251106  기억해둔 언어를 태그 페이지에서 사용
(function () {
  // URL 경로에 /en/ 또는 /ko/가 있으면 그 언어를 저장
  var path = location.pathname;
  var lang = /\/en(\/|$)/.test(path) ? 'en' : (/\/ko(\/|$)/.test(path) ? 'ko' : null);
  if (lang) {
    try { localStorage.setItem('gfw_lang', lang); } catch (_) {}
  }
})();
