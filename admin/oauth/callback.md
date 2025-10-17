---
#<!-- /* admin/oauth/callback.html  v6.3.5_202510170000 */ -->
layout: none
permalink: /admin/
---
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>OAuth Callback</title>
    <style>
      body{font-family:system-ui;display:grid;place-items:center;height:100vh;margin:0}
      .card{padding:24px;border:1px solid #eee;border-radius:12px}
    </style>
  </head>
  <body>
    <div class="card">
      <h2>GitHub 로그인 처리 중...</h2>
      <p id="status">잠시만 기다려주세요.</p>
    </div>
    <script>
      (async () => {
        const code = new URL(location.href).searchParams.get("code");
        if (!code) { document.getElementById('status').textContent = "❌ code 파라미터 없음"; return; }
        try {
          const endpoint = "{{ site.data.theme.cloudflare_worker_endpoint }}";
          const res = await fetch(endpoint + "/exchange?code=" + encodeURIComponent(code));
          const data = await res.json();
          if (data.access_token) {
            sessionStorage.setItem("github_token", data.access_token);
            document.getElementById('status').textContent = "✅ 로그인 성공! 관리자 페이지로 이동합니다...";
            setTimeout(() => location.href = "{{ '/admin/' | relative_url }}", 1200);
          } else {
            document.getElementById('status').textContent = "⚠️ 로그인 실패: " + (data.error_description || data.error || "unknown");
          }
        } catch (e) {
          document.getElementById('status').textContent = "🚫 네트워크 오류: " + e.message;
        }
      })();
    </script>
  </body>
</html>
