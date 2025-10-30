// /* assets/js/main.js v20251101_202510300905 */
(function() {
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

  function applyTheme(theme) {
    document.body.className = (document.body.className || '').replace(/\btheme-\S+/g, '').trim();
    document.body.classList.add('theme-' + theme);
    try { localStorage.setItem('theme', theme); } catch(_){}
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) giscusFrame.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: theme === 'dark' ? 'dark' : 'light' } } },
      'https://giscus.app'
    );
  }

  document.addEventListener('DOMContentLoaded', function() {
    const saved = (localStorage.getItem('theme') || '').trim();
    const active = saved || (document.body.className.match(/theme-(\S+)/)?.[1]) || 'modern-light';
    applyTheme(active);
    const themeBtn = qs('#themeToggle');
    themeBtn && themeBtn.addEventListener('click', function() {
      const isDark = document.body.classList.contains('theme-dark');
      applyTheme(isDark ? 'modern-light' : 'dark');
    });

    const navBtn = qs('#navToggle');
    const nav = qs('#siteNav');
    if (navBtn && nav) navBtn.addEventListener('click', () => nav.classList.toggle('open'));

    const modal = qs('#searchModal');
    const openSearch = qs('#openSearch');
    const input = qs('#globalSearchInput');
    openSearch && openSearch.addEventListener('click', () => { modal.showModal(); setTimeout(() => input?.focus(), 50); });
    modal && modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
    input && input.addEventListener('input', window.__gfwSearchHandler || (()=>{}));

    qsa('[data-like]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const ep = (window.GOFUNWITH_SITE && window.GOFUNWITH_SITE.n8n_worker_like) || '';
        if (!ep) return console.warn('Like endpoint missing');
        try {
          const slug = btn.getAttribute('data-like');
          const res = await fetch(ep, { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ slug }) });
          if (!res.ok) throw new Error('like api ' + res.status);
          btn.classList.add('liked');
        } catch(err) { console.error('like failed', err); }
      });
    });
  });
})();
