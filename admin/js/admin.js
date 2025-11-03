/* /admin/js/admin.js v202511041900 - Final and Complete */
document.addEventListener('DOMContentLoaded', () => {
    // === CONFIGURATION (Provided URLs) ===
    const N8N_POST_WEBHOOK = "https://n8n.gofunwith.com/webhook/new-post";
    const N8N_THEME_WEBHOOK = "https://n8n.gofunwith.com/webhook/update-theme";

    // === TAB SWITCHING LOGIC ===
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === button.dataset.tab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // === POST CREATION LOGIC ===
    const postForm = document.getElementById('new-post-form');
    const submitBtn = document.getElementById('submit-btn');
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const auto_translate = document.getElementById('auto-translate').checked;

        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = '처리 중...';

        try {
            const response = await fetch(N8N_POST_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, lang: 'ko', auto_translate })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            }
            
            const responseText = await response.text();
            if (responseText) {
                const result = JSON.parse(responseText);
                alert(`성공: ${result.message || '포스트가 생성되었습니다.'}`);
                postForm.reset();
            } else {
                alert('성공: 요청이 n8n 서버로 전송되었습니다. (빈 응답 수신)');
                postForm.reset();
            }

        } catch (error) {
            console.error('Error submitting post:', error);
            alert(`오류 발생: ${error.message}. n8n 서버와 CORS 설정을 확인하세요.`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '포스트 생성';
        }
    });

    // === THEME MANAGEMENT LOGIC ===
    const themeGallery = document.getElementById('theme-gallery');
    const themePreview = document.getElementById('theme-preview-iframe');
    async function loadThemes() {
        try {
            const response = await fetch('/_data/themes.yml');
            if (!response.ok) throw new Error("Could not load _data/themes.yml");
            
            const yamlText = await response.text();
            const themes = yamlText.split('- id:').slice(1).map(t => ({
                id: t.match(/ (.*)/)[1].trim(),
                name: t.match(/name: (.*)/)[1].trim(),
                gem: t.match(/gem: "(.*)"/)[1],
                preview_url: t.match(/preview_url: "(.*)"/)[1]
            }));

            themeGallery.innerHTML = themes.map(theme => `
                <div class="theme-card" data-id="${theme.id}" data-gem="${theme.gem}" data-preview-url="${theme.preview_url}">
                    <h4>${theme.name}</h4>
                    <button class="apply-theme-btn">이 테마 적용하기</button>
                </div>`).join('');
        } catch (e) { 
            console.error("Theme data load failed:", e);
            themeGallery.innerHTML = "<p>테마 목록을 불러오는데 실패했습니다.</p>";
        }
    }

    themeGallery.addEventListener('click', async (e) => {
        const card = e.target.closest('.theme-card');
        if (!card) return;
        themePreview.src = card.dataset.previewUrl;

        if (e.target.classList.contains('apply-theme-btn')) {
            const themeId = card.dataset.id;
            const themeGem = card.dataset.gem;
            
            if (confirm(`'${themeId}' 테마를 적용하시겠습니까?\n이 작업은 n8n을 통해 Gemfile과 _config.yml을 변경합니다.`)) {
                e.target.disabled = true;
                e.target.textContent = "요청 중...";
                try {
                    const response = await fetch(N8N_THEME_WEBHOOK, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme_id: themeId, theme_gem: themeGem })
                    });
                    if (!response.ok) throw new Error("Theme update request failed.");
                    alert(`'${themeId}' 테마 적용 요청 성공! 잠시 후 사이트가 리빌드됩니다.`);
                } catch (err) {
                    alert(`테마 적용 실패: ${err.message}`);
                } finally {
                    e.target.disabled = false;
                    e.target.textContent = "이 테마 적용하기";
                }
            }
        }
    });
    
    loadThemes();
});
