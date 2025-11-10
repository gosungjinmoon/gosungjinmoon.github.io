<script>
document.addEventListener('DOMContentLoaded', function () {
  try {
    const html = document.documentElement;
    const currentLang = html.getAttribute('lang') || 'ko';
    const list = document.querySelector('.post-recent .list-unstyled, #recent-posts, .recent-posts');
    if (!list) return;

    const items = list.querySelectorAll('li, .post-recent-item, a');
    items.forEach(el => {
      const href = (el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '').toLowerCase();
      if (!href) return;
      const isKO = href.startsWith('/ko/');
      const isEN = href.startsWith('/en/');
      if (currentLang === 'ko' && isEN) el.style.display = 'none';
      if (currentLang === 'en' && isKO) el.style.display = 'none';
    });
  } catch(e) { /* silent */ }
});
</script>
