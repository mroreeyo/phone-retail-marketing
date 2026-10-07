"use client";

import Script from "next/script";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { saveStore, type StoreInput } from "@/lib/db/mutations";
import type { BusinessHour } from "@/lib/db/types";
import { WEEK_ORDER, WEEKDAYS } from "@/lib/format";
import { SaveBar } from "./SaveBar";
import { cardCls, helpCls, inputCls, labelCls, smallBtn } from "./styles";
import { useDraft } from "./useDraft";

type Field = { key: keyof StoreInput; label: string; help: string; multiline?: boolean; type?: string };

const CONTACT: Field[] = [
  { key: "phone", label: "대표 전화번호", help: "고객 화면의 [전화 상담] 버튼이 이 번호로 연결됩니다.", type: "tel" },
  { key: "instagram_id", label: "인스타그램 아이디", help: "고객 화면의 [DM 문의] 버튼이 이 계정의 DM으로 연결됩니다." },
];
const VISIT: Field[] = [
  { key: "detail_address", label: "상세 주소", help: "건물명, 층, 호수. 찾아오시는 길의 주소 뒤에 붙습니다." },
  { key: "parking", label: "주차 안내", help: "찾아오시는 길의 [주차]에 표시됩니다. 비우면 숨겨집니다.", multiline: true },
  { key: "transit", label: "교통 안내", help: "찾아오시는 길의 [교통]에 표시됩니다. 비우면 숨겨집니다.", multiline: true },
  { key: "visit_items", label: "방문 준비물", help: "찾아오시는 길의 [준비물]에 표시됩니다. 예: 신분증, 쓰던 폰", multiline: true },
];
const LEGAL: Field[] = [
  { key: "business_name", label: "상호", help: "페이지 맨 아래 사업자 정보에 표시됩니다." },
  { key: "owner_name", label: "대표자", help: "페이지 맨 아래 사업자 정보에 표시됩니다." },
  { key: "business_reg_no", label: "사업자등록번호", help: "페이지 맨 아래 사업자 정보에 표시됩니다." },
  { key: "preapproval_text", label: "통신사 사전승낙 표시", help: "페이지 맨 아래에 그대로 표시됩니다.", multiline: true },
];

declare global {
  interface Window {
    daum?: { Postcode: new (o: Record<string, unknown>) => { embed: (el: HTMLElement) => void } };
  }
}

