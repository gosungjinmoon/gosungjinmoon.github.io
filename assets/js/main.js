/* assets/js/main.js v1.0.0_202510250840 */
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

        // GOFUNWITH_SITE.base_url을 사용하여 정확한 경로 생성
        const baseUrl = window.GOFUNWITH_SITE.base_url.replace(/\/$/, '');
        window.location.href = `${baseUrl}${searchPath}?q=${encodeURIComponent(query)}`;
      });
    }
  });
})();
