import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  DeviceMobileIcon,
  InstagramLogoIcon,
  MapPinIcon,
  PhoneIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { BusinessHour, Notice, Phone, PriceMode, StoreInfo } from "@/lib/db/types";
import { hourRows, hoursSummary, updatedLabel } from "@/lib/format";
import { type Channel, dmHref, mapHref, phoneImageUrl, pickChannel, telHref } from "@/lib/links";
import { Bubble, TAIL, ToadSays } from "./Bubble";
import { Wave } from "./Pond";
import {
  AGE_CHOICES,
  AGE_TITLE,
  CAMPAIGN_CTA,
  CAMPAIGN_FALLBACK,
  type CtaLabels,
  HERO,
  OWNER_MESSAGE,
  PHONE_CTA,
  PROMISE_LEAD,
  PROMISE_TITLE,
  PROMISES,
} from "./content";
import { ctaGold, ctaLink, ctaOutline, ctaPond, wrap } from "./layout";

const h2 = "font-display text-[1.8rem] leading-tight md:text-[2.4rem]";
const TONE = { gold: ctaGold, pond: ctaPond, outline: ctaOutline, link: ctaLink };

/**
 * 상담 버튼. 원하는 채널(전화/DM)의 연락처가 비어 있으면 다른 채널로 바꾸고, 둘 다 없으면 그리지 않는다.
 * 문구는 채널마다 따로 받아서, 채널이 바뀌어도 무엇을 상담하는 버튼인지 남긴다.
 * showNumber: 전화 버튼 안에 번호를 글자로 보여 준다. PC에서는 tel: 링크를 누를 수 없고, 어르신은 보이는 번호를 더 믿는다.
 */
function Cta({
  store,
  want,
  labels,
  tone = "outline",
  showNumber = false,
  className = "",
}: {
  store: StoreInfo;
  want: Channel;
  labels: CtaLabels;
  /** gold: 연못 초록 면의 주 버튼, pond: 금색 면의 주 버튼, outline: 보조 버튼, link: 하단 바와 겹치는 가벼운 행동 */
  tone?: keyof typeof TONE;
  showNumber?: boolean;
  className?: string;
}) {
  const ch = pickChannel(store, want);
  if (!ch) return null;
  const cls = `${TONE[tone]} ${className}`;
  const arrow = tone === "link" && <ArrowRightIcon size="1.1em" weight="bold" aria-hidden />;
  if (ch === "call") {
    return (
      <a href={telHref(store)} data-track="call" className={`${cls} flex-wrap py-2`}>
        <PhoneIcon size="1.3em" weight="fill" aria-hidden />
        {labels.call}
        {arrow}
        {showNumber && <span className="basis-full text-center text-xl tabular-nums">{store.phone}</span>}
      </a>
    );
  }
  return (
    <a href={dmHref(store)} target="_blank" rel="noopener" data-track="dm" className={cls}>
      <InstagramLogoIcon size="1.3em" weight="bold" aria-hidden />
      {labels.dm}
      {arrow}
    </a>
  );
}

/** A5. 상단 공지. 제목이 비어 있으면 표시하지 않는다 (숨김은 RLS가 걸러냄). */
export function TopNotice({ notice }: { notice?: Notice }) {
  if (!notice?.title) return null;
  return (
    <aside className="bg-pond text-paper">
      <div className={`${wrap} flex gap-2 py-3`}>
        <WarningCircleIcon size="1.4em" weight="fill" className="mt-0.5 shrink-0 text-gold" aria-hidden />
        <p>
          <strong>{notice.title}</strong>
          {notice.body && <span className="block text-lily">{notice.body}</span>}
        </p>
      </div>
    </aside>
  );
}

/**
 * A2. 첫 화면에 마스코트, 슬로건, 통신 3사 비교 메시지, 전화 버튼.
 * 연못 장면: 짙은 연못 위 연잎에 황금 두꺼비가 앉아 말풍선으로 3사 비교를 말한다 (PRD 8.2).
 * 모바일: 슬로건 → 말풍선과 두꺼비 → 지역·영업시간 → 전화 버튼.
 * 큰 글씨 모드(lg 미만): 히어로의 두꺼비를 숨기고 슬로건을 일반 크기로 맞춰, 전화번호가 첫 화면에 남게 한다(G2).
 *   두꺼비는 바로 아래 연령별 질문에서 다시 나온다.
 * 넓은 화면(lg 이상): 왼쪽에 글과 버튼, 오른쪽에 말풍선과 큰 두꺼비. 태블릿 폭에서는 모바일 배치를 쓴다(슬로건 두 줄 유지).
 * 움직임은 이 장면 하나뿐이다(globals.css의 toad-hop, ripple, bubble-pop). 모션 줄이기 설정이면 멈춘다.
 */
