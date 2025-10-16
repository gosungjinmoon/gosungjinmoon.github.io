const PAGES = [...document.querySelectorAll('.sidebar li')];
const SECTIONS = [...document.querySelectorAll('.page')];

PAGES.forEach(li => li.addEventListener('click', () => {
  PAGES.forEach(x => x.classList.remove('active'));
  li.classList.add('active');
  const id = 'page-' + li.dataset.page;
  SECTIONS.forEach(sec => sec.classList.toggle('visible', sec.id === id));
}));

// OAuth
document.getElementById('loginBtn').addEventListener('click', () => {
  const clientId = 'Ov23liqsljSBAqajz2eu'; // 공개 가능
  const redirectUri = location.origin + '/admin/oauth/callback.html';
  const scope = 'repo';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  location.href = authUrl;
});
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('github_token');
  alert('로그아웃 되었습니다.');
});

import { loadTheme, saveTheme } from './theme-service.js';
import { loadConfig, saveConfig, listPosts, createFromTemplate } from './config-service.js';

document.getElementById('loadTheme').addEventListener('click', async () => {
  const data = await loadTheme();
  if (!data) return;
  document.getElementById('brandName').value = data.brand || '';
  document.getElementById('brandTagline').value = (data.brand_tagline || 'Go have fun with tech, tools, and life.');
  document.getElementById('ga4').value = data.ga4_measurement_id || '';
  document.getElementById('n8n').value = data.n8n_webhook_subscribe || '';
});
document.getElementById('saveTheme').addEventListener('click', async () => {
  const body = {
    brand: document.getElementById('brandName').value,
    brand_tagline: document.getElementById('brandTagline').value,
    ga4_measurement_id: document.getElementById('ga4').value,
    n8n_webhook_subscribe: document.getElementById('n8n').value
  };
  const ok = await saveTheme(body);
  if (ok) {
    alert('테마 저장 완료!');
    document.getElementById('preview').contentWindow.location.reload();
  }
});

document.getElementById('loadConfig').addEventListener('click', async () => {
  const cfg = await loadConfig();
  if (!cfg) return;
  document.getElementById('langDefault').value = cfg.site?.language_default || 'ko';
  document.getElementById('postsPerPage').value = cfg.site?.posts_per_page ?? 10;
});
document.getElementById('saveConfig').addEventListener('click', async () => {
  const cfg = {
    site: {
      language_default: document.getElementById('langDefault').value,
      posts_per_page: parseInt(document.getElementById('postsPerPage').value || '10', 10)
    }
  };
  const ok = await saveConfig(cfg);
  if (ok) alert('환경설정 저장 완료!');
});

document.getElementById('listPosts')?.addEventListener('click', async () => {
  const res = await listPosts();
  document.getElementById('postsResult').textContent = JSON.stringify(res, null, 2);
});
document.getElementById('createFromTemplate')?.addEventListener('click', async () => {
  const name = prompt('파일명(예: 2025-10-15-new-post.md)');
  if (!name) return;
  const ok = await createFromTemplate(name);
  if (ok) alert('템플릿으로 생성 완료!');
});
