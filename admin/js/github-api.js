export async function callWorkerAPI(endpoint, data = {}) {
  const themeConfig = await fetch("/_data/theme.yml").then(r => r.text());
  const endpointUrl = themeConfig.match(/cloudflare_worker_endpoint:\s*"(.*?)"/)?.[1];
  if (!endpointUrl) throw new Error("Worker endpoint not found");

  const res = await fetch(`${endpointUrl}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
