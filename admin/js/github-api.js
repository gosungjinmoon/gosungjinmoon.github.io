/* admin/js/github-api.js  버전 정보_202510171345 */
export function getWorkerEndpoint(){const ep=(window.__GFW_CONFIG__&&__GFW_CONFIG__.cloudflare_worker_endpoint)||"";if(!ep)throw new Error("Worker endpoint 미설정 (config/theme-config.js 확인)");return ep;}
export async function callWorkerAPI(endpoint,data={}){const base=getWorkerEndpoint();const res=await fetch(`${base}${endpoint}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});if(!res.ok)throw new Error(`Worker error: ${res.status}`);return res.json();}
