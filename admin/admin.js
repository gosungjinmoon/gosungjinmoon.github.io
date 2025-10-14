(function(){
  const current = (window.themeConfig && window.themeConfig.current) || 'light';
  document.getElementById('currentTheme').textContent = current;
  let selected = current;
  document.querySelectorAll('.theme-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      selected = b.dataset.theme;
      document.body.setAttribute('data-theme', selected);
      document.getElementById('currentTheme').textContent = selected;
      const link = document.querySelector('link[href*="theme-"]');
      if(link) link.href = `/assets/css/theme-${selected}.css`;
    });
  });
  document.getElementById('saveBtn').addEventListener('click', async ()=>{
    const token = localStorage.getItem('github_token');
    if(!token){ alert('GitHub 로그인 필요 (OAuth 프록시 구축 후 사용)'); return; }
    const config = { current: selected, available: ["light","dark","mint","sunset"], updated: new Date().toISOString() };
    const repo = "gosungjinmoon/gosungjinmoon.github.io";
    const path = "config/theme-config.js";
    async function getSha(){
      const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
      const j = await r.json();
      return j.sha;
    }
    const body = {
      message: `chore(admin): theme -> ${selected}`,
      content: btoa(`window.themeConfig = ${JSON.stringify(config,null,2)};`),
      sha: await getSha()
    };
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`,{
      method:'PUT',
      headers:{'Authorization':`token ${token}`,'Content-Type':'application/json'},
      body: JSON.stringify(body)
    });
    if(res.ok){ alert('테마 저장 완료! 새로고침하면 적용됩니다.'); }
    else { alert('실패: 토큰/권한 확인'); }
  });
})();
