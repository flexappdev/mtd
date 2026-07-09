// FLEET DB helpers — canonical post-2026-06-16 restructure shape.
// All mtd data lives in the shared FLEET database, scoped by {app:'mtd'}.
// See ~/APPS/appai/docs/MONGO-FLEET-SCHEMA.md for the full kind list.
//
// Legacy per-kind collections in the dedicated `mtd` DB
// (`mtd_destinations`, `mtd_regions`, `mtd_cities`, `mtd_sights`,
// `mtd_hotels`, `mtd_restaurants`, `mtd_lists`, `mtd_pages`, `mtd_prompts`)
// are deprecated. The `mtd` DB is safe to drop after a 7-day soak once no
// reads/writes hit it — user drops it manually in Atlas (readWrite only per
// the cluster's 500-collection-cap feedback memory).

import { MongoClient, type Db, type Collection, type Document } from "mongodb";

const URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.MONGODB_URI ||
  "";
// Default DB is now `FLEET` (was `mtd`). Left overridable via env for the
// legacy fold script (points at `mtd` for reads during migration).
const DB_NAME = process.env.MONGO_DB || process.env.MONGODB_DB || "FLEET";

export const APP = "mtd";

type Cache = {
  client?: MongoClient;
  db?: Db;
  promise?: Promise<{ client: MongoClient; db: Db }>;
};

const g = globalThis as unknown as { _mtdMongo?: Cache };
if (!g._mtdMongo) g._mtdMongo = {};
const cache = g._mtdMongo;

async function build() {
  if (!URI) {
    throw new Error("[mtd/mongo] MONGO_URI not set — add it to .env.local");
  }
  const client = new MongoClient(URI, {
    serverSelectionTimeoutMS: 2000,
    maxPoolSize: 5,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  return { client, db };
}

export async function getDb(): Promise<Db> {
  if (cache.db) return cache.db;
  if (!cache.promise) {
    cache.promise = build().then((r) => {
      cache.client = r.client;
      cache.db = r.db;
      return r;
    });
  }
  const { db } = await cache.promise;
  return db;
}

export async function tryGetDb(): Promise<Db | null> {
  try {
    return await getDb();
  } catch (err) {
    console.warn("[mtd/mongo] unreachable:", (err as Error)?.message);
    return null;
  }
}

export function getDbName(): string {
  return DB_NAME;
}

export async function pingDb(): Promise<number | null> {
  try {
    const db = await getDb();
    const t0 = Date.now();
    await db.command({ ping: 1 });
    return Date.now() - t0;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// FLEET helpers
// ---------------------------------------------------------------------------

/** Every read filter MUST include {app:'mtd'} to avoid mixing data with
 *  other apps in the shared FLEET DB. */
export const APP_FILTER = { app: APP } as const;

/** Every write doc MUST carry {app:'mtd'} so it can be scoped/queried later. */
export function withApp<T extends Document>(doc: T): T & { app: string } {
  return { ...doc, app: APP };
}

/** Access a FLEET collection. All mtd data lives under one of these kinds. */
export async function fleetCol<T extends Document = Document>(
  kind:
    | "items"
    | "lists"
    | "pages"
    | "media_jobs"
    | "media"
    | "wiki"
    | "taxonomy"
    | "feedback"
    | "runs",
): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(kind);
}

/** Resolved FLEET collection + kind discriminator for each logical mtd
 *  collection. Consumers should read via
 *  `fleetCol('items').find({app:'mtd', kind:'city'})` etc. */
export const COLLECTIONS = {
  destinations: { collection: "items", kind: "destination" },
  regions: { collection: "items", kind: "region" },
  cities: { collection: "items", kind: "city" },
  sights: { collection: "items", kind: "sight" },
  hotels: { collection: "items", kind: "hotel" },
  restaurants: { collection: "items", kind: "restaurant" },
  lists: { collection: "lists", kind: null as string | null },
  pages: { collection: "pages", kind: null as string | null },
  prompts: { collection: "media_jobs", kind: "prompt" },
  // Dev-tool sidecar — intentionally NOT folded into FLEET.
  s3Index: { collection: "s3_index", kind: null as string | null },
} as const;

/** Collections the CMS UI is allowed to CRUD. Anything outside this list
 *  goes through the raw Mongo admin instead.
 *
 *  `collection` is the FLEET collection to open; `filter` is the read filter
 *  (always includes `{app:'mtd'}` and the appropriate `kind` when applicable). */
export const CMS_COLLECTIONS = {
  destinations: {
    collection: COLLECTIONS.destinations.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.destinations.kind },
    label: "Destinations",
    description: "Top Moroccan destinations — slug, title, region, hero, body.",
  },
  regions: {
    collection: COLLECTIONS.regions.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.regions.kind },
    label: "Regions",
    description: "Morocco regions (Marrakech-Safi, Souss-Massa, etc.).",
  },
  cities: {
    collection: COLLECTIONS.cities.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.cities.kind },
    label: "Cities",
    description: "Cities & towns with travel info.",
  },
  sights: {
    collection: COLLECTIONS.sights.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.sights.kind },
    label: "Sights",
    description: "Sights, kasbahs, ruins, viewpoints, beaches.",
  },
  hotels: {
    collection: COLLECTIONS.hotels.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.hotels.kind },
    label: "Hotels",
    description: "Riads, resorts, kasbah hotels, desert camps.",
  },
  restaurants: {
    collection: COLLECTIONS.restaurants.collection,
    filter: { ...APP_FILTER, kind: COLLECTIONS.restaurants.kind },
    label: "Restaurants",
    description: "Restaurants, cafés, street food, tea houses.",
  },
  lists: {
    collection: COLLECTIONS.lists.collection,
    filter: { ...APP_FILTER },
    label: "Lists",
    description: "Top-100 lists and curated rankings.",
  },
  pages: {
    collection: COLLECTIONS.pages.collection,
    filter: { ...APP_FILTER },
    label: "Pages",
    description: "Editorial pages — slug, title, hero, body, status.",
  },
} as const;
