import { Location } from "@/components/public/Location";
import { AgeChoices, CampaignBand, Hero, Phones, Promises, TopNotice } from "@/components/public/sections";
import { getSiteData } from "@/lib/db/queries";
import type { SiteData } from "@/lib/db/types";

export const dynamic = "force-static";

export default async function Home() {
  const data = await getSiteData();
  const { store, hours, phones, notices, settings } = data;
  const notice = (kind: string) => notices.find((n) => n.kind === kind);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness(data)) }} />
      <TopNotice notice={notice("top")} />
      <Hero store={store} />
      <AgeChoices store={store} />
      <CampaignBand notice={notice("campaign")} />
      <Phones phones={phones} priceMode={settings.price_mode} store={store} />
      <Promises />
      <Location store={store} hours={hours} />
    </>
  );
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function localBusiness({ store, hours }: SiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "MobilePhoneStore",
    name: store.business_name,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: store.phone || undefined,
    address: store.road_address
      ? { "@type": "PostalAddress", streetAddress: `${store.road_address} ${store.detail_address}`.trim(), addressCountry: "KR" }
      : undefined,
    geo: store.lat != null ? { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng } : undefined,
    sameAs: [`https://www.instagram.com/${store.instagram_id}`],
    openingHoursSpecification: hours
      .filter((h) => !h.closed && h.open_time && h.close_time)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: DAYS[h.weekday],
        opens: h.open_time!.slice(0, 5),
        closes: h.close_time!.slice(0, 5),
      })),
  };
}
