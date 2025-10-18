/* admin/js/admin.js  v6.4.1_202510180200 */

import {getThemeYaml,saveNewPostViaWorker} from "./github-api.js";
import {buildFrontMatter,makeFilename} from "./posts.js";
const navItems=document.querySelectorAll(".sidebar li"); const pages=document.querySelectorAll(".page");
navItems.forEach(li=>li.addEventListener("click",()=>{navItems.forEach(x=>x.classList.remove("active")); li.classList.add("active"); const page=li.getAttribute("data-page"); pages.forEach(p=>p.classList.toggle("visible",p.id==="page-"+page));}));
document.getElementById("loginBtn")?.addEventListener("click",()=>alert("OAuth는 Worker로 처리"));
document.getElementById("logoutBtn")?.addEventListener("click",()=>{sessionStorage.clear(); location.reload();});
document.getElementById("loadTheme")?.addEventListener("click",async()=>{const txt=await getThemeYaml(); alert("theme.yml loaded\n\n"+txt.slice(0,400)+(txt.length>400?"...":""));});
document.getElementById("saveTheme")?.addEventListener("click",async()=>alert("PR 기반 저장은 다음 버전에서"));
document.getElementById("newPostForm")?.addEventListener("submit",async e=>{e.preventDefault(); const title=document.getElementById("postTitle").value.trim(); const lang=document.getElementById("postLang").value; const tags=document.getElementById("postTags").value.trim(); const desc=document.getElementById("postDesc").value.trim(); if(!title) return alert("제목을 입력하세요."); const path=makeFilename(title,lang); const content=buildFrontMatter({title,desc,lang,tags}); try{const result=await saveNewPostViaWorker({ path, content, message: `chore(post): add ${title}` }); alert("PR 생성 완료: "+(result?.pr?.html_url||"확인 필요"));}catch(err){alert("오류: "+err.message);}});
document.getElementById("listPosts")?.addEventListener("click",async()=>{const res=await fetch("/ko/search.json"); const list=await res.json(); document.getElementById("postsResult").textContent=list.map(p=>`${p.date}  ${p.title}  ${p.url}`).join("\n");});
