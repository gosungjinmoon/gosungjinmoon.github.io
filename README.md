---
# 🧭 GOFUNWITH Blog (v2025.10)

---

## 🎯 프로젝트 개요

**GOFUNWITH Blog**는
개발자와 메이커를 위한 **완전 자동화 기술 블로그 플랫폼**입니다.

> 💡 Jekyll + n8n + Gemini + GitHub Pages 기반으로
> 글 작성 → 번역 → 게시 → 배포 전 과정을 자동화합니다.

---

### ✅ 주요 특징

* ⚙️ **정적 블로그(Jekyll)** – GitHub Pages 자동 빌드
* 🧠 **n8n + Gemini 자동 포스팅 시스템** – Admin Console에서 글 작성 시:

  1. 한국어 글 자동 저장
  2. Gemini로 영어 자동 번역
  3. GitHub API로 `_posts/ko` / `_posts/en` 동시 커밋
* 🌍 **다국어 지원** – `/ko/`, `/en/` 라우팅 및 `alt_lang` 기반 매핑
* 🧩 **theme.yml 기반 통합 설정 관리**
  (도메인, 브랜치, n8n endpoint, 댓글, 테마 색상 등)
* 🛠️ **관리자(Admin) 페이지 내 즉시 게시 기능**
* 💬 **giscus 댓글 시스템 통합**
* 🔒 **CORS 보안 + Cloudflare Proxy + n8n HTTPS 환경**

---

## 🧱 시스템 구성도

```
┌───────────────┐          POST /webhook/new-post
│   Admin Console │  ───────────────────────────────►  n8n.gofunwith.com
│  (blog.gofunwith.com/admin) │                        │
└───────────────┘                                    │
                                                     ▼
                                           Google Gemini API
                                                     │
                                                     ▼
                                            GitHub REST API
                                                     │
                                                     ▼
                                       blog.gofunwith.com (Jekyll)
```

---

## 📂 폴더 구조

```
📦 gosungjinmoon.github.io
│
├─ CNAME                     # Cloudflare DNS (blog.gofunwith.com)
├─ README.md                 # 프로젝트 개요 문서 (현재 파일)
├─ _config.yml               # Jekyll 설정 (include: [admin])
│
├─ _data/
│  ├─ lang.yml               # 다국어 코드 매핑
│  └─ theme.yml              # 브랜드, 도메인, API, 색상 등 통합 설정
│
├─ _includes/
│  ├─ head.html / header.html / footer.html
│  ├─ nav.html / seo.html / search-box.html
│  ├─ lang-switch.html       # 언어 전환 버튼 (header에서만 사용)
│  └─ tag-cloud.html         # 태그 클라우드 표시
│
├─ _layouts/
│  ├─ default.html
│  ├─ home.html
│  ├─ post.html              # 본문 내 언어버튼 제거된 버전
│  ├─ tags.html
│  └─ search.html
│
├─ _posts/
│  ├─ ko/ (YYYY-MM-DD-title.ko.md)
│  └─ en/ (YYYY-MM-DD-title.en.md)
│
├─ assets/
│  ├─ js/
│  │  ├─ github-api.js      # GitHub API 및 theme.yml 로드
│  │  ├─ posts.js           # 글 작성, n8n 호출
│  │  ├─ admin.js           # Admin 이벤트 핸들링
│  │  ├─ search.js          # 클라이언트 검색
│  │  └─ translator.js      # (옵션) 번역 처리
│  ├─ config/
│  │  └─ theme.yml          # Admin 런타임 설정 (fetch로 로드됨)
│  └─ themes/
│     └─ modern-light/
│        ├─ css/style.css
│        └─ images/logo.svg
│
├─ admin/
│  ├─ index.html
│  ├─ css/admin.css
│  └─ js/
│     ├─ admin.js
│     ├─ github-api.js
│     └─ posts.js
│
└─ .github/workflows/jekyll.yml   # GitHub Pages 자동 배포
```

---

## ⚙️ Jekyll 설정 핵심

* `_config.yml`

  ```yaml
  include: [admin]
  baseurl: ""
  plugins:
    - jekyll-seo-tag
    - jekyll-feed
    - jekyll-sitemap
  ```
* `CNAME`: blog.gofunwith.com
* `safe: true` → symlink 포함 불가
* `/ko/`, `/en/` 기본 페이지 사전 생성 (404 방지)

---

## 🌍 다국어 라우팅

| 언어  | 기본 경로         | 포스트 경로                         |
| --- | ------------- | ------------------------------ |
| 한국어 | `/ko/` 또는 `/` | `/YYYY/MM/DD/title.ko.html`    |
| 영어  | `/en/`        | `/en/YYYY/MM/DD/title.en.html` |

### Front Matter 예시

**ko 버전**

```yaml
---
title: "테스트 자동 게시글"
lang: ko
alt_lang: this-is-a-sample-blog-post
---
```

**en 버전**

