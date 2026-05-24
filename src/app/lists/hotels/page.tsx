import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { HOTELS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function ListsHotelsPage() {
  const sorted = [...HOTELS].sort((a, b) => b.rev30 - a.rev30);
  const tiles: SectionTile[] = sorted.map((h, i) => ({
    id: h.id,
    title: `#${i + 1} · ${h.name}`,
    subtitle: findDestination(h.dest)?.name,
    badge: `${h.stars}★`,
    href: `/morocco/${h.dest}`,
    meta: [`€${h.rev30.toLocaleString()} rev/30d`, `${h.clicks30.toLocaleString()} clicks/30d`],
  }));
  return (
    <SectionPage
      crumb="Lists · Top hotels"
      title="Top 100 hotels in Morocco"
      tagline="Ranked on revenue contribution — the riads, palaces and desert camps that drive bookings."
      stats={[{ label: "Ranked", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
