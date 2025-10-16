# GoFunWith Blog v6 – Admin Console 포함판

**브랜드:** GOFUNWITH – Explore. Create. Share.  
**도메인:** [blog.gofunwith.com](https://blog.gofunwith.com)

## 📂 구조
gofunwith_blog/
├── _config.yml
├── _data/
│   └── theme.yml                # 설정 반영 (GA4, Cloudflare, OAuth 등)
│   └── config.yml` : 사이트 전역 설정
├── _includes/
│   ├── header.html
│   ├── footer.html
│   ├── seo.html
│   └── tag-cloud.html
├── _layouts/
│   ├── default.html
│   ├── post.html
│   ├── home.html
│   └── page.html
├── _posts/
│   └── template.md              # 콘텐츠 작성 표준 템플릿 (SEO+태그 자동)
├── _secrets/
│   └── .env.example             # 실제 .env 참고용 (커밋 제외)
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── admin/                          # 운영자 콘솔 SPA
│   ├── index.html                  # 메인 콘솔 (테마 + 환경 설정)
│   ├── theme-preview.html          # 테마 미리보기
│   ├── settings.html               # 사이트 전역 환경설정 (GA, n8n, Cloudflare 등)
│   ├── js/
│   │   ├── admin.js                # 공통 UI 로직 (탭, 알림, 로딩)
│   │   ├── theme-service.js        # 테마 CRUD (fetch + OAuth 인증)
│   │   └── config-service.js       # 환경 설정 CRUD (YAML/JSON 관리)
│   ├── css/
│   │   └── admin.css               # 다크모드 + 반응형 스타일
│   └── oauth/
│   │   └── callback.html           # GitHub OAuth 콜백
├── .gitignore                   # _secrets/ 및 .env 제외
├── CNAME                        # blog.gofunwith.com
├── README.md                    # 상세 설치 및 배포 안내
└── index.html                   # 랜딩 페이지

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
