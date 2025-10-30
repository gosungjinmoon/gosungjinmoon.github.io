(function () {
  const $ = (s) => document.querySelector(s);
  const out = $('#out');

  async function post() {
    const title = $('#title').value.trim();
    const body  = $('#body').value.trim();
    const lang  = document.querySelector('input[name="lang"]:checked').value;
    const auto  = $('#auto').checked;

    if (!title || !body) {
      out.textContent = '제목/내용을 입력하세요.'; return;
    }

    const url = (window.GFW?.n8nEndpoint || '').replace(/\/+$/,'') +
                (window.GFW?.webhookPath || '/webhook/new-post');

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          title, content: body, lang,
          auto_translate: auto, publish_now: true
        })
      });
      const json = await res.json().catch(() => ({}));
      out.textContent = JSON.stringify(json, null, 2);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      out.textContent = `에러: ${e.message}`;
    }
  }

  $('#postBtn').addEventListener('click', post);
})();
