document.addEventListener("DOMContentLoaded", function() {
  const langSwitch = document.querySelectorAll(".lang-switch[data-lang]");
  if (!langSwitch) return;

  langSwitch.forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const targetLang = this.dataset.lang;
      const altSlug = document.querySelector("meta[name='alt_lang']")?.content;
      const dateMatch = window.location.pathname.match(/\d{4}\/\d{2}\/\d{2}/);
      if (!altSlug || !dateMatch) {
        window.location.href = targetLang === "en" ? "/en/" : "/";
        return;
      }
      const datePath = dateMatch[0];
      const newUrl = targetLang === "en"
        ? `/en/${datePath}/${altSlug}.en.html`
        : `/${datePath}/${altSlug}.ko.html`;
      window.location.href = newUrl;
    });
  });
});
