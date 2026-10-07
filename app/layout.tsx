import type { Metadata, Viewport } from "next";
import { Jua, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const jua = Jua({ weight: "400", subsets: ["latin"], variable: "--font-jua", display: "swap", preload: false });
const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-noto", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "두꺼비통신 | 광주 휴대폰 판매점",
  description: "가격은 낮게, 신뢰는 높게. SKT, KT, LG U+ 통신 3사를 한자리에서 비교해 개통하는 광주 휴대폰 성지 두꺼비통신입니다.",
  keywords: ["광주 휴대폰 성지", "광주 휴대폰 판매점", "두꺼비통신", "휴대폰 비교 개통"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "두꺼비통신",
    title: "두꺼비통신 | 광주 휴대폰 판매점",
    description: "가격은 낮게, 신뢰는 높게. 통신 3사를 한자리에서 비교해 개통합니다.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5b41e",
  viewportFit: "cover",
};

// 정적 페이지가 기본 크기로 그려진 뒤 커지는 깜빡임을 막기 위해 첫 렌더링 전에 적용한다.
const largeTextScript = `try{if(localStorage.getItem("large-text")==="1")document.documentElement.dataset.large=""}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${noto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: largeTextScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
