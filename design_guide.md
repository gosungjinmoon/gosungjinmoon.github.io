# 🎨 **GOFUNWITH 디자인 가이드**

이 가이드는 **GOFUNWITH** 브랜드의 시각적 정체성을 정의하고, 블로그의 방향성에 맞는 일관된 사용자 경험(UX)과 사용자 인터페이스(UI)를 구축하기 위한 핵심 기준을 제공합니다. 이 문서는 신규 UI/UX 디자이너 및 개발자를 위한 공식 가이드입니다.

-----

## 1️⃣ 브랜드 개요

GOFUNWITH의 핵심 철학을 정의합니다. 모든 디자인 결정은 이 가치를 기반으로 합니다.

| 항목 | 내용 |
| :--- | :--- |
| **사이트명** | **GOFUNWITH** |
| **슬로건 (Slogan)** | *Explore. Create. Share.* |
| **브랜드 핵심 가치** | 즐겁게 탐험하고, 창조하고, 나누는 여정 |
| **브랜드 의미** | **“Go have fun with tech, tools, and life.”**<br>기술, 도구, 창작, 캠핑, DIY, 생활 실험 등 다양한 영역에서 \*\*'경험 중심'\*\*과 \*\*'즐거운 실험'\*\*을 탐험하는 브랜드입니다. '여정(Journey)' 그 자체의 즐거움을 강조합니다. |
| **핵심 컨셉** | "유쾌한 호기심으로 시작하는 즐거운 탐험과 창조의 빛" |
| **표현 방향성** | 따뜻하지만 세련된, 감성적이지만 기능적인 **“Fun-Tech Minimalism”** |

-----

## 2️⃣ 핵심 디자인 원칙

모든 UI/UX 디자인 시 반드시 준수해야 할 4가지 원칙입니다.

1.  **모바일 퍼스트 (Mobile-First)**

      * 모든 디자인은 390px (Mobile S) 해상도를 기준으로 시작하며, 768px 이상(태블릿, 데스크톱)으로 확장합니다.
      * 가독성, 터치 영역(최소 44x44px), 카드 간격을 최우선으로 설계합니다.

2.  **테마 유연성 (Thematic Modularity)**

      * 블로그는 'Tech', 'DIY', 'Camping' 등 다양한 주제를 다룹니다. 디자인 시스템은 CSS 변수(`:root`)를 기반으로 합니다.
      * `theme-typo` (기본), `theme-symbol` (모던/테크)을 기본으로 하며, `theme-forest` (캠핑/감성) 등 추가 테마로 쉽게 확장할 수 있어야 합니다.

3.  **글로벌 가독성 (Bilingual Readability)**

      * 한국어와 영어가 혼용되는 환경을 고려합니다.
      * **국문**은 **Pretendard**, **영문**은 **Inter** 또는 각 테마 폰트(Poppins, Space Grotesk)를 기본으로 하여, `lang` 속성에 따라 명확한 글꼴 스택을 제공해야 합니다.

4.  **콘텐츠 중심 구조 (Content-First)**

      * 사용자의 시선이 콘텐츠에 집중되도록 합니다.
      * 헤더는 최소화하고, 본문 폭은 가독성이 가장 높은 **70-80ch** (약 650\~800px)로 유지합니다.
      * 불필요한 장식을 배제하고 여백을 충분히 활용합니다.

-----

## 3️⃣ 로고 시스템

GOFUNWITH의 로고는 블로그의 테마와 성격에 따라 두 가지 유형으로 구성됩니다.

|  명칭 | 설명 | 사용처 |
|  :--- | :--- | :--- |
|  **Typo Refined (gofunwith.)** | 브랜드의 친근함과 즐거움을 담은 워드마크 중심형 로고 | 블로그 기본, 감성/라이프 주제 |
|  **Cube Modern (GFW Cube)** | 창조적 구조와 실험적 정신을 담은 입체형 심볼 로고 | 테크/DIY 주제, 모던 테마 |

-----

## 4️⃣ Typo 로고 — “gofunwith.”

### 💡 로고 철학

‘gofunwith.’ 로고는 **탐험과 창의성의 출발점**을 상징합니다. 워드마크 위의 **노란 빛 세 줄**은 ‘새로운 아이디어가 떠오르는 순간’과 '즐거움의 빛'을 의미합니다.

