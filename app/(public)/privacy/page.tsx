import type { Metadata } from "next";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "개인정보처리방침 | 두꺼비통신" };

// TODO(운영자 확인, Q3·Q8): 본문은 출시 전에 사장님과 법무 확인을 거쳐 확정한다.
export default function Privacy() {
  return (
    <article className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display text-[1.8rem]">개인정보처리방침</h1>
      <div className="mt-6 grid gap-6 [&_h2]:text-xl [&_h2]:font-bold">
        <section>
          <h2>1. 수집하는 개인정보</h2>
          <p className="mt-2">
            이 사이트는 회원가입이 없으며, 방문자의 이름이나 연락처를 직접 수집하지 않습니다. 상담은 전화와
            인스타그램 DM으로 진행됩니다.
          </p>
        </section>
        <section>
          <h2>2. 방문 통계</h2>
          <p className="mt-2">
            사이트 개선을 위해 방문 통계 도구(Google Analytics, 네이버 애널리틱스)를 사용할 수 있으며, 이 도구는
            쿠키를 통해 개인을 식별할 수 없는 이용 기록을 수집합니다.
          </p>
        </section>
        <section>
          <h2>3. 문의</h2>
          <p className="mt-2">개인정보 관련 문의는 매장 대표 전화로 연락해 주세요.</p>
        </section>
        <p className="rounded-2xl bg-cream p-4 font-bold">확인 필요: 이 문서는 출시 전에 확정될 초안입니다.</p>
      </div>
    </article>
  );
}
