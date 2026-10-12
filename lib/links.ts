import type { StoreInfo } from "./db/types";

/** 전화 버튼은 번호가 입력된 경우에만 그린다. 비어 있으면 tel: 링크가 아무 동작도 하지 않는다. */
export const hasPhone = (s: StoreInfo) => s.phone.replace(/\D/g, "").length > 0;
export const telHref = (s: StoreInfo) => `tel:${s.phone.replace(/\D/g, "")}`;
export const dmHref = (s: StoreInfo) => `https://ig.me/m/${s.instagram_id}`;
// 커스텀 스킴(nmap://)은 카카오톡 인앱 브라우저에서 막히는 경우가 있어 웹 링크를 쓴다.
// 주소가 없으면 null: 상호명으로 검색하면 이름이 비슷한 다른 가게가 나올 수 있다.
export const mapHref = (s: StoreInfo) =>
  s.road_address ? `https://map.naver.com/p/search/${encodeURIComponent(s.road_address)}` : null;

export const phoneImageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/phones/${path}`;

export type Channel = "call" | "dm";
/** 원하는 상담 채널을 쓸 수 없으면(번호나 인스타 아이디가 비어 있으면) 다른 채널로 바꾼다. 둘 다 없으면 null. */
export function pickChannel(s: StoreInfo, want: Channel): Channel | null {
  const ok: Record<Channel, boolean> = { call: hasPhone(s), dm: s.instagram_id.trim().length > 0 };
  if (ok[want]) return want;
  const other: Channel = want === "call" ? "dm" : "call";
  return ok[other] ? other : null;
}
