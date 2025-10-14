(function() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  btn && btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  ham && ham.addEventListener('click', () => nav.classList.toggle('open'));
})();
