// /admin/oauth.js
window.GOFUNWITH = window.GOFUNWITH || {};
window.GOFUNWITH.auth = {
  clientId: "Ov23liqsljSBAqajz2eu", // ⚙️ 수정
  redirectUri: "https://blog.gofunwith.com/admin/callback.html",
  authorize() {
    const { clientId, redirectUri } = this;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  },
};

// 자동 버튼 연결
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) loginBtn.addEventListener("click", () => window.GOFUNWITH.auth.authorize());
});
