(function(){
  const btn = document.getElementById('gh-login');
  if(!btn) return;
  btn.addEventListener('click', ()=>{
    alert('GitHub OAuth는 추후 연결합니다. (현재는 로그인 없이 작성 테스트 가능)');
  });
})();
