// assets/js/theme-toggle.js v202511110223
(function(){ 
  const k = 'gfw-theme'; 
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;
  const current = localStorage.getItem(k);
  if(current === 'dark') document.documentElement.setAttribute('data-theme','dark');
  btn.addEventListener('click',()=>{
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if(t === 'dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme');
    localStorage.setItem(k, t);
  });
})();
