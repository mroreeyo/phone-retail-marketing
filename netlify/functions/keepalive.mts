// Supabase Free는 7일간 DB 요청이 없으면 프로젝트를 일시 중지한다.
// 고객 화면은 정적이라 DB를 호출하지 않으므로, 하루 한 번 공개 데이터를 1행 읽는다.
export default async function keepalive() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/store_info?select=id&limit=1`, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "" },
  });
  console.log(`keepalive: ${res.status}`);
  if (!res.ok) throw new Error(`keepalive failed: ${res.status} ${await res.text()}`);
}

export const config = { schedule: "@daily" };
