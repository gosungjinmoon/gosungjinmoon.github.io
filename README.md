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
├─ _config.yml                # Jekyll 기본 설정 (title, timezone, permalink, paginate)
│
├─ _data/
│  └─ theme.yml              # 브랜드, 도메인, GA4, Worker Endpoint, n8n Webhook 등 환경변수
│
├─ _includes/
│  ├─ head-seo.html         # SEO / favicon / meta 정보
│  ├─ header.html           # 상단 네비게이션 (언어 / 검색 / Admin 진입)
│  └─ footer.html           # 하단 스크립트 (main.js / translator.js / search.js 연결)
│
├─ _layouts/
│  ├─ default.html          # 기본 페이지 레이아웃 (공통 header/footer include)
│  ├─ home.html            # 홈 화면 (최신 포스트 12개 그리드)
│  ├─ post.html            # 개별 포스트 화면 (cover + 본문)
│  ├─ tags.html            # 태그 목록 및 태그별 포스트 리스트
│  └─ search.html          # 클라이언트 검색 입력 + 결과 렌더링
│
├─ _posts/
│  ├─ template.md           # 표준 포스트 템플릿 (SEO / 태그 / 커버 / 메타)
│  ├─ ko/                    # 한국어 포스트
│  └─ en/                    # 영문 포스트
│
├─ ko/
│  ├─ index.md             # 한국어 홈
│  ├─ tags.md              # 한국어 태그 페이지
│  └─ search.md            # 한국어 검색 페이지
│
├─ en/
│  ├─ index.md             # 영문 홈
│  ├─ tags.md              # 영문 태그 페이지
│  └─ search.md            # 영문 검색 페이지
│
├─ assets/
│  ├─ js/
│  │  ├─ main.js            # 사이트 초기화 / 로그 테스트
│  │  ├─ translator.js      # (확장용) 다국어 UI 처리
│  │  └─ search.js         # 입력 검색 → 간이 결과 표시
│  └─ themes/
│    ├─ default/
│    │  ├─ css/style.css    # 공통 CSS 테마 (default)
│    │  └─ images/logo.svg  # 로고
│    ├─ dark/…             # dark 테마
│    └─ modern/…          # modern 테마 (기본 활성)
│
├─ admin/
│  ├─ index.html           # Admin Console 전체 UI (테마, 설정, 포스트 관리)
│  ├─ css/admin.css        # Admin 전용 스타일
│  └─ js/
│    ├─ admin.js          # 탭 전환, 로그인 / 로그아웃 / 버튼 바인딩
│    ├─ github-api.js      # Cloudflare Worker API / GitHub REST API 공통 유틸
│    └─ posts.js          # 새 글 작성(자동 파일명 + PR), 목록 조회
│
├─ cloudflare_worker.js     # Cloudflare Worker 전체 코드 (브랜치 + PR 자동생성)
│
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
