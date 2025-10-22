/* admin/js/admin.js v1.0_202510220736 */
document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const mainContent = document.getElementById('main-content');
  const authStatus = document.getElementById('auth-status');
  const userInfo = document.getElementById('user-info');
  const usernameSpan = document.getElementById('username');
  const tabContainer = document.querySelector('.tabs');
  const tabContent = document.getElementById('tab-content');

  const githubApi = new GitHubAPI();
  const postHandler = new PostHandler(githubApi);

  async function init() {
    await githubApi.loadConfig();
    const token = githubApi.getToken();

    if (token) {
      try {
        const user = await githubApi.getUser();
        showLoggedIn(user.login);
        loadTab('theme-preview');
      } catch (error) {
        console.error('Auth error:', error);
        showLoggedOut();
      }
    } else {
      showLoggedOut();
    }
  }

  function showLoggedIn(username) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'block';
    usernameSpan.textContent = `Welcome, ${username}`;
    mainContent.style.display = 'block';
  }

  function showLoggedOut() {
    githubApi.logout();
    loginBtn.style.display = 'block';
    userInfo.style.display = 'none';
    mainContent.style.display = 'none';
  }

  async function loadTab(tabName) {
    let html = '';
    switch (tabName) {
      case 'theme-preview':
        html = await fetch('theme-preview.html').then((res) => res.text());
        tabContent.innerHTML = html;
        const themeContainer = document.getElementById('theme-data-container');
        themeContainer.textContent = JSON.stringify(githubApi.config, null, 2);
        break;
      case 'create-post':
        html = postHandler.getFormHtml();
        tabContent.innerHTML = html;
        postHandler.attachFormListener();
        break;
    }
  }

  loginBtn.addEventListener('click', () => githubApi.login());
  logoutBtn.addEventListener('click', () => showLoggedOut());

  tabContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const tabName = e.target.dataset.tab;
      document.querySelector('.tabs button.active').classList.remove('active');
      e.target.classList.add('active');
      loadTab(tabName);
    }
  });

  // OAuth Callback 핸들러
  window.addEventListener(
    'message',
    async (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === 'oauth_callback' && event.data.code) {
        try {
          // Worker를 통해 토큰 교환
          await githubApi.exchangeCodeForToken(event.data.code);
          // 팝업 창 닫기
          if (event.source) event.source.close();
          // UI 새로고침
          init();
        } catch (error) {
          console.error('Failed to exchange code for token:', error);
          alert('Authentication failed.');
        }
      }
    },
    false
  );

  init();
});
