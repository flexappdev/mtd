import raw from "../../data/wikivoyage-morocco.json";
import { DESTINATIONS, REGIONS } from "./mtd-v2/seed";

export type WikivoyageArticle = {
  slug: string;
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
  page_id: number;
  revision: string | null;
  timestamp: string | null;
};

export type WikivoyagePayload = {
  source: string;
  category: string;
  license: string;
  crawled_at: string;
  count: number;
  articles: WikivoyageArticle[];
};

const PAYLOAD: WikivoyagePayload = raw as WikivoyagePayload;

export function listArticles(): WikivoyageArticle[] {
  return PAYLOAD.articles;
}

export function findArticleBySlug(slug: string): WikivoyageArticle | undefined {
  return PAYLOAD.articles.find((a) => a.slug === slug);
}

const NORMALIZE = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function findArticleForDestination(destId: string): WikivoyageArticle | undefined {
  const dest = DESTINATIONS.find((d) => d.id === destId);
  if (!dest) return undefined;
  const candidates = new Set<string>([destId, NORMALIZE(dest.name)]);
  // Try synonyms for the trickier names
  const synonyms: Record<string, string[]> = {
    fes: ["fez"],
    marrakech: ["marrakesh"],
    "ait-benhaddou": ["ait-ben-haddou", "ait-benhaddou"],
    "atlas-mountains": ["high-atlas", "middle-atlas", "anti-atlas"],
  };
  for (const s of synonyms[destId] ?? []) candidates.add(s);
  for (const c of candidates) {
    const hit = PAYLOAD.articles.find((a) => a.slug === c);
    if (hit) return hit;
  }
  return undefined;
}

export function findArticleForRegion(regionId: string): WikivoyageArticle | undefined {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return undefined;
  const map: Record<string, string[]> = {
    imperial: ["fez", "marrakesh", "rabat", "meknes"],
    coast: ["south-atlantic-coast-morocco", "north-atlantic-coast-morocco"],
    atlas: ["high-atlas", "middle-atlas", "anti-atlas"],
    sahara: ["saharan-morocco"],
    mediterranean: ["mediterranean-morocco"],
  };
  for (const slug of map[regionId] ?? []) {
    const hit = PAYLOAD.articles.find((a) => a.slug === slug);
    if (hit) return hit;
  }
  return undefined;
}

export function stats() {
  return {
    count: PAYLOAD.count,
    crawled_at: PAYLOAD.crawled_at,
    source: PAYLOAD.source,
    license: PAYLOAD.license,
    with_thumb: PAYLOAD.articles.filter((a) => a.thumbnail).length,
    with_coords: PAYLOAD.articles.filter((a) => a.coordinates).length,
  };
}
