/* admin/js/github-api.js v1.0.0_202510250840 */
/*
 * GitHub OAuth 인증 및 토큰 관리, API 호출 로직
 * ⭐️ 아키텍처 핵심 ⭐️
 * 이 파일은 정적 JS이며, 'window.GOFUNWITH_ADMIN' 객체를 참조하여
 * theme.yml 경로와 Cloudflare Worker 엔드포인트를 가져옵니다.
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
      // YAML 파서는 용량을 위해 제외하고, 간단한 정규식으로 주요 값만 추출합니다.
      // (프로덕션에서는 js-yaml 라이브러리를 포함하는 것을 권장합니다)
      const yamlText = await response.text();
      configCache = parseSimpleYaml(yamlText);

      // 필수 값 체크
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

  // 간단한 YAML 파서 (key: "value" 또는 key: value 형식)
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

  // GitHub 로그인 시작
  async function login() {
    const config = await loadThemeConfig();
    const clientId = config.github_oauth_client_id;
    const redirectUri = `${window.location.origin}${window.GOFUNWITH_ADMIN.base_url}admin/oauth/callback.html`.replace(
      /\/\//g,
      '/',
    );

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=repo,user:email`;

    // 팝업 창 열기
    if (oauthPopup) oauthPopup.close();
    oauthPopup = window.open(authUrl, '_blank', 'width=600,height=700');

    // 팝업 창으로부터 메시지(code) 수신 대기
    return new Promise((resolve, reject) => {
      // 기존 리스너 제거
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

  // 로그아웃
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  }

  // OAuth code를 Access Token으로 교환 (Cloudflare Worker 사용)
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

  // GitHub API 호출 래퍼
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
      // Token expired or invalid
      logout();
      throw new Error('Authentication expired. Please login again.');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }

    return response;
  }

  // 인증된 사용자 정보 가져오기
  async function getUser() {
    try {
      const response = await githubApiFetch('/user');
      return await response.json();
    } catch (error) {
      console.error('Failed to get user:', error);
      return null; // 실패 시 null 반환
    }
  }

  // 인증 상태 확인
  async function checkAuth() {
    const token = getToken();
    if (!token) return null;
    return await getUser(); // getUser가 실패 시 null 반환
  }

  // -----------------------------------------------------------------
  // 4. Public API
  // -----------------------------------------------------------------
  window.githubApi = {
    login,
    logout,
    checkAuth,
    getToken,
    githubApiFetch, // post.js에서 사용할 수 있도록 노출
    loadThemeConfig, // post.js에서 사용할 수 있도록 노출
    fetchThemeConfigYaml, // admin.js에서 사용할 수 있도록 노출
  };
})();
