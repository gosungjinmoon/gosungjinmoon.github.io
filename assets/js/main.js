/* assets/js/main.js v1.0.6_202510251040 */
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

        // ⭐️ V1.0.6 수정: 기본 경로를 /ko/search/로, 아니면 /en/search/로
        let searchPath = '/ko/search/';
        if (lang === 'en') {
          searchPath = '/en/search/';
        }

        window.location.href = `${searchPath}?q=${encodeURIComponent(query)}`;
      });
    }
  });
})();
