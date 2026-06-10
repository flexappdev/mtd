#!/usr/bin/env node
// Generate MTD asset images via Runware FLUX.
// Reads: ~/IMAGES/2026/original/mtd-prompts.json  (built by build-mtd-prompts.mjs)
// Writes: ~/IMAGES/2026/original/mtd-{category}-{slug}.png
//
// Usage:
//   node scripts/gen-mtd-images.mjs [--dry-run] [--parallel 4] [--size 1024]
//   node scripts/gen-mtd-images.mjs --category dest
//   node scripts/gen-mtd-images.mjs --force   (re-generate existing PNGs)

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Load .env.local
const envPath = join(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
try {
  const raw = await readFile(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
} catch { /* .env.local optional when env vars already set */ }

const API_URL = process.env.RUNWARE_API_BASE || 'https://api.runware.ai/v1';
const KEY = process.env.RUNWARE_API_KEY;
// Hard-pin FLUX image model — env default is bytedance:2@2 (Seedance video, not usable here)
const MODEL = arg('model') || 'runware:100@1';
const PARALLEL = Math.max(1, Math.min(8, Number(arg('parallel') || '4')));
const SIZE = Math.max(512, Math.min(2048, Number(arg('size') || '1024')));
const FORCE = process.argv.includes('--force');
const DRY_RUN = process.argv.includes('--dry-run');
const FILTER_CAT = arg('category');

const OUT_DIR = join(homedir(), 'IMAGES', '2026', 'original');
const PROMPTS_PATH = join(OUT_DIR, 'mtd-prompts.json');

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
  return null;
}

function outPng(row) {
  return join(OUT_DIR, `mtd-${row.category}-${row.slug}.png`);
}

async function exists(p) {
  try { await access(p, FS.R_OK); return true; } catch { return false; }
}

async function runwareInfer(prompt) {
  const task = {
    taskType: 'imageInference',
    taskUUID: randomUUID(),
    positivePrompt: prompt,
    width: SIZE,
    height: SIZE,
    model: MODEL,
    numberResults: 1,
    outputFormat: 'PNG',
    outputType: 'URL',
    CFGScale: 7,
    steps: 30,
  };
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${KEY}` },
    body: JSON.stringify([task]),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`  Runware ${res.status}: ${body.slice(0, 200)}`);
    return null;
  }
  const json = await res.json();
  const item = json.data?.[0];
  return item?.imageURL ?? item?.url ?? null;
}

async function downloadTo(url, dest) {
  const r = await fetch(url);
  if (!r.ok) { console.error(`  download ${r.status}`); return false; }
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(dest, buf);
  return true;
}

async function processRow(row) {
  const dest = outPng(row);
  if (!FORCE && await exists(dest)) {
    console.log(`  [skip] ${row.category}/${row.slug} (already exists)`);
    return 'skip';
  }
  if (DRY_RUN) {
    console.log(`  [dry]  ${row.category}/${row.slug}`);
    console.log(`         ${row.prompt.slice(0, 100)}…`);
    return 'dry';
  }
  console.log(`  [gen]  ${row.category}/${row.slug}`);
  const url = await runwareInfer(row.prompt);
  if (!url) return 'fail';
  const ok = await downloadTo(url, dest);
  if (ok) console.log(`  [ok]   ${dest}`);
  return ok ? 'ok' : 'fail';
}

async function main() {
  if (!DRY_RUN && !KEY) {
    console.error('[fail] RUNWARE_API_KEY not set — run bash scripts/sync-env.sh first');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

  const rows = JSON.parse(await readFile(PROMPTS_PATH, 'utf8'));
  const filtered = FILTER_CAT ? rows.filter(r => r.category === FILTER_CAT) : rows;

  console.log(`[mtd-gen] ${filtered.length} images · model=${MODEL} · size=${SIZE} · parallel=${PARALLEL}${DRY_RUN ? ' · DRY RUN' : ''}`);

  // Pool-based parallelism
  const results = { ok: 0, skip: 0, fail: 0, dry: 0 };
  let idx = 0;
  async function worker() {
    while (idx < filtered.length) {
      const row = filtered[idx++];
      const r = await processRow(row);
      results[r] = (results[r] || 0) + 1;
    }
  }
  await Promise.all(Array.from({ length: PARALLEL }, worker));

  console.log(`\n[done] ok=${results.ok} skip=${results.skip} fail=${results.fail}${results.dry ? ` dry=${results.dry}` : ''}`);
  if (!DRY_RUN && results.ok > 0) {
    console.log('\nNext: node scripts/upload-mtd-images.mjs');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
