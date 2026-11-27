/**
 * Travel videos from the @MatSiems channel ("Siems Production").
 *
 * Consumes the shared mstravel catalog contract (see catalog.json on com27):
 * the catalog lists every travel video; each entry's `detail_url` adds hook,
 * segments, chapters and attribution. `youtube_id` is filled in as videos
 * publish, so pages pick the YouTube embed up through ISR with no redeploy.
 *
 * Every fetch fails soft: on any error the helpers return [] / null and the
 * pages hide their video sections instead of throwing.
 */
import { DESTINATIONS } from "@/lib/mtd-v2/seed";
import { MOROCCO_PLACES } from "@/lib/mtd-places";

export { formatDuration, isoDuration, chapterSeconds, youtubeEmbed } from "@/lib/travel-videos-format";

export const TRAVEL_CATALOG_URL =
  process.env.TRAVEL_CATALOG_URL || "https://com27.s3.eu-west-2.amazonaws.com/mstravel/catalog.json";

/** Optional dev override: fetch `<base>/<id>.json` instead of each entry's detail_url. */
const TRAVEL_DETAIL_BASE_URL = process.env.TRAVEL_DETAIL_BASE_URL || "";

export const TRAVEL_REVALIDATE = 900;

export const CHANNEL_FALLBACK = {
  handle: "@MatSiems",
  name: "Siems Production",
  id: "UCuCR4AsSaHOI3znW690cU8g",
  url: "https://www.youtube.com/@MatSiems",
};

export type TravelChannel = typeof CHANNEL_FALLBACK;

export type TravelVideo = {
  id: string;
  slug: string;
  kind: "short" | "long";
  title: string;
  place: string;
  place_type: "city" | "country" | null;
  description: string;
  country: string;
  tags: string[];
  duration: number;
  youtube_id: string | null;
  youtube_url: string | null;
  published_at: string | null;
  status: "published" | "queued";
  video_url: string;
  poster_url: string;
  detail_url: string;
  wbp_url: string | null;
  source?: string;
};

export type TravelSegment = { kicker: string; big: string; text: string };
export type TravelChapter = { t: string; label: string };

export type TravelVideoDetail = TravelVideo & {
  hook: string | null;
  segments: TravelSegment[];
  chapters: TravelChapter[];
  attribution: string | null;
};

export type TravelCatalog = {
  version: number | string;
  generated_at: string;
  channel: TravelChannel;
  count: number;
  published: number;
  videos: TravelVideo[];
};

/** Site tiers: Morocco first, then North Africa & Middle East, then the rest. */
export type Tier = "morocco" | "mena" | "more";

export const TIER_LABEL: Record<Tier, string> = {
  morocco: "Morocco",
  mena: "North Africa & Middle East",
  more: "More from the channel",
};

export const MENA_COUNTRIES = [
  "Tunisia",
  "Egypt",
  "Jordan",
  "Oman",
  "Saudi Arabia",
  "Qatar",
  "United Arab Emirates",
  "UAE",
  "Bahrain",
  "Israel",
  "Palestine",
  "State of Palestine",
];

export function tierOf(v: Pick<TravelVideo, "country">): Tier {
  if (v.country === "Morocco") return "morocco";
  if (MENA_COUNTRIES.includes(v.country)) return "mena";
  return "more";
}

const TIER_RANK: Record<Tier, number> = { morocco: 0, mena: 1, more: 2 };

function publishedTime(v: TravelVideo): number {
  return v.published_at ? Date.parse(v.published_at) || 0 : 0;
}

/** Site order: tier, then newest published, then films before shorts, then title. */
function compareForSite(a: TravelVideo, b: TravelVideo): number {
  const t = TIER_RANK[tierOf(a)] - TIER_RANK[tierOf(b)];
  if (t) return t;
  const p = publishedTime(b) - publishedTime(a);
  if (p) return p;
  if (a.kind !== b.kind) return a.kind === "long" ? -1 : 1;
  return a.title.localeCompare(b.title);
}

function isVideo(x: unknown): x is TravelVideo {
  const v = x as TravelVideo;
  return !!v && typeof v.id === "string" && typeof v.title === "string" && typeof v.video_url === "string";
}

export async function getCatalog(): Promise<TravelCatalog | null> {
  try {
    const res = await fetch(TRAVEL_CATALOG_URL, { next: { revalidate: TRAVEL_REVALIDATE } });
    if (!res.ok) return null;
    const data = (await res.json()) as TravelCatalog;
    if (!data || !Array.isArray(data.videos)) return null;
    return {
      ...data,
      channel: { ...CHANNEL_FALLBACK, ...(data.channel ?? {}) },
      videos: data.videos.filter(isVideo).map((v) => ({
        ...v,
        country: v.country ?? "",
        place: v.place ?? v.title,
        tags: Array.isArray(v.tags) ? v.tags : [],
        duration: Number(v.duration) || 0,
      })),
    };
  } catch (err) {
    console.warn("[travel-videos] catalog fetch failed:", (err as Error).message);
    return null;
  }
}

/** Every video this site shows, in site order (Morocco, MENA, rest). */
export async function getSiteVideos(): Promise<TravelVideo[]> {
  const catalog = await getCatalog();
  if (!catalog) return [];
  return [...catalog.videos].sort(compareForSite);
}

export async function getChannel(): Promise<TravelChannel> {
  return (await getCatalog())?.channel ?? CHANNEL_FALLBACK;
}

