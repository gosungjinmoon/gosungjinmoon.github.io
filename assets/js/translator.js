/* assets/js/translator.js  v202510221600 */
(function() {
  // Fake translator toggle – extend as needed
  window.GFW = window.GFW || {};
  GFW.setLang = function(l) {
    var target = l === 'en' ? "{'{'} '/en/' | relative_url {'}'}" : "{'{'} '/ko/' | relative_url {'}'}";
    window.location.href = target;
  };
})();
