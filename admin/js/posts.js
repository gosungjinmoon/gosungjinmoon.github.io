/* admin/js/posts.js  v6.3.7_202510171349 */
export async function createNewPost(title, lang) {
  const token = sessionStorage.getItem('github_token');
  if (!token) throw new Error("로그인이 필요합니다.");
  const slug = title.trim().toLowerCase()
    .replace(/\s+/g,'-')
    .replace(/[^a-z0-9\-가-힣]/g,'');
  const today = new Date().toISOString().slice(0,10);
  const dir = lang === 'en' ? 'en/_posts' : 'ko/_posts';
  const ext = lang === 'en' ? 'en' : 'ko';
  const filename = `${today}-${slug}.${ext}.md`;
  const path = `${dir}/${filename}`;
  const content = `---\nlayout: post\ntitle: "${title}"\nlang: ${lang}\ndate: ${today}\ntags:\n  - Tech\n---\n\n콘텐츠를 여기에 작성하세요.\n`;
  const b64 = btoa(unescape(encodeURIComponent(content)));

  const repo = "gosungjinmoon/gosungjinmoon.github.io"; // 필요시 수정
  const url = "https://api.github.com/repos/" + repo + "/contents/" + path;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": "token " + token,
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      message: "chore(admin): create post " + filename,
      content: b64
    })
  });
  if (!res.ok) throw new Error("GitHub API 오류: " + (await res.text()));
  return { path, filename };
}
