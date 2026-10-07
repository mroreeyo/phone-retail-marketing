// 고객 화면의 고정 문구. PRD에 근거가 없는 사실은 쓰지 않는다.
// TODO(운영자 확인): 출시 전에 사장님이 문구를 확인하고, 사장님 한마디를 채운다.

export const HERO = {
  title: "가격은 낮게,\n신뢰는 높게",
  sub: "SKT, KT, LG U+ 통신 3사를 한자리에서 비교해 개통해 드립니다.",
};

export const AGE_CHOICES = [
  {
    key: "young",
    label: "학생·사회초년생",
    guide: "이번 주 추천폰과 혜택이 궁금하면 DM으로 편하게 물어보세요. 통신 3사 조건을 비교해서 알려 드립니다.",
    cta: "dm",
  },
  {
    key: "family",
    label: "가족 결합",
    guide: "가족이 쓰는 통신사와 요금제를 알려 주시면, 결합했을 때의 조건을 통신사별로 비교해 드립니다.",
    cta: "call",
  },
  {
    key: "parents",
    label: "부모님 폰",
    guide: "부모님이 쓰기 편한 폰을 함께 골라 드립니다. 전화 한 통으로 먼저 물어보셔도 됩니다.",
    cta: "call",
  },
] as const;

export const PROMISES = [
  "통신 3사(SKT, KT, LG U+) 조건을 한자리에서 비교해 드립니다.",
  "\"공짜폰\", \"무조건 최저가\" 같은 과장된 말로 안내하지 않습니다.",
  "쓰던 폰 반납과 기기변경을 함께 상담해 드립니다.",
];

/** 비워 두면 사장님 한마디 영역을 표시하지 않는다. */
export const OWNER_MESSAGE = "";
