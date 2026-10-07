import { AdminTabs } from "@/components/admin/AdminTabs";
import { signOut } from "@/lib/db/mutations";
import { createSessionClient } from "@/lib/supabase/server";

// proxy.ts는 로그인 여부만 본다. 운영자 여부는 여기서 서버가 다시 확인한다.
export default async function ProtectedLayout({ children }: LayoutProps<"/admin">) {
  const db = await createSessionClient();
  const { data: isAdmin } = await db.rpc("is_admin");

  return (
    <>
      <header className="bg-brown text-paper">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-2 px-4">
          <span className="font-display text-xl">두꺼비통신 관리</span>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener" className="inline-flex min-h-12 items-center px-2 font-bold underline underline-offset-4">
              사이트 보기
            </a>
            <form action={signOut}>
              <button className="min-h-12 px-2 text-cream">로그아웃</button>
            </form>
          </div>
        </div>
        {isAdmin === true && <AdminTabs />}
      </header>
      {isAdmin === true ? (
        children
      ) : (
        <main className="mx-auto max-w-2xl px-4 py-12">
          <p className="text-lg font-bold">이 계정에는 운영자 권한이 없습니다.</p>
          <p className="mt-2 text-sub">사장님 계정으로 다시 로그인하거나, 관리자에게 권한 등록을 요청하세요.</p>
        </main>
      )}
    </>
  );
}
