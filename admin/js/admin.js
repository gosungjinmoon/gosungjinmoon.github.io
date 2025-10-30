/* admin/js/admin.js v1.0.13_202510251430 */
(function (githubApi, postCreator) {
  'use strict';

  const elements = {
    loginBtn: null, logoutBtn: null, authStatus: null, userInfo: null,
    userName: null, adminMain: null, loadingOverlay: null, loadingMessage: null,
    navItems: null, tabContents: null, newPostForm: null, createPostBtn: null,
    themeConfigDisplay: null, sidebarNav: null,
  };

  function showLoading(message = 'Processing...') {
    if (elements.loadingMessage) elements.loadingMessage.textContent = message;
    if (elements.loadingOverlay) elements.loadingOverlay.classList.remove('hidden');
  }

  function hideLoading() {
    if (elements.loadingOverlay) elements.loadingOverlay.classList.add('hidden');
  }

  function handleTabClick(e) {
    if (!e.target.classList.contains('nav-item')) return;
    e.preventDefault();
    const targetTab = e.target.dataset.tab;
    if (!targetTab) return;

    elements.navItems.forEach(item => item.classList.remove('active'));
    e.target.classList.add('active');

    elements.tabContents.forEach(content => {
      // Ensure content element exists before accessing id
      if (content) {
        content.classList.toggle('active', content.id === `tab-${targetTab}`);
      }
    });

    if (targetTab === 'settings') loadAndDisplayConfig();
  }

  function updateUIForLogin(userData) {
    if (!userData || !elements.loginBtn || !elements.userInfo || !elements.userName || !elements.adminMain) return;
    elements.loginBtn.classList.add('hidden');
    elements.userInfo.style.display = 'flex';
    elements.userName.textContent = userData.login;
    elements.adminMain.classList.remove('hidden');
  }

  function updateUIForLogout() {
     if (!elements.loginBtn || !elements.userInfo || !elements.userName || !elements.adminMain) return;
    elements.loginBtn.classList.remove('hidden');
    elements.userInfo.style.display = 'none';
    elements.userName.textContent = '';
    elements.adminMain.classList.add('hidden');
  }

  async function loadAndDisplayConfig() {
     if (!elements.themeConfigDisplay) return;
    try {
      showLoading('Loading config...');
      if (typeof githubApi?.fetchThemeConfigYaml !== 'function') {
         throw new Error("GitHub API module not loaded correctly.");
      }
      const configYaml = await githubApi.fetchThemeConfigYaml();
      elements.themeConfigDisplay.value = configYaml;
    } catch (error) {
      console.error('Error loading theme config:', error);
      // V1.0.13: Ensure correct error message assignment
      elements.themeConfigDisplay.value = 'Error loading config: ' + error.message;
    } finally {
       hideLoading();
    }
  }

  async function handlePostSubmit(e) {
    e.preventDefault();
    if (!elements.createPostBtn || !postCreator) return;
    showLoading('Creating new post PR...');
    elements.createPostBtn.disabled = true;

    try {
      const title = document.getElementById('post-title')?.value;
      const lang = document.getElementById('post-lang')?.value;
      const tags = document.getElementById('post-tags')?.value;
      const content = document.getElementById('post-content')?.value;

      if (!title || !lang || content === undefined || content === null) { // More robust check
         throw new Error("Title, Language, and Content are required.");
      }

      // Ensure postCreator module is available
      if (typeof postCreator?.createNewPost !== 'function'){
          throw new Error("Post creation module not available.");
      }

      const response = await postCreator.createNewPost(title, lang, tags ?? '', content);

      alert(
        `Successfully created Pull Request!\nPR URL: ${response.prUrl}\n\nReview and merge it on GitHub.`
      );
      if(elements.newPostForm) elements.newPostForm.reset();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + (error.message || "Unknown error"));
    } finally {
      hideLoading();
      // Ensure button exists before enabling
      if (elements.createPostBtn) elements.createPostBtn.disabled = false;
    }
  }

  function bindEvents() {
    if (elements.loginBtn) {
      elements.loginBtn.addEventListener('click', () => {
        showLoading('Redirecting to GitHub...');
        if (typeof githubApi?.login !== 'function') {
           alert("Initialization error. Cannot log in.");
           hideLoading();
           return;
        }
        githubApi.login()
          .then(userData => {
            if (userData) updateUIForLogin(userData);
            else updateUIForLogout();
          })
          .catch(error => {
            console.error('Login failed:', error);
            alert('Login failed: ' + (error.message || "Unknown error"));
            updateUIForLogout();
          })
          .finally(() => hideLoading());
      });
    } else { console.error("Login button not found."); }

    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener('click', () => {
         if (typeof githubApi?.logout === 'function') githubApi.logout();
         else console.error("Logout function not found.");
      });
    } else { console.error("Logout button not found."); }

    if (elements.newPostForm) {
      elements.newPostForm.addEventListener('submit', handlePostSubmit);
    } else { console.error("New post form not found."); }

    if (elements.sidebarNav) {
       elements.sidebarNav.addEventListener('click', handleTabClick);
    } else { console.error("Sidebar nav element not found."); }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements robustly
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
    elements.themeConfigDisplay = document.getElementById('theme-config-display');
    elements.sidebarNav = document.querySelector('.admin-sidebar nav');

    // Check if essential modules loaded IMMEDIATELY
    if (typeof window.githubApi === 'undefined' || typeof window.postCreator === 'undefined') {
       console.error("Critical JS modules (githubApi or postCreator) failed to load. Check script tags in admin/index.html and previous JS errors.");
       alert("Admin panel initialization failed. Cannot proceed. Please check console errors.");
       // Attempt to hide loading anyway
       const loadingEl = document.getElementById('loading-overlay');
       if(loadingEl) loadingEl.classList.add('hidden');
       return; // Stop initialization
    }

    bindEvents();

    // Check auth status on page load
    showLoading('Checking authentication...');
    githubApi.checkAuth()
      .then(userData => {
        if (userData) {
          updateUIForLogin(userData);
          const initialTab = window.location.hash.substring(1) || 'new-post';
          // Activate initial tab content
          document.querySelectorAll('.tab-content').forEach(tc => tc.classList.toggle('active', tc.id === `tab-${initialTab}`));
          // Activate initial nav item
          document.querySelector(`.nav-item[data-tab="${initialTab}"]`)?.classList.add('active');
          if(initialTab === 'settings') loadAndDisplayConfig();
        } else {
          updateUIForLogout();
        }
      })
      .catch(error => {
        console.error('Auth check failed:', error);
        updateUIForLogout();
      })
      .finally(() => hideLoading());
  });
