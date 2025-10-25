/* admin/js/github-api.js v1.0.5_202510251025 */
/*
 * GitHub OAuth 인증 및 토큰 관리, API 호출 로직
 */
(function () {
  'use strict';

  const TOKEN_KEY = 'gofunwith_github_token';
  let configCache = null;

  // -----------------------------------------------------------------
  // 1. Config Loader (theme.yml)
  // -----------------------------------------------------------------

  async function loadThemeConfig() {
    if (configCache) return configCache;

    if (!window.GOFUNWITH_ADMIN || !window.GOFUNWITH_ADMIN.theme_config_path) {
      throw new Error('Global admin config (GOFUNWITH_ADMIN) not found.');
    }
    const path = window.GOFUNWITH_ADMIN.theme_config_path;

    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }
      const yamlText = await response.text();
      configCache = parseSimpleYaml(yamlText);

      if (
        !configCache.github_oauth_client_id ||
        !configCache.cloudflare_worker_endpoint ||
        !configCache.n8n_webhook_subscribe
      ) {
        console.error('Parsed Config:', configCache);
        throw new Error(
          'One or more required keys are missing from theme.yml.',
        );
      }

      return configCache;
    } catch (error) {
      console.error('Failed to load or parse theme.yml:', error);
      throw error;
    }
  }

  async function fetchThemeConfigYaml() {
    const path = window.GOFUNWITH_ADMIN.theme_config_path;
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    return await response.text();
  }

  function parseSimpleYaml(yaml) {
    const config = {};
    const lines = yaml.split('\n');
    const regex = /^\s*([a-zA-Z0-9_]+):\s*"?([^"]*)"?\s*$/;
    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        config[match[1].trim()] = match[2].trim();
      }
    }
    return config;
  }

  // -----------------------------------------------------------------
  // 2. OAuth Flow
  // -----------------------------------------------------------------

  let oauthPopup = null;
  let messageListener = null;

  async function login() {
    const config = await loadThemeConfig();
    const clientId = config.github_oauth_client_id;

    /* ⭐️ V1.0.5 수정: 404 오류 해결
      Jekyll은 callback.html을 /callback/index.html로 빌드합니다.
      따라서 .html 확장자 대신 / (폴더)로 끝나야 합니다.
    */
    const redirectUri = `${window.location.origin}/admin/oauth/callback.html`;

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=repo,user:email`;

    if (oauthPopup) oauthPopup.close();
    oauthPopup = window.open(authUrl, '_blank', 'width=600,height=700');

    return new Promise((resolve, reject) => {
      if (messageListener) {
        window.removeEventListener('message', messageListener);
      }

      messageListener = async (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data && event.data.type === 'oauth-callback') {
          window.removeEventListener('message', messageListener);
          if (oauthPopup) oauthPopup.close();

          if (event.data.error) {
            reject(new Error(`OAuth Error: ${event.data.error}`));
          } else if (event.data.code) {
            try {
              const tokenData = await exchangeCodeForToken(event.data.code);
              setToken(tokenData.access_token);
              const userData = await getUser();
              resolve(userData);
            } catch (error) {
              reject(error);
            }
          }
        }
      };
      window.addEventListener('message', messageListener);
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  }

  async function exchangeCodeForToken(code) {
    const config = await loadThemeConfig();
    const workerEndpoint = config.cloudflare_worker_endpoint;

    const response = await fetch(workerEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error || 'Failed to exchange token');
    }
    return data;
  }

  // -----------------------------------------------------------------
  // 3. Token & User Management
  // -----------------------------------------------------------------

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  async function githubApiFetch(url, options = {}) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      ...options.headers,
    };

    const response = await fetch(`https://api.github.com${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      logout();
      throw new Error('Authentication expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    return response;
  }

  async function getUser() {
    try {
      const response = await githubApiFetch('/user');
      return await response.json();
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  async function checkAuth() {
    const token = getToken();
    if (!token) return null;
    return await getUser();
  }

  // -----------------------------------------------------------------
  // 4. Public API
  // -----------------------------------------------------------------
  window.githubApi = {
    login,
    logout,
    checkAuth,
    getToken,
    githubApiFetch,
    loadThemeConfig,
    fetchThemeConfigYaml,
  };
})();
