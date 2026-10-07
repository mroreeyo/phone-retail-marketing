# 두꺼비통신 홍보 사이트

광주 휴대폰 판매점 두꺼비통신의 모바일 홍보 사이트(`/`)와 운영자 관리 화면(`/admin`)입니다.
요구사항은 [PRD](휴대폰_판매점_홍보사이트_PRD.md)를 따릅니다.

- 배포: https://duggeobi-mobile.netlify.app (main 푸시 시 Netlify 자동 배포)
- 스택: Next.js 16, Tailwind v4, Supabase Free, Netlify Free

## 처음 한 번 설정

1. **Supabase**
   - SQL Editor에서 `supabase/migrations/0001_init.sql` 전체를 실행합니다.
   - Authentication > Sign In / Providers에서 회원가입(Allow new users to sign up)을 끕니다.
   - Authentication > Users > Add user로 운영자 계정(이메일, 비밀번호)을 만들고, SQL Editor에서 운영자로 등록합니다.
     ```sql
     insert into public.admins (user_id) select id from auth.users where email = '운영자@이메일';
     ```
2. **환경 변수**: `.env.example`을 `.env.local`로 복사해 값을 채우고, Netlify > Project configuration > Environment variables에도 같은 값을 등록합니다.
3. **네이버 클라우드 플랫폼**: Maps Application의 Web 서비스 URL에 `http://localhost:3000`과 배포 주소를 등록합니다.

## 개발

```bash
pnpm install
pnpm dev
```

## 검증

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm check:rls   # 비로그인 상태의 쓰기·숨김 조회가 막히는지 실제 DB로 확인
```

## 구조

- `app/(public)`: 고객용 화면. 정적 생성되고, 어드민 저장 시 `revalidatePath`로 다시 생성됩니다.
- `app/admin`: 운영자 화면. `proxy.ts`가 로그인을 확인하고, 운영자 여부는 서버와 RLS가 다시 확인합니다.
- `lib/db/mutations.ts`: 모든 쓰기(Server Action).
- `netlify/functions/keepalive.mts`: Supabase 일시 중지를 막는 하루 1회 조회.
- `components/public/content.ts`: 고객 화면 고정 문구. 출시 전 사장님 확인이 필요합니다.
