#!/usr/bin/env node
// scripts/build-mtd-universe.mjs — walks Wikipedia categories for
// Morocco-related topics, dedupes, and writes a canonical universe file
// at data/wikipedia-morocco.json.
//
// Every item has: { slug, title, kind, category, extract, thumbnail,
// coordinates, wikipediaTitle, url, revision, timestamp }.
//
// Free (Wikipedia REST + Action API only). Serial fetch, ~1 req/300ms to
// stay polite. ~500-1500 items = 3-8 minutes.
//
// Usage:
//   node scripts/build-mtd-universe.mjs                # all categories
//   node scripts/build-mtd-universe.mjs --dry-run       # print category counts only
//   node scripts/build-mtd-universe.mjs --limit=50      # first 50 per category

import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const UA = "MTD Universe Builder / mat@matsiems.com";
const REST = "https://en.wikipedia.org/api/rest_v1/page/summary";
const ACTION = "https://en.wikipedia.org/w/api.php";
const OUT = join(process.cwd(), "data", "wikipedia-morocco.json");
const DRY = process.argv.includes("--dry-run");
const LIMIT = Number(process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? Infinity);
const SLEEP = 250;

// Categories cover: cities, sights, mosques, kasbahs, beaches, mountains,
// rivers, protected areas, museums, cuisine, history, culture.
const CATEGORIES = [
  { cat: "Cities_in_Morocco", kind: "city" },
  { cat: "Towns_in_Morocco", kind: "town" },
  { cat: "Villages_in_Morocco", kind: "village" },
  { cat: "Populated_places_in_Morocco", kind: "place" },
  { cat: "Kasbahs", kind: "kasbah" },
  { cat: "Mosques_in_Morocco", kind: "mosque" },
  { cat: "Medinas", kind: "medina" },
  { cat: "Madrasas_in_Morocco", kind: "madrasa" },
  { cat: "Beaches_of_Morocco", kind: "beach" },
  { cat: "Rivers_of_Morocco", kind: "river" },
  { cat: "Mountains_of_Morocco", kind: "mountain" },
  { cat: "Mountain_passes_of_Morocco", kind: "mountain-pass" },
  { cat: "Valleys_of_Morocco", kind: "valley" },
  { cat: "Deserts_of_Morocco", kind: "desert" },
  { cat: "World_Heritage_Sites_in_Morocco", kind: "unesco" },
  { cat: "National_parks_of_Morocco", kind: "national-park" },
  { cat: "Protected_areas_of_Morocco", kind: "protected-area" },
  { cat: "Museums_in_Morocco", kind: "museum" },
  { cat: "Palaces_in_Morocco", kind: "palace" },
  { cat: "Gates_in_Morocco", kind: "gate" },
  { cat: "Squares_in_Morocco", kind: "square" },
  { cat: "Gardens_in_Morocco", kind: "garden" },
  { cat: "Moroccan_cuisine", kind: "food" },
  { cat: "Moroccan_dishes", kind: "dish" },
  { cat: "Berber_culture", kind: "culture" },
  { cat: "Festivals_in_Morocco", kind: "festival" },
  { cat: "History_of_Morocco", kind: "history" },
  { cat: "Dynasties_of_Morocco", kind: "dynasty" },
  { cat: "Buildings_and_structures_in_Morocco", kind: "building" },
  { cat: "Tourist_attractions_in_Morocco", kind: "attraction" },
  { cat: "Landforms_of_Morocco", kind: "landform" },
  { cat: "Waterfalls_of_Morocco", kind: "waterfall" },
  { cat: "Islands_of_Morocco", kind: "island" },
  { cat: "Roman_sites_in_Morocco", kind: "roman" },
  { cat: "Archaeological_sites_in_Morocco", kind: "archaeological" },
  { cat: "Provinces_of_Morocco", kind: "province" },
  { cat: "Regions_of_Morocco", kind: "region" },
  { cat: "Marrakesh", kind: "marrakech" },
  { cat: "Fez,_Morocco", kind: "fes" },
  { cat: "Casablanca", kind: "casablanca" },
  { cat: "Rabat", kind: "rabat" },
  { cat: "Tangier", kind: "tangier" },
  { cat: "Meknes", kind: "meknes" },
  { cat: "Essaouira", kind: "essaouira" },
  { cat: "Chefchaouen", kind: "chefchaouen" },
  { cat: "Agadir", kind: "agadir" },
  { cat: "Ouarzazate", kind: "ouarzazate" },
  { cat: "Sahrawi_culture", kind: "sahrawi-culture" },
  { cat: "Music_of_Morocco", kind: "music" },
  { cat: "Sports_in_Morocco", kind: "sport" },
];

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchCategoryMembers(cat, limit = 500) {
  const members = [];
  let cont;
  for (let page = 0; page < 20; page++) {
    const url = new URL(ACTION);
    url.searchParams.set("action", "query");
    url.searchParams.set("list", "categorymembers");
    url.searchParams.set("cmtitle", `Category:${cat}`);
    url.searchParams.set("cmlimit", String(Math.min(500, limit - members.length)));
    url.searchParams.set("cmnamespace", "0");
    url.searchParams.set("format", "json");
    if (cont) url.searchParams.set("cmcontinue", cont);
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
    if (!r.ok) { console.error(`  ${cat}: HTTP ${r.status}`); return members; }
    const j = await r.json();
    for (const m of j.query?.categorymembers ?? []) members.push(m.title);
    if (members.length >= limit) return members.slice(0, limit);
    cont = j.continue?.cmcontinue;
    if (!cont) break;
    await new Promise((res) => setTimeout(res, SLEEP));
  }
  return members;
}

