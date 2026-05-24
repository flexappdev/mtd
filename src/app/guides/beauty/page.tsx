import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function GuidesBeautyPage() {
  const tiles: SectionTile[] = GUIDES.filter((g) => g.kind === "beauty").map((g) => ({
    id: g.id,
    title: g.title,
    subtitle: `★ ${g.rating} (${g.reviews.toLocaleString()} reviews)`,
    badge: g.price,
    meta: [g.asin, "Amazon"],
  }));
  return (
    <SectionPage
      crumb="Guides · Beauty"
      title="Argan & beauty"
      tagline="Argan oil, hammam gift sets, rose water — the Morocco-specific beauty shelf."
      stats={[{ label: "Items", value: tiles.length }]}
      tiles={tiles}
      emptyMessage="Beauty assortment expanding — check back soon for argan, hammam and rose products."
    />
  );
}
