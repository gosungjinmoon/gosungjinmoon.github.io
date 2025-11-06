document.addEventListener("DOMContentLoaded", () => {
  const currentLang =
    document.documentElement.lang ||
    (location.pathname.includes("/en") ? "en" : "ko");

  function filterRecentPosts() {
    const recentSection = document.querySelector(".recent-posts");
    if (!recentSection) return;
    const links = recentSection.querySelectorAll("li a");
    links.forEach(link => {
      if (!link.href.includes(`/${currentLang}/`)) {
        link.parentElement.style.display = "none";
      } else {
        link.parentElement.style.display = "list-item";
      }
    });
  }

  // 초기 실행
  filterRecentPosts();

  // MutationObserver로 실시간 감시
  const observer = new MutationObserver(() => filterRecentPosts());
  observer.observe(document.body, { childList: true, subtree: true });
});
