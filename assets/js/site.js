/* Minimal site bootstrap: search, sidebar, theme toggle */
document.addEventListener('DOMContentLoaded', () => {
  // theme toggle
  const btn = document.querySelector('[data-mode-toggle]');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      const next = cur === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch(e){}
    });
  }
});