export function StoreForm({ store, hours }: { store: StoreInput; hours: BusinessHour[] }) {
  const { draft, setDraft, dirty, commit } = useDraft({ store, hours });
  const [findingAddress, setFindingAddress] = useState(false);

  const setStore = (key: keyof StoreInput, value: string) =>
    setDraft((d) => ({ ...d, store: { ...d.store, [key]: value } }));
  const setHour = (weekday: number, patch: Partial<BusinessHour>) =>
    setDraft((d) => ({ ...d, hours: d.hours.map((h) => (h.weekday === weekday ? { ...h, ...patch } : h)) }));
  const applyMonday = () =>
    setDraft((d) => {
      const mon = d.hours.find((h) => h.weekday === 1)!;
      return { ...d, hours: d.hours.map((h) => ({ ...h, open_time: mon.open_time, close_time: mon.close_time, closed: mon.closed })) };
    });

  const field = (f: Field) => (
    <label key={f.key} className="grid gap-2">
      <span className={labelCls}>{f.label}</span>
      {f.multiline ? (
        <textarea
          rows={2}
          value={draft.store[f.key]}
          onChange={(e) => setStore(f.key, e.target.value)}
          className={`${inputCls} py-3`}
        />
      ) : (
        <input
          type={f.type ?? "text"}
          value={draft.store[f.key]}
          onChange={(e) => setStore(f.key, e.target.value)}
          className={inputCls}
        />
      )}
      <span className={helpCls}>{f.help}</span>
    </label>
  );

  return (
    <main className="mx-auto grid max-w-2xl gap-6 px-4 pt-6 pb-48">
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

      <section className={`${cardCls} grid gap-5`}>
        <h2 className="text-xl font-bold">연락처</h2>
        {CONTACT.map(field)}
      </section>

      <section className={`${cardCls} grid gap-5`}>
        <h2 className="text-xl font-bold">위치와 방문 안내</h2>
        <div className="grid gap-2">
          <span className={labelCls}>도로명 주소</span>
          <div className="flex gap-2">
            <input readOnly value={draft.store.road_address} placeholder="주소 찾기를 눌러 선택" className={inputCls} />
            <button type="button" onClick={() => setFindingAddress(true)} className={`${smallBtn} shrink-0 bg-cream`}>
              주소 찾기
            </button>
          </div>
          <span className={helpCls}>찾아오시는 길의 주소, 지도, [길찾기] 버튼이 바뀝니다. 저장할 때 지도 위치를 자동으로 찾습니다.</span>
        </div>
        {VISIT.map(field)}
      </section>

      <section className={`${cardCls} grid gap-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">영업시간</h2>
          <button type="button" onClick={applyMonday} className={smallBtn}>
            월요일 시간 전체 적용
          </button>
        </div>
        <p className={helpCls}>
          찾아오시는 길의 요일별 영업시간이 바뀝니다. 시간을 비운 요일은 고객 화면에서 숨겨집니다. 임시 휴무나 특정
          날짜의 시간 변경은 [공지·이벤트] 탭의 상단 공지로 알려 주세요.
        </p>
        {WEEK_ORDER.map((wd) => {
          const h = draft.hours.find((x) => x.weekday === wd)!;
          return (
            <fieldset key={wd} className="grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-2">
              <legend className="sr-only">{WEEKDAYS[wd]}요일</legend>
              <span className="text-lg font-bold" aria-hidden>
                {WEEKDAYS[wd]}
              </span>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  type="time"
                  aria-label={`${WEEKDAYS[wd]}요일 여는 시간`}
                  disabled={h.closed}
                  value={h.open_time?.slice(0, 5) ?? ""}
                  onChange={(e) => setHour(wd, { open_time: e.target.value || null })}
                  className={`${inputCls} px-2 disabled:opacity-40`}
                />
                <span aria-hidden>~</span>
                <input
                  type="time"
                  aria-label={`${WEEKDAYS[wd]}요일 닫는 시간`}
                  disabled={h.closed}
                  value={h.close_time?.slice(0, 5) ?? ""}
                  onChange={(e) => setHour(wd, { close_time: e.target.value || null })}
                  className={`${inputCls} px-2 disabled:opacity-40`}
                />
              </div>
              <label className="col-start-2 flex min-h-12 items-center gap-2">
                <input
                  type="checkbox"
                  checked={h.closed}
                  onChange={(e) => setHour(wd, { closed: e.target.checked })}
                  className="size-6 accent-brown"
                />
                정기 휴무
              </label>
            </fieldset>
          );
        })}
      </section>

      <section className={`${cardCls} grid gap-5`}>
        <h2 className="text-xl font-bold">사업자 정보</h2>
        {LEGAL.map(field)}
      </section>

      <section className={`${cardCls} grid gap-2`}>
        <h2 className="text-xl font-bold">데이터 백업</h2>
        <p className={helpCls}>매장 정보, 추천폰, 공지를 파일로 내려받습니다. 한 달에 한 번 정도 보관해 두세요.</p>
        <a href="/admin/export" download className={`${smallBtn} justify-self-start`}>
          데이터 내보내기
        </a>
      </section>

      {findingAddress && (
        <AddressFinder
          onClose={() => setFindingAddress(false)}
          onSelect={(addr) => {
            setStore("road_address", addr);
            setFindingAddress(false);
          }}
        />
      )}

      <SaveBar dirty={dirty} onSave={() => commit((v) => saveStore(v.store, v.hours))} />
    </main>
  );
}

/** 카카오(Daum) 우편번호 서비스. 인앱 브라우저에서 팝업이 막히지 않도록 화면 안에 띄운다. */
function AddressFinder({ onSelect, onClose }: { onSelect: (roadAddress: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // 버튼을 누른 뒤에만 렌더링되므로 window를 바로 읽어도 된다.
  const [error] = useState(() => !window.daum?.Postcode);
  const select = useEffectEvent(onSelect);

  useEffect(() => {
    if (error || !ref.current) return;
    new window.daum!.Postcode({
      oncomplete: (data: { roadAddress: string }) => select(data.roadAddress),
      width: "100%",
      height: "100%",
    }).embed(ref.current);
  }, [error]);

  return (
    <div role="dialog" aria-modal="true" aria-label="주소 찾기" className="fixed inset-0 z-40 flex flex-col bg-paper">
      <div className="flex h-16 items-center justify-between border-b border-brown/15 px-4">
        <span className="text-lg font-bold">주소 찾기</span>
        <button type="button" onClick={onClose} className={smallBtn}>
          닫기
        </button>
      </div>
      {error ? (
        <p className="p-4 font-bold text-hot">주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
      ) : (
        <div ref={ref} className="flex-1" />
      )}
    </div>
  );
}
