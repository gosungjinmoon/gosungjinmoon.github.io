// /admin/js/github-api.js
export async function callWorkerAPI(endpoint, data = {}) {
  // theme.yml에서 Worker Endpoint 읽기
  let endpointUrl = "";
  try {
    const themeConfig = await fetch("/_data/theme.yml").then(r => r.text());
    endpointUrl = themeConfig.match(/cloudflare_worker_endpoint:\s*"(.*?)"/)?.[1];
  } catch (e) {
    console.error("theme.yml 불러오기 실패:", e);
  }

  if (!endpointUrl) {
    alert("❌ Worker endpoint를 찾을 수 없습니다. theme.yml을 확인하세요.");
    throw new Error("Missing endpoint");
  }

  try {
    const res = await fetch(`${endpointUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Worker 호출 실패:", error);
    return { success: false, error: error.message };
  }
}

/**
 * 현재 로그인된 GitHub 토큰을 세션에서 가져옴
 */
export function getGitHubToken() {
  return sessionStorage.getItem("github_token") || "";
}

/**
 * GitHub API 직접 호출 (토큰 인증)
 */
export async function callGitHubAPI(path, method = "GET", body = null) {
  const token = getGitHubToken();
  if (!token) {
    alert("GitHub 로그인이 필요합니다.");
    return null;
  }

  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "GoFunWith-AdminConsole",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
}
