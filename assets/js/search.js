(function(){
  var lang = (document.documentElement.getAttribute('lang') || 'ko').toLowerCase();
  var base = window.location.origin;
  var idxUrl = lang === 'en' ? base + '/en/search.json' : base + '/ko/search.json';
  var input = document.querySelector('#search-input');
  var results = document.querySelector('#search-results');
  if(!input || !results) return;
  fetch(idxUrl).then(r=>r.json()).then(index=>{
    input.addEventListener('input', e=>{
      var q = e.target.value.trim().toLowerCase();
      if(!q){ results.innerHTML=''; return; }
      var hits = index.filter(it=>(it.title||'').toLowerCase().includes(q)).slice(0,20);
      results.innerHTML = hits.map(h=>'<li><a href="'+h.url+'">'+h.title+'</a></li>').join('');
    });
  }).catch(err=>console.warn('Search load fail',err));
})();