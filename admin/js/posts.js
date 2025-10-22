/* admin/js/posts.js v1.0_202510220736 */
class PostHandler {
constructor(githubApi) {
this.githubApi = githubApi;
}
getFormHtml() {
return `
<div class="content-box">
<h2>Create New Post</h2>
<form id="create-post-form">
<label for="post-lang">Language</label>
<select id="post-lang" name="lang" required>
<option value="ko">Korean</option>
<option value="en">English</option>
</select>

<label for="post-title">Title</label>
      <input type="text" id="post-title" name="title" required />

      <label for="post-tags">Tags (comma-separated)</label>
      <input type="text" id="post-tags" name="tags" placeholder="e.g., Tech, DIY" />
      
      <button type="submit">Create Post PR</button>
    </form>
    <div id="response-message"></div>
  </div>
`;
  }
attachFormListener() {
const form = document.getElementById('create-post-form');
form.addEventListener('submit', async (e) => {
e.preventDefault();
const formData = new FormData(form);
const data = Object.fromEntries(formData.entries());

const responseMsg = document.getElementById('response-message');
  responseMsg.style.display = 'none';

  try {
    const endpoint = this.githubApi.config.cloudflare_worker_endpoint;
    if (!endpoint) {
      throw new Error('Cloudflare Worker endpoint is not configured.');
    }

    const user = await this.githubApi.getUser();
    data.author = user.name || user.login;

    responseMsg.className = '';
    responseMsg.textContent = 'Creating Pull Request...';
    responseMsg.style.display = 'block';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: The worker uses its own GITHUB_API_TOKEN, not the user's OAuth token.
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unknown error from worker.');
    }

    responseMsg.classList.add('success');
    responseMsg.innerHTML = `Success! <a href="${result.pullRequestUrl}" target="_blank">View Pull Request</a>`;
  } catch (error) {
    console.error('Error creating post:', error);
    responseMsg.classList.add('error');
    responseMsg.textContent = `Error: ${error.message}`;
  }
});
                      