### 🧩 구성 요소

| 요소 | 설명 |
| :--- | :--- |
| **워드마크** | 전체 소문자 형태(`gofunwith.`)로 부드럽고 친근한 인상 |
| **폰트** | 둥근 산세리프 — **Poppins Rounded (권장)**, *Nunito*, *Quicksand* |
| **심볼(빛)** | 워드마크 위의 짧은 3줄의 옐로우 레이(Ray) — 영감과 아이디어의 순간 |
| **슬로건** | *Explore. Create. Share.* (얇은 폰트로 하단 중앙 정렬) |

### 🎨 컬러 팔레트

| 용도 | HEX 코드 | 의미 |
| :--- | :--- | :--- |
| **Primary (Text)** | `#1E2A3A` | 신뢰감 있는 네이비, 전문성과 깊이 |
| **Accent (Symbol)** | `#FFC53D` | 아이디어의 빛, 즐거움, 창조의 에너지 |
| **Background (Light)** | `#FFFFFF` | 깨끗함, 개방성 |
| **Background (Dark)** | `#1A3258` | 야간, 깊이 있는 톤앤매너 (다크모드 배경) |

### 📐 사용 규칙

  * 로고 최소 높이: **24px 이상**
  * Clear Space: **로고 높이의 0.5배 이상**
  * 로고의 비율, 색상, 구성을 임의로 변경하거나 회전, 왜곡, 그림자 추가를 금지합니다.
  * 어두운 배경(`Background (Dark)`)에는 **화이트 워드마크 + 옐로우 심볼** 조합을 사용합니다.

### 💻 웹 스타일시트 (Typo Ver.)

```css
:root {
  --color-bg: #FFFFFF;
  --color-fg: #1E2A3A; /* 'fg'는 'foreground'로 본문 텍스트 의미 */
  --color-accent: #FFC53D;
  --color-muted: #A0A7AF; /* 부가 텍스트 */
  --color-card: #FFFFFF;
  --color-border: #E5E7EB;

  /* 다크 모드 시 재정의 */
  --dark-bg: #1A3258;
  --dark-fg: #F3F4F6;
  --dark-card: #1E2A3A;
}

body.theme-typo {
  background-color: var(--color-bg);
  color: var(--color-fg);
  /* 국문 Pretendard, 영문 및 로고 Poppins */
  font-family: 'Poppins Rounded', 'Pretendard', sans-serif;
}

button.primary {
  background: var(--color-accent);
  color: var(--color-fg);
  /* ... */
}
```

-----

## 5️⃣ Symbol 로고 — “GFW Cube”

### 💡 로고 철학

입체형 **GFW Cube**는 GOFUNWITH의 ‘도전과 창의적 구조’, '기술적 실험'을 시각화한 형태입니다. G, F, W는 **탐험(Go), 창조(Fun), 공유(With)** 의 세 가치가 맞물린다는 의미를 담습니다.

### 🧩 구성 요소

| 요소 | 설명 |
| :--- | :--- |
| **심볼 구조** | G, F, W를 30° 등각 투시로 결합한 육각 큐브형 (내부 선 균일화) |
| **워드마크** | 대문자 **GOFUNWITH**, 폰트: **Space Grotesk SemiBold** |
| **슬로건** | *Explore. Create. Share.* (Space Grotesk Regular, 하단 중앙 정렬) |

### 🎨 컬러 팔레트

| 용도 | HEX 코드 | 의미 |
| :--- | :--- | :--- |
| **Primary (Symbol/Text)** | `#20705A` | 신뢰감, 안정성, 기술적 감성 (Tech/DIY) |
| **Secondary (텍스트)** | `#1B3326` | 깊이와 명확성 |
| **Background** | `#FAF7F1` | 자연 친화, 감성적 베이지 (캠핑/라이프) |
| **Accent (보조)** | `#DDE3DB` | 중립적 톤, 배경용 |

