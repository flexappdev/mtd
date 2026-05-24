import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function GuidesCookbooksPage() {
  const tiles: SectionTile[] = GUIDES.filter((g) => g.kind === "cookbook" || g.kind === "cooking").map((g) => ({
    id: g.id,
    title: g.title,
    subtitle: `★ ${g.rating} (${g.reviews.toLocaleString()} reviews)`,
    badge: g.price,
    meta: [g.kind, g.asin],
  }));
  return (
    <SectionPage
      crumb="Guides · Cookbooks"
      title="Cookbooks"
      tagline="Mourad, Paula Wolfert and the tagines they cook from — plus the pots themselves."
      stats={[{ label: "Titles", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
