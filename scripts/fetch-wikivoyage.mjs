#!/usr/bin/env node
// Crawl Wikivoyage Category:Morocco recursively, fetch a summary + thumbnail
// + extract for every article, save to data/wikivoyage-morocco.json.
//
// Usage:
//   node scripts/fetch-wikivoyage.mjs              # full crawl
//   node scripts/fetch-wikivoyage.mjs --limit 50   # smoke test
//   node scripts/fetch-wikivoyage.mjs --offline    # use cached page list, only refresh summaries

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = dirname(here);
const OUT_DIR = join(repo, "data");
const OUT_FILE = join(OUT_DIR, "wikivoyage-morocco.json");
const PAGES_CACHE = join(OUT_DIR, "wikivoyage-pages.json");

const ROOT_CATEGORY = "Category:Morocco";
const MAX_DEPTH = 4;
const REQUEST_DELAY_MS = 120; // ~8 req/s — well under Wikimedia's polite rate

const args = process.argv.slice(2);
const LIMIT = parseInt(args[args.indexOf("--limit") + 1] ?? "0", 10) || Infinity;
const OFFLINE = args.includes("--offline");

const USER_AGENT =
  "MTD-Crawler/1.0 (Morocco Top Destinations; contact: hello@moroccotopdestinations.com)";

const visited = new Set();
const pages = new Map(); // title -> {pageid, title}
const subcats = new Set();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function api(params) {
  const u = new URL("https://en.wikivoyage.org/w/api.php");
  u.searchParams.set("format", "json");
  u.searchParams.set("origin", "*");
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  const r = await fetch(u.toString(), { headers: { "user-agent": USER_AGENT } });
  if (!r.ok) throw new Error(`api ${r.status} ${u.pathname}`);
  return r.json();
}

async function listCategory(cat, type) {
  const all = [];
  let cmcontinue;
  while (true) {
    const params = {
      action: "query",
      list: "categorymembers",
      cmtitle: cat,
      cmlimit: 500,
      cmtype: type,
    };
    if (cmcontinue) params.cmcontinue = cmcontinue;
    const data = await api(params);
    const members = data?.query?.categorymembers ?? [];
    all.push(...members);
    cmcontinue = data?.continue?.cmcontinue;
    await sleep(REQUEST_DELAY_MS);
    if (!cmcontinue) break;
  }
  return all;
}

async function walkCategory(cat, depth = 0) {
  if (visited.has(cat)) return;
  visited.add(cat);
  if (depth > MAX_DEPTH) return;
  process.stderr.write(`  [${depth}] ${cat}\n`);

  // pages directly in this category
  const directPages = await listCategory(cat, "page");
  for (const p of directPages) {
    if (p.ns !== 0) continue; // mainspace only
    if (!pages.has(p.title)) pages.set(p.title, { pageid: p.pageid, title: p.title });
  }

  // subcategories
  const subs = await listCategory(cat, "subcat");
  for (const s of subs) {
    subcats.add(s.title);
    await walkCategory(s.title, depth + 1);
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fetchSummary(title) {
  const u = `https://en.wikivoyage.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
  const r = await fetch(u, { headers: { "user-agent": USER_AGENT } });
  if (!r.ok) {
    if (r.status === 404) return null;
    throw new Error(`summary ${r.status} ${title}`);
  }
  return r.json();
}

async function loadCachedPages() {
  try {
    const raw = await readFile(PAGES_CACHE, "utf8");
    const list = JSON.parse(raw);
    for (const p of list) pages.set(p.title, p);
    return list.length;
  } catch {
    return 0;
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  if (OFFLINE) {
    const n = await loadCachedPages();
    if (!n) {
      console.error("[wv] no cached pages — run a full crawl first");
      process.exit(1);
    }
    console.error(`[wv] offline mode: ${n} pages from cache`);
  } else {
    console.error(`[wv] walking ${ROOT_CATEGORY} (max depth ${MAX_DEPTH})…`);
    await walkCategory(ROOT_CATEGORY, 0);
    console.error(`[wv] found ${pages.size} mainspace pages across ${subcats.size} subcats`);
    await writeFile(PAGES_CACHE, JSON.stringify([...pages.values()], null, 2));
  }

  const list = [...pages.values()].slice(0, LIMIT);
  const out = [];
  let i = 0;
  for (const p of list) {
    i++;
    try {
      const s = await fetchSummary(p.title);
      if (!s) {
        process.stderr.write(`  ${i}/${list.length} 404 ${p.title}\n`);
        continue;
      }
      out.push({
        slug: slugify(p.title),
        title: s.title,
        displaytitle: s.displaytitle ?? s.title,
        description: s.description ?? null,
        extract: s.extract ?? null,
        extract_html: s.extract_html ?? null,
        thumbnail: s.thumbnail?.source ?? null,
        thumbnail_w: s.thumbnail?.width ?? null,
        thumbnail_h: s.thumbnail?.height ?? null,
        coordinates: s.coordinates ?? null,
        url: s.content_urls?.desktop?.page ?? `https://en.wikivoyage.org/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}`,
        page_id: s.pageid ?? p.pageid,
        revision: s.revision ?? null,
        timestamp: s.timestamp ?? null,
      });
      if (i % 20 === 0) process.stderr.write(`  ${i}/${list.length} ${p.title}\n`);
    } catch (err) {
      process.stderr.write(`  ${i}/${list.length} ERR ${p.title}: ${(err).message}\n`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  out.sort((a, b) => a.title.localeCompare(b.title));
  await writeFile(
    OUT_FILE,
    JSON.stringify(
      {
        source: "en.wikivoyage.org",
        category: ROOT_CATEGORY,
        license: "CC BY-SA 4.0",
        crawled_at: new Date().toISOString(),
        count: out.length,
        articles: out,
      },
      null,
      2,
    ),
  );
  console.error(`[wv] wrote ${out.length} articles → ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("[wv] FAILED:", err.message);
  process.exit(1);
});
