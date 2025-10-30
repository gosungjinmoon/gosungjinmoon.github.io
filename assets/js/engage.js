
/* assets/js/engage.js v1.0.0_20251026
 * - Like button with localStorage + optional Worker backend
 * - Giscus comments loader (if configured)
 */
(function(){
  'use strict';
  function ready(fn){ if(document.readyState!=='loading'){fn();} else {document.addEventListener('DOMContentLoaded',fn);} }
  ready(function(){
    var likeBtn = document.querySelector('[data-like-btn]');
    if(likeBtn){
      var slug = likeBtn.getAttribute('data-slug');
      var countEl = document.querySelector('[data-like-count]');
      var storageKey = 'gfw_like_'+slug;
      var liked = localStorage.getItem(storageKey) === '1';
      function render(){
        if(liked){ likeBtn.classList.add('liked'); likeBtn.setAttribute('aria-pressed','true'); }
        var count = parseInt(localStorage.getItem(storageKey+'_count')||'0',10);
        if(countEl) countEl.textContent = count;
      }
      render();
      likeBtn.addEventListener('click', async function(){
        if(liked) return;
        liked = true;
        localStorage.setItem(storageKey, '1');
        // optimistic count
        var c = parseInt(localStorage.getItem(storageKey+'_count')||'0',10)+1;
        localStorage.setItem(storageKey+'_count', String(c));
        render();
        try{
          var cfg = window.GOFUNWITH_ADMIN || {};
          if(cfg.worker_like_endpoint){
            await fetch(cfg.worker_like_endpoint, {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ slug: slug, action: 'like' })
            });
          }
        }catch(e){ console.warn('Like sync failed:', e); }
      });
      // Try to fetch server count
      try{
        var cfg = window.GOFUNWITH_ADMIN || {};
        if(cfg.worker_like_endpoint){
          fetch(cfg.worker_like_endpoint + '?slug='+encodeURIComponent(slug))
            .then(r=>r.ok?r.json():null)
            .then(j=>{ if(j && typeof j.count==='number'){ localStorage.setItem(storageKey+'_count', String(j.count)); render(); }});
        }
      }catch(e){}
    }
    // Giscus
    var g = document.getElementById('giscus_thread');
    if(g){
      var s = document.createElement('script');
      var conf = g.dataset;
      s.src = 'https://giscus.app/client.js';
      s.setAttribute('data-repo', conf.repo);
      if(conf.repoid) s.setAttribute('data-repo-id', conf.repoid);
      if(conf.category) s.setAttribute('data-category', conf.category);
      if(conf.categoryid) s.setAttribute('data-category-id', conf.categoryid);
      s.setAttribute('data-mapping', conf.mapping || 'pathname');
      s.setAttribute('data-strict', '0');
      s.setAttribute('data-reactions-enabled','1');
      s.setAttribute('data-emit-metadata','0');
      s.setAttribute('data-input-position','bottom');
      s.setAttribute('data-lang', conf.lang || 'ko');
      s.setAttribute('crossorigin','anonymous');
      s.async = true;
      g.appendChild(s);
    }
  });
})();
