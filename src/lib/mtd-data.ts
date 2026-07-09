// Legacy static Morocco places list used by /morocco/* routes.
// Consumers should prefer FLEET reads via `getCities()` / `getPlaceBySlug()`
// (below) which pull from FLEET.items with `{app:'mtd', kind:'city'}`.
// The static list is kept as a resilient fallback for when Mongo is
// unreachable (dev without MONGO_URI, network hiccup during ISR).

import { APP_FILTER, fleetCol, tryGetDb } from "@/lib/mongo";

export type MoroccoPlace = { slug: string; name: string; region: string; category: string };

export const CATEGORIES = ["Imperial Cities", "Coastal", "Sahara", "Atlas", "Kasbahs", "Food"] as const;

export const MOROCCO_PLACES: MoroccoPlace[] = [
  { slug: "marrakesh", name: "Marrakesh", region: "Marrakesh-Safi", category: "Imperial Cities" },
  { slug: "fez", name: "Fez, Morocco", region: "Fès-Meknès", category: "Imperial Cities" },
  { slug: "meknes", name: "Meknes", region: "Fès-Meknès", category: "Imperial Cities" },
  { slug: "rabat", name: "Rabat", region: "Rabat-Salé-Kénitra", category: "Imperial Cities" },
  { slug: "casablanca", name: "Casablanca", region: "Casablanca-Settat", category: "Coastal" },
  { slug: "essaouira", name: "Essaouira", region: "Marrakesh-Safi", category: "Coastal" },
  { slug: "tangier", name: "Tangier", region: "Tanger-Tétouan-Al Hoceïma", category: "Coastal" },
  { slug: "chefchaouen", name: "Chefchaouen", region: "Tanger-Tétouan-Al Hoceïma", category: "Coastal" },
  { slug: "asilah", name: "Asilah", region: "Tanger-Tétouan-Al Hoceïma", category: "Coastal" },
  { slug: "agadir", name: "Agadir", region: "Souss-Massa", category: "Coastal" },
  { slug: "el-jadida", name: "El Jadida", region: "Casablanca-Settat", category: "Coastal" },
  { slug: "merzouga", name: "Merzouga", region: "Drâa-Tafilalet", category: "Sahara" },
  { slug: "erg-chebbi", name: "Erg Chebbi", region: "Drâa-Tafilalet", category: "Sahara" },
  { slug: "zagora", name: "Zagora", region: "Drâa-Tafilalet", category: "Sahara" },
  { slug: "mhamid", name: "M'Hamid El Ghizlane", region: "Drâa-Tafilalet", category: "Sahara" },
  { slug: "atlas-mountains", name: "Atlas Mountains", region: "—", category: "Atlas" },
  { slug: "high-atlas", name: "High Atlas", region: "—", category: "Atlas" },
  { slug: "toubkal", name: "Toubkal", region: "Marrakesh-Safi", category: "Atlas" },
  { slug: "imlil", name: "Imlil", region: "Marrakesh-Safi", category: "Atlas" },
  { slug: "ouirgane", name: "Ouirgane", region: "Marrakesh-Safi", category: "Atlas" },
  { slug: "ourika-valley", name: "Ourika Valley", region: "Marrakesh-Safi", category: "Atlas" },
  { slug: "ait-benhaddou", name: "Aït Benhaddou", region: "Drâa-Tafilalet", category: "Kasbahs" },
  { slug: "ouarzazate", name: "Ouarzazate", region: "Drâa-Tafilalet", category: "Kasbahs" },
  { slug: "tinghir", name: "Tinghir", region: "Drâa-Tafilalet", category: "Kasbahs" },
  { slug: "todra-gorge", name: "Todgha Gorge", region: "Drâa-Tafilalet", category: "Kasbahs" },
  { slug: "dades-valley", name: "Dadès River", region: "Drâa-Tafilalet", category: "Kasbahs" },
  { slug: "tagine", name: "Tagine", region: "—", category: "Food" },
  { slug: "couscous", name: "Couscous", region: "—", category: "Food" },
  { slug: "harira", name: "Harira", region: "—", category: "Food" },
  { slug: "pastilla", name: "Pastilla", region: "—", category: "Food" },
  { slug: "mint-tea", name: "Maghrebi mint tea", region: "—", category: "Food" },
  { slug: "msemen", name: "Msemen", region: "—", category: "Food" },
];

// ---------------------------------------------------------------------------
// FLEET-backed reader helpers (post-migration to FLEET.items {app:'mtd'}).
// All helpers fall back to the static seed if Mongo is unreachable or empty.
// ---------------------------------------------------------------------------

type PlaceDoc = MoroccoPlace & { kind?: string; place_slug?: string };

/** Load mtd cities from FLEET.items where {app:'mtd', kind:'city'} — falls
 *  back to the static MOROCCO_PLACES list when Mongo is offline or empty. */
export async function getCities(): Promise<MoroccoPlace[]> {
  const db = await tryGetDb();
  if (!db) return MOROCCO_PLACES;
  try {
    const col = await fleetCol<PlaceDoc>("items");
    const rows = await col
      .find({ ...APP_FILTER, kind: "city" }, { projection: { _id: 0 } })
      .toArray();
    if (rows.length > 0) return rows as MoroccoPlace[];
  } catch (err) {
    console.warn("[mtd/mtd-data] cities read failed, using seed:", (err as Error).message);
  }
  return MOROCCO_PLACES;
}

/** Load a single place by slug from FLEET.items — falls back to the static
 *  MOROCCO_PLACES list. */
export async function getPlaceBySlug(slug: string): Promise<MoroccoPlace | null> {
  const db = await tryGetDb();
  if (db) {
    try {
      const col = await fleetCol<PlaceDoc>("items");
      const doc = await col.findOne(
        { ...APP_FILTER, kind: "city", slug },
        { projection: { _id: 0 } },
      );
      if (doc) return doc as MoroccoPlace;
    } catch (err) {
      console.warn("[mtd/mtd-data] place read failed, using seed:", (err as Error).message);
    }
  }
  return MOROCCO_PLACES.find((p) => p.slug === slug) ?? null;
}

export type WikiSummary = { title: string; extract: string; thumbnail: string | null; url: string };
export async function getWikiSummary(name: string): Promise<WikiSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, "_"))}`;
  const res = await fetch(url, { headers: { "User-Agent": "mtd-v2" }, next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  return {
    title: String(data.title ?? name),
    extract: String(data.extract ?? ""),
    thumbnail: ((data.thumbnail as { source?: string } | undefined)?.source) ?? null,
    url: String((data.content_urls as { desktop?: { page?: string } } | undefined)?.desktop?.page ?? ""),
  };
}
