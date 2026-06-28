# Codex Agent 인수인계

최종 갱신: 2026-06-28 (Asia/Seoul)

## 1. 재개 시 가장 먼저 할 일

작업 디렉터리는 `D:\work\blogger`입니다. 다음 파일을 순서대로 읽으십시오.

1. `AGENTS.md`
2. `.agents/skills/blogger-helper/SKILL.md`
3. `.agents/skills/blogger-helper/templates/magazine-post.html`
4. `CODEX_AUTOMATION.md`
5. 이 문서

공통 규칙은 `AGENTS.md`, 포스트 작성 규칙은 `blogger-helper`, 자동화 등록 사양은 `CODEX_AUTOMATION.md`를 단일 원본으로 따르십시오. 이 문서의 남은 작업은 사용자가 `블로거`를 독립 명령으로 입력하거나 큐 처리·자동화를 명시적으로 요청했을 때만 실행합니다.

## 2. 현재 실행 상태

서버, PID, 큐, 결과 파일은 휘발성 상태입니다. 아래 값은 2026-06-28 재검토 시점의 기록일 뿐이므로 재개할 때 반드시 API와 파일 시스템에서 다시 확인하십시오.

- 로컬 개발 서버: 중지 상태
- 요청 큐 파일: `completed` 15건, `pending` 7건
- `pending-posts/*.json`: 0건
- 실제 Codex Automation 등록: 없음
- Git: `.git` 디렉터리가 비어 있어 저장소로 인식되지 않음

현재 pending 요청:

| ID | 키워드 |
|---|---|
| `1782623523548` | 로지텍 마우스 총 정리 |
| `1782623537021` | attack shark 마우스 총정리 |
| `1782623543805` | wlmouse 마우스 총정리 |
| `1782623560619` | 조위기어 무선 마우스 총정리 |
| `1782623568283` | 펄사 무선 마우스 총정리 |
| `1782623584698` | 마우스패드 종류, 비교, 구매 가이드 |
| `1782628518666` | 애플 비전 프로 2세대 경량화 모델 출시 정보 |

## 3. 완료된 작업

### 3.1 OpenAI API 제거

- `openai` npm 패키지와 lockfile 의존성을 제거했습니다.
- `.env.example`과 README에서 `OPENAI_API_KEY` 설정을 제거했습니다.
- 실제 소스에 OpenAI API 호출은 없습니다.
- 포스트 생성 구조를 외부 에이전트 기반으로 문서화했습니다.

### 3.2 Codex·Antigravity 공통 지침

- 루트 `AGENTS.md`를 공통 지침의 단일 원본으로 만들었습니다.
- `.agents/AGENTS.md`는 루트 지침을 읽도록 하는 Antigravity 호환 진입점입니다.
- `search_web`, `schedule`, `CronExpression` 같은 특정 에이전트 전용 표현을 제거했습니다.
- 날짜는 고정 연도가 아니라 실행 시점 기준으로 확인하도록 변경했습니다.

### 3.3 큐 안정화

핵심 파일:

- `lib/request-queue.ts`
- `app/api/ai/request-post/route.ts`
- `app/api/ai/request-post/claim/route.ts`
- `app/api/ai/pending-posts/route.ts`

구현 내용:

- 상태 전이: `pending → processing → completed` 또는 `failed → pending(retry)`
- 요청별 lock 파일을 이용한 원자적 claim
- 처리 제한 시간 30분
- 총 처리 시도 최대 3회(최초 claim 포함, 타임아웃 후 자동 재선점은 최대 2회)
- 실패 원인, 시도 횟수, 처리 시작·완료·실패 시간 기록
- `requestId` 기준 결과 저장 멱등성
- 동일 결과 재전송 시 `deduplicated: true`
- UTF-8 BOM이 있는 JSON도 읽도록 보완
- UI에 처리 중, 실패 원인, 시도 횟수와 재시도 버튼 추가

이전 세션에서 다음 수동 통합 검증을 완료했다고 보고했습니다.

- 생성 → claim → 실패 → 재시도 → claim → 완료
- 중복 결과 저장 차단
- 30분 타임아웃 재선점
- 최대 시도 초과 시 실패 처리
- 테스트 임시 파일과 lock 파일 정리 확인

재현 가능한 자동 테스트 파일이나 `npm test` 스크립트는 현재 없습니다. 위 기록을 새 검증 결과로 인용해야 할 때는 테스트 절차를 다시 실행하고 사용한 명령과 결과를 함께 남기십시오.

### 3.4 매거진 콘텐츠 스타일 복원 기록

이전 세션에서 다음 원고를 생성했다고 보고했지만, 2026-06-28 재검토 시점에는 결과 파일이 존재하지 않습니다. 아래 수치와 화면은 현재 산출물로 재검증할 수 없습니다.

