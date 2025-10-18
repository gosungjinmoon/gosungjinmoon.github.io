/* admin/js/github-api.js  v6.4.1_202510180200 */

export async function getThemeYaml(){ const r=await fetch("/_data/theme.yml",{cache:"no-store"}); return r.text(); }
export async function saveNewPostViaWorker(payload){
  const theme=await fetch("/_data/theme.yml").then(r=>r.text());
  const m=theme.match(/cloudflare_worker_endpoint:\s*"(.*?)"/);
  if(!m||!m[1]) throw new Error("Worker endpoint 미설정: _data/theme.yml 확인");
  const endpoint=m[1].replace(/\/$/,"")+"/api/new-post";
  const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!res.ok) throw new Error("Worker 응답 오류 "+res.status);
  return res.json();
}
