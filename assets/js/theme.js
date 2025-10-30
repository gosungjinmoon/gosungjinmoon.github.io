(function () {
  const $html = document.documentElement;
  const $btn  = document.getElementById('themeToggle');
  const $logo = document.querySelector('.brand__logo');

  function apply(mode) {
    $html.dataset.theme = mode; // CSS 훅
    if ($logo) {
      $logo.src = mode === 'dark'
        ? $logo.dataset.logoDark
        : $logo.dataset.logoLight;
    }
    localStorage.setItem('theme', mode);
  }

  const saved = localStorage.getItem('theme');
  apply(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if ($btn) $btn.addEventListener('click', () => apply($html.dataset.theme === 'dark' ? 'light' : 'dark'));
})();
