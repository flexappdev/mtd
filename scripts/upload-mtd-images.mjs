#!/usr/bin/env node
// Upload generated MTD images to S3 (com27/mtd/images/) and patch seed.ts with real URLs.
//
// Input:  ~/IMAGES/2026/original/mtd-{category}-{slug}.png
// Output: s3://com27/mtd/images/{category}/{slug}.webp
//         Patches src/lib/mtd-v2/seed.ts (with --patch flag)
//
// Usage:
//   node scripts/upload-mtd-images.mjs [--category dest|list|guide] [--force] [--patch]
//   node scripts/upload-mtd-images.mjs --patch    # upload + auto-patch seed.ts

import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

// Load .env.local
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '..', '.env.local');
try {
  const raw = await readFile(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
} catch {}

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')) return process.argv[i + 1];
  return null;
}

const bucket = process.env.S3_BUCKET_NAME || 'com27';
const region = process.env.S3_REGION || 'eu-west-2';
const accessKeyId = process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const FILTER_CAT = arg('category');
const FORCE = process.argv.includes('--force');
const PATCH = process.argv.includes('--patch');

const IMG_ROOT = join(homedir(), 'IMAGES', '2026', 'original');
const SEED_PATH = join(__dir, '..', 'src', 'lib', 'mtd-v2', 'seed.ts');
const S3_BASE = `https://${bucket}.s3.${region}.amazonaws.com`;

const CATEGORIES = ['dest', 'list', 'guide'];

// Map category to image dimensions (WebP output)
const DIMS = {
  dest:  { w: 800, h: 600 },
  list:  { w: 800, h: 600 },
  guide: { w: 400, h: 600 },
};

async function fileExists(p) {
  try { await access(p, FS.R_OK); return true; } catch { return false; }
}

async function pngToWebp(pngPath, w, h) {
  return sharp(pngPath).resize(w, h, { fit: 'cover' }).webp({ quality: 85 }).toBuffer();
}

async function main() {
  if (!accessKeyId || !secretAccessKey) {
    console.error('[fail] S3 credentials not set — run bash scripts/sync-env.sh first');
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  const cats = FILTER_CAT ? [FILTER_CAT] : CATEGORIES;

  // Discover PNG files
  let allFiles;
  try { allFiles = await readdir(IMG_ROOT); } catch { allFiles = []; }
  const pngs = allFiles.filter(f => f.startsWith('mtd-') && f.endsWith('.png'));

  const patches = {}; // { category: { slug: s3Url } }
  let uploaded = 0, skipped = 0, failed = 0;

  for (const cat of cats) {
    const catPngs = pngs
      .filter(f => f.startsWith(`mtd-${cat}-`))
      .map(f => ({ file: f, slug: f.replace(`mtd-${cat}-`, '').replace('.png', '') }));

    if (catPngs.length === 0) {
      console.log(`[${cat}] no PNGs found — run gen-mtd-images.mjs first`);
      continue;
    }
    console.log(`\n[${cat}] ${catPngs.length} PNGs`);
    patches[cat] = {};

    const { w, h } = DIMS[cat] || DIMS.dest;

    for (const { file, slug } of catPngs) {
      const pngPath = join(IMG_ROOT, file);
      const key = `mtd/images/${cat}/${slug}.webp`;
      const url = `${S3_BASE}/${key}`;

      try {
        const body = await pngToWebp(pngPath, w, h);
        await s3.send(new PutObjectCommand({
          Bucket: bucket, Key: key, Body: body,
          ContentType: 'image/webp',
          CacheControl: 'public, max-age=31536000, immutable',
        }));
        patches[cat][slug] = url;
        uploaded++;
        console.log(`  ✓ ${key}`);
      } catch (e) {
        failed++;
        console.error(`  ✗ ${key}: ${e.message}`);
      }
    }
  }

  console.log(`\n[done] uploaded=${uploaded} skipped=${skipped} failed=${failed}`);

  if (PATCH && uploaded > 0) {
    await patchSeed(patches);
  } else if (uploaded > 0) {
    console.log('\nAdd --patch to auto-update seed.ts, or manually add image fields:');
    for (const [cat, slugs] of Object.entries(patches)) {
      for (const [slug, url] of Object.entries(slugs)) {
        console.log(`  ${cat} "${slug}" → "${url}"`);
      }
    }
  }
}

async function patchSeed(patches) {
  let src = await readFile(SEED_PATH, 'utf8');
  let count = 0;

  // Destinations: find `{ id: "marrakech",` and inject `image: "url",`
  for (const [slug, url] of Object.entries(patches.dest || {})) {
    const re = new RegExp(`(\\{\\s*id:\\s*"${escRe(slug)}",[^}]*?)(?:\\s*image:\\s*"[^"]*",)?`, 's');
    const replacement = `{ id: "${slug}", image: "${url}",`;
    const newSrc = src.replace(re, (match) => {
      if (match.includes(`image:`)) return match.replace(/image:\s*"[^"]*"/, `image: "${url}"`);
      return match.replace(`{ id: "${slug}",`, `{ id: "${slug}", image: "${url}",`);
    });
    if (newSrc !== src) { src = newSrc; count++; }
  }

  // Lists: find `{ id: "top-100-morocco-places",` etc.
  for (const [slug, url] of Object.entries(patches.list || {})) {
    // List ids don't match hero slugs — find by hero field
    const heroRe = new RegExp(`(hero:\\s*"${escRe(slug)}")`);
    const newSrc = src.replace(heroRe, (match, p1) => {
      // Insert image field after the hero field
      if (src.includes(`hero: "${slug}", image:`)) return match;
      return `${p1}, image: "${url}"`;
    });
    if (newSrc !== src) { src = newSrc; count++; }
  }

  // Guides: find `{ id: "lp-morocco",` etc. using hero slug mapping
  const guideHeroMap = {
    'book-lp': 'lp-morocco', 'book-rg': 'rough-guide', 'book-mourad': 'cookbook-mourad',
    'book-paula': 'cookbook-paula', 'argan': 'argan-oil', 'tagine': 'tagine',
    'shoes': 'hiking-shoe', 'tent': 'sand-tent', 'camera': 'camera-om1', 'phrasebook': 'phrasebook',
  };
  for (const [heroSlug, url] of Object.entries(patches.guide || {})) {
    const id = guideHeroMap[heroSlug];
    if (!id) continue;
    const newSrc = src.replace(
      new RegExp(`(\\{\\s*id:\\s*"${escRe(id)}")`),
      (match) => `{ id: "${id}", image: "${url}",`
    );
    if (newSrc !== src) { src = newSrc; count++; }
  }

  await writeFile(SEED_PATH, src);
  console.log(`\n[patch] ${count} image fields injected into seed.ts`);
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch(e => { console.error(e); process.exit(1); });