```yaml
---
title: "This is a Sample Blog Post"
lang: en
alt_lang: 테스트-자동-게시글
---
```

---

## 🧰 Admin Console

> `/admin/` → n8n Webhook을 통해 자동 게시

### 주요 기능

| 기능                | 설명                              |
| ----------------- | ------------------------------- |
| 새 글 작성            | 제목, 본문, 언어, 자동 번역 여부 선택         |
| Gemini 번역         | Google Gemini API로 자연스러운 영어 변환  |
| GitHub API Commit | `_posts/ko` / `_posts/en` 자동 커밋 |
| Theme 설정          | `theme.yml` 기반 실시간 설정 로드        |
| Like, Comment     | Worker Endpoint 연결 (옵션)         |

### 주요 스크립트

| 파일              | 역할                           |
| --------------- | ---------------------------- |
| `github-api.js` | theme.yml 로드 + GitHub API 통신 |
| `posts.js`      | 게시글 작성 및 n8n 호출              |
| `admin.js`      | UI 제어 및 이벤트 핸들링              |

---

## 스타일/테마
- 기본 테마: `assets/themes/modern-light/`
- 로고: `images/logo.svg`
- CSS: 모바일 퍼스트, 카드형 레이아웃, 깔끔한 화이트+민트 포인트

---

## 🤖 n8n 자동 포스팅 워크플로우

**Webhook URL:**
`https://n8n.gofunwith.com/webhook/new-post`

### 워크플로우 노드 구조

| 순서 | 노드명                 | 설명                   |
| -- | ------------------- | -------------------- |
| 1  | Webhook             | Admin POST 수신        |
| 2  | Parse Data          | 제목, slug, 날짜 처리      |
| 3  | If Auto Translate   | 자동 번역 여부 판단          |
| 4  | Gemini Translate    | Gemini API 호출        |
| 5  | Parse EN Slug       | 번역된 제목으로 slug 생성     |
| 6  | Create/Edit KO File | `_posts/ko/`에 원문 저장  |
| 7  | Create/Edit EN File | `_posts/en/`에 번역본 저장 |
| 8  | Make Response       | 결과 JSON 반환           |
| 9  | HTTP Response       | Admin에 응답 전달         |

---

## 🔐 CORS & n8n 서버 설정

`~/ecosystem.config.js`:

```js
env: {
  N8N_HOST: "n8n.gofunwith.com",
  N8N_PROTOCOL: "https",
  N8N_PORT: "5678",
  WEBHOOK_URL: "https://n8n.gofunwith.com",
  N8N_CORS_ALLOW_ORIGIN: "https://blog.gofunwith.com",
  N8N_CORS_ALLOW_METHODS: "GET,POST,OPTIONS",
  N8N_CORS_ALLOW_HEADERS: "Authorization,Content-Type",
  N8N_CORS_CREDENTIALS: "true",
  TZ: "Asia/Seoul"
}
```

`/etc/nginx/sites-available/n8n.conf`:

```nginx
location /webhook/ {
    proxy_pass http://localhost:5678;

    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://blog.gofunwith.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
        return 204;
    }

    add_header Access-Control-Allow-Origin "https://blog.gofunwith.com" always;
}
```

---

## 🎨 Theme / Config

`_data/theme.yml`

> (Jekyll 및 Admin 공통 설정)

```yaml
brand: "GOFUNWITH – Explore. Create. Share."
domain: "blog.gofunwith.com"
repo: "gosungjinmoon/gosungjinmoon.github.io"
branch: "main"

n8n_webhook_new_post: "https://n8n.gofunwith.com/webhook/new-post"
worker_like_endpoint: "https://n8n.gofunwith.com/webhook/like-post"

giscus_repo: "gosungjinmoon/gosungjinmoon.github.io"
giscus_category: "Show and tell"
giscus_lang: "ko"

theme:
  primary_color: "#1e90ff"
  dark_mode: false
```

---

## 🚀 배포 (GitHub Actions)

`.github/workflows/jekyll.yml`
자동으로 `_site/` 빌드 후 GitHub Pages로 배포.

```yaml
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-ruby@v1
        with:
          ruby-version: 3.1
      - run: bundle install
      - run: bundle exec jekyll build --baseurl ""
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```


---

## 📜 라이선스 및 정보

| 항목     | 내용                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------- |
| 프로젝트명  | GOFUNWITH Blog System                                                                             |
| 버전     | v2025.10                                                                                          |
| 이메일    | [contact@gofunwith.com](mailto:contact@gofunwith.com)                                             |
| GitHub | [gosungjinmoon/gosungjinmoon.github.io](https://github.com/gosungjinmoon/gosungjinmoon.github.io) |
| 주요 기술  | Jekyll, n8n, Gemini API, GitHub REST API, Cloudflare                                              |
| 배포 도메인 | [https://blog.gofunwith.com](https://blog.gofunwith.com)                                          |

---


