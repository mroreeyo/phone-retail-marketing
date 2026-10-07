import type { BusinessHour, StoreInfo } from "@/lib/db/types";
import { hourRows } from "@/lib/format";
import { CopyButton } from "./CopyButton";
import { NaverMap } from "./NaverMap";

/** A6. 찾아오시는 길. 입력되지 않은 항목은 행 자체를 숨긴다. */
export function Location({ store, hours }: { store: StoreInfo; hours: BusinessHour[] }) {
  const address = [store.road_address, store.detail_address].filter(Boolean).join(" ");
  const rows = hourRows(hours);
  const notes = [
    ["주차", store.parking],
    ["교통", store.transit],
    ["준비물", store.visit_items],
  ].filter(([, v]) => v);
  if (!address && rows.length === 0 && notes.length === 0) return null;

  return (
    <section id="location" className="mx-auto max-w-xl px-4 py-8">
      <h2 className="font-display text-[1.6rem] leading-tight">찾아오시는 길</h2>
      <div className="mt-4 grid gap-5">
        {store.lat != null && store.lng != null && (
          <NaverMap lat={store.lat} lng={store.lng} title={store.business_name} />
        )}

        {address && (
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-bold">{address}</p>
            <CopyButton text={address} />
          </div>
        )}

        {rows.length > 0 && (
          <div>
            <h3 className="font-bold text-sub">영업시간</h3>
            <dl className="mt-1 grid grid-cols-[2.5rem_1fr] gap-y-1 text-lg">
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
            <h3 className="font-bold text-sub">{k}</h3>
            <p className="whitespace-pre-line">{v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
