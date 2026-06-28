# Blogger 자동 포스팅 관리자 — 작업 정리 (Project Summary)

## 프로젝트 개요

Next.js 15 App Router 기반의 **Google Blogger 자동 포스팅 관리자**입니다.
Google OAuth로 로그인한 뒤 Blogger 블로그 목록을 조회하고, HTML 본문을 초안 저장하거나 즉시 발행할 수 있습니다. 포스트 생성 요청은 로컬 큐를 통해 외부 Codex 에이전트에 전달하며 웹앱은 OpenAI API를 직접 호출하지 않습니다.

---

## 구현 완료 기능

### 1. Google OAuth 로그인
- NextAuth `GoogleProvider` 사용하며 Blogger 권한 scope 포함.
- access token과 refresh token을 NextAuth JWT에 저장하여 관리.

### 2. Blogger API 연동
- 로그인 계정의 Blogger 블로그 목록 조회 및 선택.
- 제목, HTML 본문, 라벨 입력 후 초안 저장 / 즉시 발행 가능.
- `googleapis`의 `Premature close` 문제로 fetch 기반 REST 호출로 구현.

### 3. 에이전트 SEO 초안 생성
- Codex 같은 외부 에이전트가 대기 요청을 조사하고 원고를 생성.
- 생성 결과를 대기 글 API에 저장한 뒤 Blogger 작성 폼에서 불러옴.

### 4. RSS 글감 수집
- 서버에서 카테고리별 RSS 피드 수집 및 추출.

### 5. Research 수집 (실제 정보 기반 후보)
- 직접 키워드 입력 시 AI의 가짜 정보 생성(Hallucination)을 막기 위한 백엔드 파이프라인.
- **RAWG 게임 DB 연동** 및 **LLM 엔티티 추출**을 병합하여 신뢰도 향상.

---

## AI 프롬프트 및 검증 정책

- **날짜 기준**: 실행 환경의 현재 날짜와 연도를 사용하고, 과거 연도를 현재 정보처럼 표현하지 않음.
- **실제 후보 강제**: `candidates.name`에 있는 항목만 추천 리스트 제목으로 사용.
- **추천형 글 조건**: 후보가 **최소 3개 이상** 수집되어야 작성 진행 가능.
- **placeholder 차단**: `게임 A`, `제품 B` 등의 표현이 결과에 포함되면 검증 실패 처리.
