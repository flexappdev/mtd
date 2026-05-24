import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Guidebooks",
  description: "Lonely Planet, Rough Guide, phrasebooks — Amazon affiliate links.",
};

export default function GuidesBooksPage() {
  const tiles: SectionTile[] = GUIDES.filter((g) => g.kind === "guidebook").map((g) => ({
    id: g.id,
    title: g.title,
    subtitle: `★ ${g.rating} (${g.reviews.toLocaleString()} reviews)`,
    badge: g.price,
    meta: [g.asin, "Amazon"],
  }));
  return (
    <SectionPage
      crumb="Guides · Books"
      title="Guidebooks"
      tagline="The canonical Lonely Planet, Rough Guide and phrasebook titles — all affiliate-linked to Amazon."
      stats={[{ label: "Titles", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
