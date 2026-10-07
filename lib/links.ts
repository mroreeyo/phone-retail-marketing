import type { StoreInfo } from "./db/types";

export const telHref = (s: StoreInfo) => `tel:${s.phone.replace(/\D/g, "")}`;
export const dmHref = (s: StoreInfo) => `https://ig.me/m/${s.instagram_id}`;
// 커스텀 스킴(nmap://)은 카카오톡 인앱 브라우저에서 막히는 경우가 있어 웹 링크를 쓴다.
export const mapHref = (s: StoreInfo) =>
  `https://map.naver.com/p/search/${encodeURIComponent(s.road_address || s.business_name)}`;

export const phoneImageUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/phones/${path}`;
