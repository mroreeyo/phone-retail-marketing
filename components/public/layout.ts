/** 고객 화면 공통 컨테이너. 헤더, 히어로, 섹션, 푸터가 모든 화면 크기에서 같은 좌우선을 쓴다. */
export const wrap = "mx-auto w-full max-w-xl px-4 md:max-w-5xl md:px-8";

const press = "transition-colors active:scale-[0.98]";
/** 연못 초록 면(히어로, 부모님 폰) 위의 주 버튼 */
export const ctaGold = `flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 text-lg font-bold text-pond hover:bg-gold/90 ${press}`;
/** 금색 면(캠페인) 위의 주 버튼 */
export const ctaPond = `flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-pond px-5 text-lg font-bold text-paper hover:bg-pond/90 ${press}`;
/** 하단 바와 겹치는 보조 행동. 버튼 대신 굵은 링크로 가볍게 둔다 (터치 영역 48px 유지). */
export const ctaLink = "inline-flex min-h-12 items-center gap-2 justify-self-start text-lg font-bold underline decoration-2 underline-offset-4 transition-colors hover:decoration-pad";
export const ctaOutline = `flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-pond bg-paper px-5 text-lg font-bold hover:bg-lily ${press}`;
