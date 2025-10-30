
(function(){
  async function fetchIndex(lang){
    const url = `/${lang}/search.json`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('search.json ' + lang + ' ' + res.status);
    return res.json();
  }
  function buildIndex(data){
    return lunr(function(){
      this.ref('url'); this.field('title'); this.field('content');
      data.forEach(doc => this.add(doc));
    });
  }
  let _idx=null,_docs=[],_lang=(document.documentElement.lang||'ko');
  async function ensureIndex(){ if(_idx) return _idx; const data=await fetchIndex(_lang); _docs=data; _idx=buildIndex(data); return _idx; }
  async function handle(e){
    const q=e?.target?.value?.trim()||''; const box=document.getElementById('globalSearchResults');
    if(!box) return; box.innerHTML=''; if(!q) return;
    try{
      const idx=await ensureIndex(); const hits=idx.search(q).slice(0,20);
      box.innerHTML=hits.map(h=>{const d=_docs.find(x=>x.url===h.ref)||{};return `<a class='result' href='${d.url}'><strong>${d.title||d.url}</strong><p>${(d.content||'').slice(0,120)}...</p></a>`}).join('')||'<p class="muted">No results.</p>';
    }catch(err){ console.error('search failed',err); box.innerHTML='<p class="error">Search is unavailable.</p>'; }
  }
  try{const dlg=document.getElementById('searchModal');if(dlg&&typeof dlg.showModal!=='function')dlg.setAttribute('open','');}catch(_){}
  window.__gfwSearchHandler=handle;
})();
