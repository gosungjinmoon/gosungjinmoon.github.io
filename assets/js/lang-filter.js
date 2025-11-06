document.addEventListener("DOMContentLoaded", () => {
  const currentLang = document.documentElement.lang || (location.pathname.includes("/en") ? "en" : "ko");
  const recentLinks = document.querySelectorAll(".recent-posts li a");
  recentLinks.forEach(link => {
    if (!link.href.includes(`/${currentLang}/`)) {
      link.parentElement.style.display = "none";
    }
  });
});
