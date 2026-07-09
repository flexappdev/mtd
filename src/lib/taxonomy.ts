// ============================================================================
// PART 1 — App-domain taxonomy (existing, unchanged)
// ----------------------------------------------------------------------------
// The `DOMAINS` / `domainForApp` / etc. exports below classify ABC-fleet apps
// into AI/Media/Travel/Lists/etc. Consumed by `src/lib/fetchers.ts` +
// `/apps` route. UNRELATED to Morocco place taxonomy.
//
// PART 2 (below) — FLEET place-taxonomy client stubs
// ----------------------------------------------------------------------------
// Post-2026-07-09 mtd → FLEET migration: this file is also the future home
// for a client that reads shared place refs from `FLEET.taxonomy` docs of
// kind `place-city` / `place-region` / `place-country` / `place-sight`
// (see ~/APPS/appai/docs/MONGO-FLEET-SCHEMA.md and the /appai/scripts/
// fleet-place-dedup.mjs helper). Stubbed here — not wired live yet. The
// stubs sketch the intended interface so downstream refactors have a
// stable target.
// ============================================================================

export type Domain = {
  id: string;
  name: string;
  accent: string;
  subdomains: string[];
};

export const DOMAINS: Domain[] = [
  { id: "ai",        name: "AI",         accent: "#9333ea", subdomains: ["agents", "platforms", "models", "tools"] },
  { id: "media",     name: "Media",      accent: "#ec4899", subdomains: ["video", "audio", "images", "podcasts"] },
  { id: "travel",    name: "Travel",     accent: "#10b981", subdomains: ["cities", "stays", "guides", "trips"] },
  { id: "lists",     name: "Lists",      accent: "#f59e0b", subdomains: ["top100", "rankings", "directories"] },
  { id: "learning",  name: "Learning",   accent: "#3b82f6", subdomains: ["python", "javascript", "ai", "cad"] },
  { id: "backoffice",name: "Backoffice", accent: "#64748b", subdomains: ["dashboards", "registries", "ops"] },
  { id: "social",    name: "Social",     accent: "#ef4444", subdomains: ["content", "outreach", "scrollers"] },
  { id: "commerce",  name: "Commerce",   accent: "#22c55e", subdomains: ["shops", "deals", "directories"] },
  { id: "property",  name: "Property",   accent: "#06b6d4", subdomains: ["villas", "rentals", "investments"] },
  { id: "lifestyle", name: "Lifestyle",  accent: "#f97316", subdomains: ["food", "fitness", "fashion"] },
  { id: "research",  name: "Research",   accent: "#a855f7", subdomains: ["reports", "pages", "feeds"] },
  { id: "tools",     name: "Tools",      accent: "#84cc16", subdomains: ["cli", "scripts", "automations"] },
  { id: "personal",  name: "Personal",   accent: "#e11d48", subdomains: ["context", "journal", "memory"] },
];

export type PropType = "site" | "app" | "tool" | "service" | "feed";
export const PROPTYPES: PropType[] = ["site", "app", "tool", "service", "feed"];

const DOMAIN_BY_MONOREPO: Record<string, string> = {
  appai: "tools",
  mscore: "backoffice",
  mslists: "lists",
  mstravel: "travel",
  bta: "commerce",
  scrollerai: "social",
  agentai: "ai",
  personai: "personal",
  aicontext2026: "personal",
  villai: "property",
  cabinet: "media",
  cma: "media",
  ais: "ai",
  abc: "tools",
  cac: "learning",
  multica: "tools",
  paperclip: "tools",
};

const PROPTYPE_BY_ID: Record<string, PropType> = {
  appai: "tool",
  ms: "site",
  fad: "site",
};

export function domainForApp(monorepo: string | null | undefined): Domain {
  const id = (monorepo && DOMAIN_BY_MONOREPO[monorepo]) ?? "tools";
  return DOMAINS.find((d) => d.id === id) ?? DOMAINS[0];
}

export function proptypeForApp(id: string): PropType {
  return PROPTYPE_BY_ID[id] ?? "site";
}

export function subdomainForApp(monorepo: string | null | undefined, id: string): string {
  const domain = domainForApp(monorepo);
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return domain.subdomains[hash % domain.subdomains.length];
}

export const TARGET_APP_COUNT = 100;

// ============================================================================
// PART 2 — FLEET place-taxonomy client stubs (post-2026-07-09)
// ----------------------------------------------------------------------------
// Shared canonical places (cities/regions/countries/sights) live in
// `FLEET.taxonomy` docs of kind `place-*`. Travel-site rows in `FLEET.items`
// should carry a `place_slug` referencing `taxonomy.slug` instead of
// duplicating name / coords / country / hero.
//
// This module intentionally does NOT wire live reads yet — the dedup script
// (`~/APPS/appai/scripts/fleet-place-dedup.mjs`) hasn't been run in --apply
// mode, so `FLEET.taxonomy` doesn't yet contain place-* rows for mtd. Once
// step B8 of the plan runs, un-stub `getPlace()` and use it from
// `mtd-data.ts` + `mtd-v2/seed.ts` in place of hardcoded name/coords.
// ============================================================================

export type PlaceKind = "place-city" | "place-region" | "place-country" | "place-sight";

/** Canonical place doc shape in FLEET.taxonomy (see MONGO-FLEET-SCHEMA.md). */
export type PlaceTaxonomyDoc = {
  kind: PlaceKind;
  slug: string;
  name: string;
  parent_slug?: string;
  country_iso?: string;
  coords?: { lat: number; lng: number };
  wiki_slug?: string;
  hero_s3_key?: string;
  aliases?: string[];
  updated_at?: Date;
};

/** STUB. Post-B8 dedup, resolve to a `FLEET.taxonomy` fetch. */
export async function getPlace(_slug: string): Promise<PlaceTaxonomyDoc | null> {
  // Intentional no-op — see file header. Callers should treat `null` as
  // "not yet in taxonomy; fall back to inline item fields".
  return null;
}

/** STUB. Post-B8 dedup, resolve to a `FLEET.taxonomy` fetch scoped by kind. */
export async function getPlacesByKind(_kind: PlaceKind): Promise<PlaceTaxonomyDoc[]> {
  return [];
}
