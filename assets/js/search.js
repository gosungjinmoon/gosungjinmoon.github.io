/* assets/js/search.js  v6.4.1_202510180200 */

(function() {
  const input = document.getElementById("q"); const btn = document.getElementById("btnSearch");
  if (!input || !btn) return;
  const lang = location.pathname.startsWith("/en/") ? "en" : "ko";
  const jsonUrl = `/${lang}/search.json`; let idx=null, docs=[];
  async function ensureIndex() {
    if (idx) return; const res = await fetch(jsonUrl, { cache:'no-store' });
    docs = await res.json(); idx = lunr(function(){ this.ref('url'); this.field('title'); this.field('content'); docs.forEach(d=>this.add(d)); });
  }
  async function doSearch() {
    const q = input.value.trim(); if (!q) return; await ensureIndex();
    const hits = idx.search(q); const list = document.getElementById("searchResults"); list.innerHTML="";
    hits.slice(0,20).forEach(h=>{ const d = docs.find(x=>x.url===h.ref); if(!d) return;
      const el = document.createElement('div'); el.className='item';
      el.innerHTML = `<a href="${d.url}">${d.title}</a><div class='meta'>${d.date} · ${(d.tags||[]).join(", ")}</div>`;
      list.appendChild(el); });
  }
  btn.addEventListener("click", doSearch); input.addEventListener("keydown", e => e.key==="Enter" && doSearch());
})();
