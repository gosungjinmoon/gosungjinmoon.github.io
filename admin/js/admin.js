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

document.getElementById("createPostPR").addEventListener("click", async () => {
  const title = document.getElementById("newPostTitle").value.trim();
  const lang  = document.getElementById("newPostLang").value;
  if (!title) { alert("제목을 입력하세요."); return; }

  const token = sessionStorage.getItem("github_token");
  if (!token) { alert("먼저 GitHub 로그인을 해주세요."); return; }

  try {
    const r = await fetch(worker + "/api/new-post", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, lang })
    });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || JSON.stringify(j));
    alert(`PR 생성 완료!\n브랜치: ${j.branch}\n파일: ${j.path}\nPR: #${j.pr.number}`);
  } catch (e) {
    alert("생성 실패: " + e.message);
  }
});
