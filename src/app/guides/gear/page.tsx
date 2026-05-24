import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function GuidesGearPage() {
  const tiles: SectionTile[] = GUIDES.filter((g) => g.kind === "gear").map((g) => ({
    id: g.id,
    title: g.title,
    subtitle: `★ ${g.rating} (${g.reviews.toLocaleString()} reviews)`,
    badge: g.price,
    meta: [g.asin, "Amazon"],
  }));
  return (
    <SectionPage
      crumb="Guides · Gear"
      title="Travel gear"
      tagline="Hiking shoes, sand tents, mirrorless cameras — the kit that makes Morocco easier."
      stats={[{ label: "Items", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
