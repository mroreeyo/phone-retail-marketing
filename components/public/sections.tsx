import {
  CaretDownIcon,
  ChatCircleTextIcon,
  CheckCircleIcon,
  PhoneIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { Notice, Phone, PriceMode, StoreInfo } from "@/lib/db/types";
import { updatedLabel } from "@/lib/format";
import { dmHref, phoneImageUrl, telHref } from "@/lib/links";
import { AGE_CHOICES, HERO, OWNER_MESSAGE, PROMISES } from "./content";

const ctaCall =
  "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brown px-5 text-lg font-bold text-paper active:scale-[0.98]";
const ctaDm =
  "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-brown bg-paper px-5 text-lg font-bold active:scale-[0.98]";
const h2 = "font-display text-[1.6rem] leading-tight";

/** A5. 상단 공지. 제목이 비어 있으면 표시하지 않는다 (숨김은 RLS가 걸러냄). */
export function TopNotice({ notice }: { notice?: Notice }) {
  if (!notice?.title) return null;
  return (
    <aside className="bg-brown text-paper">
      <div className="mx-auto flex max-w-xl gap-2 px-4 py-3">
        <WarningCircleIcon size="1.4em" weight="fill" className="mt-0.5 shrink-0 text-gold" aria-hidden />
        <p>
          <strong>{notice.title}</strong>
          {notice.body && <span className="block text-cream">{notice.body}</span>}
        </p>
      </div>
    </aside>
  );
}

/** A2. 첫 화면에 마스코트, 슬로건, 통신 3사 비교 메시지, 전화 버튼 */
export function Hero({ store }: { store: StoreInfo }) {
  return (
    <section className="bg-gold">
      <div className="mx-auto grid max-w-xl grid-cols-[1fr_auto] items-end gap-3 px-4 pt-6 pb-6">
        <h1 className="col-span-2 font-display text-[2.1rem] leading-[1.15] whitespace-pre-line">{HERO.title}</h1>
        <p className="font-medium">{HERO.sub}</p>
        {/* 큰 글씨 모드에서 글자 영역을 넓히도록 이미지는 px 고정 */}
        <img
          src="/mascot.webp"
          alt="전화하는 황금 두꺼비 마스코트"
          width={112}
          height={112}
          fetchPriority="high"
          className="size-[112px]"
        />
        <a href={telHref(store)} data-track="call" className={`${ctaCall} col-span-2 mt-2`}>
          <PhoneIcon size="1.3em" weight="fill" aria-hidden />
          전화 상담
        </a>
      </div>
    </section>
  );
}

/** A3. 연령별 상담 선택. 누르면 안내가 펼쳐지고 DM 또는 전화로 끝난다. */
export function AgeChoices({ store }: { store: StoreInfo }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <h2 className={h2}>어떤 상담이 필요하세요?</h2>
      <div className="mt-4 grid gap-3">
        {AGE_CHOICES.map((c) => (
          <details key={c.key} className="group rounded-2xl border-2 border-brown bg-cream open:bg-paper">
            <summary
              data-track={`age_${c.key}`}
              className="flex min-h-16 cursor-pointer list-none items-center justify-between px-5 text-xl font-bold [&::-webkit-details-marker]:hidden"
            >
              {c.label}
              <CaretDownIcon size="1.2em" weight="bold" className="transition group-open:rotate-180" aria-hidden />
            </summary>
            <div className="grid gap-4 px-5 pb-5">
              <p>{c.guide}</p>
              {c.cta === "dm" ? (
                <a href={dmHref(store)} target="_blank" rel="noopener" data-track="dm" className={ctaDm}>
                  <ChatCircleTextIcon size="1.3em" weight="bold" aria-hidden />
                  DM 문의
                </a>
              ) : (
                <a href={telHref(store)} data-track="call" className={ctaCall}>
                  <PhoneIcon size="1.3em" weight="fill" aria-hidden />
                  전화 상담
                </a>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/** A5. 캠페인 띠. 어드민에서 숨기면 RLS가 걸러내 섹션이 사라진다. */
export function CampaignBand({ notice }: { notice?: Notice }) {
  if (!notice?.title) return null;
  return (
    <section className="bg-brown text-paper">
      <div className="mx-auto max-w-xl px-4 py-7">
        <p className="font-display text-[1.8rem] leading-tight text-cream">{notice.title}</p>
        {notice.body && <p className="mt-2">{notice.body}</p>}
      </div>
    </section>
  );
}

/** A4. 이번 주 추천폰. 노출할 항목이 없으면 섹션 전체를 숨긴다. */
export function Phones({ phones, priceMode, store }: { phones: Phone[]; priceMode: PriceMode; store: StoreInfo }) {
  if (phones.length === 0) return null;
  return (
    <section className="mx-auto max-w-xl px-4 py-8">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className={h2}>이번 주 추천폰</h2>
        <p className="text-sub">{updatedLabel(phones)}</p>
      </div>
      <ul className="mt-4 grid gap-4">
        {phones.map((p) => (
          <li key={p.id} className="grid grid-cols-[6rem_1fr] gap-4 rounded-2xl bg-cream p-4">
            {p.image_path ? (
              <img
                src={phoneImageUrl(p.image_path)}
                alt={p.name}
                loading="lazy"
                className="aspect-[3/4] w-24 rounded-xl bg-paper object-contain"
              />
            ) : (
              <div className="aspect-[3/4] w-24 rounded-xl bg-paper" aria-hidden />
            )}
            <div className="min-w-0">
              {p.category && <p className="text-sub">{p.category}</p>}
              <h3 className="text-xl font-bold leading-snug">{p.name}</h3>
              {p.summary && <p className="mt-1">{p.summary}</p>}
              {priceMode === "public" && p.price_text ? (
                <p className="mt-2 text-xl font-bold text-hot">{p.price_text}</p>
              ) : (
                <a
                  href={dmHref(store)}
                  target="_blank"
                  rel="noopener"
                  data-track="dm"
                  className="mt-3 flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border-2 border-brown bg-paper px-3 font-bold active:scale-[0.98]"
                >
                  오늘 가격 DM으로 받기
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** ⑤ 약속 3가지 + 사장님 한마디 */
export function Promises() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-xl px-4 py-8">
        <h2 className={h2}>두꺼비가 약속합니다</h2>
        <ul className="mt-4 grid gap-3">
          {PROMISES.map((text) => (
            <li key={text} className="flex gap-2 text-lg">
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
    </section>
  );
}

/** A9. 법적 표시. 입력되지 않은 항목은 행을 숨긴다. */
export function Footer({ store }: { store: StoreInfo }) {
  const rows = [
    ["상호", store.business_name],
    ["대표자", store.owner_name],
    ["사업자등록번호", store.business_reg_no],
    ["주소", [store.road_address, store.detail_address].filter(Boolean).join(" ")],
    ["연락처", store.phone],
  ].filter(([, v]) => v);
  return (
    <footer className="bg-brown text-cream">
      <div className="mx-auto max-w-xl px-4 pt-8 pb-32">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          {rows.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="opacity-80">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {store.preapproval_text && <p className="mt-4 whitespace-pre-line">{store.preapproval_text}</p>}
        <Link href="/privacy" className="mt-4 inline-flex min-h-12 items-center font-bold underline underline-offset-4">
          개인정보처리방침
        </Link>
      </div>
    </footer>
  );
}
