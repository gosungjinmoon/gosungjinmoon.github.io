/* assets/js/search.js  v6.4.2_202510220213 */
(function() {
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");
  const out = document.getElementById("searchResults");
  if (!form || !input || !out) return;

  async function getIndex() {
    // build a tiny client-side index from site.pages + site.posts JSON (embedded in page as window.__IDX if needed)
    const nodes = Array.from(document.querySelectorAll("a")).map(a => ({ url: a.href, text: a.textContent || "" }));
    return nodes.filter(n => n.text.trim().length > 0);
  }

  form.querySelector("#searchBtn").addEventListener("click", async () => {
    const q = (input.value || "").toLowerCase().trim();
    const idx = await getIndex();
    const res = idx.filter(n => n.text.toLowerCase().includes(q)).slice(0, 20);
    out.innerHTML = res.map(r => `<div class="hit"><a href="${r.url}">${r.text}</a></div>`).join("") || "<p>결과 없음</p>";
  });
})();
