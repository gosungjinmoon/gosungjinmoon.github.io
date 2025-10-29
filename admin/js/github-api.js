// admin/js/github-api.js
const ThemeConfig = {
  raw: null,
  async loadThemeConfig(){
    // 우선순위: /assets/config/theme.yml → /_data/theme.yml 빌드 반영본
    const candidates = [
      '/assets/config/theme.yml',
      '/assets/config/theme.yaml'
    ];
    for (const url of candidates){
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if(!res.ok) continue;
        const txt = await res.text();
        this.raw = parseYaml(txt);
        break;
      } catch(e){}
    }
    if(!this.raw) throw new Error('theme.yml 로드 실패');

    const cfg = this.raw;
    // 필수 키
    const required = ['repo','branch'];
    const endpoints = (cfg.endpoints || {});
    const newPost = endpoints.new_post || cfg.n8n_webhook_new_post;

    if(!cfg.repo || !cfg.branch || !newPost){
      throw new Error('One or more required keys are missing from theme.yml.');
    }
    return {
      repo: cfg.repo,
      branch: cfg.branch,
      newPostEndpoint: newPost
    };
  }
};

// 단순 YAML 파서(키:값 수준). 고급 YAML 쓰면 js-yaml로 교체.
function parseYaml(txt){
  const obj = {};
  txt.split(/\r?\n/).forEach(line=>{
    const m = line.match(/^\s*([A-Za-z0-9_\.]+)\s*:\s*(.*)\s*$/);
    if(m){
      const k = m[1];
      let v = m[2].trim();
      v = v.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      // endpoints.new_post 같이 점 표기 지원
      if(k.includes('.')){
        const parts = k.split('.');
        let cur = obj;
        for(let i=0;i<parts.length-1;i++){
          cur[parts[i]] = cur[parts[i]] || {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length-1]] = v;
      } else {
        obj[k] = v;
      }
    }
  });
  return obj;
}

export default ThemeConfig;