export function Hero({ store, hours }: { store: StoreInfo; hours: BusinessHour[] }) {
  const summary = hoursSummary(hours);
  const hasHours = hourRows(hours).length > 0;
  const [line1, line2] = HERO.title.split("\n");
  const hasCta = pickChannel(store, "call") !== null;
  return (
    <section className="relative overflow-hidden bg-pond text-paper">
      <div className={`${wrap} grid gap-y-6 pt-7 pb-10 max-lg:in-data-large:gap-y-4 md:pt-12 lg:grid-cols-[1fr_auto] lg:grid-rows-[1fr_auto_auto_auto_1fr] lg:gap-x-16 lg:pt-16 lg:pb-20`}>
        <h1 className="font-display text-[2.3rem] leading-[1.12] max-lg:in-data-large:text-[1.9rem] md:text-[3rem] lg:row-start-2 lg:text-[3.6rem]">
          {line1}
          <br />
          {/* 골드 글자는 연못 초록 바탕 위에서만 쓴다 (대비 7:1) */}
          <span className="text-gold">{line2}</span>
        </h1>

        <div className="flex items-center gap-5 md:gap-8 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:flex-col lg:gap-6 lg:self-center">
          <Bubble
            tail={`${TAIL.right} max-lg:in-data-large:hidden lg:top-auto lg:-bottom-[11px] lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0 lg:rotate-180`}
            className="animate-bubble-pop grid min-w-0 flex-1 origin-right gap-2.5 text-pond lg:flex-none lg:origin-bottom lg:px-6 lg:py-5"
          >
            <p className="font-display text-[1.2rem] leading-snug md:text-[1.4rem] lg:max-w-[12em] lg:text-[1.5rem]">{HERO.bubble}</p>
            <ul className="flex flex-wrap gap-1.5" aria-label="비교하는 통신사">
              {HERO.carriers.map((c) => (
                <li key={c} className="rounded-full bg-gold px-3 font-bold">
                  {c}
                </li>
              ))}
            </ul>
          </Bubble>

          {/* 연잎과 물결은 장식. 큰 글씨 모드에서 글자 영역을 넓히도록 크기는 px 고정 */}
          <div className="relative grid w-[136px] shrink-0 justify-items-center max-lg:in-data-large:hidden md:w-[200px] lg:w-[300px] lg:in-data-large:w-[260px]">
            <span aria-hidden className="absolute bottom-0 h-[30%] w-[120%] rounded-[50%] border-2 border-lily/25" />
            <span aria-hidden className="animate-ripple absolute bottom-0 h-[30%] w-[120%] rounded-[50%] border-2 border-gold/60" />
            <span aria-hidden className="absolute bottom-[4%] h-[24%] w-[100%] rounded-[50%] bg-pad" />
            <img
              src="/mascot.webp"
              alt="전화하는 황금 두꺼비 마스코트"
              width={300}
              height={300}
              fetchPriority="high"
              className="animate-toad-hop relative w-full origin-bottom"
            />
          </div>
        </div>

        <p className="flex flex-wrap gap-x-4 gap-y-1 font-medium text-lily lg:col-start-1 lg:row-start-3">
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon size="1.2em" weight="fill" className="text-gold" aria-hidden />
            {HERO.area}
          </span>
          {summary ? (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon size="1.2em" weight="fill" className="text-gold" aria-hidden />
              {summary}
            </span>
          ) : (
            hasHours && (
              <a href="#location" className="inline-flex items-center gap-1.5 underline underline-offset-4">
                <ClockIcon size="1.2em" weight="fill" className="text-gold" aria-hidden />
                요일별 영업시간 보기
              </a>
            )
          )}
        </p>

        {/* 상담 채널이 하나도 없으면 안심 문구도 함께 숨긴다 */}
        {hasCta && (
          <div className="grid gap-2 md:max-w-md lg:col-start-1 lg:row-start-4">
            <Cta store={store} want="call" labels={HERO.cta} tone="gold" showNumber />
            <p className="text-center font-medium text-lily">{HERO.reassure}</p>
          </div>
        )}
      </div>

      {/* 연못 물결 모양으로 다음 섹션(종이 바탕)과 잇는다 */}
      <Wave className="fill-paper" />
    </section>
  );
}

