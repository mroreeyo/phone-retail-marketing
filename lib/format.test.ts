import { expect, test } from "vitest";
import { formatTime, hourRows, hoursSummary, updatedLabel } from "./format";

test("기준일은 가장 최근 수정 시각, 한국 시간", () => {
  expect(updatedLabel([])).toBeNull();
  // 2026-10-06T16:00Z = 한국 시간 10월 7일 01시
  expect(
    updatedLabel([{ updated_at: "2026-09-30T00:00:00Z" }, { updated_at: "2026-10-06T16:00:00Z" }]),
  ).toBe("10월 7일 기준");
});

test("시간 표시", () => {
  expect(formatTime("09:00:00")).toBe("오전 9시");
  expect(formatTime("12:00:00")).toBe("오후 12시");
  expect(formatTime("13:30:00")).toBe("오후 1시 30분");
});

test("영업시간 표: 월요일부터, 비어 있는 요일 제외", () => {
  expect(
    hourRows([
      { weekday: 0, open_time: null, close_time: null, closed: true },
      { weekday: 1, open_time: "10:00:00", close_time: "20:00:00", closed: false },
      { weekday: 2, open_time: null, close_time: null, closed: false },
    ]),
  ).toEqual([
    { day: "월", text: "오전 10시 ~ 오후 8시" },
    { day: "일", text: "휴무" },
  ]);
});

test("영업시간 요약: 같은 시간의 연속 요일을 묶는다", () => {
  const open = (weekday: number) => ({ weekday, open_time: "10:00:00", close_time: "21:00:00", closed: false });
  expect(hoursSummary([])).toBeNull();
  expect(hoursSummary([0, 1, 2, 3, 4, 5, 6].map(open))).toBe("매일 오전 10시 ~ 오후 9시");
  expect(
    hoursSummary([...[1, 2, 3, 4, 5, 6].map(open), { weekday: 0, open_time: null, close_time: null, closed: true }]),
  ).toBe("월~토 오전 10시 ~ 오후 9시 · 일 휴무");
});

test("영업시간 요약: 묶음이 많으면 한 줄로 쓰지 않는다", () => {
  const h = (weekday: number, close: string) => ({ weekday, open_time: "10:00:00", close_time: close, closed: false });
  expect(hoursSummary([h(1, "20:00:00"), h(2, "21:00:00"), h(3, "20:00:00")])).toBeNull();
});
