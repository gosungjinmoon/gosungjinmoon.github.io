document.addEventListener("DOMContentLoaded", () => {
  const currentLang = document.documentElement.lang || 'ko';
  const recentList = document.querySelectorAll('.recent-posts li a');
  recentList.forEach(link => {
    if (!link.href.includes('/' + currentLang + '/')) {
      link.parentElement.style.display = 'none';
    }
  });
});
