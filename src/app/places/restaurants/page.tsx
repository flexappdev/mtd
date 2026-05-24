import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { RESTAURANTS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Restaurants",
  description: "Tagine to tasting menu — Moroccan restaurants, cafés, street food.",
};

export default function RestaurantsPage() {
  const tiles: SectionTile[] = RESTAURANTS.map((r) => ({
    id: r.id,
    title: r.name,
    subtitle: findDestination(r.dest)?.name,
    badge: r.price,
    href: `/morocco/${r.dest}`,
    meta: [r.kind, "★".repeat(r.stars)],
  }));
  return (
    <SectionPage
      crumb="Places · Restaurants"
      title="Restaurants & cafés"
      tagline="Tagine to tasting menu — with the Jemaa el-Fna snail stall at #3."
      stats={[{ label: "Live", value: RESTAURANTS.length }]}
      tiles={tiles}
    />
  );
}
