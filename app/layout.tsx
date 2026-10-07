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

// 1) 큰 글씨: 정적 페이지가 기본 크기로 그려진 뒤 커지는 깜빡임을 막기 위해 첫 렌더링 전에 적용한다.
// 2) Netlify가 *.netlify.app의 <head>에 끼워 넣는 주석과 공백 노드를 지운다. 남겨 두면 React가
//    하이드레이션 오류(#418)를 내고 페이지 전체를 다시 그린다. 커스텀 도메인으로 옮긴 뒤에도 해롭지 않다.
const headScript = `try{if(localStorage.getItem("large-text")==="1")document.documentElement.dataset.large=""}catch(e){}for(var n of Array.from(document.head.childNodes))if(n.nodeType===8||(n.nodeType===3&&!n.textContent.trim()))n.remove();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${noto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
