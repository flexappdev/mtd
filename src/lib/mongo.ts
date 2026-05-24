import { MongoClient, type Db } from "mongodb";

const URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.MONGODB_URI ||
  "";
const DB_NAME = process.env.MONGO_DB || process.env.MONGODB_DB || "mtd";

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

/** Resolved Mongo collection names for MTD. The DB itself is `mtd`. */
export const COLLECTIONS = {
  destinations: "mtd_destinations",
  regions: "mtd_regions",
  cities: "mtd_cities",
  sights: "mtd_sights",
  hotels: "mtd_hotels",
  restaurants: "mtd_restaurants",
  lists: "mtd_lists",
  pages: "mtd_pages",
  prompts: "mtd_prompts",
  s3Index: "s3_index",
} as const;

/** Collections the CMS UI is allowed to CRUD. Anything outside this list
 *  goes through the raw Mongo admin instead. */
export const CMS_COLLECTIONS = {
  destinations: {
    collection: COLLECTIONS.destinations,
    label: "Destinations",
    description: "Top Moroccan destinations — slug, title, region, hero, body.",
  },
  regions: {
    collection: COLLECTIONS.regions,
    label: "Regions",
    description: "Morocco regions (Marrakech-Safi, Souss-Massa, etc.).",
  },
  cities: {
    collection: COLLECTIONS.cities,
    label: "Cities",
    description: "Cities & towns with travel info.",
  },
  sights: {
    collection: COLLECTIONS.sights,
    label: "Sights",
    description: "Sights, kasbahs, ruins, viewpoints, beaches.",
  },
  hotels: {
    collection: COLLECTIONS.hotels,
    label: "Hotels",
    description: "Riads, resorts, kasbah hotels, desert camps.",
  },
  restaurants: {
    collection: COLLECTIONS.restaurants,
    label: "Restaurants",
    description: "Restaurants, cafés, street food, tea houses.",
  },
  lists: {
    collection: COLLECTIONS.lists,
    label: "Lists",
    description: "Top-100 lists and curated rankings.",
  },
  pages: {
    collection: COLLECTIONS.pages,
    label: "Pages",
    description: "Editorial pages — slug, title, hero, body, status.",
  },
} as const;
