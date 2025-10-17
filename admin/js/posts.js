/* admin/js/posts.js  버전 정보_202510171345 */
import { callWorkerAPI } from "./github-api.js";
export function openNewPostModal(){document.getElementById("newPostModal").classList.remove("hidden");}
export function closeNewPostModal(){document.getElementById("newPostModal").classList.add("hidden");}
export async function submitNewPost(){
  const title=document.getElementById("newPostTitle").value.trim();
  const lang=document.getElementById("newPostLang").value;
  const tags=document.getElementById("newPostTags").value.trim();
  const desc=document.getElementById("newPostDesc").value.trim();
  if(!title)return alert("제목은 필수입니다!");
  const today=new Date().toISOString().slice(0,10);
  const safe=title.replace(/\s+/g,"-").replace(/[^\w가-힣-_]/g,"");
  const filename=`${today}-${safe}.md`;
  const fm=`---\nlayout: post\ntitle: "${title}"\ndate: ${today}\nlang: ${lang}\ntags:\n${tags.split(",").map(t=>`  - ${t.trim()}`).join("\n")}\ndescription: "${desc||title}"\ncover_image: "/assets/images/posts/default-cover.webp"\n---\n\n`;
  const content=`${fm}# ${title}\n\n본문을 작성하세요.\n`;
  const message=`chore(post): create ${filename}`;
  const result=await callWorkerAPI("/api/new-post",{filename,content,message});
  alert(result.pull_request_url?`PR 생성 완료:\n${result.pull_request_url}`:"PR 생성 완료");closeNewPostModal();
}
export async function listPosts(){
  const pre=document.getElementById("postsResult");pre.textContent="불러오는 중...";
  try{const xml=await fetch("/sitemap.xml").then(r=>r.text());const locs=Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m=>m[1]);const posts=locs.filter(u=>/\d{4}\/\d{2}\/\d{2}/.test(u));pre.textContent=posts.join("\n");}
  catch(e){pre.textContent="오류: "+e.message;}
}