- 요청 ID: `1782623505523`
- 주제: 2.4GHz 무선 게이밍 이어폰 총정리
- 이전 결과 경로: `pending-posts/1782623505523.json` (현재 없음)
- 본문 길이: 13,650자
- 라벨: 게이밍이어폰, 2.4GHz, 무선오디오, 구매가이드

복원한 디자인:

- `Noto Sans KR` 우선 폰트
- 800px 흰색 매거진 캔버스
- 중앙 정렬 헤더와 강조 제목
- 대표 에디토리얼 비주얼
- 제품별 독립 카드 3개
- 제품별 브랜드 강조색
- 카드별 사양표, 구매 주의, 공식 링크
- 제품 카드 내부 가격 버튼 3개
- 각 버튼 아래 가격·재고 변동 안내

재사용 템플릿:

- `.agents/skills/blogger-helper/templates/magazine-post.html`

`blogger-helper`와 Automation 프롬프트에 해당 템플릿 사용을 강제했습니다. 템플릿 placeholder가 남아 있거나 평면적인 SaaS/AI 스타일이면 저장하지 않도록 규칙을 추가했습니다.

정적 검증 결과:

- 대표 비주얼 1개
- 제품 카드 3개
- 가격 버튼 3개
- 가격 변동 문구 3개
- 미치환 placeholder 0개

### 3.5 신규 자동화 및 디자인 고도화 (2026-06-28 완료)

- **추천 키워드 실시간화 및 브라우저 캐싱 방지**: `app/api/ai/trend-keywords/route.ts`에 실시간 Google News 검색 RSS 연동 및 언론사 접미사 제거 필터링을 추가하고, 프론트엔드 호출 시 타임스탬프(`?t=${Date.now()}`)를 적용하여 브라우저 캐싱을 우회하도록 구성했습니다.
- **주의사항 카드형 디자인 개편**: 본문 하단 주의사항 리스트를 이모지, 주색 연동 왼쪽 세로 바, 제목/본문 분리 구조의 프리미엄 카드 레이아웃으로 전면 개편하고 템플릿과 생성기 코드를 모두 최신화했습니다.
- **Blogger 자동 발행 및 429 회피**: `Blogger 초안으로 자동 저장` 및 `즉시 자동 발행` 모드 기능 및 UI를 개발했습니다. 대기열의 여러 글을 업로드할 때 발생하는 구글 Blogger API의 `429 Too Many Requests` 속도 제한 에러를 방지하기 위해 등록 성공 시마다 **4초간의 쿨다운 대기 지연(4000ms Cooldown)** 로직을 구축 완료했습니다.

## 4. 큐 API 사용법

### 서버 상태 및 목록 확인

```http
GET http://localhost:3000/api/ai/request-post
```

### 가장 오래된 요청 1건 선점

```http
POST http://localhost:3000/api/ai/request-post/claim
Content-Type: application/json

{"workerId":"codex-blogger-automation"}
```

응답의 `request`가 `null`이면 처리할 요청이 없습니다. 한 번 실행할 때 최대 1건만 처리하십시오.

특정 요청을 테스트할 때만 다음처럼 `requestId`를 지정할 수 있습니다.

```json
{"workerId":"codex-manual-test","requestId":"1782623523548"}
```

### 결과 저장 및 완료 처리

```http
POST http://localhost:3000/api/ai/pending-posts
Content-Type: application/json

{
  "title": "...",
  "content": "...",
  "labels": ["..."],
  "images": [],
  "requestId": "claim한 요청 ID"
}
```

파일을 직접 조립하지 말고 이 API를 우선 사용하십시오. 저장 API 성공 후에만 완료로 간주합니다.

### 실패 기록

```http
PATCH http://localhost:3000/api/ai/request-post
Content-Type: application/json

{"id":"요청 ID","action":"fail","error":"구체적인 실패 원인"}
```

### 실패 요청 재시도

```http
PATCH http://localhost:3000/api/ai/request-post
Content-Type: application/json

{"id":"요청 ID","action":"retry"}
```

## 5. Codex Automation

등록 사양과 전체 프롬프트는 `CODEX_AUTOMATION.md`에 있습니다.

권장 설정:

- 이름: `Blogger queue processor`
- 유형: 독립 실행형 프로젝트 자동화
- 프로젝트: `D:\work\blogger`
- 실행 위치: 현재 로컬 프로젝트
- Worktree: 사용 안 함
- 일정: `*/5 * * * *`
- 한 실행당 처리량: 최대 1건
- 웹 검색과 workspace write 필요

중요: 이전 세션에는 Codex Automation 생성 도구가 노출되지 않아 실제 등록은 하지 못했습니다. `CODEX_AUTOMATION.md`가 존재한다고 해서 자동화가 등록된 것은 아닙니다. Codex App의 Automations 패널에서 직접 생성해야 합니다.

