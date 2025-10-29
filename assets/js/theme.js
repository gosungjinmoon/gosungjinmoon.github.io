(function(){
  const btn = document.querySelector('[data-theme-toggle]');
  const logo = document.querySelector('[data-gfw-logo]');
  const LIGHT = '/assets/logo/logo-light.svg';
  const DARK  = '/assets/logo/logo-dark.svg';

  function apply(mode){
    if(mode==='dark'){ document.documentElement.dataset.theme='dark'; logo && (logo.src=DARK); }
    else { document.documentElement.dataset.theme='light'; logo && (logo.src=LIGHT); }
    localStorage.setItem('gfw-theme', mode);
  }

  // 초기 모드
  const saved = localStorage.getItem('gfw-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  btn && btn.addEventListener('click', ()=>{
    const next = (document.documentElement.dataset.theme === 'dark') ? 'light' : 'dark';
    apply(next);
  });
})();
