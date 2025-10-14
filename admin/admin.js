// admin.js

const cards = document.querySelectorAll(".theme-card");
const statusEl = document.getElementById("status");
const activeThemeEl = document.getElementById("activeTheme");
const tokenInput = document.getElementById("tokenInput");

const repoOwner = "gosungjinmoon";     // 👈 수정
const repoName = "gosungjinmoon.github.io";      // 👈 수정
const configPath = "config/theme-config.js";  // 수정하지 말 것
const branch = "main";                        // or 'master'

activeThemeEl.textContent = window.__GFW_THEME__.activeTheme;

// 카드 클릭 시 미리보기
cards.forEach(card => {
  card.addEventListener("click", async () => {
    const theme = card.dataset.theme;
    document.documentElement.dataset.theme = theme;
    statusEl.textContent = `🎨 '${theme}' 테마 미리보기 중...`;

    const confirmChange = confirm(`'${theme}' 테마로 변경하시겠습니까?`);
    if (!confirmChange) return;

    const token = tokenInput.value.trim();
    if (!token) {
      alert("GitHub Personal Access Token을 입력해주세요.");
      return;
    }

    await updateThemeConfig(theme, token);
  });
});

async function updateThemeConfig(theme, token) {
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${configPath}`;

  // 현재 파일 가져오기
  const res = await fetch(url, {
    headers: { Authorization: `token ${token}` },
  });
  const data = await res.json();

  if (!data.sha) {
    statusEl.textContent = "❌ theme-config.js를 찾을 수 없습니다.";
    return;
  }

  // 새로운 JS 내용
  const newContent = `
window.__GFW_THEME__ = {
  default: "light",
  activeTheme: "${theme}",
  allowUserToggle: false,
  allowLangToggle: true
};
`.trim();

  const base64Content = btoa(unescape(encodeURIComponent(newContent)));

  // 파일 업데이트 (커밋)
  const updateRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `Update theme to '${theme}'`,
      content: base64Content,
      sha: data.sha,
      branch,
    }),
  });

  if (updateRes.ok) {
    statusEl.textContent = `✅ '${theme}' 테마가 성공적으로 변경되었습니다. GitHub Pages 배포 후 적용됩니다.`;
  } else {
    statusEl.textContent = `⚠️ 테마 변경 실패 (${updateRes.status})`;
  }
}
