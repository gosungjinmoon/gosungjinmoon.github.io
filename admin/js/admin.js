/* admin/js/admin.js  버전 정보_202510171345 */
import { openNewPostModal, closeNewPostModal, submitNewPost, listPosts } from "./posts.js";
const navItems=document.querySelectorAll(".sidebar li");
navItems.forEach(item=>{item.addEventListener("click",()=>{navItems.forEach(el=>el.classList.remove("active"));item.classList.add("active");document.querySelectorAll("section.page").forEach(sec=>sec.classList.remove("visible"));document.getElementById(`page-${item.dataset.page}`).classList.add("visible");});});
const loginBtn=document.getElementById("loginBtn");const logoutBtn=document.getElementById("logoutBtn");
function updateAuthUI(){const token=sessionStorage.getItem("github_token");if(token){loginBtn.classList.add("hidden");logoutBtn.classList.remove("hidden");}else{loginBtn.classList.remove("hidden");logoutBtn.classList.add("hidden");}}
loginBtn.addEventListener("click",async()=>{try{const ep=(window.__GFW_CONFIG__&&__GFW_CONFIG__.cloudflare_worker_endpoint)||"";if(!ep)return alert("Worker endpoint 미설정 (config/theme-config.js 확인)");const r=await fetch(`${ep}/oauth-url`);const {authorize_url}=await r.json();location.href=authorize_url;}catch(e){alert("OAuth 시작 오류: "+e.message);}});
logoutBtn.addEventListener("click",()=>{sessionStorage.removeItem("github_token");updateAuthUI();alert("로그아웃 되었습니다.");});
document.getElementById("openNewPostModal").addEventListener("click",openNewPostModal);
document.getElementById("cancelNewPost").addEventListener("click",closeNewPostModal);
document.getElementById("submitNewPost").addEventListener("click",submitNewPost);
document.getElementById("listPosts").addEventListener("click",listPosts);
updateAuthUI();
