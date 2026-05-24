import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, REGIONS } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Map",
  description: "Interactive map of Morocco — pinned destinations, region-coloured.",
};

export default function MediaMapPage() {
  const tiles: SectionTile[] = REGIONS.map((r) => {
    const inRegion = DESTINATIONS.filter((d) => d.region === r.id);
    return {
      id: r.id,
      title: r.name,
      subtitle: `${inRegion.length} pins`,
      meta: inRegion.slice(0, 4).map((d) => d.name),
    };
  });
  return (
    <SectionPage
      crumb="Media · Map"
      title="Map of Morocco"
      tagline="Interactive map coming — pinned destinations, region-coloured, with rolling click stats."
      stats={[
        { label: "Regions", value: REGIONS.length },
        { label: "Pins", value: DESTINATIONS.length },
      ]}
      tiles={tiles}
      emptyMessage="The live map is rendering soon. Until then, the region breakdown above lists all pins."
    />
  );
}
