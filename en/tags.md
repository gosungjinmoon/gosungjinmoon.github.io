<!-- /* en/tags.md  v6.3.7_202510171349 */ -->
---
layout: default
title: "#Tags"
lang: en
permalink: /en/tags/
---
<h2>#Tags</h2>
{% include tag-cloud.html %}
<div id="tag-list"></div>
<script>
(async function() {
  const hash = decodeURIComponent(location.hash.replace('#',''));
  const res = await fetch('{{ '/' | append: 'en' | append: '/search.json' | relative_url }}');
  const data = await res.json();
  const filtered = hash ? data.filter(p => (p.tags||[]).includes(hash)) : data;
  document.querySelector('#tag-list').innerHTML = filtered.map(h => `<div><a href="${h.url}">${h.title}</a><small> — ${(h.tags||[]).join(', ')}</small></div>`).join('');
})();
</script>
