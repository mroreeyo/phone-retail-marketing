import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// /admin 하위 경로에서 세션을 갱신하고, 비로그인이면 로그인 화면으로 보낸다.
// 운영자 여부(is_admin)는 app/admin/(protected)/layout.tsx와 RLS가 다시 확인한다.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(list, headers) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!data?.claims && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (data?.claims && isLogin) {
    return NextResponse.redirect(new URL("/admin/store", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
