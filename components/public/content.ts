// 고객 화면의 고정 문구. PRODUCT.md의 "확인된 서비스"에 없는 사실은 쓰지 않는다.
// 목소리: 황금 두꺼비가 손님에게 직접 말한다. 민요 "두껍아 두껍아 헌 집 줄게 새 집 다오"의 가락을 빌린다.
// 채널 이름은 "전화 상담", "인스타 DM"으로 통일한다. 버튼은 채널마다 문구를 따로 두어,
// 번호나 인스타 아이디가 비어 다른 채널로 바뀌어도 무엇을 상담하는 버튼인지 남는다.
// TODO(운영자 확인): 2026-10-08에 새로 쓴 초안이다. 출시 전에 사장님이 문구를 확인하고, 사장님 한마디를 채운다.

import type { Channel } from "@/lib/links";

export type CtaLabels = Record<Channel, string>;

export const HERO = {
  title: "가격은 낮게,\n신뢰는 높게",
  /** 두꺼비 말풍선. 통신 3사 비교(G3)를 첫 화면에서 말한다. */
  bubble: "통신 3사 조건, 제가 한\u00a0번에 비교해 드릴게요",
  carriers: ["SKT", "KT", "LG U+"],
  /** 지역 표시. 주소가 비어 있어도 보인다. */
  area: "광주 휴대폰 판매점",
  cta: { call: "전화 상담", dm: "인스타 DM 상담" } satisfies CtaLabels,
  reassure: "상담만 받고 가셔도 괜찮아요.",
};

export const AGE_TITLE = "누가 쓰실 폰인가요?";

/** 첫 항목(부모님 폰)이 가장 크게 보인다. 고객용 UI의 기본 대상은 60대 이상이다 (PRD 4.1). */
export const AGE_CHOICES: {
  key: string;
  label: string;
  guide: string;
  want: Channel;
  cta: CtaLabels;
  /** 원하는 채널을 쓸 수 없을 때 버튼 위에 덧붙이는 안내 */
  fallbackNote?: string;
}[] = [
  {
    key: "parents",
    label: "부모님 폰",
    guide: "큰 글씨, 연락처·사진 옮기기, 단축번호까지 매장에서 설정해 드려요.",
    want: "call",
    cta: { call: "부모님 폰 전화 상담", dm: "부모님 폰 인스타 DM 상담" },
    fallbackNote: "인스타가 어려우시면 자녀분이 대신 물어봐 주셔도 돼요.",
  },
  {
    key: "family",
    label: "가족 결합",
    guide: "가족이 쓰는 통신사와 요금제를 알려 주시면, 결합 할인을 통신사별로 비교해 드려요.",
    want: "call",
    cta: { call: "가족 결합 전화 상담", dm: "가족 결합 인스타 DM 상담" },
  },
  {
    key: "young",
    label: "학생·사회초년생",
    guide: "이번 주 추천폰과 통신 3사 조건을 인스타 DM으로 편하게 받아 보세요.",
    want: "dm",
    cta: { dm: "인스타 DM으로 조건 받기", call: "전화로 조건 묻기" },
  },
];

/** 캠페인 띠. 어드민에서 설명을 비워 두면 이 문장을 쓴다. */
export const CAMPAIGN_FALLBACK = "쓰던 폰을 가져오시면 반납과 보상을 기기변경과 함께 상담해 드려요.";
export const CAMPAIGN_CTA: CtaLabels = { call: "헌 폰 보상 전화 상담", dm: "헌 폰 보상 인스타 DM 상담" };

export const PHONE_CTA: CtaLabels = { dm: "인스타 DM으로 가격 받기", call: "전화로 가격 묻기" };

export const PROMISE_TITLE = "두꺼비가 약속합니다";
/** 첫 약속은 크게 보인다. 판매점을 처음 찾는 손님이 가장 걱정하는 부분이다. */
export const PROMISE_LEAD = "\"공짜폰\", \"무조건 최저가\" 같은 과장된 말로 안내하지 않습니다.";
export const PROMISES = [
  "통신 3사(SKT, KT, LG U+) 조건을 한자리에서 비교해 보여 드립니다.",
  "개통하지 않고 상담만 받고 가셔도 괜찮습니다.",
];

export const LOCATION = {
  title: "오시는 길과 연락처",
  /** 주소·영업시간·방문 안내가 하나도 없을 때의 제목 */
  contactOnlyTitle: "연락처",
  /** 주소가 비어 있을 때 두꺼비가 하는 말. 쓸 수 있는 채널에 맞춘다. */
  noAddress: { dm: "매장 위치는 인스타 DM으로 알려 드릴게요.", call: "매장 위치는 전화로 알려 드릴게요." } satisfies CtaLabels,
};

/** 비워 두면 사장님 한마디 영역을 표시하지 않는다. */
export const OWNER_MESSAGE = "";
