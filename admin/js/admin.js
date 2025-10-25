/* admin/js/admin.js v1.0.9_202510251140 */
/*
 * Admin UI/UX 로직 (탭 전환, 폼 제출 등)
 */
(function (githubApi, postCreator) {
  'use strict';

  // DOM 요소 캐시
  const elements = {
    loginBtn: null,
    logoutBtn: null,
    authStatus: null,
    userInfo: null,
    userName: null,
    adminMain: null,
    loadingOverlay: null,
    loadingMessage: null,
    navItems: null,
    tabContents: null,
    newPostForm: null,
    createPostBtn: null,
    themeConfigDisplay: null,
  };

  function showLoading(message) {
    elements.loadingMessage.textContent = message || 'Processing...';
    elements.loadingOverlay.classList.remove('hidden');
  }

  function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
  }

  // 탭 전환 로직
  function handleTabClick(e) {
    e.preventDefault();
    const targetTab = e.target.dataset.tab;

    if (!targetTab) return;

    // Nav 활성화
    elements.navItems.forEach((item) => item.classList.remove('active'));
    e.target.classList.add('active');

    // Content 활성화
    elements.tabContents.forEach((content) => {
      content.id === `tab-${targetTab}`
        ? content.classList.add('active')
        : content.classList.remove('active');
    });

    // 설정 탭 클릭 시 config 로드
    if (targetTab === 'settings') {
      loadAndDisplayConfig();
    }
  }

  // 로그인 상태에 따른 UI 업데이트
  function updateUIForLogin(userData) {
    elements.loginBtn.classList.add('hidden');
    elements.userInfo.style.display = 'flex';
    elements.userName.textContent = userData.login;
    elements.adminMain.classList.remove('hidden');
  }

  // 로그아웃 상태에 따른 UI 업데이트
  function updateUIForLogout() {
    elements.loginBtn.classList.remove('hidden');
    elements.userInfo.style.display = 'none';
    elements.userName.textContent = '';
    elements.adminMain.classList.add('hidden');
  }

  // 설정 탭에 theme.yml 내용 표시
  async function loadAndDisplayConfig() {
    try {
      const configYaml = await githubApi.fetchThemeConfigYaml();
      elements.themeConfigDisplay.value = configYaml;
    } catch (error) {
      console.error('Error loading theme config:', error);
      elements.themeConfigDisplay.value =
        'Error loading config: 'm' + error.message;
    }
  }

  // 새 포스트 폼 제출 처리
  async function handlePostSubmit(e) {
    e.preventDefault();
    showLoading('Creating new post PR...');
    elements.createPostBtn.disabled = true;

    try {
      const title = document.getElementById('post-title').value;
      const lang = document.getElementById('post-lang').value;
      const tags = document.getElementById('post-tags').value;
      const content = document.getElementById('post-content').value;

      const response = await postCreator.createNewPost(title, lang, tags, content);

      alert(
        `Successfully created Pull Request!\nPR URL: ${response.prUrl}\n\nReview and merge it on GitHub.`,
      );
      elements.newPostForm.reset();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    } finally {
      hideLoading();
      elements.createPostBtn.disabled = false;
    }
  }

  // 이벤트 리스너 바인딩
  function bindEvents() {
    // ⭐️ V1.0.7 수정: 로그인 버튼 리스너
    elements.loginBtn.addEventListener('click', () => {
      showLoading('Redirecting to GitHub...');
      githubApi
        .login()
        .then((userData) => {
          // 로그인 성공 시 (팝업이 닫힌 후)
          updateUIForLogin(userData);
          hideLoading();
        })
        .catch((error) => {
          // 로그인 실패 또는 팝업 닫힘
          console.error('Login failed:', error);
          alert('Login failed: ' + error.message);
          hideLoading();
        });
    });

    elements.logoutBtn.addEventListener('click', () => githubApi.logout());
    elements.newPostForm.addEventListener('submit', handlePostSubmit);

    document
      .querySelector('.admin-sidebar nav')
      .addEventListener('click', handleTabClick);
  }

  // DOM 로드 완료 시 실행
  document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 캐시
    elements.loginBtn = document.getElementById('login-btn');
    elements.logoutBtn = document.getElementById('logout-btn');
    elements.authStatus = document.getElementById('auth-status');
    elements.userInfo = document.getElementById('user-info');
    elements.userName = document.getElementById('user-name');
    elements.adminMain = document.getElementById('admin-main');
    elements.loadingOverlay = document.getElementById('loading-overlay');
    elements.loadingMessage = document.getElementById('loading-message');
    elements.navItems = document.querySelectorAll('.nav-item');
    elements.tabContents = document.querySelectorAll('.tab-content');
    elements.newPostForm = document.getElementById('new-post-form');
    elements.createPostBtn = document.getElementById('create-post-btn');
    elements.themeConfigDisplay = document.getElementById(
      'theme-config-display',
    );

    bindEvents();

    // 페이지 로드 시 인증 상태 확인
    showLoading('Checking authentication...');
    githubApi
      .checkAuth()
      .then((userData) => {
        if (userData) {
          updateUIForLogin(userData);
        } else {
          updateUIForLogout();
        }
      })
      .catch((error) => {
        console.error('Auth check failed:', error);
        updateUIForLogout();
      })
      .finally(() => {
        hideLoading();
      });
  });
})(window.githubApi, window.postCreator);
