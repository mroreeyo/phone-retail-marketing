@AGENTS.md

# 두꺼비통신 홍보 사이트

- 상위 폴더 `C:\Users\ncuri\Downloads\AGENTS.md`는 다른 프로젝트(엔큐리티 직무 챗봇)의 규칙이다. 이 저장소에는 적용하지 않는다.
- 요구사항의 정본은 `휴대폰_판매점_홍보사이트_PRD.md`이다. 결정이 바뀌면 PRD의 결정 사항(11절)에도 기록한다.
- 스택: Next.js 16 (App Router, `proxy.ts`), Tailwind v4, Supabase Free, Netlify Free.
- 권한은 RLS(`supabase/migrations`)에서 강제한다. 쓰기는 `public.is_admin()`인 경우만 허용한다.
- 비밀 값은 `.env.local`과 Netlify 환경 변수에만 둔다. `NCP_MAPS_CLIENT_SECRET`은 서버 코드에서만 읽는다.
- 고객용(`components/public`)과 어드민(`components/admin`) 컴포넌트를 섞지 않는다. 데이터 타입만 `lib/db/types.ts`에서 공유한다.
- 검증: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
