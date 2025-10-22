/* admin/js/github-api.js v1.0_202510220736 */
class GitHubAPI {
  constructor() {
    this.token = localStorage.getItem('github_token');
    this.config = null;
    this.authWindow = null;
  }

  async loadConfig() {
    if (this.config) return this.config;
    try {
      // Jekyll YAML은 JSON과 호환되지 않으므로, 간단한 파서를 사용하거나 YAML 라이브러리를 사용해야 합니다.
      // 여기서는 간단한 key: "value" 형태만 가정합니다.
      const response = await fetch('/assets/config/theme.yml');
      const text = await response.text();
      const config = {};
      text.split('\n').forEach((line) => {
        if (line.includes(':')) {
          const parts = line.split(':');
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim().replace(/"/g, '');
          if (key && !key.startsWith('#')) {
            config[key] = value;
          }
        }
      });
      this.config = config;
      return this.config;
    } catch (error) {
      console.error('Failed to load theme.yml:', error);
      throw error;
    }
  }

  getToken() {
    return this.token;
  }

  login() {
    if (!this.config.github_oauth_client_id) {
      alert('GitHub Client ID is not configured in theme.yml');
      return;
    }
    const redirectUri = `${window.location.origin}/admin/oauth/callback.html`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.config.github_oauth_client_id}&redirect_uri=${redirectUri}&scope=repo`;
    
    // 팝업 창 열기
    this.authWindow = window.open(authUrl, 'GitHubAuth', 'width=600,height=700');
  }

  logout() {
    localStorage.removeItem('github_token');
    this.token = null;
  }

  async exchangeCodeForToken(code) {
    if (!this.config.cloudflare_worker_endpoint || !this.config.cloudflare_worker_endpoint.includes('gfw-oauth-exchange')) {
       alert('OAuth exchange worker endpoint is not configured in theme.yml for token exchange.');
       // Fallback/Demo: a real implementation needs a server-side component to protect the client secret.
       // The cloudflare_worker_endpoint for POSTS is different from the OAUTH one.
       // Let's assume a dummy endpoint for now, user needs to implement it.
       throw new Error("OAuth exchange worker endpoint not configured.");
    }

    // This part should call a separate, secure Cloudflare Worker to exchange the code for a token,
    // as it requires the GitHub OAuth App's Client Secret.
    // The worker `gfw-oauth-exchange` is responsible for this.
    const response = await fetch(this.config.cloudflare_worker_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        throw new Error('Failed to get token from worker.');
    }

    const data = await response.json();
    if (data.token) {
        this.token = data.token;
        localStorage.setItem('github_token', this.token);
    } else {
        throw new Error(data.error || 'Token not found in response.');
    }
  }

  async getUser() {
    if (!this.token) throw new Error('Not authenticated');
    const response = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${this.token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }
}
