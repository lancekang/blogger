---
name: blogger-helper
description: Guides the agent on how to write SEO-optimized blog posts, perform current fact-checking for specs and prices, and understand the blog generation and research pipeline.
---

# Blogger 자동 포스팅 에이전트 가이드 (Blogger Helper Skill)

본 스킬은 **Google Blogger 자동 포스팅 관리자** 프로젝트에서 에이전트가 코드를 수정하고, 신규 기능을 개발하며, 블로그 포스트 초안을 작성 및 검수할 때 준수해야 하는 개발 및 콘텐츠 작성 가이드라인을 제공합니다.

---

## 1. 준수해야 할 핵심 규칙

### A. 실시간 정보 교차 검증 (Fact-Checking First)
* **실행 시점 기준 정보 수집**: 현재 날짜와 연도를 실행 환경에서 확인하고, 사용 가능한 웹 검색 또는 브라우저 기능으로 최신 스펙과 가격 정보를 먼저 확인하십시오. 특정 연도나 도구명에 의존해서는 안 됩니다.
* **스펙 검증**: IT 디바이스의 AP 칩셋 명칭, 디스플레이 주사율/밝기, 배터리 실측 용량(mAh) 등은 제조사 공식 발표 자료 기준으로 교차 검증해야 합니다.
* **가격 검증**: 정가 외에 다나와(Danawa) 및 국내 오픈마켓 실구매가 범위를 확인하고 예산(예: 100만 원대 가성비 노트북)에 부합하는 트림인지 검증하십시오.

### B. 콘텐츠 포맷팅 및 링크 안정성 규칙
* **분량 규격**: 생성하는 모든 포스트 원고는 최소 **3,000자 이상**의 잡지/매거진 스타일로 정교하게 작성해야 합니다.
* **안전한 다나와 링크**: 쇼핑 검색 링크 삽입 시, 깨질 우려가 있는 퍼센트 인코딩 대신 **한글 텍스트 쿼리 파라미터** 형태(`keyword=샤오미+패드+8+프로`)로 안전하게 작성합니다.
* **가격 변동 문구 필수화**: 쇼핑/가격 비교 링크 및 버튼 하단에는 다음과 같은 주의 문구를 이탤릭체 소형 폰트(11~12px)로 반드시 명기해야 합니다:
  > *※ 실시간 가격 비교 링크는 시장 상황 및 조회 시점에 따라 실제 판매 가격과 재고가 상이할 수 있습니다.*
* **다운로드 링크 제공**: 공식 홈페이지 또는 애플 App Store 및 구글 Play Store의 검증된 스토어 다운로드 고유 ID(예: `id1262985592`) 링크를 버튼 형태로 제공하여 사용성을 극대화하십시오.

---

## 2. 개발 시 기술적 수칙

1. **API Key 및 환경변수 보호**:
   - `RAWG_API_KEY`, `GEMINI_API_KEY` 등 비밀 키는 절대로 클라이언트 컴포넌트(`use client`)에 노출하거나 직접 하드코딩해서는 안 됩니다. 반드시 `process.env`를 통해 서버 컴포넌트나 API Route 내에서만 사용해야 합니다.
   - 이 프로젝트의 포스트 생성 흐름에서는 OpenAI API를 호출하거나 `OPENAI_API_KEY`를 요구하지 않습니다.
2. **Next.js 15 규칙 준수**:
   - Dynamic API(예: `headers()`, `cookies()`, `params`)는 반드시 비동기(`await`)로 처리해야 합니다.
   - 클라이언트 컴포넌트와 서버 컴포넌트의 경계를 확실히 구분하십시오.
3. **Connection Close 대응**:
   - Blogger API 호출 시 `googleapis` 라이브러리의 `Premature close` 에러 방지를 위해, fetch 기반의 REST API 호출 구조([lib/blogger.ts](../../../lib/blogger.ts) 방식)를 유지하십시오.

---

## 3. 관련 참조 문서 (References)

프로젝트 아키텍처 및 상세 사양이 필요할 경우 아래 문서를 참고하십시오.
- **프로젝트 상세 가이드**: [references/project_guide.md](references/project_guide.md)
- **전체 작업 이력 및 요약**: [references/project_summary.md](references/project_summary.md)
- **사실 기반 AI 초안 생성 파이프라인**: [references/real_data_ai_draft.md](references/real_data_ai_draft.md)

---

## 매거진 디자인 시스템

포스트 생성 전 [templates/magazine-post.html](templates/magazine-post.html)을 읽고 기본 골격으로 사용하십시오.

* `Noto Sans KR`을 첫 번째 폰트로 사용하고 800px 흰색 캔버스와 24px 좌우 패딩을 유지합니다.
* 헤더는 중앙 정렬하며 영문 키커, 32px 내외 제목, 덱 문장, 대표 비주얼 순으로 구성합니다.
* 흰색·연회색·검정을 기본으로 하고 공통 주색 1개와 제품별 강조색 1개만 사용합니다. 인디고 한 색으로 전체를 채우는 SaaS 템플릿형 디자인은 금지합니다.
* 각 제품은 `용도 배지 → 제품명 → 한 줄 평가 → 분석 → 사양표 → 구매 주의 → 공식 자료 → 가격 버튼` 순서의 독립 카드로 구성합니다.
* 가격 버튼은 각 제품 카드 안에 pill 형태로 배치하고 바로 아래에 가격·재고 변동 문구를 표시합니다.
* 헤더 아래에는 `{{IMAGE_0}}` 또는 주제를 설명하는 에디토리얼 비주얼 하나만 배치합니다.
* 평면적인 문서, 하나의 큰 비교표, 이모지 남용, 과한 그라디언트·네온·그림자, 하단에 몰아둔 쇼핑 버튼을 금지합니다.