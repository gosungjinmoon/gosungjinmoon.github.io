/* /assets/js/dist/custom.js v202511050700 */

document.addEventListener('DOMContentLoaded', function () {
  const topbar = document.getElementById('topbar');
  const searchWrapper = document.getElementById('topbar-search-wrapper');
  
  if (!topbar || !searchWrapper) return;

  const currentLang = document.documentElement.lang;

  // Create switcher container
  const switcher = document.createElement('div');
  switcher.id = 'lang-switcher';
  switcher.className = 'dropdown';

  // Create button
  const button = document.createElement('button');
  button.className = 'btn btn-sm';
  button.type = 'button';
  button.setAttribute('data-bs-toggle', 'dropdown');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<i class="fas fa-fw fa-language"></i>';

  // Create dropdown menu
  const menu = document.createElement('ul');
  menu.className = 'dropdown-menu dropdown-menu-end';

  const koLink = document.createElement('a');
  koLink.className = `dropdown-item ${currentLang === 'ko' ? 'active' : ''}`;
  koLink.href = '/';
  koLink.textContent = '한국어';

  const enLink = document.createElement('a');
  enLink.className = `dropdown-item ${currentLang === 'en' ? 'active' : ''}`;
  enLink.href = '/en/';
  enLink.textContent = 'English';

  const liKo = document.createElement('li');
  liKo.appendChild(koLink);
  const liEn = document.createElement('li');
  liEn.appendChild(enLink);

  menu.appendChild(liKo);
  menu.appendChild(liEn);
  
  switcher.appendChild(button);
  switcher.appendChild(menu);

  // Insert the switcher between search and palette
  topbar.insertBefore(switcher, searchWrapper.nextSibling);
});
