/* assets/js/search.js  버전 정보_202510171345 */
(function(){
  const input=document.getElementById("searchInput");const results=document.getElementById("searchResults");if(!input||!results)return;
  input.addEventListener("input",function(){const q=this.value.trim().toLowerCase();results.innerHTML="";if(!q)return;
    const hits=(window.__SITE_INDEX__||[]).filter(p=>(p.title||"").toLowerCase().includes(q));
    hits.slice(0,10).forEach(h=>{const li=document.createElement("li");li.innerHTML=`<a href="${h.url}">${h.title}</a>`;results.appendChild(li);});
  });
  fetch("/sitemap.xml").then(r=>r.text()).then(xml=>{
    const m=Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(x=>x[1]);
    window.__SITE_INDEX__=m.filter(u=>/\d{4}\/\d{2}\/\d{2}\//.test(u)||u.includes("/ko/")||u.includes("/en/"))
      .map(u=>({title:decodeURI(u.split("/").slice(-2,-1)[0]||"Post"),url:u}));
  }).catch(()=>{});
})();
