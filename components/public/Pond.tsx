/**
 * 연못 물결 경계선. 아래쪽이 채워진 물결이라, 다음 섹션의 색(fill-*)으로 그리면 그 섹션이 물결로 차오른다.
 * flip: 위아래를 뒤집어, 위 섹션의 색이 물결로 흘러내리게 한다.
 */
export function Wave({ className, flip = false }: { className: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      className={`block h-6 w-full md:h-10 ${flip ? "-scale-y-100" : ""} ${className}`}
    >
      <path d="M0 48h1440V22c-140 16-260 22-380 14S820 8 700 12 470 36 340 36 110 22 0 12z" />
    </svg>
  );
}
