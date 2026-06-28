# Google Blogger 자동 포스팅 관리자

Next.js 15 App Router, NextAuth, Google Blogger API로 Blogger 글을 관리하고 초안 저장하거나 즉시 발행하는 관리자 웹앱입니다. 포스트 생성 요청은 로컬 큐에 저장되며 Codex 같은 외부 에이전트가 처리합니다.

## 기술 스택

- Next.js 15
- App Router
- TypeScript
- Tailwind CSS
- NextAuth
- Blogger REST API
- ESLint

## 설치

```bash
npm install
```

## 환경변수

`.env.example`을 참고해 `.env.local`을 생성합니다.

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
```

`NEXTAUTH_SECRET`은 다음 명령으로 생성할 수 있습니다.

```bash
openssl rand -base64 32
```

Windows PowerShell에서 OpenSSL이 없다면 다음 명령을 사용할 수 있습니다.

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Google Cloud 설정

1. Google Cloud Console에서 Blogger API를 활성화합니다.
2. OAuth 동의 화면을 구성합니다.
3. OAuth 2.0 Client ID와 Client Secret을 발급합니다.
4. 개발용 승인된 리디렉션 URI에 다음 값을 등록합니다.

```text
http://localhost:3000/api/auth/callback/google
```

5. 발급받은 값을 `.env.local`에 입력합니다.

## 포스트 생성 방식

웹앱은 OpenAI API를 직접 호출하지 않습니다. 사용자가 요청한 키워드는 `requested-keywords/` 큐에 저장됩니다. Codex 같은 외부 에이전트는 `/api/ai/request-post/claim`으로 요청을 선점하고 조사와 원고 작성을 수행한 뒤 `/api/ai/pending-posts`에 `requestId`와 함께 결과를 저장합니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 사용 방법

1. Google로 로그인합니다.
2. 로그인한 계정의 Blogger 블로그 목록에서 블로그를 선택합니다.
3. AI 글 생성 섹션에서 키워드, 카테고리, 글 톤, 목표 글자 수를 입력합니다.
4. `AI 초안 생성` 버튼을 누릅니다.
5. 생성된 제목, HTML 본문, 라벨이 Blogger 작성 폼에 자동 입력됩니다.
6. 내용을 검수한 뒤 `초안 저장` 또는 `즉시 발행` 버튼을 누릅니다.

라벨은 쉼표로 구분합니다.

```text
IT, 전자제품, 게임
```

## API 구조

- `app/api/auth/[...nextauth]/route.ts`: NextAuth Google OAuth 핸들러
- `app/api/blogger/blogs/route.ts`: 로그인한 계정의 Blogger 블로그 목록 조회
- `app/api/blogger/posts/route.ts`: Blogger REST API로 초안 저장 또는 즉시 발행
- `app/api/ai/request-post/route.ts`: 에이전트 요청 생성, 조회, 실패 기록 및 재시도
- `app/api/ai/request-post/claim/route.ts`: 대기 요청의 원자적 선점과 처리 타임아웃 복구
- `app/api/ai/pending-posts/route.ts`: 에이전트가 생성한 대기 글 저장 및 조회
- `app/api/ai/trend-keywords/route.ts`: 추천 키워드 목록 제공

Blogger API 호출과 인증 토큰 처리는 서버 라우트에서만 수행합니다. 클라이언트에는 `refresh_token`을 노출하지 않습니다.

## 검증

```bash
npm run lint
npm run build
```

## Vercel 배포

Vercel 프로젝트 환경변수에 다음 값을 등록합니다.

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

배포 URL을 사용한다면 Google Cloud OAuth 클라이언트의 승인된 리디렉션 URI에도 다음 형식의 URL을 추가해야 합니다.

```text
https://your-domain.vercel.app/api/auth/callback/google
```
