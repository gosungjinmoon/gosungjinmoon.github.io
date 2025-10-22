/* admin/js/posts.js  v6.4.2_202510220213 */
import { createPostViaWorker, listPosts } from "./github-api.js";

export function bindPostActions() {
  const btnCreate = document.getElementById("createFromTemplate");
  const btnList = document.getElementById("listPosts");
  const titleEl = document.getElementById("postTitle");
  const langEl = document.getElementById("postLang");
  const out = document.getElementById("postsResult");

  btnCreate?.addEventListener("click", async () => {
    try {
      const title = (titleEl?.value||"새 글").trim();
      const lang = (langEl?.value||"ko");
      const data = await createPostViaWorker(title, lang);
      out.textContent = JSON.stringify(data, null, 2);
      alert("PR 생성 요청 완료");
    } catch(e) {
      out.textContent = "Error: " + e.message;
      alert("오류: " + e.message);
    }
  });

  btnList?.addEventListener("click", async () => {
    const items = await listPosts();
    out.textContent = items.join("\n") || "No posts found";
  });
}
