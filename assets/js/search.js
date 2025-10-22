/* assets/js/search.js  v202510221600 */
(function() {
  // Provide progressive enhancement: if lunr exists, use it. Else fallback to simple filter in layout.
  window.buildLunr = function(index) {
    if (!window.lunr) return null;
    const idx = lunr(function () {
      this.field('title'); this.field('tags'); this.ref('url');
      index.forEach(doc => this.add(doc));
    });
    return function(query) {
      return idx.search(query).map(r => index.find(d => d.url === r.ref));
    }
  }
})();
