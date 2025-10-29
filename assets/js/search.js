// assets/js/search.js
(function(){
  // GFW: 언어별 search.json 선택
  var lang = (document.documentElement.getAttribute('lang') || 'ko').toLowerCase();
  var base = window.location.origin;
  var idxUrl = lang === 'en' ? base + '/en/search.json' : base + '/ko/search.json';

  // 검색 입력 요소/결과 영역 셀렉터는 사이트에 맞게 조정
  var input = document.querySelector('#search-input');
  var results = document.querySelector('#search-results');

  if(!input || !results) return;

  fetch(idxUrl, { cache: 'no-cache' })
    .then(function(r){ return r.json(); })
    .then(function(index){
      input.addEventListener('input', function(e){
        var q = e.target.value.trim().toLowerCase();
        if(!q){ results.innerHTML=''; return; }
        var hits = index.filter(function(it){
          return (it.title || '').toLowerCase().includes(q) ||
                 (it.tags || '').toLowerCase().includes(q) ||
                 (it.content || '').toLowerCase().includes(q);
        }).slice(0, 20);

        results.innerHTML = hits.map(function(h){
          var url = h.url || '#';
          return '<li><a href="'+url+'">'+(h.title || url)+'</a></li>';
        }).join('');
      });
    })
    .catch(function(err){
      console.warn('Search index load failed', idxUrl, err);
    });
})();