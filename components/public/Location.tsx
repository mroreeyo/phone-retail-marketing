import { Fragment } from "react";
import type { BusinessHour, StoreInfo } from "@/lib/db/types";
import { hourRows } from "@/lib/format";
import { hasPhone, pickChannel, telHref } from "@/lib/links";
import { ToadSays } from "./Bubble";
import { LOCATION } from "./content";
import { CopyButton } from "./CopyButton";
import { wrap } from "./layout";
import { NaverMap } from "./NaverMap";

const label = "font-bold text-sub";

/** 인스타 아이디는 "_"와 "." 뒤에서만 줄을 바꾼다. 단어 중간에서 끊기면 옮겨 적기 어렵다. */
function breakableId(id: string) {
  return id.split(/(?<=[._])/).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </Fragment>
  ));
}

/**
 * A6. 찾아오시는 길과 연락처. 입력되지 않은 항목은 행 자체를 숨긴다.
 * 주소가 없으면 제목을 내용에 맞추고, 두꺼비가 위치를 물어볼 방법을 알려 준다.
 * 인스타 아이디는 복사할 수 있게 둔다: 카카오톡 인앱 브라우저에서는 DM 링크가 열리지 않을 때가 있다.
 */
export function Location({ store, hours }: { store: StoreInfo; hours: BusinessHour[] }) {
  const address = [store.road_address, store.detail_address].filter(Boolean).join(" ");
  const rows = hourRows(hours);
  const notes = [
    ["주차", store.parking],
    ["교통", store.transit],
    ["준비물", store.visit_items],
  ].filter(([, v]) => v);
  const phone = hasPhone(store);
  const instagram = store.instagram_id.trim();
  const hasMap = store.lat != null && store.lng != null;
  const visitInfo = Boolean(address) || rows.length > 0 || notes.length > 0;
  const askChannel = pickChannel(store, "dm");
  if (!visitInfo && !phone && !instagram) return null;

  return (
    <section id="location" className={`${wrap} relative py-10 md:py-16`}>
      {/* 연잎의 물결: 히어로와 연령별 항목의 물결 원을 이어받는 장식 */}
      <span aria-hidden className="pointer-events-none absolute top-4 right-4 size-28 rounded-full border-2 border-pad/30 md:size-40" />
      <span aria-hidden className="pointer-events-none absolute top-10 right-10 size-16 rounded-full border-2 border-pad/40 md:size-24" />
      <h2 className="relative font-display text-[1.6rem] leading-tight md:text-[2rem]">
        {visitInfo ? LOCATION.title : LOCATION.contactOnlyTitle}
      </h2>
      <div className={`relative mt-5 grid gap-6 ${hasMap ? "md:grid-cols-2 md:items-start md:gap-10" : "md:max-w-2xl"}`}>
        {hasMap && <NaverMap lat={store.lat!} lng={store.lng!} title={store.business_name} />}

        <div className="grid gap-5">
          {address ? (
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-lg font-bold">{address}</p>
              <CopyButton text={address} what="주소" />
            </div>
          ) : (
            askChannel && (
              <ToadSays>
                <p className="font-display text-[1.2rem] leading-snug">{LOCATION.noAddress[askChannel]}</p>
              </ToadSays>
            )
          )}

          {(phone || instagram) && (
            <dl className="grid gap-3">
              {phone && (
                <div>
                  <dt className={label}>전화</dt>
                  <dd>
                    <a
                      href={telHref(store)}
                      data-track="call"
                      className="inline-flex min-h-12 items-center text-xl font-bold tabular-nums underline underline-offset-4"
                    >
                      {store.phone}
                    </a>
                  </dd>
                </div>
              )}
              {instagram && (
                <div>
                  <dt className={label}>인스타그램</dt>
                  <dd className="flex items-center justify-between gap-3">
                    <span className="min-w-0 text-lg font-bold [overflow-wrap:anywhere]">@{breakableId(instagram)}</span>
                    <CopyButton text={instagram} what="아이디" />
                  </dd>
                </div>
              )}
            </dl>
          )}

          {rows.length > 0 && (
            <div>
              <h3 className={label}>영업시간</h3>
              <dl className="mt-1 grid grid-cols-[2.5rem_1fr] gap-y-1 text-lg tabular-nums">
                {rows.map((r) => (
                  <div key={r.day} className="contents">
                    <dt className="font-bold">{r.day}</dt>
                    <dd>{r.text}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-sub">임시 휴무는 페이지 맨 위 공지로 알려 드립니다.</p>
            </div>
          )}

          {notes.map(([k, v]) => (
            <div key={k}>
              <h3 className={label}>{k}</h3>
              <p className="whitespace-pre-line">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
