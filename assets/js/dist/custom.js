/* /assets/js/dist/custom.js v202511050600 */

document.addEventListener('DOMContentLoaded', function () {
  const topbar = document.getElementById('topbar-wrapper');
  if (!topbar) return;

  const currentLang = document.documentElement.lang;
  const switcher = document.createElement('div');
  switcher.id = 'lang-switcher-wrapper';

  let links = `
    <a href="/" class="lang-btn ${currentLang === 'ko' ? 'active' : ''}">한국어</a>
    <a href="/en/" class="lang-btn ${currentLang === 'en' ? 'active' : ''}">English</a>
  `;
  switcher.innerHTML = links;
  
  topbar.appendChild(switcher);
});
