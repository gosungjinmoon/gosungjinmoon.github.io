/* admin/js/admin.js  v6.4.1_20251017 */
import { createPost, listPosts } from "./posts.js";

/* 테마 엔드포인트 전역 등록 */
window.__THEME_ENDPOINT__ = "{{ site.data.theme.theme.cloudflare_worker_endpoint }}";

/* 탭 전환 */
const tabs = document.querySelectorAll(".sidebar li");
const pages = document.querySelectorAll(".page");
tabs.forEach((li) => {
  li.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    pages.forEach((p) => p.classList.remove("visible"));
    li.classList.add("active");
    document.getElementById(`page-${li.dataset.page}`).classList.add("visible");
  });
});

/* 로그인/로그아웃 (OAuth는 Worker에서 처리) */
document.getElementById("loginBtn").addEventListener("click", () => {
  alert("OAuth는 Worker로 처리");
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  location.reload();
});

/* 설정 불러오기/저장 */
document.getElementById("loadConfig").addEventListener("click", () => {
  document.getElementById("langDefault").value = "{{ site.data.config.site.default_lang }}";
  document.getElementById("postsPerPage").value = "{{ site.data.config.site.posts_per_page }}";
});
document.getElementById("saveConfig").addEventListener("click", () => {
  alert("저장 & 커밋은 Worker 확장 API로 처리(차기 버전).");
});

/* 테마 불러오기/저장 */
document.getElementById("loadTheme").addEventListener("click", () => {
  document.getElementById("brandName").value = "{{ site.data.config.site.brand }}";
  document.getElementById("brandTagline").value = "{{ site.data.config.site.tagline }}";
  document.getElementById("ga4").value = "{{ site.data.theme.theme.ga4_measurement_id }}";
  document.getElementById("n8n").value = "{{ site.data.theme.theme.n8n_webhook_subscribe }}";
});
document.getElementById("saveTheme").addEventListener("click", () => {
  alert("저장 & 커밋은 Worker 확장 API로 처리(차기 버전).");
});

/* 포스트 생성/목록 */
document.getElementById("createPost").addEventListener("click", async () => {
  try {
    const title = document.getElementById("postTitle").value.trim();
    const lang = document.getElementById("postLang").value;
    const tags = document.getElementById("postTags").value.trim();
    const desc = document.getElementById("postDesc").value.trim();
    if (!title) return alert("제목을 입력하세요.");

    const res = await createPost({ title, lang, tags, description: desc });
    alert(res?.pr?.html_url ? `PR 생성: ${res.pr.html_url}` : "완료");
  } catch (e) {
    alert("오류: " + e.message);
  }
});

document.getElementById("listPosts").addEventListener("click", async () => {
  try {
    const data = await listPosts();
    document.getElementById("postsResult").textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    alert("오류: " + e.message);
  }
});
