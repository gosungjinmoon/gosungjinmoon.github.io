(function(){
  const cfg = (window.GFW_THEME || {});
  const submit = document.getElementById('submit');
  async function post(){
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const lang = document.querySelector('input[name="lang"]:checked').value;
    const auto = document.getElementById('auto-translate').checked;

    if(!title || !content){ alert('제목/내용을 입력하세요.'); return; }

    const body = { title, content, lang, auto_translate: auto, publish_now: true };
    const url = cfg.n8nEndpoint;
    if(!url){ alert('n8n endpoint 설정이 없습니다. _data/theme.yml의 n8n_endpoint를 확인하세요.'); return; }

    try{
      const r = await fetch(url, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify(body),
        mode:'cors',
        credentials:'omit'
      });
      const j = await r.json().catch(()=> ({}));
      if(!r.ok){ throw new Error((j && j.message) || ('HTTP '+r.status)); }
      alert('게시 요청 완료: ' + JSON.stringify(j));
    }catch(e){
      console.error(e);
      alert('에러: ' + e.message);
    }
  }
  if(submit) submit.addEventListener('click', post);
})();
