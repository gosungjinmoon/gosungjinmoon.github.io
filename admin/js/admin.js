/* /admin/js/admin.js v202511042000 */
document.addEventListener('DOMContentLoaded', () => {
    const N8N_POST_WEBHOOK = "https://n8n.gofunwith.com/webhook/new-post";
    const N8N_THEME_WEBHOOK = "https://n8n.gofunwith.com/webhook/update-theme";
    
    // Tab switching logic
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

    // Post creation logic
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // ... (이전 답변의 post submit 로직과 동일)
    });

    // Theme management logic
    const themeGallery = document.getElementById('theme-gallery');
    const themePreview = document.getElementById('theme-preview-iframe');
    async function loadThemes() {
        try {
            const response = await fetch('/_data/themes.yml');
            const yamlText = await response.text();
            // Simple pseudo-YAML parsing
            const themes = yamlText.split('- id:').slice(1).map(t => ({
                id: t.match(/ (.*)/)[1].trim(),
                name: t.match(/name: (.*)/)[1].trim(),
                preview_url: t.match(/preview_url: "(.*)"/)[1]
            }));

            themeGallery.innerHTML = themes.map(theme => `
                <div class="theme-card" data-id="${theme.id}" data-preview-url="${theme.preview_url}">
                    <h4>${theme.name}</h4>
                    <button class="apply-theme-btn">적용하기</button>
                </div>`).join('');
        } catch (e) { console.error("Theme data load failed:", e); }
    }

    themeGallery.addEventListener('click', e => {
        const card = e.target.closest('.theme-card');
        if (!card) return;
        themePreview.src = card.dataset.previewUrl;

        if (e.target.classList.contains('apply-theme-btn')) {
            const themeId = card.dataset.id;
            if (confirm(`'${themeId}' 테마를 적용하시겠습니까?`)) {
                // alert(`Applying theme: ${themeId}`); // n8n webhook call logic here
            }
        }
    });
    
    loadThemes();
});
