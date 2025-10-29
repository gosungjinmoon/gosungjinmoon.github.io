// admin/js/posts.js
import ThemeConfig from './github-api.js';

function slugifyKo(str){
  // 한글/영문/숫자/공백 → 하이픈 처리
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-가-힣]+/g, '')
    .replace(/\-+/g, '-');
}

function ymd(){
  const d = new Date();
  const pad = n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

export async function createNewPost({title, content, lang='ko', auto_translate=true, publish_now=true}){
  const cfg = await ThemeConfig.loadThemeConfig();
  const slug = slugifyKo(title);
  const date = ymd();

  const payload = {
    title, content, lang,
    auto_translate: !!auto_translate,
    publish_now: !!publish_now,
    slug, date
  };

  const res = await fetch(cfg.newPostEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    mode: 'cors', credentials: 'omit'
  });

  if(!res.ok){
    const t = await res.text().catch(()=> '');
    throw new Error(`n8n error ${res.status}: ${t}`);
  }
  return res.json();
}