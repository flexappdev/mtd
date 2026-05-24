import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, findRegion } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function MediaImagesPage() {
  const tiles: SectionTile[] = DESTINATIONS.map((d) => ({
    id: d.id,
    title: d.name,
    subtitle: findRegion(d.region)?.name,
    meta: [`${d.facts} facts`, `${d.sights} sights`],
    href: `/morocco/${d.id}`,
  }));
  return (
    <SectionPage
      crumb="Media · Images"
      title="Images"
      tagline="Editorial photography by destination. 4,200 curated stock images + AI-generated hero art."
      stats={[
        { label: "Destinations", value: DESTINATIONS.length },
        { label: "Stock", value: "4,200" },
      ]}
      tiles={tiles}
    />
  );
}
