// /admin/js/posts.js
import { callWorkerAPI } from "./github-api.js";

/**
 * 새 포스트 생성 (Cloudflare Worker 호출)
 */
export async function createNewPost() {
  const title = prompt("📝 새 포스트 제목을 입력하세요:");
  if (!title) {
    alert("제목은 필수입니다!");
    return;
  }

  const lang = confirm("🇰🇷 한국어로 작성하시겠습니까?\n(취소 시 English)") ? "ko" : "en";
  const today = new Date().toISOString().slice(0, 10);
  const safeTitle = title.trim().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9가-힣-_]/g, "");
  const filename = `${today}-${safeTitle}.md`;
  const subDir = lang === "ko" ? "_posts/ko" : "_posts/en";

  // 템플릿 콘텐츠 자동 생성
  const content = `---
layout: post
title: "${title}"
subtitle: ""
description: "A short summary for SEO (150 chars)"
author: "Eric Moon"
date: ${today}
lang: ${lang}
tags:
  - Tech
  - Automation
cover_image: "/assets/images/posts/default-cover.webp"
featured: false
reading_time: 5
canonical_url: "https://blog.gofunwith.com/${lang}/${today}-${safeTitle}"
---

# ${title}

여기에 본문을 작성하세요 ✨  
(Write your post content here.)

## 💡 작성 가이드
- **title**: 포스트 제목
- **description**: 검색 노출용 요약문
- **tags**: 관련 주제 자동 연결
- **cover_image**: SNS 썸네일
- **canonical_url**: 중복 방지용 기준 URL

---

> **© ${new Date().getFullYear()} GOFUNWITH – Explore. Create. Share.**
`;

  try {
    const confirmMsg = `🗂️ 파일명: ${filename}\n📂 경로: ${subDir}\n\n이 내용으로 새 글을 생성할까요?`;
    if (!confirm(confirmMsg)) return;

    // Worker 호출
    const result = await callWorkerAPI("/api/new-post", {
      filename: `${subDir}/${filename}`,
      content,
      message: `new post: ${title}`,
    });

    if (result.success) {
      alert(`✅ 새 포스트 생성 성공!\nPR이 자동 생성되었습니다.\n\n${result.pr.html_url}`);
      window.open(result.pr.html_url, "_blank");
    } else {
      alert(`❌ 실패: ${result.error || "알 수 없는 오류"}`);
    }
  } catch (err) {
    alert(`🚫 오류 발생: ${err.message}`);
    console.error(err);
  }
}

/**
 * 저장소 내 포스트 목록 불러오기
 */
export async function listPosts() {
  const res = await fetch("https://api.github.com/repos/gosungjinmoon/gosungjinmoon.github.io/contents/_posts");
  const data = await res.json();
  const output = data
    .map(item => `📄 ${item.name}`)
    .join("\n") || "포스트가 없습니다.";

  const resultEl = document.getElementById("postsResult");
  if (resultEl) resultEl.textContent = output;
}

/**
 * 이벤트 리스너 등록
 */
document.addEventListener("DOMContentLoaded", () => {
  const listBtn = document.getElementById("listPosts");
  const createBtn = document.getElementById("createFromTemplate");
  if (listBtn) listBtn.addEventListener("click", listPosts);
  if (createBtn) createBtn.addEventListener("click", createNewPost);
});
