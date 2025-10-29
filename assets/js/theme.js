(function(){
  var KEY='gfw_theme';
  function apply(theme){
    document.documentElement.setAttribute('data-theme',theme);
    try{localStorage.setItem(KEY,theme);}catch(e){}
  }
  function init(){
    var sel=document.querySelector('[data-theme-selector]');
    var saved=null;
    try{saved=localStorage.getItem(KEY);}catch(e){}
    if(saved){apply(saved);if(sel)sel.value=saved;}
    if(sel){sel.addEventListener('change',e=>apply(e.target.value));}
  }
  document.addEventListener('DOMContentLoaded',init);
})();