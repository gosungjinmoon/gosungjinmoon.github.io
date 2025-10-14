document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("github_token");
  const status = document.getElementById("status");
  const cards = document.querySelectorAll(".theme-card");

  const REPO = "gosungjinmoon/gosungjinmoon.github.io";
  const FILE_PATH = "config/theme-config.js";
  const BRANCH = "main";

  if (!token) {
    status.textContent = "⚠️ GitHub 로그인 필요";
    return;
  }

  status.textContent = "✅ GitHub 인증 완료. 테마를 클릭하세요.";

  // 테마 클릭 이벤트
  cards.forEach(card => {
    card.addEventListener("click", async () => {
      const theme = card.dataset.theme;
      status.textContent = `🎨 ${theme} 테마로 변경 중...`;

      try {
        // ① 현재 파일 내용 조회
        const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, {
          headers: { Authorization: `token ${token}` }
        });

        const data = await res.json();
        if (!data.content) throw new Error("theme-config.js를 불러올 수 없습니다.");

        // ② 새로운 파일 내용 생성
        const newConfig = `window.__GFW_THEME__ = {
  default: "light",
  activeTheme: "${theme}",
  allowUserToggle: false,
  allowLangToggle: true
};`;

        const encoded = btoa(unescape(encodeURIComponent(newConfig)));

        // ③ GitHub API로 업데이트 (PUT)
        const updateRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
          method: "PUT",
          headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: `Update theme to ${theme}`,
            content: encoded,
            sha: data.sha,
            branch: BRANCH
          })
        });

        if (!updateRes.ok) throw new Error("업데이트 실패");

        status.textContent = `✅ ${theme} 테마가 적용되었습니다! (GitHub 반영 완료)`;
        document.body.className = "";
        document.body.classList.add(`theme-${theme}`);
      } catch (err) {
        console.error(err);
        status.textContent = "🚫 테마 업데이트 실패: " + err.message;
      }
    });
  });
});
