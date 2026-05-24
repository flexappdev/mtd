import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { LISTS, TOTAL_RANKED } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Lists",
  description: "Editorial + community Top-100 lists across places, hotels, sights, food and media.",
};

export default function ListsIndex() {
  const tiles: SectionTile[] = LISTS.map((l) => ({
    id: l.id,
    title: l.title,
    subtitle: l.description,
    badge: l.trending ? "Trending" : undefined,
    meta: [l.curator, `${l.items} items`],
  }));
  return (
    <SectionPage
      crumb="Lists"
      title="Top 100 lists"
      tagline="Ranked editorial + community lists across places, hotels, sights, food and media."
      stats={[
        { label: "Lists", value: LISTS.length },
        { label: "Ranked items", value: TOTAL_RANKED.toLocaleString() },
      ]}
      tiles={tiles}
    />
  );
}
