/* assets/js/search.js v1.0.0_202510250840 */
/*
 * ⭐️ 아키텍처 핵심 ⭐️
 * 이 파일은 정적 JS 파일입니다.
 * Liquid 태그 대신, head.html에서 주입한 'window.GOFUNWITH_SITE' 전역 객체를 참조하여
 * 현재 언어에 맞는 'search.json' 경로를 가져옵니다.
 */
(function () {
  'use strict';

  let lunrIndex = null;
  let postData = [];
  let currentLang = 'ko';

  // URL에서 쿼리 파라미터 가져오기
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Lunr 인덱스 초기화
  async function initLunr() {
    if (!window.GOFUNWITH_SITE || !window.lunr) {
      console.error('Site config or Lunr.js not loaded.');
      return;
    }

    currentLang = window.GOFUNWITH_SITE.current_lang;
    const jsonPath = window.GOFUNWITH_SITE.search_json_path[currentLang];

    if (!jsonPath) {
      console.error('Search JSON path not found for lang:', currentLang);
      return;
    }

    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      postData = data; // store post data for result display

      // Lunr.js 인덱스 빌드
      lunrIndex = lunr(function () {
        // 다국어 지원 (영어, 한국어)
        if (currentLang === 'en') {
          this.use(lunr.stopWordFilter);
        } else if (window.lunr.ko) {
          this.use(lunr.ko); // lunr-languages 플러그인이 필요할 수 있음
        }

        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('tags', { boost: 5 });

        data.forEach((doc) => {
          this.add(doc);
        });
      });

      // 인덱스 로드 후 검색 실행
      performSearch();
    } catch (e) {
      console.error('Error fetching or building search index:', e);
      displayError();
    }
  }

  // 검색 수행
  function performSearch() {
    const query = getQueryParam('q');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const resultsTitle = document.getElementById('search-results-title');
    const loadingEl = document.getElementById('search-loading');
    const noResultsEl = document.getElementById('search-no-results');

    if (loadingEl) loadingEl.style.display = 'none';
    if (!query || !lunrIndex || !resultsContainer || !resultsTitle || !noResultsEl) {
      if (noResultsEl) noResultsEl.style.display = 'block';
      return;
    }

    if (searchInput) searchInput.value = query;
    resultsTitle.innerText =
      currentLang === 'en'
        ? `Search results for "${query}"`
        : `"${query}"에 대한 검색 결과`;

    try {
      const results = lunrIndex.search(query);
      displayResults(results);
    } catch (e) {
      console.error('Error during search:', e);
      displayError();
    }
  }

  // 결과 표시
  function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    const noResultsEl = document.getElementById('search-no-results');
    resultsContainer.innerHTML = ''; // 기존 결과 삭제

    if (results.length === 0) {
      noResultsEl.style.display = 'block';
      return;
    }

    noResultsEl.style.display = 'none';

    results.forEach((result) => {
      const post = postData.find((p) => p.url === result.ref);
      if (post) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="post-meta">${post.date}</span>
          <h2>
            <a class="post-link" href="${window.GOFUNWITH_SITE.base_url}${post.url.substring(1)}">${post.title}</a>
          </h2>
          <div class="post-excerpt">${post.content.substring(0, 150)}...</div>
          <div class="post-tags">
            ${
              post.tags
                ? post.tags
                    .map(
                      (tag) =>
                        `<span class="tag-item">${tag}</span>`,
                    )
                    .join('')
                : ''
            }
          </div>
        `;
        resultsContainer.appendChild(li);
      }
    });
  }

  function displayError() {
    const resultsContainer = document.getElementById('search-results');
    const loadingEl = document.getElementById('search-loading');
    if (loadingEl) loadingEl.style.display = 'none';
    resultsContainer.innerHTML =
      '<li class="search-error">An error occurred during the search.</li>';
  }

  // 페이지 로드 시 검색 실행
  document.addEventListener('DOMContentLoaded', () => {
    // /search/ 또는 /en/search/ 페이지에서만 실행
    if (
      window.location.pathname.endsWith('/search/') ||
      window.location.pathname.endsWith('/search')
    ) {
      initLunr();
    }
  });
})();
