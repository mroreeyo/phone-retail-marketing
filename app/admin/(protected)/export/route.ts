import { createSessionClient } from "@/lib/supabase/server";

// B7. Supabase Free는 자동 백업이 없으므로 운영자가 내려받아 보관한다. 예약(P1, 개인정보)은 포함하지 않는다.
export async function GET() {
  const db = await createSessionClient();
  const { data: isAdmin } = await db.rpc("is_admin");
  if (isAdmin !== true) return new Response("운영자 권한이 없습니다.", { status: 403 });

  const tables = ["store_info", "business_hours", "phones", "notices", "settings"] as const;
  const results = await Promise.all(tables.map((t) => db.from(t).select("*")));
  const failed = results.find((r) => r.error);
  if (failed?.error) return new Response(`내보내기 실패: ${failed.error.message}`, { status: 500 });

  const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(new Date());
  const body = Object.fromEntries(tables.map((t, i) => [t, results[i].data]));
  return new Response(JSON.stringify({ exported_at: new Date().toISOString(), ...body }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="duggeobi-backup-${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
