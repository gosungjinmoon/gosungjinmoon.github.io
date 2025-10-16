// Lightweight client search
(async () => {
  const lang = location.pathname.startsWith('/en/') ? 'en' : 'ko';
  const data = await fetch(`/${lang}/search.json`).then(r => r.json()).catch(() => []);
  const input = document.getElementById('search-input');
  const list = document.getElementById('search-results');
  if(!input || !list) return;
  function render(items){
    list.innerHTML = items.slice(0,50).map(p => `<li><a href="${p.url}">${p.title}</a></li>`).join('');
  }
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if(!q){ list.innerHTML=''; return; }
    const res = data.filter(p => (p.title||'').toLowerCase().includes(q) || (p.content||'').toLowerCase().includes(q));
    render(res);
  });
})();
