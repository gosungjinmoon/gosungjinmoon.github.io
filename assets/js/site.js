/* assets/js/site.js  버전 정보_202510171345 */
(function(){
  const links=document.querySelectorAll('.site-nav .menu a');const path=location.pathname;
  links.forEach(a=>{ if(path.startsWith(a.getAttribute('href'))) a.classList.add('active'); });
})();