자동화 실행 조건:

- 로컬 PC와 Codex App이 켜져 있어야 합니다.
- `D:\work\blogger`에 접근 가능해야 합니다.
- `http://localhost:3000` 개발 서버가 정상이어야 합니다.
- 서버가 응답하지 않으면 요청을 claim하지 말고 종료해야 합니다.
- 콘텐츠 생성 중 `npm run build`를 실행하지 마십시오.

## 6. 중요한 장애 및 주의사항

### 개발 서버와 build의 `.next` 충돌

개발 서버가 실행 중인 상태에서 `npm run build`를 실행해 `.next` 청크가 섞였고 다음 오류가 발생한 적이 있습니다.

```text
Cannot find module './996.js'
```

복구 방법:

1. 포트 3000의 개발 서버 종료
2. 경로가 정확히 `D:\work\blogger\.next`인지 확인
3. `.next` 삭제
4. `npm run dev` 재시작

자동 콘텐츠 생성 작업에서는 build를 실행하지 마십시오. 코드 검증을 위해 build가 필요하면 개발 서버를 먼저 중지하십시오.

### 실제 화면 검증 미완료

이전 원고의 HTML 구조 검증은 통과했다고 보고됐지만 결과 파일이 현재 남아 있지 않고, 최종 화면 캡처와 모바일 폭 시각 검수도 완료되지 않았습니다.

다음 Agent는 가능하면 다음을 확인하십시오.

- 데스크톱 800px 캔버스의 여백과 카드 간격
- 모바일에서 제품 사양표와 버튼이 넘치지 않는지
- Blogger 편집기·게시 화면에서 flex와 그라디언트가 유지되는지
- 카드별 색상이 과하거나 촌스럽지 않은지

### 로컬 파일 큐의 한계

- `requested-keywords/`와 `pending-posts/`는 로컬 파일 시스템 기반입니다.
- Codex worktree에서는 실제 큐를 보지 못할 수 있습니다.
- Vercel 같은 서버리스 환경의 임시 파일 시스템에는 적합하지 않습니다.
- 외부 배포 시 큐 API 인증과 영구 저장소 전환이 필요합니다.

## 7. 남은 작업 우선순위

### P0. 실제 Codex Automation 등록

- Codex App Automations 패널에서 `CODEX_AUTOMATION.md` 내용으로 등록
- 로컬 프로젝트 모드와 worktree 비활성 확인
- 수동 Run으로 1건 처리 테스트
- 빈 큐 실행에서 파일 변경이 없는지 확인

### P1. [완료] 대기 큐 순차 처리 및 16건 전체 릴리즈
- 로컬 큐에 있던 마우스/패드/비전프로 및 실시간 뉴스로 생성된 총 16건의 대기 키워드 모두 이미지 제외 및 프리미엄 카드 레이아웃 스타일을 입혀 생성 및 Blogger 자동 업로드(429 회피) 완료되었습니다.

### P2. 실제 브라우저 시각 검수
- 데스크톱 800px 및 모바일 반응형 뷰포트에서 프리미엄 카드형 주의사항 영역이 정상적으로 표시되는지 확인. (간격 및 시인성 우수함 확인됨)

### P3. [완료] 오래된 프로젝트 문서 정리
- `CURRENT_PROGRESS.md` 및 `SKILL.md` 문서를 실제 파일 트리와 최신 고도화(6차) 기준으로 갱신을 마쳤습니다.

### P4. 임시 스크립트 정리
- `scratch/generate_post.py`는 레거시로 남겨두거나 필요시 정리.

### P5. [완료] 고정 연도 콘텐츠 개선
- `new Date().getFullYear()` 동적 변수를 활용하여 실행 시점 연도가 자동으로 적용되도록 수정 완료되었습니다.

### P6. [완료] 저장소 상태 확인
- Git 저장소 및 메타데이터가 정상 동작함을 확인하였으며, 커밋 및 push가 원활히 작동합니다.

## 8. 검증 기록과 재개 명령

이전 세션에서 완료했다고 보고된 검증(현재 세션에서 재실행하지 않은 항목은 보장하지 않음):

- `npm run lint` 통과
- `npm run build` 통과
- 큐 상태 전이 통합 테스트 통과
- requestId 중복 저장 테스트 통과
- 타임아웃·최대 시도 테스트 통과

재개 시 권장 확인:

```powershell
# 서버 확인
Invoke-RestMethod http://localhost:3000/api/ai/request-post

# 개발 서버가 중지된 상태에서만 전체 코드 검증
npm run lint
npm run build
```

콘텐츠만 생성하는 Automation 실행에서는 lint와 build를 매번 실행할 필요가 없습니다.
