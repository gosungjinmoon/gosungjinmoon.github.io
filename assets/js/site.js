(function(){
  const langCfg = window.langConfig || { default: 'ko', ko:{}, en:{} };
  const userLang = (navigator.language||'ko').toLowerCase().startsWith('en') ? 'en' : langCfg.default;
  document.documentElement.lang = userLang;
  const brandEl = document.querySelector('.brand-title');
  const taglineEl = document.getElementById('tagline');
  const navEl = document.getElementById('mainNav');
  const dict = langCfg[userLang] || langCfg['ko'];
  if(brandEl && dict.brand) brandEl.textContent = dict.brand;
  if(taglineEl && dict.tagline) taglineEl.textContent = dict.tagline;
  if(navEl && dict.nav){
    navEl.innerHTML = dict.nav.map(n=>`<a href="${n.href}">${n.title}</a>`).join('');
  }

  const btn = document.getElementById('themeToggle');
  const root = document.body;
  const current = (window.themeConfig && window.themeConfig.current) || 'light';
  root.setAttribute('data-theme', current);
  btn && btn.addEventListener('click', ()=>{
    const order = (window.themeConfig && window.themeConfig.available) || ['light','dark','mint','sunset'];
    const now = root.getAttribute('data-theme');
    const idx = (order.indexOf(now)+1) % order.length;
    const next = order[idx];
    root.setAttribute('data-theme', next);
    const link = document.querySelector('link[href*="theme-"]');
    if(link) link.href = `/assets/css/theme-${next}.css`;
  });

  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  ham && ham.addEventListener('click', ()=> nav.classList.toggle('open'));
})();
