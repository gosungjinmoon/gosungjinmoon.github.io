(async () => {
  const worker = "{{ site.data.theme.cloudflare_worker_endpoint }}";
  const themes = ["default", "dark", "modern"];
  const container = document.getElementById("themes");
  let selected = "{{ site.data.theme.active_theme }}";
  function render(){
    container.innerHTML = themes.map(t => `
      <label class="card">
        <input type="radio" name="theme" value="${t}" ${t===selected?'checked':''} />
        <strong>${t}</strong><br/>
        <small>/assets/themes/${t}</small>
      </label>
    `).join("");
    container.querySelectorAll('input[name="theme"]').forEach(r => {
      r.addEventListener('change', e => selected = e.target.value);
    });
  }
  render();

  document.getElementById("apply").addEventListener("click", async () => {
    const status = document.getElementById("status");
    status.textContent = "테마 적용 중...";
    try{
      const res = await fetch(worker + "/api/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          path: "_data/theme.yml",
          message: "chore: switch theme to " + selected,
          data: { active_theme: selected }
        })
      });
      if(!res.ok) throw new Error(await res.text());
      status.textContent = "✅ 적용 완료! 잠시 후 새로고침하면 반영됩니다.";
    }catch(e){
      status.textContent = "❌ 실패: " + e.message;
    }
  });
})();
