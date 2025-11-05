document.addEventListener("DOMContentLoaded", () => {
  const currentLang = document.documentElement.lang || 'ko';
  const recentList = document.querySelectorAll('.recent-posts li a');
  recentList.forEach(item => {
    if (!item.href.includes('/' + currentLang + '/')) {
      item.parentElement.style.display = 'none';
    }
  });
});
