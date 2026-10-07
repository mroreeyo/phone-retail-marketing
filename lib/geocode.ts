// 네이버 클라우드 플랫폼 Maps Geocoding. 서버에서만 호출한다 (Secret 사용).
export async function geocode(address: string): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(
    `https://maps.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`,
    {
      headers: {
        "x-ncp-apigw-api-key-id": process.env.NEXT_PUBLIC_NCP_MAP_CLIENT_ID!,
        "x-ncp-apigw-api-key": process.env.NCP_MAPS_CLIENT_SECRET!,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as { addresses?: { x: string; y: string }[] };
  const first = body.addresses?.[0];
  return first ? { lat: Number(first.y), lng: Number(first.x) } : null;
}
