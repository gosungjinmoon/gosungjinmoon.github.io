---
layout: post
title: "첫 번째 여정: 이 GOFUNWITH 블로그는 어떻게 만들어졌는가?"
date: 2025-10-30 16:45:00 +0900
lang: ko
tags: [Meta, Tech, Jekyll, Automation, n8n, Cloudflare, Giscus]
excerpt: "GOFUNWITH 블로그의 핵심 철학인 '경험과 실험'을 바탕으로, 이 블로그 시스템을 0에서부터 구축한 기술적인 여정을 공유합니다. Jekyll, GitHub Actions, n8n, Cloudflare Workers가 어떻게 조화롭게 작동하는지 확인해 보세요."
---

## "Go have fun with tech, tools, and life."

GOFUNWITH 블로그에 오신 것을 환영합니다! 이 블로그의 첫 번째 게시글로, 저희의 핵심 가치인 '경험 중심, 도전과 실험'을 가장 잘 보여줄 수 있는 주제를 골랐습니다.

**바로 이 블로그 시스템 자체를 구축한 여정(Journey)입니다.**

단순히 완성된 결과물만 보여드리는 것이 아니라, 왜 이런 구조를 선택했는지, 어떤 도구들을 엮어 자동화했는지, 그리고 그 과정에서 어떤 '즐거운 실험'이 있었는지 공유하고자 합니다.

### 1. 목표: 왜 처음부터 만들었는가?

기성 블로그 플랫폼도 많지만, 저희는 GOFUNWITH의 철학에 맞는 시스템을 원했습니다.

1.  **엄청난 속도 (Performance):** 정적 사이트(Static Site)로 생성되어 전 세계 어디서든 CDN을 통해 빛의 속도로 콘텐츠를 제공합니다.
2.  **완전한 통제권 (Control):** 플랫폼 정책에 종속되지 않고, 테마, 기능(댓글, 좋아요), 수익화(광고)까지 100% 커스터마이징이 가능해야 했습니다.
3.  **비용 효율 (Cost):** GitHub Pages, Cloudflare Workers, n8n(자체 호스팅) 등 무료 또는 거의 무료에 가까운 인프라를 활용합니다.
4.  **즐거운 실험 (Fun!):** 무엇보다, 이 모든 것을 자동화된 파이프라인으로 엮어내는 과정 자체가 GOFUNWITH의 핵심 가치인 '즐거운 창작'이었습니다.

### 2. 아키텍처: 사용된 기술 스택

이 블로그는 여러 기술들이 유기적으로 결합되어 작동합니다.

#### 뼈대: Jekyll + GitHub Pages

* **Jekyll:** 마크다운(`*.md`) 파일로 글을 작성하면, Jekyll이 이를 정적 HTML 파일로 빌드(구워내기)합니다.
* **GitHub Pages:** 이렇게 생성된 정적 HTML 파일들을 전 세계 사용자에게 무료로 호스팅해줍니다.

#### 엔진: GitHub Actions

* `main` 브랜치에 코드가 푸시될 때마다(예: 새 글 PR이 Merge될 때) GitHub Actions가 자동으로 `bundle exec jekyll build` 명령을 실행하여 사이트 전체를 다시 빌드하고 배포합니다.

#### 두뇌 (자동화): n8n

이 시스템의 핵심입니다. n8n 워크플로우가 백엔드 서버의 역할을 대신합니다.

* **새 글 작성 자동화:** Admin 페이지에서 글을 작성하고 'Submit'을 누르면, 이 데이터가 n8n Webhook(`n8n_webhook_subscribe`)으로 전송됩니다. n8n은 GitHub API를 호출하여 **자동으로 새 브랜치를 만들고, 마크다운 파일을 커밋하며, `main` 브랜치로 Pull Request(PR)를 생성**합니다.
* **자동 번역 (예정):** 한국어 글이 등록되면, `n8n_webhook_translate`가 호출되어 번역 API(DeepL 등)를 통해 영어로 자동 번역 후, 영어 포스트 PR을 생성합니다.
* **테마 변경:** Admin 페이지에서 테마를 변경하면, `n8n_webhook_theme_update`가 호출되어 `_data/theme.yml` 파일의 `active_theme` 값을 변경하는 PR을 생성합니다.

#### 보안관 (인증): Cloudflare Workers

* Admin 페이지의 GitHub 로그인은 민감한 `Client Secret` 키를 필요로 합니다.
* 이 키를 브라우저에 노출하는 대신, Cloudflare Worker(`cloudflare_worker_endpoint`)가 중간에서 OAuth 인증 코드를 받아 Access Token으로 교환해주는 **안전한 프록시 서버** 역할을 합니다.

#### 관리자실: 정적 Admin UI

* `/admin/` 경로는 React나 Vue 같은 프레임워크 없이 순수 HTML/CSS/JS로만 제작된 정적 관리 페이지입니다.
* GitHub API, Cloudflare Worker, n8n Webhook을 호출하여 마치 동적 CMS처럼 작동합니다.

#### 광장 (소통): Giscus

* 포스트 하단의 댓글 기능은 GitHub 리포지토리의 **Discussions** 기능과 연동된 **Giscus**를 사용합니다.
* 방문자들은 GitHub 계정으로 로그인하여 댓글을 달고, 모든 기록은 리포지토리에 투명하게 저장됩니다.

#### 수익 및 상호작용

* **수익화:** `_layouts` 파일 곳곳에 **Google AdSense** 슬롯을 배치하여 광고 수익을 창출할 수 있도록 설계되었습니다.
* **좋아요:** **Cloudflare Workers와 KV Store**를 연동한 커스텀 API 엔드포인트(`like_api_endpoint`)를 통해 정적 사이트에서도 '좋아요' 수를 집계하고 표시합니다.

### 3. 여정: 순탄하지만은 않았던 실험

이 시스템을 구축하는 과정은 수많은 오류와의 싸움이었습니다.

* Jekyll 빌드 시 `theme: null` 설정과 플러그인 의존성 충돌로 인해 CSS/JS가 로드되지 않는 문제 (`Liquid Exception: No repo name found` 등).
* 손상된 `lunr.min.js` 파일로 인한 연쇄적인 JavaScript 오류.
* `admin.js`의 사소한 오타(`'m'`) 하나로 Admin 페이지 전체가 마비되었던 경험.
* GitHub OAuth Callback URL의 마지막 슬래시(`/`) 하나 차이로 404 오류가 발생했던 문제.

이 모든 문제 해결 과정이 바로 GOFUNWITH가 추구하는 '도전과 실험'의 증거입니다.

### 4. 다음은?

이제 이 블로그라는 '도구'가 완성되었습니다. 앞으로 이 도구를 활용하여 기술, DIY, 자동화, 그리고 삶의 다양한 '재미있는 실험'들을 기록하고 공유(Share)할 것입니다.

이 블로그의 구축 과정이 궁금하시다면, 댓글(Giscus)로 질문을 남겨주세요!

**Explore. Create. Share.**
