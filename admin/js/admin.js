document.getElementById("listPosts").addEventListener("click", async () => {
  const out = document.getElementById("postsResult");
  try{
    const ko = await workerList("_ko");
    const en = await workerList("_en");
    out.textContent = JSON.stringify({ ko, en }, null, 2);
  }catch(e){
    out.textContent = "목록 실패: " + e.message;
  }
});
