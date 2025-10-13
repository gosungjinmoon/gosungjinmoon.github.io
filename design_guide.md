# GOFUNWITH Design & Theme Guidelines (v1.0)
> For: blog.gofunwith.com  
> Author: CI & Design Team  
> Updated: 2025-10-13  
> Focus: Mobile-first, Bilingual (KR/EN), Thematic Extensibility

---

## 🎯 Brand Identity
**Brand:** GOFUNWITH  
**Motto:** Explore · Create · Share  
**Tone:** Modern, Human, Curious, Global  
**Target:** Tech·DIY·Life·Travel creators sharing insight in KR/EN.

---

## 🧩 Core Design Principles
1. **모바일 퍼스트 (Mobile-first)**  
   - 390–768px 중심으로 가독성, 터치영역, 카드 간격 우선 설계  
2. **글로벌 확장성 (Bilingual Readability)**  
   - 한국어+영어 혼합 콘텐츠의 줄 간격, 자간 균형  
   - Pretendard + Inter 조합 (locale별 fallback 자동화)
3. **테마 유연성 (Thematic Modularity)**  
   - 색상/폰트/간격은 모두 CSS Variable 기반  
   - 신규 테마(`theme-light`, `theme-dark`, `theme-sand`, `theme-forest`) 클래스 교체만으로 변경  
4. **심플한 콘텐츠 중심 구조**  
   - 헤더 최소화, 본문 여백 확대, 서브 네비와 태그 강조  
5. **글로벌 블로그 트렌드 반영**  
   - Ghost, Medium, Substack 스타일 혼합  
   - Flat한 컬러, 가벼운 그림자, 대형 타이포 중심

---

## 🎨 Color Tokens
| Token | HEX | Description |
|-------|------|-------------|
| `--color-bg` | `#FAFAFA` | 기본 배경 |
| `--color-fg` | `#1E2A3A` | 본문 텍스트 |
| `--color-accent` | `#FF7B54` | CTA 및 하이라이트 |
| `--color-muted` | `#A0A7AF` | 서브텍스트 |
| `--color-card` | `#FFFFFF` | 카드형 배경 |
| `--color-border` | `#E5E7EB` | 섹션 구분선 |

**Dark Theme 변환**  
- `--color-bg: #0F141A`  
- `--color-fg: #F3F4F6`  
- `--color-card: #1E2A3A`

**확장 테마 예시**  
- `theme-sand`: 베이지 + 그린 (캠핑/라이프 감성)  
- `theme-forest`: 다크그린 + 아이보리 (자연, DIY 감성)

---

## 🔠 Typography
| Type | Font | Size | Line Height | Weight |
|------|------|------|--------------|---------|
| Heading | Poppins / Pretendard | clamp(1.8rem, 2.5vw, 2.8rem) | 1.2 | 700 |
| Subheading | Outfit / Pretendard | 1.4rem | 1.3 | 600 |
| Body | Inter / Pretendard | 1rem | 1.7 | 400–500 |
| Meta | Inter | 0.875rem | 1.5 | 400 |

> ✅ 영어는 Inter, 한글은 Pretendard로 렌더링  
> ✅ `lang="en"` 속성 시 자동 폰트 스위칭 지원

---

## 📱 Responsive Layout
- 모바일(≤768px): 1단 카드형, 16px 패딩  
- 태블릿(768–1024px): 2단 리스트, 24px 패딩  
- 데스크톱(≥1024px): 3단 카드형 + 사이드바  
- 헤더·GNB는 sticky, 56px 이하 유지  
- 푸터는 SNS·저작권·테마 토글 포함

---

## 🧠 Content Design
- 대표 이미지: 16:9, radius 12px  
- 본문 폭: 70–80ch  
- 코드 블록, 수식, 이미지 캡션 스타일 일관  
- 다국어 번역 섹션(`.translation`)은 얇은 border-top으로 구분  
- 포스트 끝 CTA: “더 보기 / Subscribe / 댓글 남기기” 블록 포함

---

## 🌈 Theme Management
- 모든 색상과 폰트는 `:root` 변수로 선언  
- 테마 전환 시 body에 `.theme-xxx` 클래스 변경  
- 다크모드 자동 감지 + 수동 토글 병행  
- 새 테마 추가 시 `themes/` 디렉토리 하위에 partial CSS 추가

---

## 💬 Language Handling
- HTML 태그에 `lang="ko"` / `lang="en"` 자동 감지  
- i18n 지원을 위해 구조:
  ```html
  <section class="post">
    <p lang="ko">기술로 인생을 즐겁게 만드는 법.</p>
    <p lang="en">How to make life fun with technology.</p>
  </section>