import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { LISTS, TOTAL_RANKED } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function ListsAllPage() {
  const tiles: SectionTile[] = LISTS.map((l) => ({
    id: l.id,
    title: l.title,
    subtitle: l.description,
    badge: l.trending ? "Trending" : undefined,
    meta: [l.curator, `${l.items} items`, l.kind],
  }));
  return (
    <SectionPage
      crumb="Lists · All"
      title="All curated lists"
      tagline="Every ranked list on MTD — editorial and community, across places, hotels, sights, food and media."
      stats={[
        { label: "Lists", value: LISTS.length },
        { label: "Ranked items", value: TOTAL_RANKED.toLocaleString() },
      ]}
      tiles={tiles}
    />
  );
}
