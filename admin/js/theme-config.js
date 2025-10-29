window.GFW=window.GFW||{};
GFW.loadThemeConfig=async function(){
  const res = await fetch('{{ "/assets/config/theme.yml" | relative_url }}',{cache:'no-cache'});
  const txt = await res.text();
  // 매우 단순한 key: value 파서 (따옴표 제거)
  const cfg = {};
  txt.split(/\r?\n/).forEach(l=>{
    const m=l.match(/^([a-zA-Z0-9_]+):\s*(.+)$/);
    if(m) cfg[m[1]]=m[2].replace(/^["']|["']$/g,'');
  });
  if(!cfg.n8n_webhook_new_post){ throw new Error("n8n_webhook_new_post is missing in theme.yml"); }
  return cfg;
};
