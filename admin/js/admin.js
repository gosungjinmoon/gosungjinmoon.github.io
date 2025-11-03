/* /admin/js/admin.js v202511040001 */
document.addEventListener('DOMContentLoaded', () => {
    const N8N_WEBHOOK_URL = "https://n8n.gofunwith.com/webhook/new-post"; // 본인 n8n 웹훅 주소로 변경
    
    const form = document.getElementById('new-post-form');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const lang = document.getElementById('post-lang').value;
        const auto_translate = document.getElementById('auto-translate').checked;

        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '처리 중...';

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    lang,
                    auto_translate
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            alert(`성공: ${result.message || '포스트가 생성되었습니다.'}`);
            form.reset();

        } catch (error) {
            console.error('Error submitting post:', error);
            alert(`오류 발생: ${error.message}. n8n 서버와 CORS 설정을 확인하세요.`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '포스트 생성 및 배포';
        }
    });

    const N8N_THEME_WEBHOOK = "https://n8n.gofunwith.com/webhook/update-theme"; // 새 웹훅 주소
    const themeGallery = document.getElementById('theme-gallery');
    const themePreview = document.getElementById('theme-preview-iframe');

    async function loadThemes() {
        try {
            const response = await fetch('/_data/themes.yml');
            const text = await response.text();
            // YAML 파서는 추가해야 하지만, 간단하게 정규식으로 파싱
            // 실제 프로덕션에서는 yml 파싱 라이브러리 사용 권장
            // 여기서는 간단히 예시로만 구현
            const themes = text.split('- id:').slice(1).map(t => {
                const name = t.match(/name: (.*)/)[1];
                const preview = t.match(/preview_url: "(.*)"/)[1];
                return { name, preview };
            });
            
            themeGallery.innerHTML = themes.map(theme => `
                <div class="theme-card" data-preview-url="${theme.preview}">
                    <h4>${theme.name}</h4>
                    <button class="apply-theme-btn">적용하기</button>
                </div>
            `).join('');
        } catch(e) { console.error("테마 로드 실패:", e); }
    }

    themeGallery.addEventListener('click', e => {
        const card = e.target.closest('.theme-card');
        if (!card) return;

        const previewUrl = card.dataset.previewUrl;
        themePreview.src = previewUrl;

        if (e.target.classList.contains('apply-theme-btn')) {
            // n8n 웹훅 호출 로직 (생략)
            alert(`${card.querySelector('h4').textContent} 테마 적용을 요청합니다.`);
        }
    });

    loadThemes();
});
