<!-- /* ko/search.md  v6.3.7_202510171349 */ -->
---
layout: default
title: "Search"
lang: ko
permalink: /ko/search/
---
<h2>Search</h2>
{% include search-box.html %}
<div id="results"></div>
<script>
(async function() {
  const params = new URLSearchParams(location.search);
  const q = params.get('q') || '';
  const box = document.querySelector('#search-form input[name="q"]');
  if (box) box.value = q;
  if (!q) return;
  const res = await fetch('{{ '/' | append: 'ko' | append: '/search.json' | relative_url }}');
  const data = await res.json();
  const hits = data.filter(p => (p.title + ' ' + p.content).toLowerCase().includes(q.toLowerCase()));
  document.querySelector('#results').innerHTML = hits.map(h => `<div><a href="${h.url}">${h.title}</a><p>${h.excerpt}</p></div>`).join('') || '<p>No results</p>';
})();
</script>
