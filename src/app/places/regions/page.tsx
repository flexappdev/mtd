import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, REGIONS } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function RegionsPage() {
  const tiles: SectionTile[] = REGIONS.map((r) => {
    const inRegion = DESTINATIONS.filter((d) => d.region === r.id);
    return {
      id: r.id,
      title: r.name,
      subtitle: `${inRegion.length} destination${inRegion.length === 1 ? "" : "s"}`,
      meta: [r.id],
    };
  });
  return (
    <SectionPage
      crumb="Places · Regions"
      title="Morocco regions"
      tagline="From the imperial heartland to the Sahara, the Atlas, the Atlantic coast, and the Mediterranean."
      stats={[{ label: "Regions", value: REGIONS.length }]}
      tiles={tiles}
    />
  );
}
