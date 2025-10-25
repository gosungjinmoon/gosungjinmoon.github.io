/* assets/js/search.js v1.0.2_202510250915 */
(function () {
  'use strict';

  // ... (initLunr, performSearch 함수는 변경 없음) ...

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
        /* ⭐️ 수정: post.url이 이미 '/ko/post-name/' 형식이므로
           base_url을 덧붙일 필요 없이 그대로 사용합니다. */
        li.innerHTML = `
          <span class="post-meta">${post.date}</span>
          <h2>
            <a class="post-link" href="${post.url}">${post.title}</a>
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

  // ... (displayError, DOMContentLoaded는 변경 없음) ...

  // --- (파일 끝) ---
  // (initLunr, performSearch, displayError, DOMContentLoaded 리스너 등
  // 이전 답변의 나머지 JS 코드는 그대로 유지합니다.)
  // ...
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

  // (initLunr 등 나머지 함수들 복사)
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
        if (currentLang === 'en') {
          this.use(lunr.stopWordFilter);
        }
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('tags', { boost: 5 });
        data.forEach((doc) => {
          this.add(doc);
        });
      });
      performSearch();
    } catch (e) {
      console.error('Error fetching or building search index:', e);
      displayError();
    }
  }

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

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

  function displayError() {
    const resultsContainer = document.getElementById('search-results');
    const loadingEl = document.getElementById('search-loading');
    if (loadingEl) loadingEl.style.display = 'none';
    resultsContainer.innerHTML =
      '<li class="search-error">An error occurred during the search.</li>';
  }
})();
