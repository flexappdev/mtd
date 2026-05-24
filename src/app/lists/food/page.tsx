import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { RESTAURANTS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Top 100 restaurants in Morocco",
  description: "Tagine to tasting menu — with the Jemaa el-Fna snail stall at #3.",
};

export default function ListsFoodPage() {
  const sorted = [...RESTAURANTS].sort((a, b) => b.clicks30 - a.clicks30);
  const tiles: SectionTile[] = sorted.map((r, i) => ({
    id: r.id,
    title: `#${i + 1} · ${r.name}`,
    subtitle: findDestination(r.dest)?.name,
    badge: r.price,
    href: `/morocco/${r.dest}`,
    meta: [r.kind, "★".repeat(r.stars)],
  }));
  return (
    <SectionPage
      crumb="Lists · Top food"
      title="Top 100 restaurants in Morocco"
      tagline="Tagine to tasting menu — with the Jemaa el-Fna snail stall at #3."
      stats={[{ label: "Ranked", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