### 📐 사용 규칙

  * 심볼 단독 사용 가능 (예: 파비콘, 앱 아이콘 / 정사각 1:1 비율)
  * 최소 크기: 32px 이상 (디테일 유지를 위해)
  * 색상 변경을 금지하며, 지정된 팔레트 내에서만 사용합니다.
  * 로고 주위 여백: 로고 높이의 0.75배
  * **[중요]** 큐브 내부의 글자(G, F, W)는 큐브의 **라인과 겹치지 않도록** 충분한 여백을 두어 배치합니다.

### 💻 웹 스타일시트 (Symbol Ver.)

```css
:root {
  --color-bg: #FAF7F1;
  --color-fg: #1B3326;
  --color-accent: #20705A;
  --color-muted: #5a7065;
  --color-card: #FFFFFF;
  --color-border: #DDE3DB;
}

body.theme-symbol {
  background: var(--color-bg);
  color: var(--color-fg);
  /* 국문 Pretendard, 영문 및 로고 Space Grotesk */
  font-family: 'Space Grotesk', 'Pretendard', sans-serif;
}

a {
  color: var(--color-accent);
  /* ... */
}
```

-----

## 6️⃣ UI/UX & 컴포넌트 가이드

로고 외 블로그 전체의 일관성을 유지하기 위한 핵심 UI/UX 지침입니다.

### 🧱 레이아웃 (Layout)

| 구분 | 모바일 (≤ 768px) | 데스크톱 (≥ 1024px) |
| :--- | :--- | :--- |
| **그리드** | 1단 컬럼, 카드형 리스트 | 3단 카드형 (콘텐츠 2 / 사이드바 1) |
| **패딩** | 16px (좌우) | 24px (좌우) |
| **본문 폭** | 100% | 최대 **70-80ch** (약 800px) |
| **헤더** | 높이 56px 이하, **Sticky** (스크롤 시 고정) | 높이 64px 이하, **Sticky** |

### 🧩 컴포넌트 (Components)

  * **카드 (Cards)**

      * 블로그 포스트, 카테고리 등 콘텐츠의 기본 단위입니다.
      * 대표 이미지는 **16:9 비율**을 유지합니다.
      * 모서리 둥글기(Border-radius)는 **12px**를 적용하여 부드러운 인상을 줍니다.
      * 배경은 `var(--color-card)`를 사용합니다.

  * **버튼 (Buttons)**

      * **Primary (주요):** `var(--color-accent)`를 배경색으로 사용합니다. (예: 구독하기, 중요 CTA)
      * **Secondary (보조):** 테두리(Outline) 또는 `var(--color-muted)`를 사용합니다. (예: 태그, 더보기)
      * 모든 버튼은 명확한 `hover`, `active` 상태를 가져야 합니다.

  * **이미지 (Images)**

      * **톤앤매너:** 로고의 톤과 일치하는 **차분하고 선명한 색감**의 고품질 이미지를 사용합니다.
      * **주제:** '탐험', '창조', '즐거움', '기술', '자연'의 가치를 반영해야 합니다.
      * **접근성:** 모든 이미지는 SEO와 접근성을 위해 명확한 `alt` 태그를 포함해야 합니다.

  * **코드 블록 (Code Blocks)**

      * Tech 블로그의 핵심 요소입니다. `var(--dark-card)` 또는 `var(--color-border)`와 같이 본문과 명확히 구분되는 배경색을 사용합니다.
      * `Fira Code` 또는 `JetBrains Mono` 등 가독성 높은 고정폭 글꼴을 사용합니다.

-----

## 7️⃣ 파일 관리 및 형식

| 파일형식 | 용도 |
| :--- | :--- |
| **SVG** | **(권장)** 벡터 기반. 반응형 웹, 모바일, 다크모드 대응. 로고의 기본 형식. |
| **PNG (1024x1024)** | 앱 아이콘, SNS 프로필, 썸네일 등 비-벡터 환경 |
| **ICO / SVG Favicon** | 브라우저 탭, 북마크용 (Symbol 로고의 큐브 단독 사용 권장) |

**저장 규칙**

```
/assets/logo/
  ├── logo-typo-light.svg  (밝은 배경용)
  ├── logo-typo-dark.svg   (어두운 배경용)
  ├── logo-symbol-light.svg
  ├── logo-symbol-dark.svg
  ├── favicon.svg          (Symbol 큐브)
```