/**
 * A3. 연령별 상담 선택. 펼치지 않아도 각 항목의 혜택과 상담 버튼이 바로 보인다.
 * 항목마다 연잎 면에 담는다. 첫 항목(부모님 폰)은 연못 초록 면으로 가장 크게 둔다(기본 대상 60대 이상).
 * 넓은 화면(lg 이상)에서는 부모님 폰이 왼쪽 큰 칸, 나머지 두 항목이 오른쪽에 쌓인다.
 * 청년 항목은 DM, 가족·부모님 항목은 전화로 끝난다. 항목 클릭은 li의 data-track으로 함께 집계된다 (A10).
 */
export function AgeChoices({ store }: { store: StoreInfo }) {
  return (
    <section className={`${wrap} py-10 md:py-16`}>
      <ToadSays>
        <h2 className={h2}>{AGE_TITLE}</h2>
      </ToadSays>
      <ul className="mt-6 grid gap-4 md:grid-cols-[1.25fr_1fr] md:grid-rows-2 md:gap-5">
        {AGE_CHOICES.map((c, i) => {
          const lead = i === 0;
          const fallback = c.fallbackNote && pickChannel(store, c.want) !== c.want;
          return (
            <li
              key={c.key}
              data-track={`age_${c.key}`}
              className={`relative grid content-start gap-3 overflow-hidden rounded-[2rem] ${
                lead
                  ? "bg-pond px-6 pt-7 pb-6 text-paper md:row-span-2 md:content-center md:gap-4 md:p-8 lg:p-10"
                  : "bg-lily px-5 pt-6 pb-5"
              }`}
            >
              {/* 연잎의 물결: 히어로의 물결 원을 이어받는 장식 */}
              <span
                aria-hidden
                className={`absolute -top-12 -right-12 size-36 rounded-full border-2 ${lead ? "border-gold/40 lg:size-56" : "border-pad/40"}`}
              />
              <span
                aria-hidden
                className={`absolute -top-5 -right-5 size-20 rounded-full border-2 ${lead ? "border-gold/30 lg:size-32" : "border-pad/30"}`}
              />
              <h3 className={`relative leading-tight ${lead ? "font-display text-[2.1rem] text-gold lg:text-[2.6rem]" : "text-[1.3rem] font-bold"}`}>
                {c.label}
              </h3>
              <p className={`relative ${lead ? "text-lg text-lily" : ""}`}>
                {c.guide}
                {fallback && <span className="mt-1 block font-bold">{c.fallbackNote}</span>}
              </p>
              <Cta store={store} want={c.want} labels={c.cta} tone={lead ? "gold" : "link"} className={lead ? "relative mt-1 px-3" : "relative"} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * A5. 캠페인 띠. 어드민에서 숨기면 RLS가 걸러내 섹션이 사라진다.
 * 히어로의 후렴: 같은 두꺼비를 좌우로 뒤집어 연잎 위에 앉히고, 물결 원을 금색 면 위에 겹친다.
 */
export function CampaignBand({ notice, store }: { notice?: Notice; store: StoreInfo }) {
  if (!notice?.title) return null;
  return (
    <section className="relative overflow-hidden bg-gold">
      <span aria-hidden className="absolute -right-24 -bottom-28 size-80 rounded-full border-2 border-pond/40 md:right-10 md:size-[26rem]" />
      <span aria-hidden className="absolute -right-10 -bottom-14 size-52 rounded-full border-2 border-pond/30 md:right-24 md:size-72" />
      <div className={`${wrap} relative grid grid-cols-[1fr_auto] items-end gap-x-4 gap-y-5 py-12 md:py-16 lg:grid-cols-[1fr_auto_auto] lg:items-center lg:gap-x-12`}>
        <div className="grid gap-3">
          <h2 className="font-display text-[2.4rem] leading-[1.12] md:text-[3rem] lg:text-[3.4rem]">{notice.title}</h2>
          <p className="text-lg">{notice.body || CAMPAIGN_FALLBACK}</p>
        </div>
        {/* 장식용 두꺼비. 큰 글씨 모드에서도 글자 영역을 넓히도록 크기는 px 고정 */}
        <div aria-hidden className="relative grid w-[96px] justify-items-center self-start md:w-[140px] lg:w-[180px] lg:self-center">
          <span className="absolute bottom-0 h-[26%] w-[115%] rounded-[50%] bg-pad" />
          <img src="/mascot.webp" alt="" width={180} height={180} loading="lazy" className="relative w-full -scale-x-100" />
        </div>
        <Cta store={store} want="call" labels={CAMPAIGN_CTA} tone="pond" className="col-span-2 lg:col-span-1 lg:w-auto" />
      </div>
    </section>
  );
}

/** A4. 이번 주 추천폰. 노출할 항목이 없으면 섹션 전체를 숨긴다. */
export function Phones({ phones, priceMode, store }: { phones: Phone[]; priceMode: PriceMode; store: StoreInfo }) {
  if (phones.length === 0) return null;
  return (
    <section className={`${wrap} py-10 md:py-16`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className={h2}>이번 주 추천폰</h2>
        <p className="text-sub">{updatedLabel(phones)}</p>
      </div>
      <ul className="mt-5 grid gap-4 md:grid-cols-2">
        {phones.map((p) => (
          <li key={p.id} className="grid grid-cols-[6rem_1fr] gap-4 rounded-2xl bg-lily p-4">
            {p.image_path ? (
              <img
                src={phoneImageUrl(p.image_path)}
                alt={p.name}
                loading="lazy"
                className="aspect-[3/4] w-24 rounded-xl bg-paper object-contain"
              />
            ) : (
              <div className="grid aspect-[3/4] w-24 place-items-center rounded-xl bg-paper text-sub" aria-hidden>
                <DeviceMobileIcon size="2.2em" weight="duotone" />
              </div>
            )}
            <div className="min-w-0">
              {p.category && <p className="text-sub">{p.category}</p>}
              <h3 className="text-xl font-bold leading-snug">{p.name}</h3>
              {p.summary && <p className="mt-1">{p.summary}</p>}
              {priceMode === "public" && p.price_text && (
                <p className="mt-2 text-xl font-bold text-lotus">{p.price_text}</p>
              )}
            </div>
            {/* 상담 유도형이면 카드 전체 폭 버튼. 좁은 칸에 넣으면 문구가 여러 줄로 꺾인다. */}
            {!(priceMode === "public" && p.price_text) && (
              <Cta store={store} want="dm" labels={PHONE_CTA} className="col-span-2 min-h-12 px-3 text-base" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** ⑤ 약속 + 사장님 한마디. 과장 금지 약속을 가장 크게 보여 준다. PC에서는 제목과 약속을 두 단으로.
 * 연잎 색이 물결로 차올랐다가 다시 흘러내린다. */
export function Promises() {
  return (
    <>
      <Wave className="fill-lily" />
      <section className="bg-lily">
        <div className={`${wrap} py-10 md:grid md:grid-cols-[1fr_1.4fr] md:gap-x-16 md:py-16`}>
          <h2 className={h2}>{PROMISE_TITLE}</h2>
          <div>
            {/* 가장 중요한 약속은 체크 목록이 아니라 큰 인용문으로 */}
            <p className="mt-5 font-display text-[1.75rem] leading-snug text-balance md:mt-0 md:text-[2.3rem]">{PROMISE_LEAD}</p>
            <ul className="mt-6 grid gap-3 border-t-2 border-pad/30 pt-5">
              {PROMISES.map((text) => (
                <li key={text} className="flex gap-3 text-lg">
                  <CheckCircleIcon size="1.4em" weight="fill" className="mt-0.5 shrink-0 text-trust" aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
            {OWNER_MESSAGE && (
              <blockquote className="mt-6 rounded-2xl bg-paper p-5">
                <p className="whitespace-pre-line">{OWNER_MESSAGE}</p>
                <footer className="mt-2 font-bold">두꺼비통신 사장</footer>
              </blockquote>
            )}
          </div>
        </div>
      </section>
      <Wave className="fill-lily" flip />
    </>
  );
}

/** A9. 법적 표시. 입력되지 않은 항목은 행을 숨긴다. 페이지가 히어로처럼 연못으로 끝난다. */
export function Footer({ store }: { store: StoreInfo }) {
  // ActionBar와 같은 조건: 상담 채널이나 길찾기가 하나라도 있으면 모바일 하단 바가 있다.
  const hasBar = pickChannel(store, "call") !== null || mapHref(store) !== null;
  const rows = [
    ["상호", store.business_name],
    ["대표자", store.owner_name],
    ["사업자등록번호", store.business_reg_no],
    ["주소", [store.road_address, store.detail_address].filter(Boolean).join(" ")],
    ["연락처", store.phone],
  ].filter(([, v]) => v);
  return (
    <footer className="text-lily">
      <Wave className="fill-pond" />
      <div className="bg-pond">
        {/* 모바일 하단 액션바(약 4.6rem + 홈 인디케이터)에 가리지 않도록 rem으로 띄운다. PC에는 액션바가 없다. */}
        <div className={`${wrap} pt-8 md:pb-10 ${hasBar ? "pb-[calc(6.5rem+env(safe-area-inset-bottom))]" : "pb-10"}`}>
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="opacity-80">{k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          {store.preapproval_text && <p className="mt-4 whitespace-pre-line">{store.preapproval_text}</p>}
          <Link href="/privacy" className="mt-4 inline-flex min-h-12 items-center font-bold underline underline-offset-4">
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
