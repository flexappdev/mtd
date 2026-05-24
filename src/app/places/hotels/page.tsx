import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { HOTELS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

function bestRate(rates: Record<string, number | null>): number | null {
  const vals = Object.values(rates).filter((v): v is number => typeof v === "number");
  return vals.length ? Math.min(...vals) : null;
}

export default function HotelsPage() {
  const tiles: SectionTile[] = HOTELS.map((h) => {
    const rate = bestRate(h.rates as unknown as Record<string, number | null>);
    return {
      id: h.id,
      title: h.name,
      subtitle: findDestination(h.dest)?.name,
      badge: `${h.stars}★`,
      href: `/morocco/${h.dest}`,
      meta: [rate ? `from €${rate}` : "rate tbd", `${h.clicks30.toLocaleString()} clicks/30d`],
    };
  });
  return (
    <SectionPage
      crumb="Places · Hotels"
      title="Hotels & riads"
      tagline="From the Royal Mansour to clifftop Atlas retreats and Sahara desert camps."
      stats={[{ label: "Hotels (live)", value: HOTELS.length }]}
      tiles={tiles}
    />
  );
}
