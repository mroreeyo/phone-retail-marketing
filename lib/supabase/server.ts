import { createClient as createPlainClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** 로그인 세션을 쿠키에서 읽는 클라이언트 (어드민 서버 코드용). 요청마다 새로 만든다. */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component에서는 쿠키를 쓸 수 없다. 세션 갱신은 proxy.ts가 담당한다.
        }
      },
    },
  });
}

/** 쿠키 없이 공개 데이터만 읽는 클라이언트 (고객용 정적 페이지용) */
export function createPublicClient() {
  return createPlainClient(url, key, { auth: { persistSession: false } });
}
