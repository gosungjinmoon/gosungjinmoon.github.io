(function(){
  var sel = document.getElementById('lang-switch');
  if(!sel) return;
  sel.addEventListener('change', function(e){
    var lang = e.target.value;
    var path = location.pathname.replace(/^\/(ko|en)\//, '/');
    location.href = '/' + lang + path;
  });
})();
