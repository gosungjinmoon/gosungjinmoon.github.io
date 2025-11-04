document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.includes("/en/") ? "en" : "ko";
  localStorage.setItem("lang", current);
});
