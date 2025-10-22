/* admin/js/github-api.js  v202510221600 */
(function() {
  // Helper: read theme for endpoints
  window.GFW_THEME = {
    async readRaw() {
      const res = await fetch("{'{'} '/_data/theme.yml' | relative_url {'}'}");
      return res.text();
    }
  };
})();
