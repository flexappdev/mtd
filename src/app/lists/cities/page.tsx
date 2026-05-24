import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, findRegion } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Top 50 cities in Morocco",
  description: "Imperial capitals, coastal ports and Atlas towns, ranked.",
};

export default function ListsCitiesPage() {
  const cities = DESTINATIONS.filter((d) => d.kind === "city").sort((a, b) => b.clicks30 - a.clicks30);
  const tiles: SectionTile[] = cities.map((c, i) => ({
    id: c.id,
    title: `#${i + 1} · ${c.name}`,
    subtitle: c.position,
    meta: [findRegion(c.region)?.name ?? c.region, `${c.clicks30.toLocaleString()} clicks/30d`],
    href: `/morocco/${c.id}`,
  }));
  return (
    <SectionPage
      crumb="Lists · Top cities"
      title="Top 50 cities in Morocco"
      tagline="Imperial capitals, coastal ports and Atlas towns — ranked on traffic and editorial weight."
      stats={[{ label: "Ranked", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
