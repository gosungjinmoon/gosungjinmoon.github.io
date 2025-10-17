/* cloudflare_worker.js  버전 정보_202510171235 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/oauth-url") {
      // Return authorize URL (placeholder; implement in your Worker with client id/redirect)
      const client_id = env.GITHUB_CLIENT_ID || "YOUR_CLIENT_ID";
      const redirect_uri = env.GITHUB_REDIRECT_URI || "https://YOUR_DOMAIN/admin/callback.html";
      const authorize_url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=repo`;
      return new Response(JSON.stringify({ authorize_url }), { headers: { "content-type": "application/json" } });
    }
    if (url.pathname === "/api/new-post" && request.method === "POST") {
      try {
        const { filename, content, message } = await request.json();
        const owner = env.GITHUB_OWNER;
        const repo = env.GITHUB_REPO;
        const token = env.GITHUB_TOKEN;
        const base = env.DEFAULT_BASE_BRANCH || "main";
        const branch = `post-${Date.now()}`;
        const gh = async (api, init = {}) => {
          const res = await fetch(`https://api.github.com${api}`, {
            ...init,
            headers: {
              "content-type": "application/json",
              "authorization": `token ${token}`,
              "accept": "application/vnd.github+json",
              ...(init.headers || {}),
            },
          });
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        };
        const baseRef = await gh(`/repos/${owner}/${repo}/git/ref/heads/${base}`);
        const baseSha = baseRef.object.sha;
        await gh(`/repos/${owner}/${repo}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }) });
        const path = `_posts/${filename}`;
        const blob = await gh(`/repos/${owner}/${repo}/git/blobs`, { method: "POST", body: JSON.stringify({ content, encoding: "utf-8" }) });
        const tree = await gh(`/repos/${owner}/${repo}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: baseSha, tree: [{ path, mode: "100644", type: "blob", sha: blob.sha }] }) });
        const commit = await gh(`/repos/${owner}/${repo}/git/commits`, { method: "POST", body: JSON.stringify({ message: message || `chore(post): add ${filename}`, tree: tree.sha, parents: [baseSha] }) });
        await gh(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: true }) });
        const pr = await gh(`/repos/${owner}/${repo}/pulls`, { method: "POST", body: JSON.stringify({ title: message || `Add ${filename}`, head: branch, base }) });
        return new Response(JSON.stringify({ success: true, pull_request_url: pr.html_url }), { headers: { "content-type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }
    return new Response("ok");
  }
};
