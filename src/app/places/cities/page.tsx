import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, REGIONS, findRegion } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function CitiesPage() {
  const cities = DESTINATIONS.filter((d) => d.kind === "city");
  const tiles: SectionTile[] = cities.map((d) => ({
    id: d.id,
    title: d.name,
    subtitle: d.position,
    badge: d.status,
    href: `/morocco/${d.id}`,
    meta: [findRegion(d.region)?.name ?? d.region, `${d.hotels} hotels`, `${d.sights} sights`],
  }));
  return (
    <SectionPage
      crumb="Places · Cities"
      title="Moroccan cities"
      tagline="Marrakech, Fes, Chefchaouen, Casablanca and the rest — across 5 regions."
      stats={[
        { label: "Cities", value: cities.length },
        { label: "Regions", value: REGIONS.length },
      ]}
      tiles={tiles}
    />
  );
}
