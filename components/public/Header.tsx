"use client";

import { InstagramLogoIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { StoreInfo } from "@/lib/db/types";
import { dmHref, hasPhone, mapHref, telHref } from "@/lib/links";
import { wrap } from "./layout";

// 큰 글씨 상태의 원본은 <html data-large> 속성이다 (layout.tsx의 인라인 스크립트가 첫 렌더링 전에 설정).
const root = () => document.documentElement;
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(root(), { attributes: true, attributeFilter: ["data-large"] });
  return () => mo.disconnect();
};

const deskLink =
  "inline-flex min-h-12 items-center gap-1.5 rounded-2xl px-3 font-bold transition-colors hover:bg-lily active:scale-[0.98]";

/** PC에서는 하단 액션바 대신 헤더에 연락처를 글자로 보여 준다 (A1의 PC 대응). */
function DesktopContacts({ store }: { store: StoreInfo }) {
  const map = mapHref(store);
  return (
    <nav aria-label="연락처" className="hidden items-center gap-1 md:flex">
      {hasPhone(store) && (
        <a href={telHref(store)} data-track="call" className={`${deskLink} tabular-nums`}>
          <PhoneIcon size="1.2em" weight="fill" aria-hidden />
          {store.phone}
        </a>
      )}
      {store.instagram_id.trim() && (
        <a href={dmHref(store)} target="_blank" rel="noopener" data-track="dm" className={deskLink}>
          <InstagramLogoIcon size="1.2em" weight="bold" aria-hidden />
          인스타 DM
        </a>
      )}
      {map && (
        <a href={map} target="_blank" rel="noopener" data-track="map" className={deskLink}>
          <MapPinIcon size="1.2em" weight="bold" aria-hidden />
          길찾기
        </a>
      )}
    </nav>
  );
}

export function Header({ store }: { store: StoreInfo }) {
  const large = useSyncExternalStore(subscribe, () => root().hasAttribute("data-large"), () => false);

  function toggle() {
    const next = !large;
    root().toggleAttribute("data-large", next);
    try {
      localStorage.setItem("large-text", next ? "1" : "0");
    } catch {
      // 저장소를 쓸 수 없는 인앱 브라우저에서는 이번 방문에만 적용된다.
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-pond/10 bg-paper/95 backdrop-blur">
      <div className={`${wrap} flex h-16 items-center justify-between gap-3`}>
        <Link href="/" className="font-display text-2xl leading-none">
          두꺼비통신
        </Link>
        <div className="flex items-center gap-2">
          <DesktopContacts store={store} />
          <button
            type="button"
            onClick={toggle}
            aria-pressed={large}
            data-track="large_text"
            className="group flex min-h-12 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border-2 border-pond px-3 font-bold transition-colors hover:bg-lily active:scale-[0.98] aria-pressed:bg-pond aria-pressed:text-paper aria-pressed:hover:bg-pond/90"
          >
            큰 글씨
            {/* 켜짐/꺼짐이 보이는 스위치 모양. 다른 일반 버튼과 구분된다. */}
            <span aria-hidden className="relative ml-1 h-6 w-10 rounded-full border-2 border-current">
              <span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-current transition-transform group-aria-pressed:translate-x-4" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
