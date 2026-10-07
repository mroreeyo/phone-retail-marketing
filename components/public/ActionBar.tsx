import { InstagramLogoIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/ssr";
import type { StoreInfo } from "@/lib/db/types";
import { dmHref, mapHref, telHref } from "@/lib/links";

const base =
  "flex min-h-14 items-center justify-center gap-1 whitespace-nowrap rounded-2xl text-base font-bold leading-tight active:scale-[0.98]";

/** A1. 모든 고객 화면 하단에 고정. 전화 버튼이 가장 넓고 왼쪽. */
export function ActionBar({ store }: { store: StoreInfo }) {
  return (
    <nav
      aria-label="빠른 연락"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-brown/15 bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-xl grid-cols-[1.4fr_1fr_1fr] gap-1.5 px-2 py-2">
        <a href={telHref(store)} data-track="call" className={`${base} bg-brown text-paper`}>
          <PhoneIcon size="1.4em" weight="fill" aria-hidden />
          전화 상담
        </a>
        <a
          href={dmHref(store)}
          target="_blank"
          rel="noopener"
          data-track="dm"
          className={`${base} flex-col gap-0 border-2 border-brown bg-cream`}
        >
          <InstagramLogoIcon size="1.5em" weight="bold" aria-hidden />
          DM 문의
        </a>
        <a
          href={mapHref(store)}
          target="_blank"
          rel="noopener"
          data-track="map"
          className={`${base} flex-col gap-0 border-2 border-brown bg-cream`}
        >
          <MapPinIcon size="1.5em" weight="bold" aria-hidden />
          길찾기
        </a>
      </div>
    </nav>
  );
}
