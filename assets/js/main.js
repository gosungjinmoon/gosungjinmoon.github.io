
(function() {
  function qs(s){return document.querySelector(s)}
  function qsa(s){return Array.from(document.querySelectorAll(s))}
  function applyTheme(t){
    document.body.className = (document.body.className||'').replace(/\btheme-\S+/g,'').trim();
    document.body.classList.add('theme-'+t);
    try{ localStorage.setItem('theme', t); }catch(_){}
    const f = document.querySelector('iframe.giscus-frame');
    if (f) f.contentWindow?.postMessage({ giscus: { setConfig: { theme: t==='dark' ? 'dark':'light' } } }, 'https://giscus.app');
  }
  document.addEventListener('DOMContentLoaded', function(){
    const saved = (localStorage.getItem('theme')||'').trim();
    applyTheme(saved || (document.body.className.match(/theme-(\S+)/)?.[1]) || 'modern-light');

    const themeBtn = qs('#themeToggle');
    themeBtn && themeBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      applyTheme(isDark ? 'modern-light' : 'dark');
    });

    const navBtn = qs('#navToggle'), nav = qs('#siteNav');
    if (navBtn && nav) navBtn.addEventListener('click', () => nav.classList.toggle('open'));

    const modal = qs('#searchModal'), openBtn = qs('#openSearch'), input = qs('#globalSearchInput');
    if (openBtn && modal) openBtn.addEventListener('click', () => {
      try { modal.showModal(); } catch(_) { modal.setAttribute('open',''); }
      setTimeout(() => input?.focus(), 50);
    });
    modal && modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
    input && input.addEventListener('input', window.__gfwSearchHandler || (()=>{}));

    qsa('[data-like]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ep = (window.GOFUNWITH_SITE && window.GOFUNWITH_SITE.n8n_worker_like) || '';
        if (!ep) return console.warn('Like endpoint missing');
        try {
          const slug = btn.getAttribute('data-like');
          const res = await fetch(ep, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug }) });
          if (!res.ok) throw new Error('like api ' + res.status);
          btn.classList.add('liked');
        } catch(err) { console.error('like failed', err); }
      });
    });
  });
})();
