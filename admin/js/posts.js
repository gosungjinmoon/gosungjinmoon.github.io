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
