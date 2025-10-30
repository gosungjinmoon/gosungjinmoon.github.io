// Like button API integration
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.like-btn');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const postId = btn.dataset.post;
    const res = await fetch(window.GOFUNWITH.like_api_endpoint + '?post=' + postId, { method: 'POST' });
    if (res.ok) {
      const count = await res.json();
      btn.querySelector('.like-count').textContent = count.likes;
    }
  });
});
