"use client";

import { useEffect, useState } from "react";
import type { ActionResult } from "@/lib/db/types";

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "ok" } | { kind: "error"; message: string };

/** B7. 하단 고정 저장 버튼. 저장하지 않고 떠나려 하면 경고한다. */
export function SaveBar({ dirty, onSave }: { dirty: boolean; onSave: () => Promise<ActionResult> }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (!dirty) return;
    const msg = "저장하지 않은 변경 내용이 있습니다. 이동하면 사라집니다. 이동할까요?";
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    // 어드민 안의 탭 이동(클라이언트 내비게이션)은 beforeunload가 발생하지 않으므로 링크 클릭을 가로챈다.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]");
      if (a && a.getAttribute("target") !== "_blank" && !confirm(msg)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [dirty]);

  async function save() {
    setStatus({ kind: "saving" });
    try {
      const r = await onSave();
      setStatus(r.ok ? { kind: "ok" } : { kind: "error", message: r.message });
    } catch {
      setStatus({ kind: "error", message: "인터넷 연결을 확인해 주세요." });
    }
  }

  useEffect(() => {
    if (status.kind !== "ok") return;
    const t = setTimeout(() => setStatus({ kind: "idle" }), 4000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brown/15 bg-paper pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto grid max-w-2xl gap-2 px-4 py-3">
        <div aria-live="polite">
          {status.kind === "ok" && <p className="font-bold text-trust">저장했어요. 사이트에 바로 반영돼요.</p>}
          {status.kind === "error" && (
            <p className="font-bold text-hot" role="alert">
              {status.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={save}
          disabled={status.kind === "saving" || (!dirty && status.kind !== "error")}
          className="min-h-14 rounded-2xl bg-brown text-lg font-bold text-paper active:scale-[0.98] disabled:opacity-50"
        >
          {status.kind === "saving"
            ? "저장하는 중..."
            : status.kind === "error"
              ? "다시 시도"
              : dirty
                ? "저장하고 사이트에 반영"
                : "변경 사항 없음"}
        </button>
      </div>
    </div>
  );
}
