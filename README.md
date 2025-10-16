# GoFunWith Blog v6 – Admin Console 포함판

이 패키지는 GitHub Pages 블로그 + 운영자 콘솔(Admin) + 보안 구조를 포함합니다.

## 📂 구조
- `/admin/` : 운영자 콘솔 SPA
  - `index.html` : 메인 (탭 UI)
  - `theme-preview.html` : 테마 미리보기
  - `settings.html` : 환경설정 안내
  - `oauth/callback.html` : GitHub OAuth 콜백
  - `js/admin.js` : 콘솔 UI
  - `js/theme-service.js` : 테마 읽기/쓰기
  - `js/config-service.js` : 환경설정/포스트 API
  - `js/worker-client.js` : Cloudflare Worker 프록시 클라이언트
  - `css/admin.css` : 다크 테마 UI
- `/_data/theme.yml` : 사이트 브랜드/통합 설정
- `/_data/config.yml` : 사이트 전역 설정
- `/_posts/template.md` : SEO 포함 포스트 템플릿
- `/_secrets/.env.example` : 민감정보 예시 (실제 .env는 커밋 금지)

## 🔒 보안
- OAuth Secret은 리포지토리에 커밋하지 않습니다.
- Cloudflare Worker가 GitHub API 호출을 프록시하며, Secret은 Worker 환경변수에 저장합니다.
- Admin은 GitHub 로그인 후 토큰을 `sessionStorage`에 보관합니다.

## 🔗 필요 준비
1) GitHub OAuth App 설정 (Authorization callback URL):
   `https://<your-domain>/admin/oauth/callback.html`

2) Cloudflare Worker (프록시 엔드포인트)에서 다음 라우트 구현
   - `POST /api/read { path }` → 리포 파일 읽기 (YAML → JSON 반환)
   - `POST /api/save { path, data, message }` → 파일 저장 (JSON → YAML 커밋)
   - `POST /api/list { path }` → 경로 목록
   - `POST /api/copy { from, to, message }` → 템플릿 복사 커밋

3) `_data/theme.yml` 의 `cloudflare_worker_endpoint` 값은 Worker 주소로 유지

## 🚀 설치
```
git clone git@github.com:gosungjinmoon/gosungjinmoon.github.io.git
cd gosungjinmoon.github.io
# 이 패키지의 모든 파일을 최상단에 복사
git add -A
git commit -m "feat(admin): GoFunWith v6 with Admin Console"
git push origin main
```

## 🧪 빠른 테스트
- `https://<username>.github.io/admin/` 접속 → GitHub 로그인 → 테마 불러오기/저장
- 저장 후 프리뷰(iframe) 새로고침으로 반영 확인

---
© 2025 GOFUNWITH – Explore. Create. Share.
