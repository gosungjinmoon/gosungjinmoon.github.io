/* admin/js/github-api.js  v6.4.1_20251017 */
export async function callWorker(route, payload) {
  const ep = window.__THEME_ENDPOINT__;
  if (!ep) {
    alert("오류: Worker endpoint 미설정. _data/theme.yml 확인");
    throw new Error("worker_endpoint_missing");
  }
  const res = await fetch(`${ep}${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Worker ${route} ${res.status}`);
  return res.json();
}
