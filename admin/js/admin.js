/* /admin/js/admin.js v202511041600 */
document.addEventListener('DOMContentLoaded', () => {
    // 본인의 n8n 웹훅 주소로 반드시 변경해야 합니다.
    const N8N_WEBHOOK_URL = "https://n8n.gofunwith.com/webhook/new-post"; 
    
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
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
            }

            // 응답 본문이 비어있는지 확인 후 JSON 파싱 시도
            const responseText = await response.text();
            if (responseText) {
                const result = JSON.parse(responseText);
                alert(`성공: ${result.message || '포스트가 생성되었습니다.'}`);
                form.reset();
            } else {
                alert('성공: 요청이 n8n 서버로 전송되었습니다. (빈 응답 수신)');
                form.reset();
            }

        } catch (error) {
            console.error('Error submitting post:', error);
            alert(`오류 발생: ${error.message}. n8n 서버와 CORS 설정을 확인하세요.`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '포스트 생성 및 배포';
        }
    });
});
