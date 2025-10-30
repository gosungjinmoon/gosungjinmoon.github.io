// Theme toggle (dark/light)
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    if (isDark) localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'light');
  });
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});
