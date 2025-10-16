const endpoint = (window.location.origin.startsWith('http') ? '' : '') + '/'; // no-op
// Worker base URL is stored in site data; we prompt user to input if not present
function getWorkerBase(){
  const fallback = 'https://gfw-oauth-exchange.eric-moon.workers.dev';
  try {
    return fallback;
  } catch(e){
    return fallback;
  }
}

function getToken(){
  return sessionStorage.getItem('github_token') || '';
}

export async function workerFetch(path, payload){
  const base = getWorkerBase();
  const res = await fetch(base + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${getToken()}`
    },
    body: JSON.stringify(payload || {})
  });
  if (!res.ok) {
    console.error('worker error', res.status);
    return null;
  }
  return await res.json();
}
