document.addEventListener("DOMContentLoaded", () => {
  const currentLang =
    document.documentElement.lang ||
    (location.pathname.includes("/en") ? "en" : "ko");

  function filterRecentPosts() {
    const sections = document.querySelectorAll(
      ".post-recent, .recent-posts, .recently-updated"
    );
    sections.forEach(section => {
      const links = section.querySelectorAll("a[href]");
      links.forEach(link => {
        if (!link.href.includes(`/${currentLang}/`)) {
          link.parentElement.style.display = "none";
        } else {
          link.parentElement.style.display = "";
        }
      });
    });
  }

  filterRecentPosts();
  const observer = new MutationObserver(() => filterRecentPosts());
  observer.observe(document.body, { childList: true, subtree: true });
});
