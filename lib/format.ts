import type { BusinessHour, Phone } from "./db/types";

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;
/** 표시 순서: 월 ~ 일 */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** 노출 중인 추천폰의 마지막 수정 시각을 "10월 7일 기준"으로. 항목이 없으면 null. */
export function updatedLabel(phones: Pick<Phone, "updated_at">[]): string | null {
  if (phones.length === 0) return null;
  const latest = Math.max(...phones.map((p) => Date.parse(p.updated_at)));
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "numeric",
    day: "numeric",
  }).formatToParts(latest);
  const get = (t: string) => parts.find((p) => p.type === t)?.value;
  return `${get("month")}월 ${get("day")}일 기준`;
}

/** "09:00:00" → "오전 9시", "13:30:00" → "오후 1시 30분" */
export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${ampm} ${h12}시${m ? ` ${m}분` : ""}`;
}

/** 요일별 영업시간 표 행. 입력되지 않은 요일은 제외한다 (A6). */
export function hourRows(hours: BusinessHour[]): { day: string; text: string }[] {
  return WEEK_ORDER.flatMap((wd) => {
    const h = hours.find((x) => x.weekday === wd);
    if (!h) return [];
    if (h.closed) return [{ day: WEEKDAYS[wd], text: "휴무" }];
    if (!h.open_time || !h.close_time) return [];
    return [{ day: WEEKDAYS[wd], text: `${formatTime(h.open_time)} ~ ${formatTime(h.close_time)}` }];
  });
}
