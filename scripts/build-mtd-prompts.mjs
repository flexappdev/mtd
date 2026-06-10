#!/usr/bin/env node
// Build Runware FLUX image-generation prompts for all MTD assets.
// Output: ~/IMAGES/2026/original/mtd-prompts.json  (42 rows)
//
// Usage: node scripts/build-mtd-prompts.mjs

import { writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const OUT_DIR = join(homedir(), 'IMAGES', '2026', 'original');
const BASE_STYLE = 'editorial travel photography, cinematic grade, 8K, ultra-detailed, photorealistic';

const DEST_PROMPTS = [
  { slug: 'marrakech',      prompt: `Aerial photography of Marrakech Morocco, Jemaa el-Fna square at golden hour, red ochre medina walls, minarets, heat haze, ${BASE_STYLE}` },
  { slug: 'fes',            prompt: `Photography of Fes Morocco medina alleyways, mosaic zellige tilework, artisan leather tanneries at blue hour, lanterns, UNESCO, ${BASE_STYLE}` },
  { slug: 'chefchaouen',    prompt: `Photography of Chefchaouen Morocco blue city, cobalt blue whitewashed stairs, terracotta flower pots, Rif mountains, ${BASE_STYLE}` },
  { slug: 'essaouira',      prompt: `Photography of Essaouira Morocco Atlantic coast, blue wooden fishing boats in harbour, rampart walls, seagulls, golden light, ${BASE_STYLE}` },
  { slug: 'merzouga',       prompt: `Photography of Erg Chebbi Sahara dunes Morocco, camel silhouettes at sunrise, golden rippled sand, star-lit sky gradient, ${BASE_STYLE}` },
  { slug: 'casablanca',     prompt: `Photography of Hassan II Mosque Casablanca Morocco, Atlantic ocean plaza, ornate minaret tower, twilight blue hour, ${BASE_STYLE}` },
  { slug: 'rabat',          prompt: `Photography of Hassan Tower Rabat Morocco, royal gardens, incomplete mosque columns, golden afternoon light, ${BASE_STYLE}` },
  { slug: 'ouarzazate',     prompt: `Aerial photography of Kasbah Ait Benhaddou Ouarzazate Morocco, fortress mud-brick walls, Atlas Mountains backdrop, warm desert light, ${BASE_STYLE}` },
  { slug: 'ait-benhaddou',  prompt: `Photography of Ait Benhaddou ksar Morocco, ancient towers, Atlas mountain valley, golden hour long shadows, UNESCO world heritage, ${BASE_STYLE}` },
  { slug: 'atlas-mountains',prompt: `Aerial photography of Atlas Mountains Morocco, Berber village on green terraced hillside, snow-capped peaks, valley mist, ${BASE_STYLE}` },
  { slug: 'meknes',         prompt: `Photography of Bab Mansour gate Meknes Morocco, imperial blue zellij tilework, horseback silhouette, golden evening light, ${BASE_STYLE}` },
  { slug: 'tangier',        prompt: `Photography of Tangier Morocco port panorama, Strait of Gibraltar, white medina on hillside, turquoise Mediterranean waters, ${BASE_STYLE}` },
  { slug: 'agadir',         prompt: `Photography of Agadir Morocco Atlantic beach crescent, golden sand, palm promenade, turquoise ocean horizon, summer, ${BASE_STYLE}` },
  { slug: 'tetouan',        prompt: `Photography of Tetouan medina Morocco, Andalusian white houses, narrow arched alleyways, blue ceramic tiles, UNESCO, ${BASE_STYLE}` },
];

const LIST_PROMPTS = [
  { slug: 'morocco-places',     prompt: `Dramatic aerial montage of Morocco landmarks, Sahara dunes, blue medina, mountain peaks, Atlantic coast, cinematic composition, ${BASE_STYLE}` },
  { slug: 'imperial',           prompt: `Ornate Moroccan imperial architecture, zellige mosaic tilework pattern close-up, gold and cobalt blue, ornamental arches, luxury travel, ${BASE_STYLE}` },
  { slug: 'luxury-hotels',      prompt: `Luxury Moroccan riad interior courtyard, marble fountain, Moorish arches, lanterns at dusk, lush palms, hotel photography, ${BASE_STYLE}` },
  { slug: 'riads',              prompt: `Rooftop view of traditional riad Marrakech medina, terracotta tiles, lanterns, orange trees in courtyard, sunset sky, ${BASE_STYLE}` },
  { slug: 'desert-camps',       prompt: `Luxury glamping tent in Sahara desert Morocco, Milky Way star sky, lanterns glowing, sand dunes at night, ${BASE_STYLE}` },
  { slug: 'restaurants',        prompt: `Moroccan restaurant table setting, tagine dishes, colorful spices, mosaic table, warm candlelight, food photography, ${BASE_STYLE}` },
  { slug: 'rooftops',           prompt: `Sunset rooftop bar terrace Marrakech Morocco medina, cocktails, panoramic view of minarets and rooftops, golden hour, ${BASE_STYLE}` },
  { slug: 'sights',             prompt: `Koutoubia Mosque Marrakech Morocco, ancient minaret against clear blue sky, palms, architecture photography, ${BASE_STYLE}` },
  { slug: 'unesco',             prompt: `Fes el-Bali medina Morocco UNESCO, labyrinthine alleyways, medieval architecture, birds-eye drone view, ${BASE_STYLE}` },
  { slug: 'beaches',            prompt: `Legzira arched rock beach Morocco Atlantic coast, dramatic natural sea arch, golden sand, waves, ${BASE_STYLE}` },
  { slug: 'souks',              prompt: `Moroccan souk market, colorful spices in terracotta bowls, hanging lanterns, leather goods, vibrant atmosphere, ${BASE_STYLE}` },
  { slug: 'hikes',              prompt: `Trekker on high Atlas Mountains Morocco trail, dramatic rocky peaks, valley below, adventure photography, ${BASE_STYLE}` },
  { slug: 'films',              prompt: `Cinematic film-noir Morocco atmosphere, dramatic desert landscapes, Hollywood quality, ornate architecture, golden light, ${BASE_STYLE}` },
  { slug: 'books',              prompt: `Stack of Morocco travel books on traditional Moroccan table, tea glasses, ornate brass tray, library scene, ${BASE_STYLE}` },
  { slug: 'instagram',          prompt: `Perfect travel photography Chefchaouen Morocco blue city, colorful kaftan on blue stairway, flowers, content creator, ${BASE_STYLE}` },
  { slug: 'festivals',          prompt: `Gnaoua World Music Festival Essaouira Morocco, traditional musicians performing with guembri, crowd, stage lights, ${BASE_STYLE}` },
  { slug: 'daytrips-marrakech', prompt: `Day trip from Marrakech Morocco, Ourika Valley green terraces and waterfalls, Atlas mountains backdrop, ${BASE_STYLE}` },
  { slug: 'london',             prompt: `Playful editorial comparison travel photo, London Big Ben beside Marrakech Koutoubia Mosque, creative montage, magazine cover, ${BASE_STYLE}` },
];

const GUIDE_PROMPTS = [
  { slug: 'book-lp',      prompt: 'Product photography of Lonely Planet Morocco travel guidebook, studio lighting, clean white gradient backdrop, professional book hero shot, 8K' },
  { slug: 'book-rg',      prompt: 'Product photography of Rough Guide Morocco travel book, studio lighting, clean white background, professional book, 8K' },
  { slug: 'book-mourad',  prompt: 'Product photography of Moroccan cookbook with tagine dish illustration on cover, studio lighting, warm tones, professional, 8K' },
  { slug: 'book-paula',   prompt: 'Product photography of The Food of Morocco cookbook, tagine cover, warm kitchen tones, studio lighting, professional, 8K' },
  { slug: 'argan',        prompt: 'Product photography of Moroccan argan oil beauty gift set, amber glass bottles, rose petals, warm golden studio lighting, premium, 8K' },
  { slug: 'tagine',       prompt: 'Product photography of traditional Moroccan tagine ceramic cooking pot, terracotta and blue glaze, studio lighting, clean background, 8K' },
  { slug: 'shoes',        prompt: 'Product photography of Salomon hiking shoes, technical trail boot, clean studio lighting, white gradient backdrop, gear shot, 8K' },
  { slug: 'tent',         prompt: 'Product photography of camping pop-up tent, sand-colored, outdoor gear, clean studio photography, product hero shot, 8K' },
  { slug: 'camera',       prompt: 'Product photography of mirrorless camera body, sleek black, clean studio lighting, white gradient backdrop, professional gear shot, 8K' },
  { slug: 'phrasebook',   prompt: 'Product photography of small Arabic phrasebook, compact travel book, studio lighting, clean white background, professional, 8K' },
];

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const rows = [
    ...DEST_PROMPTS.map(({ slug, prompt }) => ({ category: 'dest', slug, prompt })),
    ...LIST_PROMPTS.map(({ slug, prompt }) => ({ category: 'list', slug, prompt })),
    ...GUIDE_PROMPTS.map(({ slug, prompt }) => ({ category: 'guide', slug, prompt })),
  ];

  const outPath = join(OUT_DIR, 'mtd-prompts.json');
  await writeFile(outPath, JSON.stringify(rows, null, 2));

  console.log(`[ok] ${rows.length} prompts → ${outPath}`);
  console.log(`     ${DEST_PROMPTS.length} destination  ${LIST_PROMPTS.length} list  ${GUIDE_PROMPTS.length} guide`);
  console.log('\nNext: node scripts/gen-mtd-images.mjs --dry-run');
}

main().catch(e => { console.error(e); process.exit(1); });
