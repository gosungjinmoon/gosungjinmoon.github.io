/* admin/js/github-api.js v1.0.2_202510250915 */
(function () {
  'use strict';

  // ... (Config Loader, parseSimpleYaml 등은 변경 없음) ...

  // -----------------------------------------------------------------
  // 2. OAuth Flow
  // -----------------------------------------------------------------
  // ... (oauthPopup, messageListener 변수는 변경 없음) ...

  // GitHub 로그인 시작
  async function login() {
    const config = await loadThemeConfig();
    const clientId = config.github_oauth_client_id;

    /* ⭐️ 수정: GOFUNWITH_ADMIN.base_url이 '/'로 고정되었으므로
       경로 조합을 단순화하고 이중 슬래시(//)를 방지합니다. */
    const redirectUri = `${window.location.origin}/admin/oauth/callback.html`;

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=repo,user:email`;

    // ... (팝업 열기 및 메시지 리스너 로직은 변경 없음) ...
    // (이하 나머지 코드는 이전 답변과 동일하게 유지합니다.)
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

  // ... (loadThemeConfig, parseSimpleYaml, logout, exchangeCodeForToken, 
  //      setToken, getToken, githubApiFetch, getUser, checkAuth 등
  //      이전 답변의 나머지 JS 코드는 그대로 유지합니다.)

  // (나머지 함수들 복사)
  const TOKEN_KEY = 'gofunwith_github_token';
  let configCache = null;
  let oauthPopup = null;
  let messageListener = null;

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
