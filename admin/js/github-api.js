/* admin/js/github-api.js  v6.4.2_202510220213 */
export async function createPostViaWorker(title, lang) {
  const res = await fetch("/_data/theme.yml");
  const txt = await res.text();
  const endpoint = (txt.match(/cloudflare_worker_endpoint:\s*"(.*?)"/)||[])[1] || "";
  if (!endpoint) throw new Error("Worker endpoint not configured in theme.yml");

  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth()+1).padStart(2,"0");
  const dd = String(now.getDate()).padStart(2,"0");
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const filename = `${yyyy}-${mm}-${dd}-${slug}.${lang}.md`;

  const frontMatter = `---
layout: post
title: "${title}"
lang: ${lang}
date: ${yyyy}-${mm}-${dd}
tags: [Tech]
cover_image: "/assets/themes/modern-light/images/logo.svg"
---

# ${title}

새 글 시작!
`;

  const payload = { path: `_posts/${filename}`, content: frontMatter };
  const r = await fetch(`${endpoint}/api/new-post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Worker error " + r.status);
  return r.json();
}

export async function listPosts() {
  // Simple client-side listing (no auth) by parsing the archive list
  const anchors = Array.from(document.querySelectorAll('a'))
    .map(a=>a.href).filter(h=>/\d{4}\/\d{2}\/\d{2}/.test(h));
  return Array.from(new Set(anchors));
}
