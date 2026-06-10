#!/usr/bin/env node
// Search YouTube Data API v3 for each FEATURED_VIDEO and populate videoId + embedUrl.
// Patches src/lib/mtd-v2/seed.ts when run with --patch.
//
// Usage:
//   node scripts/wire-videos.mjs            # dry-run: print results only
//   node scripts/wire-videos.mjs --patch    # patch seed.ts in-place

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = join(__dir, '..', '.env.local');
try {
  const raw = await readFile(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
} catch {}

const KEY = process.env.YOUTUBE_API_KEY;
const PATCH = process.argv.includes('--patch');
const SEED_PATH = join(__dir, '..', 'src', 'lib', 'mtd-v2', 'seed.ts');

const VIDEOS = [
  { id: 'v-001', title: 'Marrakech medina at dawn full walking tour Morocco' },
  { id: 'v-002', title: 'Chefchaouen blue city Morocco drone walk' },
  { id: 'v-003', title: 'Erg Chebbi Sahara dunes sunrise Morocco Merzouga' },
  { id: 'v-004', title: 'Fes tannery leather Morocco medina tour' },
  { id: 'v-005', title: 'Ait Benhaddou film location tour Morocco Atlas' },
  { id: 'v-006', title: 'Marrakech souk bargaining guide Morocco' },
  { id: 'v-007', title: 'Berber couscous Friday Imlil Atlas Mountains Morocco' },
  { id: 'v-008', title: 'Camel trek Erg Chigaga desert Morocco' },
  { id: 'v-009', title: 'Essaouira Atlantic coast Morocco low tide walk' },
  { id: 'v-010', title: 'Tangier kasbah Morocco strait tour' },
  { id: 'v-011', title: 'Atlas Mountains crossing Tizi n Tichka Morocco pass' },
  { id: 'v-012', title: 'Casablanca to Rabat train Morocco' },
];

async function searchYouTube(query) {
  if (!KEY) return null;
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('key', KEY);
  url.searchParams.set('q', query);
  url.searchParams.set('type', 'video');
  url.searchParams.set('part', 'id,snippet');
  url.searchParams.set('maxResults', '1');
  url.searchParams.set('relevanceLanguage', 'en');
  url.searchParams.set('videoCategoryId', '19'); // Travel & Events

  const res = await fetch(url.toString());
  if (!res.ok) { console.error(`  YouTube ${res.status} for: ${query}`); return null; }
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  return {
    videoId: item.id.videoId,
    embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
    thumbUrl: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? null,
    title: item.snippet?.title ?? null,
  };
}

async function main() {
  if (!KEY) {
    console.error('[fail] YOUTUBE_API_KEY not set — run bash scripts/sync-env.sh first');
    process.exit(1);
  }

  console.log(`[wire-videos] searching YouTube for ${VIDEOS.length} videos…\n`);

  const results = [];
  for (const v of VIDEOS) {
    process.stdout.write(`  ${v.id} "${v.title.slice(0, 50)}"… `);
    const r = await searchYouTube(v.title);
    if (r) {
      console.log(`✓ ${r.videoId}`);
      results.push({ ...v, ...r });
    } else {
      console.log('— not found');
      results.push({ ...v, videoId: null });
    }
    // Polite rate limit: 200ms between requests
    await new Promise(r => setTimeout(r, 200));
  }

  const found = results.filter(r => r.videoId);
  console.log(`\n[done] ${found.length}/${VIDEOS.length} videos matched`);

  if (!PATCH) {
    console.log('\nFields to add to FEATURED_VIDEOS in seed.ts:');
    for (const r of found) {
      console.log(`  ${r.id}: videoId="${r.videoId}" embedUrl="${r.embedUrl}"`);
    }
    console.log('\nRun with --patch to auto-apply.');
    return;
  }

  // Patch seed.ts
  let src = await readFile(SEED_PATH, 'utf8');
  let count = 0;

  for (const r of found) {
    if (!r.videoId) continue;
    // Find `{ id: "v-001",` and inject videoId/embedUrl/thumbUrl
    const re = new RegExp(`(\\{\\s*id:\\s*"${r.id}",)`);
    const fields = [
      `videoId: "${r.videoId}"`,
      `embedUrl: "${r.embedUrl}"`,
      r.thumbUrl ? `thumbUrl: "${r.thumbUrl}"` : null,
    ].filter(Boolean).join(', ');
    const newSrc = src.replace(re, (match) => {
      // Remove existing fields if re-running
      const cleaned = match;
      return `{ id: "${r.id}", ${fields}, `;
    });
    if (newSrc !== src) { src = newSrc; count++; }
  }

  await writeFile(SEED_PATH, src);
  console.log(`[patch] ${count} video entries updated in seed.ts`);
}

main().catch(e => { console.error(e); process.exit(1); });
