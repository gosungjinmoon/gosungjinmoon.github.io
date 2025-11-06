document.addEventListener("DOMContentLoaded", () => {
  const lang = document.documentElement.lang || (window.location.pathname.includes("/en") ? "en" : "ko");
  const recent = document.querySelectorAll(".recent-posts li a");
  recent.forEach(el => {
    if (!el.href.includes(`/${lang}/`)) el.parentElement.style.display = "none";
  });
});
