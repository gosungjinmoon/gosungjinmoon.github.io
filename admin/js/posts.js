import { callWorkerAPI } from "./github-api.js";

export async function createNewPost() {
  const title = prompt("새 글 제목을 입력하세요");
  if (!title) return alert("제목이 필요합니다!");

  const today = new Date().toISOString().slice(0, 10);
  const filename = `${today}-${title.replace(/\s+/g, "-")}.md`;

  const content = `---
layout: post
title: "${title}"
date: ${today}
lang: ko
tags: []
---

# ${title}

내용을 작성하세요.
`;

  const result = await callWorkerAPI("/api/new-post", {
    filename,
    content,
    message: `create post: ${title}`,
  });

  if (result.success) {
    alert(`✅ PR 생성 완료!\n${result.pr.html_url}`);
    window.open(result.pr.html_url, "_blank");
  } else {
    alert("❌ 오류: " + result.error);
  }
}
