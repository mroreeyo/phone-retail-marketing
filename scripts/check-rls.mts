// 출시 전 체크리스트(어드민) 자동 점검: 비로그인(publishable key)으로 쓰기·숨김 조회·admins 조회가 막히는지 확인한다.
// 실행: pnpm check:rls   (.env.local을 읽는다)
// 데이터를 바꾸지 않도록 UPDATE는 같은 값으로, DELETE는 존재하지 않는 조건으로 시도한다.
import { createClient } from "@supabase/supabase-js";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
  auth: { persistSession: false },
});

let failures = 0;
const check = (name: string, pass: boolean, detail = "") => {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!pass) failures++;
};
const blocked = (r: { error: { code?: string } | null; data: unknown[] | null }) =>
  !!r.error || (r.data?.length ?? 0) === 0;

// [테이블, 기본키, 같은 값으로 덮어쓸 컬럼]
const tables = [
  ["store_info", "id", "phone"],
  ["business_hours", "weekday", "closed"],
  ["phones", "id", "name"],
  ["notices", "kind", "title"],
  ["settings", "id", "price_mode"],
] as const;

for (const [t, pk, col] of tables) {
  const ins = await db.from(t).insert({ [col]: "rls-check" } as never).select();
  check(`${t} INSERT 거부`, !!ins.error, ins.error?.code);

  const { data: rows } = await db.from(t).select(`${pk}, ${col}`).limit(1);
  const row = rows?.[0] as Record<string, unknown> | undefined;
  if (row) {
    const upd = await db.from(t).update({ [col]: row[col] } as never).eq(pk, row[pk] as string).select();
    check(`${t} UPDATE 거부`, blocked(upd), upd.error?.code);
  }

  const del = await db.from(t).delete().eq(pk, t === "notices" ? "__none__" : -1).select();
  check(`${t} DELETE 거부`, blocked(del), del.error?.code);
}

const phones = await db.from("phones").select("hidden");
check("phones 조회 성공", !phones.error, phones.error?.message);
check("숨김 추천폰 비노출", (phones.data ?? []).every((p) => !p.hidden));
const notices = await db.from("notices").select("hidden");
check("notices 조회 성공", !notices.error, notices.error?.message);
check("숨김 공지 비노출", (notices.data ?? []).every((n) => !n.hidden));

const admins = await db.from("admins").select("*");
check("admins 조회 거부", blocked(admins), admins.error?.code);

const up = await db.storage.from("phones").upload(`rls-check-${Date.now()}.webp`, new Blob(["x"], { type: "image/webp" }));
check("phones 버킷 업로드 거부", !!up.error, up.error?.message);

console.log(failures ? `\n${failures}건 실패` : "\n모두 통과");
process.exit(failures ? 1 : 0);
