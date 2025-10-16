import { workerFetch } from './worker-client.js';

export async function loadTheme(){
  const res = await workerFetch('/api/read', { path: '_data/theme.yml' });
  return res?.data || null;
}

export async function saveTheme(body){
  const res = await workerFetch('/api/save', {
    path: '_data/theme.yml',
    data: body,
    message: 'chore(admin): update theme settings'
  });
  return res?.ok;
}
