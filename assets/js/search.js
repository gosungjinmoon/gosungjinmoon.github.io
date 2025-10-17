/* assets/js/search.js  v6.3.5_202510170000 */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const q = (params.get('q') || '').toLowerCase();
  const box = document.getElementById('search-results');
  if (!box) return;
  if (!q) {
    box.textContent = 'Enter a keyword.';
    return;
  }
  fetch('{{ "/sitemap.xml" | relative_url }}')
    .then(r => r.text())
    .then(txt => {
      const urls = Array.from(txt.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
      const matched = urls.filter(u => u.toLowerCase().includes(q));
      box.innerHTML = '<ul>' + matched.map(u => `<li><a href="${u}">${u}</a></li>`).join('') + '</ul>';
    })
    .catch(() => { box.textContent = 'No results.'; });
});
