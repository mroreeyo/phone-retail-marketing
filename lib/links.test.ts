import { expect, test } from "vitest";
import type { StoreInfo } from "./db/types";
import { mapHref, pickChannel } from "./links";

const store = (phone: string, instagram_id: string, road_address = "") => ({ phone, instagram_id, road_address }) as StoreInfo;

test("상담 채널: 비어 있는 채널은 다른 채널로 바꾼다", () => {
  expect(pickChannel(store("062-123-4567", "duggeobi"), "call")).toBe("call");
  expect(pickChannel(store("", "duggeobi"), "call")).toBe("dm");
  expect(pickChannel(store("062-123-4567", ""), "dm")).toBe("call");
  expect(pickChannel(store("", ""), "call")).toBeNull();
});

test("길찾기: 주소가 없으면 링크를 만들지 않는다", () => {
  expect(mapHref(store("", "", ""))).toBeNull();
  expect(mapHref(store("", "", "광주 서구 상무대로 1"))).toContain(encodeURIComponent("광주 서구 상무대로 1"));
});
