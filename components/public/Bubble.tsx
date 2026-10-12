import type { ReactNode } from "react";

/**
 * 두꺼비 말풍선. 꼬리는 위를 향하게 그려 두고, 위치와 방향은 tail 클래스로만 바꾼다.
 * 프리셋: TAIL.left(왼쪽 두꺼비), TAIL.right(오른쪽 두꺼비)
 */
export const TAIL = {
  left: "top-1/2 -left-[15px] -translate-y-1/2 -rotate-90",
  right: "top-1/2 -right-[15px] -translate-y-1/2 rotate-90",
};

export function Bubble({ tail, className = "", children }: { tail: string; className?: string; children: ReactNode }) {
  return (
    <div className={`relative rounded-3xl border-2 border-pond bg-paper px-4 py-3 ${className}`}>
      <svg viewBox="0 0 20 12" aria-hidden className={`absolute h-3 w-5 ${tail}`}>
        <path d="M0 12 L10 1 L20 12" className="fill-paper stroke-pond" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {children}
    </div>
  );
}

/** 작은 두꺼비가 왼쪽에서 말하는 한 줄. 히어로 아래 섹션에서 안내원 역할을 반복한다 (PRD 8.2). */
export function ToadSays({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      {/* 큰 글씨 모드에서도 글자 영역을 넓히도록 이미지는 px 고정 */}
      <img src="/mascot.webp" alt="" width={64} height={64} loading="lazy" className="size-16 shrink-0" />
      <Bubble tail={TAIL.left} className="min-w-0 flex-1 md:flex-none">
        {children}
      </Bubble>
    </div>
  );
}
