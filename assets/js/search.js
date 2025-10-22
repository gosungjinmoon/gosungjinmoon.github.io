/* assets/js/search.js v1.0_202510220736 */
(function () {
  const resultsContainer = document.getElementById('search-results');
  const searchInput = document.getElementById('search-input');

  if (!resultsContainer) return;

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  const query = getQueryVariable('q');
  if (searchInput) {
    searchInput.value = query || '';
  }

  if (!query) {
    resultsContainer.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  // 언어에 맞는 search.json 경로 설정
  const lang = document.documentElement.lang || 'ko';
  const jsonPath = lang === 'en' ? '/en/search.json' : '/ko/search.json';

  fetch(jsonPath)
    .then((response) => response.json())
    .then((data) => {
      const idx = lunr(function () {
        this.ref('url');
        this.field('title');
        this.field('content');

        data.forEach((doc) => {
          this.add(doc);
        });
      });

      const results = idx.search(query);
      displayResults(results, data);
    })
    .catch((error) => {
      console.error('Error fetching search data:', error);
      resultsContainer.innerHTML = '<p>Error loading search results.</p>';
    });

  function displayResults(results, store) {
    if (results.length) {
      resultsContainer.innerHTML = '';
      const ul = document.createElement('ul');
      ul.className = 'post-list';

      results.forEach((result) => {
        const item = store.find((doc) => doc.url === result.ref);
        if (item) {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="post-meta">${item.date}</span>
            <h2><a class="post-link" href="${item.url}">${item.title}</a></h2>
            <p>${item.content.substring(0, 150)}...</p>
          `;
          ul.appendChild(li);
        }
      });
      resultsContainer.appendChild(ul);
    } else {
      resultsContainer.innerHTML = `<p>No results found for "${query}"</p>`;
    }
  }
})();
