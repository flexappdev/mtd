import { PageHeader } from "@/components/v2/PageHeader";
import { MapClient } from "@/components/v2/MapClient";
import { DESTINATIONS, REGIONS, findRegion } from "@/lib/mtd-v2/seed";
import { listArticles } from "@/lib/wikivoyage";
import type { MapPin } from "@/components/v2/LeafletMap";

export const revalidate = 300;

export const metadata = {
  title: "Map",
  description: "Interactive map of Morocco — every destination + every Wikivoyage article pinned and clickable.",
};

// Hand-picked Morocco-centred coords for the 14 v2 destinations (the seed only
// carries category/region taxonomy, not coordinates — Wikivoyage carries coords
// for its 83 articles which we already have, but the v2 destination IDs don't
// always match WV slugs so we hard-code the canonical points here).
const DEST_COORDS: Record<string, [number, number]> = {
  marrakech: [31.6295, -7.9811],
  fes: [34.0181, -5.0078],
  chefchaouen: [35.1714, -5.2696],
  essaouira: [31.5085, -9.7595],
  merzouga: [31.0998, -4.0136],
  casablanca: [33.5731, -7.5898],
  rabat: [34.0209, -6.8417],
  ouarzazate: [30.9189, -6.8934],
  "ait-benhaddou": [31.0473, -7.1294],
  "atlas-mountains": [31.0586, -7.9075],
  meknes: [33.8935, -5.5547],
  tangier: [35.7595, -5.834],
  agadir: [30.4278, -9.5981],
  tetouan: [35.5715, -5.3724],
};

export default function MediaMapPage() {
  const destPins: MapPin[] = DESTINATIONS.filter((d) => DEST_COORDS[d.id]).map((d) => {
    const [lat, lon] = DEST_COORDS[d.id];
    return {
      id: `dest-${d.id}`,
      name: d.name,
      lat,
      lon,
      href: `/morocco/${d.id}`,
      kind: "destination" as const,
      description: `${findRegion(d.region)?.name ?? d.region} · ${d.position}`,
    };
  });

  // Use the WV slug for the popup link (more articles than destinations).
  const destSlugs = new Set(DESTINATIONS.map((d) => d.id));
  const wikiPins: MapPin[] = listArticles()
    .filter((a) => a.coordinates && !destSlugs.has(a.slug))
    .map((a) => ({
      id: `wiki-${a.slug}`,
      name: a.title,
      lat: a.coordinates!.lat,
      lon: a.coordinates!.lon,
      href: `/wiki/${a.slug}`,
      kind: "wiki" as const,
      description: a.description ?? undefined,
    }));

  const pins = [...destPins, ...wikiPins];

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Media · Map"
        title="Map of Morocco"
        tagline={`${pins.length} pins · ${destPins.length} destinations and ${wikiPins.length} Wikivoyage articles, geographically. Click a pin to open the full guide.`}
        stats={[
          { label: "Destinations", value: destPins.length },
          { label: "Wiki articles", value: wikiPins.length },
          { label: "Regions", value: REGIONS.length },
        ]}
      />

      <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#10b981" }} />
          Destination
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "#3b82f6" }} />
          Wikivoyage article
        </span>
      </div>

      <MapClient pins={pins} />

      <p className="text-center text-xs text-zinc-500">
        Map tiles &copy; <a href="https://www.openstreetmap.org/copyright" className="underline">OpenStreetMap</a> contributors.
        Coordinates from{" "}
        <a href="https://en.wikivoyage.org/wiki/Morocco" className="underline" target="_blank" rel="noreferrer">
          Wikivoyage · Morocco
        </a>{" "}
        (CC BY-SA 4.0).
      </p>
    </div>
  );
}
