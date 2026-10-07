"use client";

import { useEffect, useRef, useState } from "react";

type NaverMaps = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => unknown;
  Marker: new (opts: Record<string, unknown>) => unknown;
};
declare global {
  interface Window {
    naver?: { maps: NaverMaps };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_NCP_MAP_CLIENT_ID;

/**
 * 섹션이 화면에 들어올 때만 네이버 지도 스크립트를 불러온다 (첫 로딩 성능 보호).
 * 등록되지 않은 도메인(배포 미리보기 등)이나 로드 실패 시에는 지도 영역을 숨긴다.
 */
export function NaverMap({ lat, lng, title }: { lat: number; lng: number; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!CLIENT_ID);

  useEffect(() => {
    const el = ref.current;
    if (!el || !CLIENT_ID) return;

    const draw = () => {
      const maps = window.naver?.maps;
      if (!maps) return setFailed(true);
      const center = new maps.LatLng(lat, lng);
      const map = new maps.Map(el, { center, zoom: 16, scaleControl: false, mapDataControl: false });
      new maps.Marker({ position: center, map, title });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (window.naver?.maps) return draw();
        // 인증 실패(등록되지 않은 도메인)는 스크립트가 이 전역 콜백으로 알려 준다.
        (window as unknown as { navermap_authFailure: () => void }).navermap_authFailure = () => setFailed(true);
        const s = document.createElement("script");
        s.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${CLIENT_ID}`;
        s.onload = draw;
        s.onerror = () => setFailed(true);
        document.head.appendChild(s);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lat, lng, title]);

  if (failed) return null;
  return <div ref={ref} className="h-56 w-full overflow-hidden rounded-2xl bg-cream" aria-label={`${title} 위치 지도`} role="img" />;
}
