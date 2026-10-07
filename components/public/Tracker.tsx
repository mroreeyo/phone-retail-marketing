"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA = process.env.NEXT_PUBLIC_GA_ID;
const NAVER = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;

/** A10. data-track 속성이 붙은 요소의 클릭을 GA4 이벤트로 보낸다. ID가 없으면 아무것도 로드하지 않는다. */
export function Tracker() {
  useEffect(() => {
    if (!GA) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("[data-track]");
      if (el) window.gtag?.("event", el.dataset.track);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return (
    <>
      {GA && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="lazyOnload" />
          <Script id="ga" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA}');`}
          </Script>
        </>
      )}
      {NAVER && (
        <Script
          src="https://wcs.naver.net/wcslog.js"
          strategy="lazyOnload"
          onLoad={() => {
            const w = window as unknown as { wcs_add?: Record<string, string>; wcs_do?: () => void };
            w.wcs_add = w.wcs_add ?? {};
            w.wcs_add.wa = NAVER;
            w.wcs_do?.();
          }}
        />
      )}
    </>
  );
}
