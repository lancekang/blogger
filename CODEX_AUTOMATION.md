# Codex Automation 등록 사양

이 문서는 Codex App의 Automations 패널에 입력할 설정이다. 저장소에 이 파일을 추가하는 것만으로 자동화가 등록되지는 않는다.

## 기본 설정

- 이름: `Blogger queue processor`
- 유형: 독립 실행형 프로젝트 자동화
- 프로젝트: `D:\work\blogger`
- 실행 위치: 현재 로컬 프로젝트
- Worktree: 사용하지 않음
- 일정: `*/5 * * * *`
- 샌드박스: workspace write 및 웹 검색 허용
- 한 실행당 처리량: 최대 1건

로컬 PC와 Codex App이 실행 중이고 프로젝트 경로에 접근할 수 있어야 한다. `http://localhost:3000` 개발 서버도 실행 중이어야 한다.

## Automation Prompt

```text
$blogger-helper

D:\work\blogger의 현재 로컬 프로젝트에서만 작업한다. 별도 worktree를 만들거나 사용하지 않는다. 웹앱 내부에서 OpenAI API를 호출하지 않는다. 한 번 실행할 때 요청을 최대 1건만 처리한다.

1. http://localhost:3000/api/ai/request-post에 GET 요청을 보내 개발 서버가 정상인지 확인한다. 서버가 응답하지 않으면 요청을 claim하지 말고 서버 미실행 사실만 보고하고 종료한다.
2. POST http://localhost:3000/api/ai/request-post/claim에 {"workerId":"codex-blogger-automation"}을 전송한다.
3. 응답의 request가 null이면 파일을 변경하지 않고 "대기 요청 없음"으로 종료한다.
4. request가 있으면 id, keyword, attemptCount를 기록한다. 이 요청만 처리한다.
5. 실행 시점의 현재 날짜를 확인한다. 사용 가능한 웹 검색 또는 브라우저 기능으로 제조사 공식 자료를 우선 조사하고, 최신 스펙과 국내 가격을 교차 검증한다. 확인하지 못한 내용은 추정하지 않는다.
6. 원고 작성 전에 `.agents/skills/blogger-helper/templates/magazine-post.html`을 읽고 그 구조를 기본 골격으로 사용한다. 최소 3,000자 이상의 한국어 매거진 스타일 HTML을 작성하며, 중앙 정렬 헤더·대표 비주얼·제품별 독립 카드·용도별 선택 카드를 포함한다. 각 제품 카드 안에 해당 제품 가격 버튼과 변동 안내 문구를 배치한다. 템플릿 placeholder가 하나라도 남아 있거나 제품 카드를 평면 본문과 하나의 큰 비교표로 대체한 결과는 저장하지 않는다. 라벨은 중복 없이 3~5개만 만든다.
7. 쇼핑 링크는 안전한 한글 쿼리를 사용한다. 가격 비교 링크 아래에 11~12px 이탤릭체로 "※ 실시간 가격 비교 링크는 시장 상황 및 조회 시점에 따라 실제 판매 가격과 재고가 상이할 수 있습니다."를 넣는다.
8. POST http://localhost:3000/api/ai/pending-posts에 {title, content, labels, images, requestId} JSON을 전송한다. requestId에는 claim한 request.id를 반드시 사용한다.
9. 저장 API가 성공했을 때만 완료로 보고한다. 동일 requestId 결과가 이미 있어 deduplicated=true가 반환돼도 성공으로 처리한다.
10. claim 이후 실패하면 PATCH http://localhost:3000/api/ai/request-post에 {"id":request.id,"action":"fail","error":"구체적인 실패 원인"}을 전송한다. 실패 상태 기록까지 실패하면 요청 ID와 두 오류를 모두 보고한다.
11. 콘텐츠 생성 작업에서는 npm run build를 실행하지 않는다. 실행 중인 Next 개발 서버와 .next 산출물이 충돌할 수 있다.
```

## 등록 후 확인

1. 자동화를 저장하기 전에 프롬프트를 일반 Codex 스레드에서 한 번 테스트한다.
2. 첫 실행 결과에서 실행 위치가 `D:\work\blogger`인지 확인한다.
3. `requested-keywords` 요청 하나가 `pending → processing → completed`로 바뀌는지 확인한다.
4. 결과 파일 이름이 요청 ID와 같은지 확인한다.
5. 빈 큐 실행에서는 파일 변경이 없는지 확인한다.