// Pass modules explicitly if they are not global (though they are in this setup)
})(window.githubApi, window.postCreator);


// v1.1 Theme & Settings handlers
async function applyTheme(themeName){
  try{
    const cfg = await githubApi.loadThemeConfig();
    const token = githubApi.getToken();
    if(!token) throw new Error('Login required');
    // fetch current theme.yml
    const yamlText = await githubApi.fetchThemeConfigYaml();
    // simple replace active_theme
    const updated = yamlText.replace(/active_theme:\s*.*/,'active_theme: '+themeName);
    await githubApi.commitFile({
      path: '_data/theme.yml',
      content: updated,
      message: 'chore(admin): switch theme to '+themeName
    });
    alert('테마가 적용되었습니다. 잠시 후 새로고침됩니다.');
    location.reload();
  }catch(e){
    alert('테마 적용 실패: '+ e.message);
    console.error(e);
  }
}

async function saveSettingsFromForm(form){
  const data = new FormData(form);
  const entries = {};
  data.forEach((v,k)=>{ entries[k]=v; });
  const yaml = Object.entries(entries).map(([k,v])=> `${k}: "${String(v).replace(/"/g,'\"')}"`).join('\n');
  try{
    const token = githubApi.getToken();
    if(!token) throw new Error('Login required');
    await githubApi.commitFile({
      path: '_data/settings.yml',
      content: '/* _data/settings.yml generated by admin */\n'+yaml+'\n',
      message: 'chore(admin): update settings'
    });
    alert('설정이 저장되었습니다.');
  }catch(e){
    alert('설정 저장 실패: '+e.message);
  }
}
