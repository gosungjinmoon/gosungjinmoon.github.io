// assets/js/theme.js
(function(){
  const KEY='gfw_theme';
  const logos={
    light:'/assets/logo/logo-light.svg',
    dark:'/assets/logo/logo-dark.svg'
  };
  function apply(theme){
    document.documentElement.setAttribute('data-theme',theme);
    const logo=document.querySelector('header .logo img');
    if(logo && logos[theme]) logo.src=logos[theme];
    try{localStorage.setItem(KEY,theme);}catch(e){}
  }
  function init(){
    const sel=document.querySelector('[data-theme-selector]');
    let saved=null;
    try{saved=localStorage.getItem(KEY);}catch(e){}
    if(saved){apply(saved);if(sel)sel.value=saved;}
    if(sel){sel.addEventListener('change',e=>apply(e.target.value));}
  }
  document.addEventListener('DOMContentLoaded',init);
})();