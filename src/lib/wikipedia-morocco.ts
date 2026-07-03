// Reader for the Wikipedia category-walk universe at
// data/wikipedia-morocco.json (built by scripts/build-mtd-universe.mjs).
// Mirrors the shape of src/lib/wikivoyage.ts but sourced from Wikipedia's
// category tree — one item per Morocco-related Wikipedia page across cities,
// mosques, kasbahs, mountains, cuisine, culture, history, etc.

import raw from "../../data/wikipedia-morocco.json";

export type WikipediaMoroccoItem = {
  slug: string;
  wikipediaTitle: string;
  kind: string;
  category: string;
  title: string;
  displaytitle: string;
  description: string | null;
  extract: string | null;
  extract_html: string | null;
  thumbnail: string | null;
  thumbnail_w: number | null;
  thumbnail_h: number | null;
  coordinates: { lat: number; lon: number } | null;
  url: string;
  page_id: number | null;
  revision: string | null;
  timestamp: string | null;
};

export type WikipediaMoroccoPayload = {
  source: string;
  license: string;
  crawled_at: string;
  count: number;
  articles: WikipediaMoroccoItem[];
};

const PAYLOAD = raw as WikipediaMoroccoPayload;

export function listItems(): WikipediaMoroccoItem[] {
  return PAYLOAD.articles;
}

export function findItemBySlug(slug: string): WikipediaMoroccoItem | undefined {
  return PAYLOAD.articles.find((a) => a.slug === slug);
}

export function listKinds(): { kind: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of PAYLOAD.articles) map.set(a.kind, (map.get(a.kind) ?? 0) + 1);
  return [...map.entries()]
    .map(([kind, count]) => ({ kind, count }))
    .sort((a, b) => b.count - a.count);
}

export function listByKind(kind: string): WikipediaMoroccoItem[] {
  return PAYLOAD.articles.filter((a) => a.kind === kind);
}

export function itemsWithThumbnails(): WikipediaMoroccoItem[] {
  return PAYLOAD.articles.filter((a) => a.thumbnail);
}

export function itemsWithCoordinates(): WikipediaMoroccoItem[] {
  return PAYLOAD.articles.filter((a) => a.coordinates);
}

export function stats() {
  return {
    total: PAYLOAD.count,
    withThumbnail: itemsWithThumbnails().length,
    withCoords: itemsWithCoordinates().length,
    kinds: listKinds().length,
    crawledAt: PAYLOAD.crawled_at,
  };
}
