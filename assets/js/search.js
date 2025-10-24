/* assets/js/search.js v1.0.0_202510221638 */

/*
 * Client-side search using Lunr.js
 *
 * This script is loaded on all pages, but only executes search logic
 * on the search layout (/ko/search/ or /en/search/).
 */

(function (window) {
  'use strict';

  let idx = null;
  let searchData = {};
  let currentLang = 'ko';

  const MAX_RESULTS = 10;

  /**
   * Initializes the search index for a specific language.
   * @param {string} lang - The language code (e.g., 'ko', 'en').
   */
  async function initSearch(lang) {
    currentLang = lang || 'ko';
    const searchPage = document.querySelector('.search-page');
    if (!searchPage) return; // Not on a search page

    const resultsList = document.getElementById('search-results-list');
    const statusEl = document.getElementById('search-status');

    try {
      // 1. Fetch search data (JSON)
      statusEl.textContent = statusEl.dataset.loading || 'Loading...';
      const searchJsonUrl = `{{ '/search.json' | prepend: '${currentLang}' | relative_url }}`;
      const response = await fetch(searchJsonUrl);
      if (!response.ok) throw new Error(`Failed to load search index: ${response.statusText}`);
      const documents = await response.json();

      // 2. Build Lunr index
      idx = lunr(function () {
        // Use 'ko' or 'en' specific stemmers if available, or default
        if (lunr[currentLang]) {
          this.use(lunr[currentLang]);
        }
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('tags', { boost: 5 });
        this.field('content');

        documents.forEach(doc => {
          this.add(doc);
          searchData[doc.url] = doc; // Store full data for display
        }, this);
      });

      // 3. Check for query params and perform initial search
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      const searchInput = document.getElementById(`search-input-${currentLang}`);

      if (query) {
        searchInput.value = query;
        performSearch(query, resultsList, statusEl);
      } else {
        statusEl.textContent = ''; // Clear loading status
      }

      // 4. Add submit event listener to the form
      const searchForm = document.getElementById(`search-form-${currentLang}`);
      searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const newQuery = searchInput.value;
        performSearch(newQuery, resultsList, statusEl);
        // Update URL query string
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('q', newQuery);
        window.history.pushState({}, '', newUrl);
      });
    } catch (error) {
      console.error('Search initialization failed:', error);
      statusEl.textContent = 'Failed to load search index.';
    }
  }

  /**
   * Performs the search and displays results.
   * @param {string} query - The search query.
   * @param {HTMLElement} resultsList - The UL element to display results.
   * @param {HTMLElement} statusEl - The element to show search status.
   */
  function performSearch(query, resultsList, statusEl) {
    resultsList.innerHTML = ''; // Clear previous results

    if (!query) {
      statusEl.textContent = '';
      return;
    }

    try {
      const results = idx.search(query);

      if (results.length === 0) {
        statusEl.textContent = statusEl.dataset.noResults || 'No results found.';
        return;
      }

      statusEl.textContent = `${results.length} result(s) found.`;

      results.slice(0, MAX_RESULTS).forEach(result => {
        const doc = searchData[result.ref];
        const li = document.createElement('li');
        li.innerHTML = `
          <a href="{{ '${doc.url}' | relative_url }}">
            <h3>${doc.title}</h3>
          </a>
          <p>${doc.content.substring(0, 150)}...</p>
          <span class="search-meta">${doc.date}</span>
        `;
        resultsList.appendChild(li);
      });
    } catch (error) {
      console.error('Search failed:', error);
      statusEl.textContent = 'Search failed.';
      resultsList.innerHTML = '';
    }
  }

  // Expose initSearch to global scope
  window.initSearch = initSearch;
})(window);
