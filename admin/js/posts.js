/* admin/js/posts.js  v6.3.5_202510170000 */
export function openNewPostModal() {
  document.getElementById('newPostModal').classList.add('visible');
}
export function closeNewPostModal() {
  document.getElementById('newPostModal').classList.remove('visible');
}
export async function createNewPost() {
  const title = document.getElementById('npTitle').value.trim();
  const lang = document.getElementById('npLang').value;
  const tags = document.getElementById('npTags').value;
  const desc = document.getElementById('npDesc').value;
  if (!title) { alert('제목을 입력하세요'); return; }

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');

  const safe = title.replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9\-\\s]/g,'').trim().replace(/\\s+/g,'-').toLowerCase();
  const fname = `${yyyy}-${mm}-${dd}-${safe}.md`;

  const tagLines = (tags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `  - ${t}`)
    .join('\\n');

  const fm = `---
layout: post
title: "${title}"
subtitle: ""
description: "${desc.replace(/"/g,'\\"')}"
author: "GF Writer"
date: ${yyyy}-${mm}-${dd}
lang: ${lang}
tags:
${tagLines}
cover_image: "/assets/images/posts/default-cover.webp"
featured: false
reading_time: 4
canonical_url: ""
---

# ${title}

내용을 여기에 작성하세요.
`;

  const endpoint = "{{ site.data.theme.cloudflare_worker_endpoint }}";
  if (!endpoint) { alert('Worker endpoint를 찾을 수 없습니다. theme.yml을 확인하세요'); return; }

  try {
    const r = await fetch(endpoint + "/create", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: `_posts/${fname}`, content: fm })
    });
    const j = await r.json();
    if (j.ok) {
      alert('생성 완료');
      closeNewPostModal();
      location.reload();
    } else {
      alert('생성 실패: ' + (j.error || 'unknown'));
    }
  } catch (e) {
    alert('네트워크 오류: ' + e.message);
  }
}
