/* admin/js/posts.js  v202510221600 */
(function() {
  function slugify(s) {
    return s.toLowerCase().trim().replace(/[^a-z0-9\uac00-\ud7a3\s-]/g,'').replace(/\s+/g,'-');
  }
  function today() {
    const d = new Date(); const pad = (n)=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  window.GFW_POSTS = {
    buildPayload() {
      const title = document.getElementById('title').value.trim();
      const lang = document.getElementById('lang').value;
      const tags = document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean);
      if (!title) throw new Error('Title is required');
      const slug = slugify(title);
      const date = today();
      const path = `_posts/${lang}/${date}-${slug}.${lang}.md`;
      const front = [
        '---',
        'layout: post',
        `title: "${title.replace(/"/g,'\\"')}"`,
        `date: ${date}`,
        `lang: ${lang}`,
        `tags: [${tags.join(', ')}]`,
        '---',
        '',
        'Write your content here…'
      ].join('\n');
      return { action: 'create_post_pr', path, content: front, title: `[admin] New post: ${title}` };
    }
  };
})();
