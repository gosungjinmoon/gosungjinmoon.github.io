/* admin/js/admin.js  v202510221600 */
(function() {
  const $ = (s) => document.querySelector(s);
  const status = $('#status');
  $('#preview').addEventListener('click', () => window.location.href = "{'{'} '/admin/theme-preview.html' | relative_url {'}'}");
  $('#create').addEventListener('click', async () => {
    status.textContent = 'Submitting…';
    try {
      const themeRes = await fetch("{'{'} '/_data/theme.yml' | relative_url {'}'}");
      const themeTxt = await themeRes.text();
      const worker = (themeTxt.match(/cloudflare_worker_endpoint:\s*"?(.+?)"?\s*$/m) || [])[1];
      if (!worker) throw new Error('Worker endpoint missing in theme.yml');
      const payload = window.GFW_POSTS.buildPayload();
      const res = await fetch(worker, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const out = await res.json();
      status.textContent = out.message || 'Done';
    } catch (e) {
      console.error(e); status.textContent = 'Error: ' + e.message;
    }
  });
})();
