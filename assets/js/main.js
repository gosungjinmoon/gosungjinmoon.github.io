/* assets/js/main.js v1.0.2_202510250915 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 모바일 네비게이션 토글
    const navTrigger = document.querySelector('.nav-trigger');
    const navMenu = document.querySelector('.nav-menu');

    if (navTrigger && navMenu) {
      navTrigger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }

    // 검색 폼 언어 설정
    const searchForm = document.getElementById('search-form');
    const searchLangInput = document.getElementById('search-lang');
    if (searchForm && searchLangInput && window.GOFUNWITH_SITE) {
      // 현재 페이지 언어에 맞춰 폼의 lang 값을 설정
      searchLangInput.value = window.GOFUNWITH_SITE.current_lang;

      // 폼 제출 시 언어에 맞는 검색 페이지로 이동
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = document.getElementById('search-input').value;
        const lang = searchLangInput.value || 'ko';
        let searchPath = '/search/';

        if (lang === 'en') {
          searchPath = '/en/search/';
        }

        /* ⭐️ 수정: GOFUNWITH_SITE.base_url이 '/'로 고정되었으므로
           단순히 경로를 합치지 않고, 올바른 루트 경로로 이동시킵니다. */
        window.location.href = `${searchPath}?q=${encodeURIComponent(query)}`;
      });
    }
  });
})();
