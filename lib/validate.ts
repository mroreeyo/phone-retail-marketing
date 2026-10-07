/** 국내 전화번호(휴대폰, 지역번호, 대표번호)를 하이픈 형식으로 정리한다. 형식이 틀리면 null. */
export function normalizePhone(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (/^01[016789]\d{7,8}$/.test(d)) return d.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  if (/^02\d{7,8}$/.test(d)) return d.replace(/^(02)(\d{3,4})(\d{4})$/, "$1-$2-$3");
  if (/^0[3-6]\d{8,9}$/.test(d)) return d.replace(/^(\d{3})(\d{3,4})(\d{4})$/, "$1-$2-$3");
  if (/^070\d{8}$/.test(d)) return d.replace(/^(070)(\d{4})(\d{4})$/, "$1-$2-$3");
  if (/^1[5-9]\d{6}$/.test(d)) return d.replace(/^(\d{4})(\d{4})$/, "$1-$2");
  return null;
}

/** 인스타그램 아이디: 앞의 @와 공백을 제거한다. 허용 문자가 아니면 null. */
export function normalizeInstagramId(input: string): string | null {
  const id = input.trim().replace(/^@/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(id) ? id : null;
}

/** "HH:MM" 또는 "HH:MM:SS"만 허용 */
export function isTime(v: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v);
}
