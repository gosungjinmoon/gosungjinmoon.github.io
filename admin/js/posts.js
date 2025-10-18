/* admin/js/posts.js  v6.4.1_20251017 */
import { callWorker } from "./github-api.js";

/* 슬러그 유틸 */
function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* 날짜+제목 자동 파일명: 2025-10-15-title.md */
export function buildFilename(title, lang) {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}-${slugify(title)}.${lang}.md`;
}

export async function createPost({ title, lang, tags, description }) {
  const filename = buildFilename(title, lang === "en" ? "en" : "ko");
  const folder = lang === "en" ? "_posts/en" : "_posts/ko";
  const path = `${folder}/${filename}`;

  const front = [
    "---",
    `layout: post`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `subtitle: ""`,
    `description: "${(description || "").replace(/"/g, '\\"')}"`,
    `author: "GOFUNWITH"`,
    `date: ${new Date().toISOString().slice(0, 10)}`,
    `lang: ${lang}`,
    `tags:`,
    ...(tags || "Tech")
      .split(",")
      .map((t) => `  - ${t.trim()}`),
    `cover_image: "/assets/images/posts/default-cover.webp"`,
    `featured: false`,
    `reading_time: 5`,
    `canonical_url: "https://blog.gofunwith.com/${lang}/"`,
    "---",
    "",
    "# 본문을 여기에 작성하세요 ✨",
    "",
  ].join("\n");

  const result = await callWorker("/api/new-post", {
    path,
    content: front,
    message: `chore(post): create ${path}`,
  });
  return result;
}

export async function listPosts() {
  const result = await callWorker("/api/list-posts", {});
  return result;
}
