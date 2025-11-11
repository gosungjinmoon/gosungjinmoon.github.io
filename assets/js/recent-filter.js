// assets/js/recent-filter.js  /* v20251106 */
(function () {
  // 현재 페이지 언어: <html lang=".."> 우선, 없으면 URL로 추정
  var currentLang = (document.documentElement.lang || '').toLowerCase();
  if (currentLang !== 'ko' && currentLang !== 'en') {
    currentLang = /\/en(\/|$)/.test(location.pathname) ? 'en' : 'ko';
  }

  function getLangFromHref(href) {
    try {
      var path = new URL(href, location.origin).pathname;
      // 첫 세그먼트(ko|en) 검사
      var seg = path.split('/').filter(Boolean)[0];
      return seg === 'en' ? 'en' : (seg === 'ko' ? 'ko' : null);
    } catch (_) {
      return null;
    }
  }

  function filterList(root) {
    if (!root) return;
    var items = root.querySelectorAll('li');
    items.forEach(function (li) {
      var a = li.querySelector('a[href]');
      if (!a) return;
      var lang = getLangFromHref(a.href);
      if (lang && lang !== currentLang) {
        li.style.display = 'none';
      } else {
        li.style.display = ''; // 보이도록
      }
    });
  }

  function filterAll() {
    // Chirpy의 “Recently Updated” 위젯은 페이지마다 DOM 구조가 조금씩 달 수 있어
    // 제목(헤딩) 텍스트/클래스 기준으로 안전하게 탐색
    // 1) 클래스로 먼저 시도
    var lists = Array.from(document.querySelectorAll(
      '.recent-posts ul, .recent-posts ol, .post-recent ul, .post-recent ol'
    ));

    // 2) 헤딩 텍스트로 탐색 (영/한 로케일 모두 커버)
    var headingCandidates = Array.from(document.querySelectorAll('h2, h3, h4'));
    headingCandidates.forEach(function (h) {
      var t = (h.textContent || '').trim().toLowerCase();
      if (t.includes('recently updated') || t.includes('최근 업데이트')) {
        var ul = h.parentElement && h.parentElement.querySelector('ul,ol');
        if (ul && !lists.includes(ul)) lists.push(ul);
      }
    });

    // 필터 적용
    lists.forEach(filterList);
  }

  // 초기 1회
  filterAll();

  // DOM에 위젯이 늦게 붙는 경우 대응
  var observer = new MutationObserver(filterAll);
  observer.observe(document.body, { childList: true, subtree: true });

  // 혹시 모를 지연 렌더링용 안전망
  setTimeout(filterAll, 400);
  setTimeout(filterAll, 1000);
})();
