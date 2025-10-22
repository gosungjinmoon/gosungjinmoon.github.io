/* admin/js/admin.js  v6.4.2_202510220213 */
import { bindPostActions } from "./posts.js";

(function() {
  // sidebar tabs
  const items = document.querySelectorAll(".sidebar li");
  const pages = document.querySelectorAll(".page");
  items.forEach(li => li.addEventListener("click", () => {
    items.forEach(x=>x.classList.remove("active"));
    li.classList.add("active");
    const target = li.getAttribute("data-page");
    pages.forEach(p=>p.classList.remove("visible"));
    document.getElementById("page-"+target)?.classList.add("visible");
  }));

  // theme/config stub bind
  document.getElementById("loadTheme")?.addEventListener("click", async () => {
    const res = await fetch("/_data/theme.yml");
    const txt = await res.text();
    alert("theme.yml 로드 완료\n\n" + txt.slice(0,300) + "...");
  });
  document.getElementById("saveTheme")?.addEventListener("click", () => alert("v6.4.2: Worker 연동으로 저장 예정"));
  document.getElementById("loadConfig")?.addEventListener("click", async () => {
    const res = await fetch("/_data/config.yml");
    const txt = await res.text();
    alert("config.yml 로드 완료\n\n" + txt.slice(0,300) + "...");
  });
  document.getElementById("saveConfig")?.addEventListener("click", () => alert("v6.4.2: Worker 연동으로 저장 예정"));

  // auth (visual only)
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  loginBtn?.addEventListener("click", () => { sessionStorage.setItem("gfw_login","1"); alert("로그인 처리(시각적)"); });
  logoutBtn?.addEventListener("click", () => { sessionStorage.removeItem("gfw_login"); alert("로그아웃됨"); location.reload(); });

  bindPostActions();
})();