export async function getVideo(id: string): Promise<TravelVideoDetail | null> {
  const videos = await getSiteVideos();
  const base = videos.find((v) => v.id === id);
  if (!base) return null;
  const detailUrl = TRAVEL_DETAIL_BASE_URL
    ? `${TRAVEL_DETAIL_BASE_URL.replace(/\/$/, "")}/${encodeURIComponent(base.id)}.json`
    : base.detail_url;
  let detail: Partial<TravelVideoDetail> = {};
  if (detailUrl) {
    try {
      const res = await fetch(detailUrl, { next: { revalidate: TRAVEL_REVALIDATE } });
      if (res.ok) detail = (await res.json()) as Partial<TravelVideoDetail>;
    } catch (err) {
      console.warn(`[travel-videos] detail fetch failed for ${id}:`, (err as Error).message);
    }
  }
  return {
    ...base,
    ...detail,
    // The catalog is the fresher source for publish state.
    youtube_id: base.youtube_id ?? detail.youtube_id ?? null,
    youtube_url: base.youtube_url ?? detail.youtube_url ?? null,
    published_at: base.published_at ?? detail.published_at ?? null,
    status: base.status,
    hook: detail.hook ?? null,
    segments: Array.isArray(detail.segments) ? detail.segments : [],
    chapters: Array.isArray(detail.chapters) ? detail.chapters : [],
    attribution: typeof detail.attribution === "string" ? detail.attribution : null,
  };
}

// ---------- helpers ----------

export const shorts = (vs: TravelVideo[]) => vs.filter((v) => v.kind === "short");
export const films = (vs: TravelVideo[]) => vs.filter((v) => v.kind === "long");
export const byTier = (vs: TravelVideo[], tier: Tier) => vs.filter((v) => tierOf(v) === tier);
export const byCountry = (vs: TravelVideo[], country: string) => vs.filter((v) => v.country === country);

/** Countries in site order: Morocco, MENA (as listed), then the rest A–Z, with counts. */
export function countriesInOrder(vs: TravelVideo[]): { country: string; count: number; tier: Tier }[] {
  const counts = new Map<string, number>();
  for (const v of vs) if (v.country) counts.set(v.country, (counts.get(v.country) ?? 0) + 1);
  return [...counts.entries()]
    .map(([country, count]) => ({ country, count, tier: tierOf({ country }) }))
    .sort((a, b) => {
      const t = TIER_RANK[a.tier] - TIER_RANK[b.tier];
      if (t) return t;
      if (a.tier === "mena") return MENA_COUNTRIES.indexOf(a.country) - MENA_COUNTRIES.indexOf(b.country);
      return a.country.localeCompare(b.country);
    });
}

/** Same place first, then same country, then same tier, then the rest. */
export function relatedVideos(video: TravelVideo, all: TravelVideo[], n = 12): TravelVideo[] {
  const others = all.filter((v) => v.id !== video.id);
  const score = (v: TravelVideo) =>
    v.slug === video.slug ? 0 : v.country === video.country ? 1 : tierOf(v) === tierOf(video) ? 2 : 3;
  return others
    .map((v, i) => ({ v, s: score(v), i }))
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.v);
}

/** The hero video: a Morocco film, else newest published Morocco video, else wider fallbacks. */
export function pickFeatured(vs: TravelVideo[]): TravelVideo | null {
  const morocco = byTier(vs, "morocco");
  const newest = (list: TravelVideo[]) =>
    [...list].filter((v) => v.published_at).sort((a, b) => publishedTime(b) - publishedTime(a))[0];
  return (
    films(morocco)[0] ??
    newest(morocco) ??
    morocco[0] ??
    films(byTier(vs, "mena"))[0] ??
    newest(vs) ??
    films(vs)[0] ??
    vs[0] ??
    null
  );
}

export function subscribeUrl(channel: TravelChannel = CHANNEL_FALLBACK): string {
  return `${channel.url}?sub_confirmation=1`;
}

// ---------- links to this site's place pages ----------

/** Catalog slug -> mtd place slug where the two spell a place differently. */
const SLUG_ALIASES: Record<string, string> = {
  marrakesh: "marrakech",
  fez: "fes",
  "ait-ben-haddou": "ait-benhaddou",
  todgha: "todra-gorge",
};

const MTD_PLACE_SLUGS = new Set<string>([
  ...DESTINATIONS.map((d) => d.id),
  ...MOROCCO_PLACES.map((p) => p.slug),
]);

/** This site's own page for a Morocco video's place, if there is one. */
export function mtdPlaceHref(v: Pick<TravelVideo, "slug" | "country">): string | null {
  if (v.country !== "Morocco") return null;
  const slug = SLUG_ALIASES[v.slug] ?? v.slug;
  return MTD_PLACE_SLUGS.has(slug) ? `/morocco/${slug}` : null;
}

/** The place link for a video: mtd's own page first, else World Best Places. */
export function placeLink(v: TravelVideo): { href: string; external: boolean } | null {
  const own = mtdPlaceHref(v);
  if (own) return { href: own, external: false };
  if (v.wbp_url) return { href: v.wbp_url, external: true };
  return null;
}

/** Videos to show on an mtd place page (/morocco/<slug>). */
export function videosForPlace(vs: TravelVideo[], placeSlug: string): TravelVideo[] {
  const want = SLUG_ALIASES[placeSlug] ?? placeSlug;
  return vs.filter((v) => v.country === "Morocco" && (SLUG_ALIASES[v.slug] ?? v.slug) === want);
}
