# 🌐 GOFUNWITH 블로그 시스템

**목적:**  
브랜드 GOFUNWITH의 블로그를 GitHub Pages + Cloudflare + GitHub API 기반으로  
자동화된 테마 관리 및 수익화 중심으로 운영하기 위한 시스템입니다.

---

## 🚀 1. 구성 개요

| 구분 | 설명 |
|------|------|
| `/index.html` | 방문자용 메인 페이지. GA4 + Cloudflare Analytics 연동 |
| `/admin/theme-preview.html` | 관리자 페이지 – 로그인 후 테마 선택 및 적용 |
| `/config/theme-config.js` | 현재 활성 테마 설정 (GitHub API로 자동 업데이트) |
| `/themes/` | Light, Sand, Forest, Ocean 테마 CSS 정의 |
| `/admin/oauth.js` | GitHub OAuth 로그인 처리 |
| `/admin/callback.html` | 인증 후 Access Token 발급 및 저장 |

---

## ⚙️ 2. 실행 절차

### 1️⃣ GitHub OAuth 등록
1. [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. **New OAuth App** 생성
   - Homepage URL: `https://blog.gofunwith.com`
   - Authorization callback URL: `https://blog.gofunwith.com/admin/callback.html`
3. 생성 후 `Client ID` / `Client Secret` 복사

### 2️⃣ 환경 설정
- `/admin/oauth.js` 에 아래 값 입력:
  ```js
  const CLIENT_ID = "YOUR_GITHUB_CLIENT_ID";
  const REDIRECT_URI = "https://blog.gofunwith.com/admin/callback.html";
