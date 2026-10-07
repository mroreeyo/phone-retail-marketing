// 고객용과 어드민이 공유하는 데이터 타입. supabase/migrations/0001_init.sql과 일치해야 한다.

export type StoreInfo = {
  id: 1;
  phone: string;
  instagram_id: string;
  road_address: string;
  detail_address: string;
  lat: number | null;
  lng: number | null;
  parking: string;
  transit: string;
  visit_items: string;
  business_name: string;
  owner_name: string;
  business_reg_no: string;
  preapproval_text: string;
  updated_at: string;
};

/** weekday: 0 = 일요일 ... 6 = 토요일. 시간은 "HH:MM:SS" */
export type BusinessHour = {
  weekday: number;
  open_time: string | null;
  close_time: string | null;
  closed: boolean;
};

export type Phone = {
  id: string;
  sort_order: number;
  category: string;
  name: string;
  summary: string;
  price_text: string;
  image_path: string | null;
  hidden: boolean;
  updated_at: string;
};

export type NoticeKind = "top" | "campaign";

export type Notice = {
  kind: NoticeKind;
  title: string;
  body: string;
  hidden: boolean;
};

export type PriceMode = "consult" | "public";

export type Settings = {
  id: 1;
  price_mode: PriceMode;
};

export type SiteData = {
  store: StoreInfo;
  hours: BusinessHour[];
  phones: Phone[];
  notices: Notice[];
  settings: Settings;
};

export type ActionResult = { ok: true } | { ok: false; message: string };
