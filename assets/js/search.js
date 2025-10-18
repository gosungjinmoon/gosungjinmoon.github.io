/* assets/js/search.js  v6.4.1_20251017 */
/* 간단 검색: 제목/요약에서 포함 검색 (lunr.js로 확장 예정) */
(function () {
  const form = document.getElementById("searchForm");
  if (!form) return;
  const input = document.getElementById("q");
  const box = document.getElementById("searchResults");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const q = (input.value || "").toLowerCase();
    if (!q) return;
    // 매우 단순: DOM 내 카드/리스트를 대상으로 필터 (정적 페이지용)
    const links = Array.from(document.querySelectorAll("article.card a, .post a"));
    const hits = links
      .map((a) => ({ title: a.textContent.trim(), href: a.getAttribute("href") }))
      .filter((i) => i.title.toLowerCase().includes(q))
      .slice(0, 20);

    box.innerHTML = hits.length
      ? `<ul>${hits.map((h) => `<li><a href="${h.href}">${h.title}</a></li>`).join("")}</ul>`
      : `<p>No results.</p>`;
  });
})();
