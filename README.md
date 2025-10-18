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
├─ _config.yml
├─ _data/
│  ├─ config.yml
│  ├─ tags.yml
│  └─ theme.yml
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
├─ cloudflare_worker.js     # Cloudflare Worker 전체 코드 (브랜치 + PR 자동생성)
├─ .prettierrc              # 포맷팅 규칙 (semi, tabWidth 2, printWidth 100)
└─ .eslintrc.json           # Lint 규칙 (ES2020, no-unused-vars, no-undef 등)

```
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

## 🧰 Admin Console 동작 요약

| 기능             | 설명                                              |
| :------------- | :---------------------------------------------- |
| GitHub 로그인     | OAuth 2.0 클라이언트 ID (공용) 기반 로그인 후 토큰 세션 저장       |
| 로그아웃           | `sessionStorage` 초기화 후 페이지 리로드                  |
| 테마/설정          | 현재 `theme.yml` 데이터 읽기/저장 (Cloudflare Worker 연계) |
| 새 글 작성 (PR 생성) | 입력한 제목 → 날짜+slugified 파일명 → Worker POST → PR    |
| 목록 불러오기        | GitHub REST API (`/contents/_posts`) 호출 후 렌더링   |

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
## 🔒 보안
- OAuth Secret은 리포지토리에 커밋하지 않습니다.
- Cloudflare Worker가 GitHub API 호출을 프록시하며, Secret은 Worker 환경변수에 저장합니다.
- Admin은 GitHub 로그인 후 토큰을 `sessionStorage`에 보관합니다.

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
