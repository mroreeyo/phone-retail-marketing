import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type { SiteData } from "./types";

/**
 * 고객용 화면이 읽는 공개 데이터. RLS가 숨김 항목을 걸러낸다.
 * 실패하면 예외를 던진다: 빌드가 실패하면 Netlify는 이전 배포를 유지한다.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const db = createPublicClient();
  const [store, hours, phones, notices, settings] = await Promise.all([
    db.from("store_info").select("*").single(),
    db.from("business_hours").select("*"),
    db.from("phones").select("*").order("sort_order"),
    db.from("notices").select("*"),
    db.from("settings").select("*").single(),
  ]);
  const err = store.error ?? hours.error ?? phones.error ?? notices.error ?? settings.error;
  if (err) throw new Error(`공개 데이터 조회 실패: ${err.message}`);
  return {
    store: store.data,
    hours: hours.data ?? [],
    phones: phones.data ?? [],
    notices: notices.data ?? [],
    settings: settings.data,
  };
});