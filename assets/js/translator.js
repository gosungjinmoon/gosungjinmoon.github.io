window.addEventListener('DOMContentLoaded', function(){
  const items = document.querySelectorAll('.post-item[data-lang="ko"]');
  items.forEach(el => {
    const btn = document.createElement('button');
    btn.textContent = '번역 생성';
    btn.className = 'btn';
    btn.onclick = async () => {
      const filename = el.dataset.filename;
      try {
        await fetch('https://n8n.gofunwith.com/webhook/translate', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ filename })
        });
        alert('번역 요청이 전송되었습니다.');
      } catch(e) {
        alert('번역 요청 실패: ' + e.message);
      }
    };
    el.appendChild(btn);
  });
});
