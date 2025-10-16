(function(){
  try{
    const path = location.pathname;
    const current = path.startsWith('/en/') ? 'en' : (path.startsWith('/ko/') ? 'ko' : null);
    const stored = localStorage.getItem('lang');
    if (!current){
      const target = stored || (navigator.language && navigator.language.startsWith('ko') ? 'ko' : 'en');
      location.replace('/' + target + '/'); return;
    }
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('langToggle');
      if (btn){
        btn.addEventListener('click', () => {
          const next = current === 'ko' ? 'en' : 'ko';
          localStorage.setItem('lang', next);
          location.href = '/' + next + '/';
        });
      }
    });
  }catch(e){ console.warn(e); }
})();
