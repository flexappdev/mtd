# mtd · Morocco Travel Destinations · Roadmap

- Current version: `v0.1.0`
- Prod: https://mtd-rose.vercel.app
- Repo: https://github.com/flexappdev/mtd
- Last updated: 2026-07-08

## Priority call

- **V1 + V2 first.** They compound — every page V2 creates inherits V1's schema/sitemap machinery. Both are pure organic-traffic plays. Ship before the 2026-07-19 WorldCupAI window closes and attention shifts back to mtd.
- **V4 + V5 are the revenue pair** — MoroccAI → booking loop, then live rates pipeline to earn the affiliate trust.
- **V6 → V8 are retention / moat** — saved-places loop, i18n (FR + AR), and the 335-video SEO surface.

## Already shipped in v0.1.0 (do not redo)

Baseline as of 2026-06-13 commits `3c28862` + `9e0d5cc`:

- **MoroccAI chat** at `/moroccai/chat` — streaming Claude Sonnet 4.6 via `/api/moroccai/stream` with prompt caching + catalogue-grounded system prompt.
- **Admin CMS** at `/admin/moroccai` for prompt / catalogue management.
- **GA4** with Consent Mode v2 + 4 tracked events + JSON-LD + per-route OG images already live in served HTML.
- **42 FLUX hero images** at `s3://com27/mtd/*` (per-page heroes with `PublicReadMtd` bucket policy).
- **12 YouTube embeds** wired into `src/lib/seed.ts` (Siems Production episodes surfaced on destination pages).
- Build script hardened with `NODE_OPTIONS=--max-old-space-size=4096 next build --webpack` to survive the leaflet/mapbox OOM trap.

---

## V1 — SSR conversion, sitemap segmentation, canonical fixes

Kill the visible "Loading Morocco…" CSR flash on the homepage — move data fetching to RSC/SSG with ISR (`revalidate = 3600`). Segment `sitemap.xml` into `/places /lists /wiki /media` sections (currently a single flat list) and ship a matching `robots.txt`. Add canonical URLs to every anchor-linked sight so `/morocco/marrakech#majorelle` collapses into a single indexable target. Layer in the schema gaps that the 2026-06-13 pipeline didn't cover: dynamic OG-per-city (city name + hero baked into the image), `ItemList` schema for all 18 top-N lists, and `VideoObject` schema on the Siems episode embeds. GA4 / JSON-LD / per-page OG are already in — this V is the RSC + sitemap + canonical layer that finishes the SEO foundation.

Status: proposed

## V2 — Sight pages as long-tail SEO surface

Promote the 212 sights from `#anchors` on city pages to dedicated routes `/morocco/[city]/[sight]` with their own metadata, hero image, wiki extract, nearby hotels (3 affiliate cards), related video, and map pin. Keep the anchor as a redirect. This is the biggest untapped organic surface on the site — 212 indexable pages from data that already exists.

Status: proposed

## V3 — Data integrity & copy polish

Fix pluralisation bugs ("1 destinations" → "1 destination") via a shared `count()` formatter. Reconcile inconsistent counts across nav vs sections (Places says 14, hero claims 47 hotels for Marrakech alone vs 10,000 total). Single source of truth: a `stats.ts` derived from the DB at build time, consumed by nav, hero, and footer. Add empty-state handling for thin regions (Sahara & Desert: 1).

Status: proposed

## V4 — MoroccAI → booking conversion loop

MoroccAI outputs currently end at an itinerary. Close the loop: every itinerary day renders inline affiliate cards (hotel for that night via Booking deep-link with checkin/checkout params, 1 restaurant, 1 gear item where relevant). Add "Save this trip" (auth-gated) and "Email me this plan" (newsletter capture). Track plan → click → booking funnel events.

Status: proposed

## V5 — Live rates pipeline

Replace "indicative, refreshed periodically" with a scheduled rates job: Edge Function cron (6h) pulling Booking/Expedia/Agoda rates for the ~200 hotels that actually receive clicks (use the existing 30d click data to prioritise), cached in DB with `fetched_at` badge on cards. Stale >24h → hide price, show "check rates" CTA. Fixes trust + reduces affiliate bounce.

Status: proposed

## V6 — Saved places & personalisation loop

`/saved` is currently a dead-end link. Build it out: saved places grid, saved trips from MoroccAI, price-drop alerts on saved hotels (email via the rates pipeline delta), and a "your Morocco" percentage tracker (visited X of 212 sights). Login wall doubles as newsletter capture. Weekly digest email of price drops + new list entries.

Status: proposed

## V7 — i18n: French + Arabic

Morocco's inbound market is FR-dominant. Add `next-intl` with `/fr` and `/ar` (RTL) locales, `hreflang` tags, translated metadata, and locale-aware affiliate deep-links (Booking supports lang params). Start with the top-10 destination pages + homepage; wiki content stays EN with a translated summary block.

Status: proposed

## V8 — Video SEO & Siems Production surface

335 owned videos are the moat vs 10k community embeds. Give each Siems episode a watch page `/media/videos/[slug]` with `VideoObject` schema, transcript (Whisper batch), chapter markers, and contextual destination/hotel cards beside the player. Transcripts become 335 more indexable pages and feed MoroccAI's RAG corpus.

Status: proposed

---

## Expansion policy

Each V above is filed as an **index entry** — one paragraph of theme + intent. Per-version expansion into a full CC prompt (branch name, POM budget, file-level OUTPUT, verification checklist) happens on request, not upfront. Ask for `expand V1` (or any Vn) when you're ready to pick it up; that will produce `ROADMAP_V1.md` at repo root with numbered scope, touched files, and a green-test checklist.
