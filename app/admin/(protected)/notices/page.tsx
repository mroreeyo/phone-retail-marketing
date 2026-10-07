import { NoticesForm } from "@/components/admin/NoticesForm";
import type { Notice } from "@/lib/db/types";
import { createSessionClient } from "@/lib/supabase/server";

export default async function NoticesPage() {
  const db = await createSessionClient();
  const { data } = await db.from("notices").select("*").returns<Notice[]>();
  if (!data) throw new Error("공지를 불러오지 못했습니다.");
  return <NoticesForm notices={data} />;
}
