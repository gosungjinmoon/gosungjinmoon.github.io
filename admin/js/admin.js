// admin/js/admin.js
import { createNewPost } from './posts.js';

async function handlePostSubmit(e){
  e.preventDefault();
  const title=document.getElementById('postTitle').value.trim();
  const content=document.getElementById('postContent').value.trim();
  const lang=document.querySelector('input[name="postLang"]:checked')?.value||'ko';
  const autoTranslate=document.getElementById('autoTranslate').checked;
  const publishNow=true;
  try{
    const result=await createNewPost({title,content,lang,auto_translate:autoTranslate,publish_now:publishNow});
    alert('포스트 생성 완료: '+JSON.stringify(result));
    location.reload();
  }catch(err){
    console.error('Error creating post:',err);
    alert('Error creating post: '+err.message);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('postForm');
  if(form)form.addEventListener('submit',handlePostSubmit);

  const loginBtn=document.getElementById('githubLogin');
  if(loginBtn){
    loginBtn.addEventListener('click',()=>{
      const client_id='YOUR_GITHUB_APP_CLIENT_ID';
      const redirect='https://blog.gofunwith.com/admin/';
      const url=`https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo`;
      window.location.href=url;
    });
  }
});