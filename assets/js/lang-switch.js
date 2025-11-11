// assets/js/lang-switch.js v202511110223
(function(){
  const sel = document.getElementById('lang-switch');
  if(!sel) return;
  sel.addEventListener('change',()=>{
    const lang = sel.value;
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if(parts[0] === 'ko' || parts[0] === 'en') {
      parts[0] = lang;
    } else {
      parts.unshift(lang);
    }
    const next = '/' + parts.join('/') + (window.location.search || '');
    window.location.assign(next);
  });
})();
