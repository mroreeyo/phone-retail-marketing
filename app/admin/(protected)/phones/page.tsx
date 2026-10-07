import { PhonesForm } from "@/components/admin/PhonesForm";
import type { Phone, Settings } from "@/lib/db/types";
import { createSessionClient } from "@/lib/supabase/server";

export default async function PhonesPage() {
  const db = await createSessionClient();
  const [{ data: phones }, { data: settings }] = await Promise.all([
    db.from("phones").select("*").order("sort_order").returns<Phone[]>(),
    db.from("settings").select("*").single<Settings>(),
  ]);
  if (!phones || !settings) throw new Error("추천폰을 불러오지 못했습니다.");
  return <PhonesForm phones={phones} priceMode={settings.price_mode} />;
}
