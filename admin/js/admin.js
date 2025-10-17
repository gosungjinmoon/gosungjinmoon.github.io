/* admin/js/admin.js  v6.3.5_202510170000 */
import { openNewPostModal, closeNewPostModal, createNewPost } from "./posts.js";
import { listPosts } from "./github-api.js";

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

document.addEventListener('DOMContentLoaded', () => {
  $$('.sidebar li').forEach(li => {
    li.addEventListener('click', () => {
      $$('.sidebar li').forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      const pg = li.getAttribute('data-page');
      $$('.page').forEach(p => p.classList.remove('visible'));
      document.getElementById('page-' + pg).classList.add('visible');
    });
  });

  document.getElementById('openNewPost')?.addEventListener('click', openNewPostModal);
  document.getElementById('cancelPost')?.addEventListener('click', closeNewPostModal);
  document.getElementById('createPost')?.addEventListener('click', createNewPost);

  document.getElementById('listPosts')?.addEventListener('click', async () => {
    const posts = await listPosts();
    document.getElementById('postsResult').textContent = JSON.stringify(posts, null, 2);
  });
});
