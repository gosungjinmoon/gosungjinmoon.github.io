// Language switcher
document.addEventListener('DOMContentLoaded', () => {
  const lang = navigator.language.startsWith('en') ? 'en' : 'ko';
  if (window.location.pathname === '/' && lang === 'en') {
    window.location.href = '/en/';
  }
  document.querySelectorAll('.lang-switch').forEach(btn => {
    btn.addEventListener('click', e => {
      const to = e.target.dataset.lang;
      window.location.href = '/' + (to === 'ko' ? '' : to + '/');
    });
  });
});
