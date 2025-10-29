(async function(){
  const cfg = await GFW.loadThemeConfig().catch(e=>{ alert('설정 로드 실패: '+e.message); });
  if(!cfg) return;
  const el = (id)=>document.getElementById(id);
  el('submitBtn').addEventListener('click', async ()=>{
    const title = el('title').value.trim();
    const content = el('content').value.trim();
    const lang = document.querySelector('input[name="lang"]:checked').value;
    const autoTr = document.getElementById('autoTr').checked;
    const body = { title, content, lang, auto_translate: autoTr, publish_now: true };
    try{
      const res = await fetch(cfg.n8n_webhook_new_post, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
      const data = await res.json().catch(()=>({}));
      el('msg').textContent = res.ok ? '게시 성공' : ('오류: '+(data.message||res.status));
      if(res.ok && data && data.created){
        el('msg').textContent += ' ('+(data.created.ko||data.created.en)+')';
      }
    }catch(err){ el('msg').textContent = '네트워크 오류: '+err.message; }
  });
})();
