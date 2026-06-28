# Blogger 자동 포스팅 관리자 — 프로젝트 가이드 (Project Guide)

본 문서는 **Google Blogger 자동 포스팅 관리자** 프로젝트의 구조, 설정, 아키텍처 및 상세 기능 사용법을 안내하는 가이드라인입니다.

---

## 1. 프로젝트 개요

Next.js 15 App Router 기반으로 구축된 **Google Blogger 자동 포스팅 관리자**는 사용자가 Google OAuth로 로그인하여 자신의 블로그를 선택하고, AI를 활용해 SEO 최적화된 블로그 글을 생성한 뒤, 블로그에 초안으로 저장하거나 즉시 발행할 수 있도록 돕는 웹 애플리케이션입니다.

단순한 AI 텍스트 생성을 넘어, **실제 정보(RSS 피드, 뉴스, RAWG 게임 DB)**를 시스템이 먼저 수집(Research)하고 이를 AI에게 주입함으로써 정보의 왜곡(Hallucination)과 임의의 Placeholder(예: 게임 A, 제품 B) 사용을 차단하도록 아키텍처가 설계되어 있습니다.

---

## 2. 시스템 아키텍처

본 애플리케이션은 크게 두 가지 포스팅 생성 흐름을 지원합니다.

### A. RSS 글감 수집 및 본문 추출 흐름
1. **RSS 수집**: 사용자가 선택한 카테고리(IT, 게임 등)의 Google News RSS 및 주요 IT RSS 피드를 서버가 조회합니다.
2. **원문 추출**: 사용자가 특정 글감을 선택하면, 서버가 해당 URL의 HTML을 가져와 `@mozilla/readability`와 `JSDOM`을 통해 광고/네비게이션이 제거된 본문 텍스트만 추출합니다.
3. **에이전트 초안 생성**: 외부 Codex 에이전트가 검증된 자료를 바탕으로 지정된 톤과 글자 수에 맞춰 SEO 최적화 포스트를 생성하고 대기 글 API에 저장합니다.

### B. 직접 키워드 입력 및 Research 파이프라인 흐름
1. **키워드 파싱**: 입력된 키워드에서 플랫폼(닌텐도, PS5 등) 및 장르(RPG, 액션 등)를 분석합니다 (`lib/keyword-parser.ts`).
2. **사실 정보 수집 (Research)**:
   - **게임 키워드**: RAWG 게임 DB API를 통해 평점 높은 실제 출시/출시예정 게임 메타데이터(출시일, 장르, 평점, 요약 등)를 조회합니다.
   - **기타/뉴스**: Google News RSS를 검색하여 관련 기사 및 참고 자료를 수집합니다.
3. **후보군 보강 (LLM Entity Extraction)**: 수집된 뉴스 본문에서 실제 제품명/게임명을 추출하여 후보군이 3개 미만일 경우 추가 보강합니다.
4. **AI 초안 생성**: 수집 완료된 실제 후보(Candidates) 메타데이터와 참고 뉴스(References)를 프롬프트에 주입하여, AI가 실제 존재하는 대상만으로 추천 리스트를 작성하도록 강제합니다.

---

## 3. 디렉토리 구조

```text
D:/work/blogger/
├── .agents/
│   ├── AGENTS.md                 # 에이전트 행동 및 포스팅 생성 규칙
│   └── skills/
│       └── blogger-helper/       # 프로젝트 맞춤형 AI 스킬 폴더
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   ├── request-post/     # 에이전트 작업 요청 큐 API
│   │   │   └── pending-posts/    # 에이전트 생성 결과 저장 API
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth Google OAuth 인증 핸들러
│   │   ├── blogger/
│   │   │   ├── blogs/            # Google Blogger 블로그 목록 조회 API
│   │   │   └── posts/            # Blogger 글 등록(초안/발행) API
│   │   └── sources/
│   │       ├── article/          # URL 기준 기사 본문 추출 API
│   │       ├── research/         # 키워드 관련 실제 후보 및 참고 자료 수집 API
│   │       └── rss/              # 카테고리별 RSS 글감 수집 API
│   ├── globals.css               # Tailwind CSS 및 글로벌 스타일
│   ├── layout.tsx                # 레이아웃 구성
│   ├── page.tsx                  # 메인 대시보드 UI
│   └── providers.tsx             # NextAuth Session Provider 및 컨텍스트
```
