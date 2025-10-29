(function(){
  const $=(s)=>document.querySelector(s);
  $('#submitBtn').addEventListener('click', async ()=>{
    const title=$('#title').value.trim();
    const content=$('#content').value.trim();
    const lang=document.querySelector('input[name="lang"]:checked').value;
    const auto=$('#auto').checked;
    if(!title||!content){alert('제목과 본문을 입력하세요.');return;}
    const body={title,content,lang,auto_translate:auto,publish_now:true};
    $('#result').textContent='Posting…';
    try{
      const res=await fetch(window.GFW_CONFIG.n8nEndpoint,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)
      });
      const data=await res.json();
      $('#result').textContent=JSON.stringify(data,null,2);
      alert('완료! GitHub에 커밋/PR 확인하세요.');
    }catch(e){
      $('#result').textContent=String(e);
      alert('에러: '+e.message);
    }
  });
})();
