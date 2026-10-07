"use client";

import { CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt("주소를 길게 눌러 복사하세요", text);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-12 shrink-0 items-center gap-1 rounded-2xl border-2 border-brown px-3 font-bold active:scale-[0.98]"
    >
      <CopyIcon size="1.2em" weight="bold" aria-hidden />
      <span aria-live="polite">{done ? "복사됨" : "복사"}</span>
    </button>
  );
}
