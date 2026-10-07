"use client";

import { saveNotices } from "@/lib/db/mutations";
import type { Notice, NoticeKind } from "@/lib/db/types";
import { SaveBar } from "./SaveBar";
import { cardCls, helpCls, inputCls, labelCls } from "./styles";
import { useDraft } from "./useDraft";

const SECTIONS: { kind: NoticeKind; title: string; help: string; titleLabel: string; bodyLabel: string }[] = [
  {
    kind: "top",
    title: "상단 공지",
    help: "고객 화면 맨 위에 표시됩니다. 제목을 비우면 사라집니다. 임시 휴무, 영업시간 변경을 알릴 때 쓰세요.",
    titleLabel: "공지 제목",
    bodyLabel: "자세한 내용 (선택)",
  },
  {
    kind: "campaign",
    title: "캠페인 띠",
    help: "추천폰 위의 진한 갈색 띠에 표시됩니다. 예: 헌 폰 줄게, 새 폰 다오",
    titleLabel: "캠페인 제목",
    bodyLabel: "설명 (선택)",
  },
];

export function NoticesForm({ notices }: { notices: Notice[] }) {
  const { draft, setDraft, dirty, commit } = useDraft(notices);
  const set = (kind: NoticeKind, patch: Partial<Notice>) =>
    setDraft((d) => d.map((n) => (n.kind === kind ? { ...n, ...patch } : n)));

  return (
    <main className="mx-auto grid max-w-2xl gap-6 px-4 pt-6 pb-48">
      {SECTIONS.map((s) => {
        const n = draft.find((x) => x.kind === s.kind);
        if (!n) return null;
        return (
          <section key={s.kind} className={`${cardCls} grid gap-4`}>
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className={helpCls}>{s.help}</p>
            <label className="grid gap-2">
              <span className={labelCls}>{s.titleLabel}</span>
              <input value={n.title} onChange={(e) => set(s.kind, { title: e.target.value })} className={inputCls} />
            </label>
            <label className="grid gap-2">
              <span className={labelCls}>{s.bodyLabel}</span>
              <textarea
                rows={2}
                value={n.body}
                onChange={(e) => set(s.kind, { body: e.target.value })}
                className={`${inputCls} py-3`}
              />
            </label>
            <label className="flex min-h-12 items-center gap-2">
              <input
                type="checkbox"
                checked={n.hidden}
                onChange={(e) => set(s.kind, { hidden: e.target.checked })}
                className="size-6 accent-brown"
              />
              사이트에서 잠시 숨기기 (내용은 남겨 둡니다)
            </label>
          </section>
        );
      })}
      <SaveBar dirty={dirty} onSave={() => commit(saveNotices)} />
    </main>
  );
}
