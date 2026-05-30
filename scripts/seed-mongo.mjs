#!/usr/bin/env node
// Seed MTD Mongo from the v2 seed so /admin counts aren't zero and the
// public pages read from real collections instead of the seed fallback.
//
// Usage:
//   node scripts/seed-mongo.mjs              # idempotent upsert
//   node scripts/seed-mongo.mjs --reset      # drop+recreate the mtd_* collections
//
// Reads env from .env.local. Writes against MONGO_DB (default "mtd").

import { MongoClient } from "mongodb";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);

// Minimal .env.local loader — only the keys we care about, no quotes handling.
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
const DB_NAME = process.env.MONGO_DB || process.env.MONGODB_DB || "mtd";
const RESET = process.argv.includes("--reset");

if (!URI) {
  console.error("[seed] MONGO_URI / MONGODB_URI not set in .env.local");
  process.exit(1);
}

// Load the seed via dynamic import so we share a single source of truth.
// The seed is .ts but only contains data + tiny helpers — `tsx` or
// pre-compile would be heavier than just rewriting a thin JSON exporter.
// Cheapest path: re-declare the imports here as JSON-shaped arrays loaded
// from the source via a regex parse. Even cheaper: ship the seed as a
// runtime-evaluable .mjs.
//
// Pragmatic choice: read the .ts file and eval the relevant exports via
// a tagged regex. The seed has no logic, only literal data, so this is safe.
//
// Better: just call tsx if available. Try that first.
let seed;
try {
  const tsxPath = join(repo, "node_modules", ".bin", "tsx");
  const { spawnSync } = await import("node:child_process");
  const probe = spawnSync(tsxPath, ["--version"], { stdio: "ignore" });
  if (probe.status === 0) {
    // tsx is installed — we could route through it, but importing the .ts
    // from node ESM requires --loader tsx, which means re-execing the
    // process. Cheaper: just parse the .ts.
  }
} catch {}

// Parse the seed module by reading the .ts file and using `Function` to
// eval each named const. The seed uses no imports other than types.
const seedSrc = readFileSync(join(repo, "src/lib/mtd-v2/seed.ts"), "utf8");

function extractArray(name) {
  // Match: export const NAME: <type>[] = [\n ... \n];
  const re = new RegExp(`export const ${name}[^=]*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const m = seedSrc.match(re);
  if (!m) throw new Error(`[seed] failed to extract ${name} from seed.ts`);
  // eslint-disable-next-line no-new-func
  return new Function(`return (${m[1]});`)();
}

seed = {
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

const PLAN = [
  { col: "mtd_regions", data: seed.REGIONS },
  { col: "mtd_destinations", data: seed.DESTINATIONS },
  { col: "mtd_hotels", data: seed.HOTELS },
  { col: "mtd_sights", data: seed.SIGHTS },
  { col: "mtd_restaurants", data: seed.RESTAURANTS },
  { col: "mtd_lists", data: seed.LISTS },
  { col: "mtd_videos", data: seed.FEATURED_VIDEOS },
  { col: "mtd_guides", data: seed.GUIDES },
  { col: "mtd_wiki", data: seed.WIKI_ARTICLES },
];

const client = new MongoClient(URI, { serverSelectionTimeoutMS: 5000 });
const now = new Date().toISOString();

async function main() {
  await client.connect();
  const db = client.db(DB_NAME);
  console.log(`[seed] connected to ${DB_NAME} on ${URI.replace(/\/\/[^@]+@/, "//<creds>@")}`);

  let total = 0;
  for (const { col, data } of PLAN) {
    if (RESET) {
      try {
        await db.collection(col).drop();
        console.log(`[seed] dropped ${col}`);
      } catch {
        // collection may not exist
      }
    }
    const c = db.collection(col);
    let upserts = 0;
    for (const doc of data) {
      const id = doc.id;
      if (!id) {
        console.warn(`[seed] skipping ${col} doc without id:`, doc);
        continue;
      }
      await c.updateOne(
        { id },
        { $set: { ...doc, updatedAt: now }, $setOnInsert: { createdAt: now } },
        { upsert: true },
      );
      upserts++;
    }
    // Ensure index on id
    await c.createIndex({ id: 1 }, { unique: true });
    const total_after = await c.countDocuments({});
    console.log(`[seed] ${col}: ${upserts} upserts → ${total_after} docs`);
    total += upserts;
  }

  console.log(`[seed] done · ${total} upserts across ${PLAN.length} collections`);
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await client.close();
  });
