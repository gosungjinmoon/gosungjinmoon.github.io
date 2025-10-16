# GoFunWith Blog

**브랜드:** GOFUNWITH – Explore. Create. Share.  
**도메인:** [blog.gofunwith.com](https://blog.gofunwith.com)

## 📂 구조
```
gofunwith_blog_v6.1_international/
├─ index.html                  # 언어 자동 감지 → /ko/ 또는 /en/
├─ _config.yml                 # Jekyll/다국어/컬렉션/플러그인 설정
├─ CNAME                       # blog.gofunwith.com
├─ .gitignore
├─ README.md

├─ _data/
│  ├─ theme.yml                # 브랜드·도메인·GA4·n8n·테마 설정
│  └─ config.yml               # 사이트 전역 설정

├─ _includes/                  # 템플릿 조각
│  ├─ header.html              # 브랜드/네비/언어스위치
│  ├─ footer.html
│  ├─ seo.html                 # SEO/OG/Twitter/GA4/Beacon
│  ├─ nav.html
│  └─ lang-switch.html

├─ _layouts/                   # 레이아웃
│  ├─ default.html             # 공통 레이아웃
│  ├─ home.html                # 언어별 최신글 리스트
│  └─ post.html                # 포스트 뷰

├─ _ko/                        # 🇰🇷 한국어 컬렉션 (공개: /ko/)
│  └─ 2025-10-15-hello.md
├─ _en/                        # 🇺🇸 영어 컬렉션 (공개: /en/)
│  └─ 2025-10-15-hello.md

├─ ko/
│  └─ index.html               # 한국어 홈 (layout: home, lang: ko)
├─ en/
│  └─ index.html               # 영어 홈 (layout: home, lang: en)

├─ assets/
│  └─ themes/
│     └─ default/
│        ├─ css/style.css
│        ├─ js/
│        │  ├─ translator.js   # 저장된 언어/브라우저 언어 기반 전환
│        │  ├─ main.js
│        │  └─ ui.js
│        └─ images/logo.svg

└─ admin/
   ├─ index.html               # Admin 셸 (확장 예정)
   ├─ css/admin.css
   └─ oauth/callback.html      # Cloudflare Worker OAuth 교환 → /admin 리다이렉트
```
## 📝 글 작성
- 한국어: `_ko/2025-10-20-title.md`
- 영어: `_en/2025-10-20-title.md`

## 🔧 커스터마이즈
- `_data/theme.yml`에서 브랜드/도메인/GA4/n8n/테마 설정
- 테마는 `/assets/themes/<name>/`로 추가하고 `active_theme` 변경

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
