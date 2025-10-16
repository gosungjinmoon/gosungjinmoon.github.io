import { createNewPost } from "./posts.js";

document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.getElementById("createFromTemplate");
  if (createBtn) createBtn.addEventListener("click", createNewPost);

  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("github_token");
    alert("로그아웃 되었습니다.");
    location.reload();
  });
});
