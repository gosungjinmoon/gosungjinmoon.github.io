import { workerFetch } from './worker-client.js';

export async function loadConfig(){
  const res = await workerFetch('/api/read', { path: '_data/config.yml' });
  return res?.data || null;
}
export async function saveConfig(cfg){
  const res = await workerFetch('/api/save', {
    path: '_data/config.yml',
    data: cfg,
    message: 'chore(admin): update site config'
  });
  return res?.ok;
}

export async function listPosts(){
  const res = await workerFetch('/api/list', { path: '_posts' });
  return res?.files || [];
}
export async function createFromTemplate(filename){
  const res = await workerFetch('/api/copy', {
    from: '_posts/template.md',
    to: `_posts/${filename}`,
    message: `feat(post): add ${filename} from template`
  });
  return res?.ok;
}
