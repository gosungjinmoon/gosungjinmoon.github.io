/* admin/js/admin.js v1.0.12_202510251400 */
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
      content.classList.toggle('active', content.id === `tab-${targetTab}`);
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
      // Ensure githubApi is loaded and function exists
      if (typeof githubApi?.fetchThemeConfigYaml !== 'function') {
         throw new Error("GitHub API module not loaded correctly.");
      }
      const configYaml = await githubApi.fetchThemeConfigYaml();
      elements.themeConfigDisplay.value = configYaml;
    } catch (error) {
      console.error('Error loading theme config:', error);
      // Corrected syntax error from V1.0.10 check
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
      // Ensure form elements exist before accessing value
      const title = document.getElementById('post-title')?.value;
      const lang = document.getElementById('post-lang')?.value;
      const tags = document.getElementById('post-tags')?.value;
      const content = document.getElementById('post-content')?.value;

      if (!title || !lang || content === undefined) {
         throw new Error("Title, Language, and Content are required.");
      }

      const response = await postCreator.createNewPost(title, lang, tags ?? '', content); // Use empty string if tags is null/undefined

      alert(
        `Successfully created Pull Request!\nPR URL: ${response.prUrl}\n\nReview and merge it on GitHub.`
      );
      if(elements.newPostForm) elements.newPostForm.reset();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + (error.message || "Unknown error"));
    } finally {
      hideLoading();
      elements.createPostBtn.disabled = false;
    }
  }

  function bindEvents() {
    if (elements.loginBtn) {
      elements.loginBtn.addEventListener('click', () => {
        showLoading('Redirecting to GitHub...');
        // Ensure githubApi is loaded
        if (typeof githubApi?.login !== 'function') {
           alert("Initialization error. Cannot log in.");
           hideLoading();
           return;
        }
        githubApi.login()
          .then(userData => {
            if (userData) updateUIForLogin(userData);
            else updateUIForLogout(); // Handle popup close without success
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
    // Cache DOM elements
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

    // Check if essential modules loaded
    if (!window.githubApi || !window.postCreator) {
       console.error("Critical JS modules (githubApi or postCreator) failed to load.");
       alert("Admin panel initialization failed. Please check console errors.");
       hideLoading(); // Ensure loading is hidden
       return; // Stop initialization
    }

    bindEvents();

    // Check auth status on page load
    showLoading('Checking authentication...');
    githubApi.checkAuth()
      .then(userData => {
        if (userData) {
          updateUIForLogin(userData);
          // Load config if settings tab is active initially (or based on hash)
          const initialTab = window.location.hash.substring(1) || 'new-post';
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
// Ensure modules are available globally or passed correctly
})(window.githubApi, window.postCreator);
