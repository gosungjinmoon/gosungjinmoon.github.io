document.addEventListener('DOMContentLoaded', ()=>{
  const $ = (s)=>document.querySelector(s);
  const form = $('#postForm');
  const out = $('#result');

  form?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const title = $('#postTitle').value.trim();
    const content = $('#postContent').value.trim();
    const lang = (document.querySelector('input[name="postLang"]:checked')?.value) || 'ko';
    const autoTranslate = $('#autoTranslate').checked;

    out.textContent = 'Posting...';

    try{
      const resp = await createNewPost({
        title, content, lang,
        auto_translate: autoTranslate,
        publish_now: true
      });
      out.textContent = JSON.stringify(resp, null, 2);
      alert('✅ 게시 성공');
    }catch(err){
      console.error(err);
      out.textContent = err.message || String(err);
      alert('❌ 게시 실패: ' + (err.message || err));
    }
  });
});
