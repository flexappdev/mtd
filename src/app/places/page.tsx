import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, HOTELS, RESTAURANTS, SIGHTS, findRegion } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Places",
  description: "Browse Morocco by region, city, sight, hotel, or restaurant.",
};

const SECTIONS: SectionTile[] = [
  { id: "regions", title: "Regions", subtitle: "5 regions, from coast to desert", href: "/places/regions" },
  { id: "cities", title: "Cities", subtitle: "14 cities & towns with travel info", href: "/places/cities" },
  { id: "sights", title: "Sights", subtitle: "212 kasbahs, ruins, viewpoints, beaches", href: "/places/sights" },
  { id: "hotels", title: "Hotels", subtitle: "Riads, resorts, kasbah hotels, desert camps", href: "/places/hotels" },
  { id: "restaurants", title: "Restaurants", subtitle: "Restaurants, cafés, street food, tea houses", href: "/places/restaurants" },
];

type Search = { q?: string };

export default async function PlacesIndex({ searchParams }: { searchParams: Promise<Search> }) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  if (!query) {
    return (
      <SectionPage
        crumb="Places"
        title="Places in Morocco"
        tagline="Browse Morocco by region, city, sight, hotel, or restaurant."
        tiles={SECTIONS}
      />
    );
  }

  const cities: SectionTile[] = DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query) || d.position.toLowerCase().includes(query)).map((d) => ({
    id: `city-${d.id}`,
    title: d.name,
    subtitle: d.position,
    meta: [findRegion(d.region)?.name ?? d.region, `${d.hotels} hotels`, `${d.sights} sights`],
    href: `/morocco/${d.id}`,
  }));
  const hotels: SectionTile[] = HOTELS.filter((h) => h.name.toLowerCase().includes(query)).map((h) => ({
    id: `hotel-${h.id}`,
    title: h.name,
    subtitle: `${"★".repeat(h.stars)}`,
    meta: ["Hotel", h.dest],
    href: `/places/hotels#${h.id}`,
  }));
  const sights: SectionTile[] = SIGHTS.filter((s) => s.name.toLowerCase().includes(query)).map((s) => ({
    id: `sight-${s.id}`,
    title: s.name,
    subtitle: s.kind,
    meta: ["Sight", s.dest, ...(s.unesco ? ["UNESCO"] : [])],
    badge: s.unesco ? "UNESCO" : undefined,
    href: `/morocco/${s.dest}#${s.id}`,
  }));
  const restaurants: SectionTile[] = RESTAURANTS.filter((r) => r.name.toLowerCase().includes(query)).map((r) => ({
    id: `rest-${r.id}`,
    title: r.name,
    subtitle: r.kind,
    meta: ["Restaurant", r.dest, r.price],
    href: `/places/restaurants#${r.id}`,
  }));

  const tiles = [...cities, ...hotels, ...sights, ...restaurants];

  return (
    <SectionPage
      crumb={`Search · ${q}`}
      title={`Results for “${q}”`}
      tagline={`${tiles.length} match${tiles.length === 1 ? "" : "es"} across cities, hotels, sights and restaurants.`}
      stats={[
        { label: "Cities", value: cities.length },
        { label: "Hotels", value: hotels.length },
        { label: "Sights", value: sights.length },
        { label: "Restaurants", value: restaurants.length },
      ]}
      tiles={tiles}
      emptyMessage={`No matches for “${q}”. Try a city, hotel name, or “UNESCO”.`}
    />
  );
}
