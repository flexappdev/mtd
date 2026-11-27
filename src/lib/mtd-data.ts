// Legacy static Morocco places list used by /morocco/* routes.
// Consumers should prefer FLEET reads via `getCities()` / `getPlaceBySlug()`
// (below) which pull from FLEET.items with `{app:'mtd', kind:'city'}`.
// The static list is kept as a resilient fallback for when Mongo is
// unreachable (dev without MONGO_URI, network hiccup during ISR).

import { APP_FILTER, fleetCol, tryGetDb } from "@/lib/mongo";

import { CATEGORIES, MOROCCO_PLACES, type MoroccoPlace } from "@/lib/mtd-places";

export { CATEGORIES, MOROCCO_PLACES };
export type { MoroccoPlace };

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
