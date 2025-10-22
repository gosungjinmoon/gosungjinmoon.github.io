# GOFUNWITH Blog

**브랜드:** GOFUNWITH – Explore. Create. Share.  
**도메인:** [blog.gofunwith.com](https://blog.gofunwith.com)

## 🎯 개요

**목표:**
GitHub Pages + Cloudflare Worker + Admin Console 통합형 블로그 플랫폼을 하나의 완전한 구조로 제공.
(모든 파일 — 레이아웃, 테마, JS, Admin, Worker, CI 설정, Prettier/ESLint 설정 포함)

**특징:**

* Jekyll 정적 구조 (브랜치 = `main`)
* Cloudflare Worker 를 이용한 GitHub PR 자동 생성 (“새 글 작성”)
* Admin Console 로 테마 / 설정 / 포스트 생성 지원
* 다국어 분리 (`/ko`, `/en`) + 공통 테마
* 모든 파일 상단에 버전 주석 추가 (`/* 파일명 버전정보_YYYYMMDDHHMM */`)
* 코드 포맷팅 : Prettier / ESLint 규칙 적용

---
## 📂 폴더 구조
```
📦 gofunwith_blog/
│
├─ CNAME                     # Cloudflare DNS 연결용 도메인 (blog.gofunwith.com)
├─ README.md                 # 전체 구조, 구현 순서, Cloudflare 연동 설명 (현재 문서)
├─ _config.yml               # include:[admin] 포함, GitHub Pages 호환 플러그인 사용
├─ _data/
│  ├─ config.yml             # 브랜드/네비/기본설정
│  ├─ tags.yml               # 태그 기본/별칭
│  └─ theme.yml              # theme.slug, 도메인, worker endpoint 등
├─ _includes/
│  ├─ head-seo.html
│  ├─ header.html
│  ├─ footer.html
│  ├─ lang-switch.html
│  ├─ nav.html
│  ├─ search-box.html
│  ├─ seo.html
│  └─ tag-cloud.html
├─ _layouts/
│  ├─ default.html
│  ├─ home.html
│  ├─ post.html
│  ├─ search.html
│  └─ tags.html
├─ _posts/
│  ├─ ko/ (YYYY-MM-DD-*.md)
│  └─ en/ (YYYY-MM-DD-*.md)
├─ ko/
│  ├─ index.md
│  ├─ tags.md
│  └─ search.md
├─ en/
│  ├─ index.md
│  ├─ tags.md
│  └─ search.md
├─ assets/
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ search.js
│  │  └─ translator.js
│  └─ themes/
│     └─ modern-light/
│        ├─ css/style.css
│        └─ images/logo.svg
├─ admin/
│  ├─ index.html
│  ├─ css/admin.css
│  └─ js/
│     ├─ admin.js
│     ├─ github-api.js
│     └─ posts.js
├─ cloudflare_worker.js     # Cloudflare Worker 참조용 코드 (브랜치 + PR 자동생성, 배포안함)
├─ .prettierrc              # 포맷팅 규칙 (semi, tabWidth 2, printWidth 100)
└─ .eslintrc.json           # Lint 규칙 (ES2020, no-unused-vars, no-undef 등)

```

## Jekyll 설정 핵심
- `_config.yml` : `include: [admin]` 필수 (admin HTML도 Liquid 처리)
- `baseurl: ""` + CNAME=`blog.gofunwith.com`
- 플러그인: `jekyll-seo-tag`, `jekyll-feed`, `jekyll-sitemap` 등 GitHub Pages 호환 목록만 사용

## 다국어 라우팅
- `/` → 한국어 홈 (`ko/index.md` with `permalink: /`)
- `/en/` → 영어 홈
- `/ko/tags/`, `/ko/search/` 등 필수 페이지 사전 생성 → 404 방지

## 검색(Search)
- 기본 제공 `assets/js/search.js` 는 경량 클라이언트 필터(데모)
- 실제 lunr 검색을 원하면 `assets/js/lunr.min.js` 를 공식 빌드로 교체하고
  포스트 인덱스 JSON 생성 파이프라인을 추가하세요.

## 🧰 Admin Console
- 경로: `/admin/`
- 레이아웃: `_layouts/admin.html` → `/admin/js/admin.js` 로드
- 기능: 탭 전환, 테마/설정 읽기 알림, 새 글 생성(Worker endpoint 사용)
- 주의: `theme.yml` 의 `cloudflare_worker_endpoint` 가 빈 값이면 새 글 생성 시 에러

## 스타일/테마
- 기본 테마: `assets/themes/modern-light/`
- 로고: `images/logo.svg`
- CSS: 모바일 퍼스트, 카드형 레이아웃, 깔끔한 화이트+민트 포인트

## 🔒 보안
- OAuth Secret은 리포지토리에 커밋하지 않습니다.
- Cloudflare Worker가 GitHub API 호출을 프록시하며, Secret은 Worker 환경변수에 저장합니다.
- Admin은 GitHub 로그인 후 토큰을 `sessionStorage`에 보관합니다.
  
---
## 🪶 Prettier / ESLint 정책

* **Prettier**

  * `semi: true`
  * `singleQuote: false`
  * `tabWidth: 2`
  * `printWidth: 100`
* **ESLint**

  * `no-unused-vars: warn`
  * `no-undef: error`
  * `semi: ["error","always"]`

---
## ⚙️ Cloudflare 연동 절차

1. **Worker 작성 및 배포**

   * 파일명: `cloudflare_worker.js`
   * Wrangler 또는 Cloudflare Dashboard 에서 생성

     ```bash
     wrangler init gfw-admin-api
     wrangler deploy
     ```
   * Worker 환경 변수 (Environment Variables):

     ```
     GITHUB_OWNER=gosungjinmoon
     GITHUB_REPO=gosungjinmoon.github.io
     GITHUB_TOKEN=<repo scoped PAT>
     DEFAULT_BASE_BRANCH=main
     ```
   * Worker URL 예시:
     `https://gfw-admin-api.example.workers.dev`

2. **theme.yml 설정**

   ```yaml
   cloudflare_worker_endpoint: "https://gfw-admin-api.example.workers.dev"
   ```

   Admin Console 이 이 URL을 읽어 새 포스트 생성 API (`/api/new-post`) 호출.

3. **Worker 로직**

   * `_posts/{ko|en}/YYYY-MM-DD-title.md` 파일 생성
   * 새 브랜치(`post-YYYYMMDD`) 생성
   * 파일 업로드 → Pull Request 자동 생성
   * 반환: `{success:true, pr:{html_url}}`

---

## 🚀 설치
```
git clone git@github.com:gosungjinmoon/gosungjinmoon.github.io.git
cd gosungjinmoon.github.io
# 이 패키지의 모든 파일을 최상단에 복사
git add -A
git commit -m "feat(admin): GoFunWith with Admin Console"
git push origin main
```

---
© 2025 GOFUNWITH – Explore. Create. Share.
