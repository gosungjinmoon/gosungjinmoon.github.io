document.addEventListener("DOMContentLoaded", () => {
  const currentLang = document.documentElement.lang || (location.pathname.includes("/en") ? "en" : "ko");

  function filterRecentPosts() {
    const recentSection = document.querySelector(".recent-posts");
    if (!recentSection) return;
    const links = recentSection.querySelectorAll("li a");
    links.forEach(a => {
      if (!a.href.includes(`/${currentLang}/`)) {
        a.parentElement.style.display = "none";
      }
    });
  }

  // 즉시 + 지연 필터링 (빌드 타이밍 대비)
  filterRecentPosts();
  setTimeout(filterRecentPosts, 1000);
});