async function fetchSummary(title) {
  const url = `${REST}/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const r = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(15_000) });
  if (!r.ok) return null;
  const s = await r.json();
  if (s.type === "disambiguation" || s.type === "no-extract") return null;
  return {
    title: s.titles?.canonical ?? title,
    displaytitle: s.displaytitle ?? s.title ?? title,
    description: s.description ?? null,
    extract: s.extract ?? null,
    extract_html: s.extract_html ?? null,
    thumbnail: s.thumbnail?.source ?? null,
    thumbnail_w: s.thumbnail?.width ?? null,
    thumbnail_h: s.thumbnail?.height ?? null,
    coordinates: s.coordinates ? { lat: s.coordinates.lat, lon: s.coordinates.lon } : null,
    url: s.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    page_id: s.pageid ?? null,
    revision: s.revision ?? null,
    timestamp: s.timestamp ?? null,
  };
}

async function main() {
  const seen = new Set();
  const items = [];
  const perCategory = {};

  for (const { cat, kind } of CATEGORIES) {
    process.stdout.write(`\n[cat] ${cat} (${kind}) → `);
    const titles = await fetchCategoryMembers(cat, LIMIT);
    perCategory[cat] = titles.length;
    process.stdout.write(`${titles.length} titles`);
    if (DRY) continue;

    let added = 0;
    for (const title of titles) {
      if (seen.has(title)) continue;
      seen.add(title);
      const s = await fetchSummary(title);
      await new Promise((res) => setTimeout(res, SLEEP));
      if (!s) continue;
      items.push({
        slug: slugify(title),
        wikipediaTitle: title.replace(/ /g, "_"),
        kind,
        category: cat,
        ...s,
      });
      added++;
      if (added % 25 === 0) process.stdout.write(`\n  … +${added}`);
    }
    process.stdout.write(`  ✓ ${added} added`);
  }

  console.log(`\n\n[totals]`);
  for (const [c, n] of Object.entries(perCategory)) console.log(`  ${c}: ${n}`);
  console.log(`\n[universe] ${items.length} unique items (deduped)`);

  if (DRY) return;

  const payload = {
    source: "wikipedia-category-walk",
    license: "CC-BY-SA-3.0",
    crawled_at: new Date().toISOString(),
    count: items.length,
    articles: items,
  };
  await writeFile(OUT, JSON.stringify(payload, null, 2));
  console.log(`\n[write] ${OUT} (${(JSON.stringify(payload).length / 1024).toFixed(1)} KB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
