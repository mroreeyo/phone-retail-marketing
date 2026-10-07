import { expect, test } from "vitest";
import { isTime, normalizeInstagramId, normalizePhone } from "./validate";

test("전화번호 정규화", () => {
  expect(normalizePhone("01012345678")).toBe("010-1234-5678");
  expect(normalizePhone("010-123-4567")).toBe("010-123-4567");
  expect(normalizePhone("062 123 4567")).toBe("062-123-4567");
  expect(normalizePhone("0212345678")).toBe("02-1234-5678");
  expect(normalizePhone("15881234")).toBe("1588-1234");
  expect(normalizePhone("070-1234-5678")).toBe("070-1234-5678");
  expect(normalizePhone("12345")).toBeNull();
  expect(normalizePhone("010-12-34")).toBeNull();
});

test("인스타그램 아이디", () => {
  expect(normalizeInstagramId(" @duggeobi_mobile ")).toBe("duggeobi_mobile");
  expect(normalizeInstagramId("두꺼비")).toBeNull();
});

test("시간 형식", () => {
  expect(isTime("09:30")).toBe(true);
  expect(isTime("21:00:00")).toBe(true);
  expect(isTime("24:00")).toBe(false);
});
