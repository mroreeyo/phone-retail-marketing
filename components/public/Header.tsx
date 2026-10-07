"use client";

import { TextAaIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// 큰 글씨 상태의 원본은 <html data-large> 속성이다 (layout.tsx의 인라인 스크립트가 첫 렌더링 전에 설정).
const root = () => document.documentElement;
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(root(), { attributes: true, attributeFilter: ["data-large"] });
  return () => mo.disconnect();
};

export function Header() {
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
    <header className="sticky top-0 z-20 border-b border-brown/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-4">
        <Link href="/" className="font-display text-2xl leading-none">
          두꺼비통신
        </Link>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={large}
          data-track="large_text"
          className="flex min-h-12 items-center gap-1.5 rounded-2xl border-2 border-brown px-3 font-bold active:scale-[0.98] aria-pressed:bg-brown aria-pressed:text-paper"
        >
          <TextAaIcon size="1.4em" weight="bold" aria-hidden />
          큰 글씨
        </button>
      </div>
    </header>
  );
}
