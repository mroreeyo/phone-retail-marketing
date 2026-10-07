import { StoreForm } from "@/components/admin/StoreForm";
import type { BusinessHour, StoreInfo } from "@/lib/db/types";
import { createSessionClient } from "@/lib/supabase/server";

export default async function StorePage() {
  const db = await createSessionClient();
  const [{ data: store }, { data: hours }] = await Promise.all([
    db.from("store_info").select("*").single<StoreInfo>(),
    db.from("business_hours").select("*").order("weekday").returns<BusinessHour[]>(),
  ]);
  if (!store || !hours) throw new Error("매장 정보를 불러오지 못했습니다.");

  const { id: _id, lat: _lat, lng: _lng, updated_at: _u, ...input } = store;
  return <StoreForm store={input} hours={hours} />;
}
