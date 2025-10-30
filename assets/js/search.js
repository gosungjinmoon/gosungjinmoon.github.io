/* assets/js/search.js v1.0.12_202510251400 */
(function () {
  'use strict';

  let lunrIndex = null;
  let postData = [];
  // ⭐️ V1.0.12: Declare currentLang in the outer scope
  let currentLang = 'ko';

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  async function initLunr() {
    if (!window.GOFUNWITH_SITE || !window.lunr) {
      console.error('Site config or Lunr.js not loaded.');
      displayError('Search is unavailable.'); // User feedback
      return;
    }

    // Assign currentLang from global object
    currentLang = window.GOFUNWITH_SITE.current_lang || 'ko';
    const jsonPath = window.GOFUNWITH_SITE.search_json_path[currentLang];

    if (!jsonPath) {
      console.error('Search JSON path not found for lang:', currentLang);
      displayError('Search configuration error.');
      return;
    }

    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
         throw new Error(`Failed to load search data: ${response.statusText}`);
      }
      const data = await response.json();
      postData = data;

      lunrIndex = lunr(function () {
        // Language specific setup might go here if lunr-languages is used
        // if (currentLang === 'ko' && lunr.ko) { this.use(lunr.ko); }

        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('content');
        this.field('tags', { boost: 5 });

        data.forEach((doc) => {
          if (doc && doc.url) { // Ensure doc and url exist
             this.add(doc);
          } else {
             console.warn("Skipping invalid document in search data:", doc);
          }
        });
      });

      performSearch(); // Perform search after index is ready
    } catch (e) {
      console.error('Error fetching or building search index:', e);
      displayError('Could not initialize search.');
    }
  }

  function performSearch() {
    const query = getQueryParam('q');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');
    const resultsTitle = document.getElementById('search-results-title');
    const loadingEl = document.getElementById('search-loading');
    const noResultsEl = document.getElementById('search-no-results');

    if (loadingEl) loadingEl.style.display = 'none';
    if (!resultsContainer || !resultsTitle || !noResultsEl) {
       console.error("Search result DOM elements not found.");
       return;
    }
    resultsContainer.innerHTML = '';
    noResultsEl.style.display = 'none';

    if (!query) {
       resultsTitle.innerText = currentLang === 'en' ? 'Enter a search term' : '검색어를 입력하세요';
       return;
    }

    if (!lunrIndex) {
       console.error("Lunr index is not initialized for search.");
       resultsTitle.innerText = currentLang === 'en' ? 'Search is not ready' : '검색을 사용할 수 없습니다';
       displayError('Search index not ready.');
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
      displayError('An error occurred during search.');
    }
  }

  function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    const noResultsEl = document.getElementById('search-no-results');
    if (!resultsContainer || !noResultsEl) return;

    resultsContainer.innerHTML = '';

    if (results.length === 0) {
      noResultsEl.style.display = 'block';
      return;
    }

    noResultsEl.style.display = 'none';

    results.forEach((result) => {
      const post = postData.find((p) => p && p.url === result.ref);
      if (post) {
        const li = document.createElement('li');
        const excerpt = (post.content || '').substring(0, 150) + '...';
        const tagsHtml = post.tags && Array.isArray(post.tags)
          ? post.tags
              .map(tag => {
                const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
                const tagUrl = currentLang === 'en' ? `/en/tags/#${tagSlug}` : `/ko/tags/#${tagSlug}`;
                return `<a href="${tagUrl}" class="tag-item">${tag}</a>`;
              })
              .join('')
          : '';

        li.innerHTML = `
          <span class="post-meta">${post.date || ''}</span>
          <h2>
            <a class="post-link" href="${post.url}">${post.title || 'Untitled'}</a>
          </h2>
          <div class="post-excerpt">${excerpt}</div>
          <div class="post-tags">${tagsHtml}</div>
        `;
        resultsContainer.appendChild(li);
      } else {
         console.warn("Could not find post data for search result ref:", result.ref);
      }
    });
  }

  function displayError(message = 'An error occurred.') {
    const resultsContainer = document.getElementById('search-results');
    const loadingEl = document.getElementById('search-loading');
    const resultsTitle = document.getElementById('search-results-title');
    const noResultsEl = document.getElementById('search-no-results');

    if (loadingEl) loadingEl.style.display = 'none';
    if(resultsTitle) resultsTitle.innerText = '';
    if(noResultsEl) noResultsEl.style.display = 'none';

    if (resultsContainer) {
       resultsContainer.innerHTML = `<li class="search-error">${message}</li>`;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    // V1.0.12: Ensure trailing slash consistency
    const cleanPathname = pathname.endsWith('/') ? pathname : pathname + '/';
    if (cleanPathname === '/ko/search/' || cleanPathname === '/en/search/') {
      initLunr();
    }
  });
})();
