---
layout: default
title: Search
lang: en
permalink: /en/search/
---
# Search
<input id="q" placeholder="Search..." />
<ul id="results"></ul>
<script>
fetch('{{ "/en/search.json" | relative_url }}').then(r=>r.json()).then(data=>{
  const q=document.getElementById('q'), ul=document.getElementById('results');
  const render=()=>{
    const term=q.value.toLowerCase().trim();
    ul.innerHTML='';
    data.filter(p=>!term || p.title.toLowerCase().includes(term) || (p.tags||[]).join(' ').toLowerCase().includes(term))
        .forEach(p=>{ const li=document.createElement('li'); li.innerHTML='<a href="'+p.url+'">'+p.title+'</a>'; ul.appendChild(li); });
  };
  q.addEventListener('input', render); render();
});
</script>
