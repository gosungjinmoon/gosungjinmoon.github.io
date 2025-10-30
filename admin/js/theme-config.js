window.GFW_THEME = {
  workerEndpoint: "{{ site.data.theme.cloudflare_worker_endpoint | default: '' }}",
  n8nEndpoint: "{{ site.data.theme.n8n_endpoint | default: '' }}", // 예: https://n8n.gofunwith.com/webhook/new-post
};
