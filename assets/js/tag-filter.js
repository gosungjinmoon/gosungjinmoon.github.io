// v20251106  태그 상세(/tags/:name/)에서 현재 언어의 글만 보이도록 필터
(function () {
  // 태그 상세 페이지가 아니면 바로 종료
  if (!/^\/tags\/[^/]+\/?$/.test(location.pathname)) return;

  // 기억된 언어 가져오기: 없으면 referrer로 추정, 그래도 없으면 'ko'
  var stored = null;
  try { stored = localStorage.getItem('gfw_lang'); } catch (_) {}
  var inferred = stored ||
    (document.referrer.includes('/en/') ? 'en'
     : (document.referrer.includes('/ko/') ? 'ko' : null)) ||
    'ko';

  function applyFilter() {
    // Chirpy의 태그 페이지는 기본적으로 <ul class="post-list"> 안에 항목들이 들어감
    var list = document.querySelector('ul.post-list, .post-content ul, .archive .post-list');
    if (!list) return;

    list.querySelectorAll('li a[href]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      // 현재 언어 경로(/en/ 또는 /ko/)가 포함되지 않은 글은 숨김
      // (글 permalink에 /en/ 또는 /ko/가 들어가므로 정확히 거를 수 있음)
      if (href.indexOf('/' + inferred + '/') === -1) {
        var li = a.closest('li');
        if (li) li.style.display = 'none';
      }
    });
  }

  // 초기 적용 + 동적 로딩 대비 보강
  applyFilter();
  var mo = new MutationObserver(applyFilter);
  mo.observe(document.body, { childList: true, subtree: true });
})();
