"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/db/types";

/** 편집 중인 값과 마지막 저장 값을 비교해 dirty를 계산한다. 저장에 성공하면 기준값을 갱신한다. */
export function useDraft<T>(initial: T) {
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  /** save가 next를 돌려주면(서버에서 id가 붙은 값 등) 편집 값과 기준값을 모두 그 값으로 바꾼다. */
  async function commit(save: (value: T) => Promise<ActionResult & { next?: T }>): Promise<ActionResult> {
    const r = await save(draft);
    if (r.ok) {
      const value = r.next ?? draft;
      if (r.next) setDraft(r.next);
      setSaved(value);
    }
    return r;
  }

  return { draft, setDraft, dirty, commit };
}
