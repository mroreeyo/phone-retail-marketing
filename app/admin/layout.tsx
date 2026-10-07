import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "두꺼비통신 관리",
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-dvh bg-paper">{children}</div>;
}
