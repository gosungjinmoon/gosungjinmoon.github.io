async function createNewPost(payload){
  const endpoint = 'https://n8n.gofunwith.com/webhook/new-post';
  const res = await fetch(endpoint, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    const t = await res.text().catch(()=>res.statusText);
    throw new Error(t);
  }
  return res.json();
}
window.createNewPost = createNewPost;
