/* assets/js/search.js v1.0.12_202510251400 */
(function () {
  'use strict';

  let lunrIndex = null;
  let postData = [];
  // ⭐️ V1.0.12: Declare currentLang in the outer scope
  let currentLang = 'ko';

  // URL에서 쿼리 파라미터 가져오기
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Lunr 인덱스 초기화
  async function initLunr() {
    // ⭐️ V1.0.12: currentLang is now accessible here
    if (!window.GOFUNWITH_SITE || !window.lunr) {
      console.error('Site config or Lunr.js not loaded.');
      return; // Stop execution if essential parts are missing
    }

    // Set currentLang based on global site object
    currentLang = window.GOFUNWITH_SITE.current_lang || 'ko'; // Fallback to 'ko'
    const jsonPath = window.GOFUNWITH_SITE.search_json_path[currentLang];

    if (!jsonPath) {
      console.error('Search JSON path not found for lang:', currentLang);
      displayError('Search configuration error.'); // Show user-friendly error
      return;
    }

    try {
      const response = await fetch(jsonPath);
      // V1.0.12: Check if fetch was successful
      if (!response.ok) {
         throw new Error(`Failed to load search data: ${response.statusText}`);
      }
      const data = await response.json();
      postData = data; // store post data for result display

      // Lunr.js 인덱스 빌드
      lunrIndex = lunr(function () {
        if (currentLang === 'en') {
          // English uses default stemmer and stop word filter
        } else {
          // Add Korean stemmer/tokenizer if available (requires lunr-languages plugin)
          // Example: if (lunr.ko) { this.use(lunr.ko); }
        }

        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('tags', { boost: 5 });

        data.forEach((doc) => {
          // V1.0.12: Ensure doc exists before adding
          if (doc) {
             this.add(doc);
          }
        });
      });

      // 인덱스 로드 후 검색 실행
      performSearch();
    } catch (e) {
      console.error('Error fetching or building search index:', e);
      displayError('Could not initialize search.'); // Show user-friendly error
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

    // Hide loading indicator regardless of outcome
    if (loadingEl) loadingEl.style.display = 'none';

    // Check if essential elements exist
    if (!resultsContainer || !resultsTitle || !noResultsEl) {
       console.error("Search result elements not found in the DOM.");
       return;
    }
     // Clear previous results
    resultsContainer.innerHTML = '';
    noResultsEl.style.display = 'none';


    if (!query) {
       resultsTitle.innerText = currentLang === 'en' ? 'Enter a search term' : '검색어를 입력하세요';
       return; // No query, do nothing further
    }

     if (!lunrIndex) {
       console.error("Lunr index is not initialized.");
       resultsTitle.innerText = currentLang === 'en' ? 'Search is not ready' : '검색을 사용할 수 없습니다';
       return;
    }


    if (searchInput) searchInput.value = query; // Pre-fill search box

    resultsTitle.innerText =
      currentLang === 'en'
        ? `Search results for "${query}"`
        : `"${query}"에 대한 검색 결과`;

    try {
      const results = lunrIndex.search(query);
      displayResults(results);
    } catch (e) {
      console.error('Error during search:', e);
      displayError('An error occurred during search.');
    }
  }

  // 결과 표시
  function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    const noResultsEl = document.getElementById('search-no-results');
    // Ensure elements exist before manipulation
    if (!resultsContainer || !noResultsEl) return;

    resultsContainer.innerHTML = ''; // Clear previous results again just in case

    if (results.length === 0) {
      noResultsEl.style.display = 'block';
      return;
    }

    noResultsEl.style.display = 'none';

    results.forEach((result) => {
      // Find the corresponding post data using the result reference (URL)
      const post = postData.find((p) => p && p.url === result.ref); // Add check for p
      if (post) {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="post-meta">${post.date || ''}</span>
          <h2>
            <a class="post-link" href="${post.url}">${post.title || 'Untitled'}</a>
          </h2>
          <div class="post-excerpt">${(post.content || '').substring(0, 150)}...</div>
          <div class="post-tags">
            ${
              post.tags && Array.isArray(post.tags) // V1.0.12: Check if tags is an array
                ? post.tags
                    .map(
                      (tag) =>
                        // V1.0.12: Link tags correctly based on language
                        currentLang === 'en'
                         ? `<a href="/en/tags/#${tag.toLowerCase().replace(/\s+/g, '-')}" class="tag-item">${tag}</a>`
                         : `<a href="/ko/tags/#${tag.toLowerCase().replace(/\s+/g, '-')}" class="tag-item">${tag}</a>`
                    )
                    .join('')
                : ''
            }
          </div>
        `;
        resultsContainer.appendChild(li);
      } else {
         console.warn("Could not find post data for search result ref:", result.ref)
      }
    });
  }

  // 오류 메시지 표시 함수
  function displayError(message = 'An error occurred.') {
    const resultsContainer = document.getElementById('search-results');
    const loadingEl = document.getElementById('search-loading');
    const resultsTitle = document.getElementById('search-results-title');

    if (loadingEl) loadingEl.style.display = 'none';
    if(resultsTitle) resultsTitle.innerText = ''; // Clear title on error

    if (resultsContainer) {
       resultsContainer.innerHTML =
         `<li class="search-error">${message}</li>`;
    }
     const noResultsEl = document.getElementById('search-no-results');
     if(noResultsEl) noResultsEl.style.display = 'none';
  }

  // 페이지 로드 시 검색 실행
  document.addEventListener('DOMContentLoaded', () => {
    // 검색 페이지(/ko/search/ 또는 /en/search/)에서만 인덱스 초기화 실행
    const pathname = window.location.pathname;
    if (pathname.endsWith('/ko/search/') || pathname.endsWith('/en/search/')) {
      initLunr();
    }
  });
})();
