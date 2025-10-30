(function () {
  // Theme
  const key = 'gfw_theme';
  const root = document.documentElement;
  function apply(mode){
    if(mode==='dark'){ root.classList.add('dark'); }
    else { root.classList.remove('dark'); }
    const logo = document.getElementById('site-logo');
    if (logo){
      const light = '{{ "/assets/logo/logo-light.svg" | relative_url }}';
      const dark  = '{{ "/assets/logo/logo-dark.svg"  | relative_url }}';
      logo.src = (mode==='dark') ? dark : light;
    }
  }
  let mode = localStorage.getItem(key) || 'light';
  apply(mode);

  const btn = document.getElementById('theme-toggle');
  if (btn){
    btn.addEventListener('click', () => {
      mode = (mode==='light') ? 'dark' : 'light';
      localStorage.setItem(key, mode);
      apply(mode);
    });
  }
})();
