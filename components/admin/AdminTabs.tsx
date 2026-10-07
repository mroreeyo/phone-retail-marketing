"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin/store", label: "매장 정보" },
  { href: "/admin/phones", label: "추천폰" },
  { href: "/admin/notices", label: "공지·이벤트" },
];

export function AdminTabs() {
  const path = usePathname();
  return (
    <nav aria-label="관리 메뉴" className="mx-auto grid max-w-2xl grid-cols-3 px-2">
      {TABS.map((t) => {
        const active = path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className="flex min-h-12 items-center justify-center border-b-4 border-transparent font-bold text-cream aria-[current=page]:border-gold aria-[current=page]:text-paper"
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
