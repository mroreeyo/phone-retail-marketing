import { InstagramLogoIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import type { StoreInfo } from "@/lib/db/types";
import { dmHref, mapHref, pickChannel, telHref } from "@/lib/links";

const base =
  "flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 py-1 text-center text-base font-bold leading-tight transition-colors in-data-large:text-[0.9rem] active:scale-[0.98]";
const outline = `${base} border-2 border-pond bg-lily`;
const COLS = ["", "grid-cols-1", "grid-cols-[1.25fr_1fr]", "grid-cols-[1.1fr_1fr_0.9fr]"];

/**
 * A1. 모든 고객 화면 하단에 고정. 첫 번째 버튼이 가장 넓고 왼쪽이며, 히어로의 주 버튼과 같은 금색이다.
 * 연락처가 비어 있는 버튼은 그리지 않는다: 번호가 없으면 DM이 첫 자리로 오고, 주소가 없으면 길찾기를 숨긴다.
 * PC(md 이상)에서는 헤더가 연락처를 보여 주므로 숨긴다.
 */
export function ActionBar({ store }: { store: StoreInfo }) {
  const first = pickChannel(store, "call");
  const map = mapHref(store);
  const items: ReactNode[] = [];

  if (first === "call") {
    items.push(
      <a key="call" href={telHref(store)} data-track="call" className={`${base} bg-gold text-pond`}>
        <PhoneIcon size="1.4em" weight="fill" aria-hidden />
        <span>
          전화 상담
        </span>
      </a>,
    );
  }
  if (pickChannel(store, "dm") === "dm") {
    items.push(
      <a
        key="dm"
        href={dmHref(store)}
        target="_blank"
        rel="noopener"
        data-track="dm"
        className={first === "dm" ? `${base} bg-gold text-pond` : outline}
      >
        <InstagramLogoIcon size="1.5em" weight="bold" aria-hidden />
        인스타 DM
      </a>,
    );
  }
  if (map) {
    items.push(
      <a key="map" href={map} target="_blank" rel="noopener" data-track="map" className={outline}>
        <MapPinIcon size="1.5em" weight="bold" aria-hidden />
        길찾기
      </a>,
    );
  }
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="빠른 연락"
      className="fixed inset-x-0 bottom-0 z-30 border-t md:hidden border-pond/15 bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <div className={`mx-auto grid max-w-xl gap-1.5 px-2 py-2 ${COLS[items.length]}`}>{items}</div>
    </nav>
  );
}
