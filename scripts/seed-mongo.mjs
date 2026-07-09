#!/usr/bin/env node
// Seed mtd data into the shared FLEET DB (post-2026-07-09 migration) so
// /admin counts aren't zero and the public pages read from real
// FLEET.{items,lists,pages,media,media_jobs} rows instead of the seed
// fallback.
//
// All docs carry {app:'mtd'} plus a `kind` discriminator so they can be
// co-located in shared FLEET collections. Uniqueness is on {app, kind, slug}
// per FLEET rules — the composite key means mtd slugs never clash with
// other apps' slugs in the same collection.
//
// Usage:
//   node scripts/seed-mongo.mjs              # idempotent upsert (default)
//   node scripts/seed-mongo.mjs --reset      # deleteMany({app:'mtd', kind:'<k>'}) then re-upsert
//
// Reads env from .env.local. Writes into MONGO_DB (default "FLEET").

import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);

// Minimal .env.local loader — only the keys we care about.
function loadEnv(path) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const idx = line.indexOf("=");
      const k = line.slice(0, idx);
      const v = line.slice(idx + 1);
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // ignore — caller validates required keys below
  }
}
loadEnv(join(repo, ".env.local"));

const URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const DB_NAME = process.env.MONGO_DB || process.env.MONGODB_DB || "FLEET";
const APP = "mtd";
const RESET = process.argv.includes("--reset");

if (!URI) {
  console.error("[seed] MONGO_URI / MONGODB_URI not set in .env.local");
  process.exit(1);
}

// Parse the seed module by reading the .ts file and evaluating each named
// const via `Function`. The seed uses no imports other than types.
const seedSrc = readFileSync(join(repo, "src/lib/mtd-v2/seed.ts"), "utf8");

function extractArray(name) {
  const re = new RegExp(`export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const m = seedSrc.match(re);
  if (!m) throw new Error(`[seed] failed to extract ${name} from seed.ts`);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${m[1]});`)();
}

const seed = {
  REGIONS: extractArray("REGIONS"),
  DESTINATIONS: extractArray("DESTINATIONS"),
  HOTELS: extractArray("HOTELS"),
  SIGHTS: extractArray("SIGHTS"),
  RESTAURANTS: extractArray("RESTAURANTS"),
  LISTS: extractArray("LISTS"),
  FEATURED_VIDEOS: extractArray("FEATURED_VIDEOS"),
  GUIDES: extractArray("GUIDES"),
  WIKI_ARTICLES: extractArray("WIKI_ARTICLES"),
};

/** For each source array, describe:
 *  - which FLEET collection it goes into,
 *  - the `kind` discriminator (null if the collection is single-kind),
 *  - and a slug function returning the {app, kind, slug} composite key. */
const PLAN = [
  {
    label: "regions",
    collection: "items",
    kind: "region",
    data: seed.REGIONS,
    slug: (d) => d.id,
  },
  {
    label: "destinations",
    collection: "items",
    // Destinations carry their own per-doc `kind` in {city,sight,region};
    // preserve that on the FLEET row. The `kind` here is the discriminator
    // *for the row itself* (per-doc), not a single collection-wide kind.
    kind: null,
    data: seed.DESTINATIONS,
    slug: (d) => d.id,
    perDocKind: (d) => d.kind || "destination",
  },
  {
    label: "hotels",
    collection: "items",
    kind: "hotel",
    data: seed.HOTELS,
    slug: (d) => d.id,
  },
  {
    label: "sights",
    collection: "items",
    kind: "sight",
    data: seed.SIGHTS,
    slug: (d) => d.id,
  },
  {
    label: "restaurants",
    collection: "items",
    kind: "restaurant",
    data: seed.RESTAURANTS,
    slug: (d) => d.id,
  },
  {
    label: "lists",
    collection: "lists",
    kind: null,
    data: seed.LISTS,
    slug: (d) => d.id,
  },
  {
    label: "videos",
    collection: "media",
    kind: "video",
    data: seed.FEATURED_VIDEOS,
    slug: (d) => d.id,
  },
  {
    label: "guides",
    collection: "media",
    kind: "guide",
    data: seed.GUIDES,
    slug: (d) => d.id,
  },
  {
    label: "wiki",
    collection: "wiki",
    kind: null,
    data: seed.WIKI_ARTICLES,
    slug: (d) => d.id,
  },
];

const client = new MongoClient(URI, { serverSelectionTimeoutMS: 5000 });
const now = new Date().toISOString();

async function main() {
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`[seed] connected to ${DB_NAME} on ${URI.replace(/\/\/[^@]+@/, "//<creds>@")}`);
  console.log(`[seed] writing docs with {app:'${APP}', kind, slug} composite key\n`);

  let total = 0;
  for (const step of PLAN) {
    const { label, collection, kind, data, slug, perDocKind } = step;
    const c = db.collection(collection);

    if (RESET) {
      const resetFilter = kind
        ? { app: APP, kind }
        : perDocKind
        ? { app: APP, kind: { $in: [...new Set(data.map(perDocKind))] } }
        : { app: APP };
      const r = await c.deleteMany(resetFilter);
      console.log(`[seed] ${label}: deleted ${r.deletedCount} pre-existing FLEET.${collection} docs`);
    }

    let upserts = 0;
    for (const doc of data) {
      const s = slug(doc);
      if (!s) {
        console.warn(`[seed] skipping ${label} doc without slug/id:`, doc);
        continue;
      }
      const rowKind = perDocKind ? perDocKind(doc) : kind;
      const filter = rowKind
        ? { app: APP, kind: rowKind, slug: s }
        : { app: APP, slug: s };
      const setDoc = {
        ...doc,
        app: APP,
        slug: s,
        ...(rowKind ? { kind: rowKind } : {}),
        updatedAt: now,
      };
      // Never overwrite `_id` from the seed's `id` — leave Mongo to assign.
      delete setDoc._id;
      await c.updateOne(
        filter,
        { $set: setDoc, $setOnInsert: { createdAt: now } },
        { upsert: true },
      );
      upserts++;
    }

    // Ensure composite {app, kind, slug} index for reads.
    try {
      await c.createIndex({ app: 1, kind: 1, slug: 1 });
    } catch {
      // best-effort; existing index may already cover it
    }

    const count = kind
      ? await c.countDocuments({ app: APP, kind })
      : perDocKind
      ? await c.countDocuments({ app: APP, kind: { $in: [...new Set(data.map(perDocKind))] } })
      : await c.countDocuments({ app: APP });
    console.log(`[seed] ${label}: ${upserts} upserts → FLEET.${collection}{app:'${APP}'${kind ? `, kind:'${kind}'` : ""}} · ${count} docs`);
    total += upserts;
  }

  console.log(`\n[seed] done · ${total} upserts across ${PLAN.length} logical collections`);
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await client.close();
  });
