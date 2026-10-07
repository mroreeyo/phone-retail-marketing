"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { geocode } from "@/lib/geocode";
import { createSessionClient } from "@/lib/supabase/server";
import { isTime, normalizeInstagramId, normalizePhone } from "@/lib/validate";
import type { ActionResult, BusinessHour, Notice, Phone, PriceMode, StoreInfo } from "./types";

// 모든 쓰기는 ① 운영자 확인 ② 입력 검증 ③ 쓰기(RLS가 한 번 더 막음) ④ 고객 화면 재생성 순서로 처리한다.

async function adminClient() {
  const db = await createSessionClient();
  const { data } = await db.rpc("is_admin");
  if (data !== true) throw new Error("운영자 권한이 없습니다. 다시 로그인해 주세요.");
  return db;
}

async function run(fn: () => Promise<string | void>): Promise<ActionResult> {
  try {
    const message = await fn();
    if (message) return { ok: false, message };
    revalidatePath("/", "layout"); // 고객용 전체(메인, 개인정보처리방침의 푸터·액션바)를 다시 생성
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다." };
  }
}

const fail = (error: { message: string } | null) => {
  if (error) throw new Error(`저장하지 못했습니다: ${error.message}`);
};

// ───────── 로그인 ─────────

export async function signIn(_: string | null, form: FormData): Promise<string | null> {
  const db = await createSessionClient();
  const { error } = await db.auth.signInWithPassword({
    email: String(form.get("email") ?? ""),
    password: String(form.get("password") ?? ""),
  });
  if (error) return "이메일 또는 비밀번호가 맞지 않습니다.";
  redirect("/admin/store");
}

export async function signOut() {
  const db = await createSessionClient();
  await db.auth.signOut();
  redirect("/admin/login");
}

// ───────── 매장 정보 (B2, B3) ─────────

export type StoreInput = Omit<StoreInfo, "id" | "lat" | "lng" | "updated_at">;

export async function saveStore(store: StoreInput, hours: BusinessHour[]): Promise<ActionResult> {
  return run(async () => {
    const db = await adminClient();

    const phone = store.phone ? normalizePhone(store.phone) : "";
    if (phone === null) return "대표 전화번호 형식을 확인해 주세요. 예: 062-123-4567";
    const instagram = normalizeInstagramId(store.instagram_id);
    if (!instagram) return "인스타그램 아이디 형식을 확인해 주세요. 예: duggeobi_mobile";

    for (const h of hours) {
      if (h.closed) continue;
      const times = [h.open_time, h.close_time].filter(Boolean) as string[];
      if (times.length === 1) return "여는 시간과 닫는 시간을 모두 입력하거나 모두 비워 주세요.";
      if (times.some((t) => !isTime(t))) return "영업시간 형식을 확인해 주세요.";
    }

    let coords: { lat: number | null; lng: number | null } = { lat: null, lng: null };
    if (store.road_address) {
      const found = await geocode(store.road_address);
      if (!found) return "주소의 위치를 찾지 못했습니다. 주소 찾기로 주소를 다시 선택해 주세요.";
      coords = found;
    }

    fail((await db.from("store_info").update({ ...store, phone, instagram_id: instagram, ...coords }).eq("id", 1)).error);
    fail(
      (
        await db.from("business_hours").upsert(
          hours.map((h) => ({
            weekday: h.weekday,
            closed: h.closed,
            open_time: h.closed ? null : h.open_time || null,
            close_time: h.closed ? null : h.close_time || null,
          })),
        )
      ).error,
    );
  });
}

// ───────── 추천폰 (B4, B5) ─────────

export type PhoneInput = Omit<Phone, "id" | "sort_order" | "updated_at"> & { id?: string };

export async function savePhones(
  priceMode: PriceMode,
  phones: PhoneInput[],
  deleted: { id: string; image_path: string | null }[],
): Promise<ActionResult & { phones?: Phone[] }> {
  // 새로 추가한 추천폰은 저장 후 id가 생기므로, 저장된 목록을 돌려줘 폼이 다시 추가(중복 저장)하지 않게 한다.
  let saved: Phone[] = [];
  const result = await run(async () => {
    const db = await adminClient();
    if (phones.some((p) => !p.name.trim())) return "기종명이 비어 있는 추천폰이 있습니다.";

    fail((await db.from("settings").update({ price_mode: priceMode }).eq("id", 1)).error);

    if (deleted.length) {
      fail((await db.from("phones").delete().in("id", deleted.map((d) => d.id))).error);
      const paths = deleted.map((d) => d.image_path).filter(Boolean) as string[];
      if (paths.length) await db.storage.from("phones").remove(paths); // 사진 정리는 실패해도 저장은 유지
    }

    const rows = phones.map((p, i) => ({ ...p, name: p.name.trim(), sort_order: i }));
    const existing = rows.filter((r) => r.id);
    const created = rows.filter((r) => !r.id).map(({ id: _id, ...r }) => r);
    if (existing.length) fail((await db.from("phones").upsert(existing)).error);
    if (created.length) fail((await db.from("phones").insert(created)).error);

    const { data, error } = await db.from("phones").select("*").order("sort_order");
    fail(error);
    saved = data ?? [];
  });
  return result.ok ? { ...result, phones: saved } : result;
}

// ───────── 공지·캠페인 (B6) ─────────

export async function saveNotices(notices: Notice[]): Promise<ActionResult> {
  return run(async () => {
    const db = await adminClient();
    fail(
      (
        await db.from("notices").upsert(
          notices.map((n) => ({ ...n, title: n.title.trim(), body: n.body.trim() })),
        )
      ).error,
    );
  });
}
