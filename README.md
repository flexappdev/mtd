# MTD — Morocco Top Destinations

> Cinematic Netflix-style guide to Morocco — cities, kasbahs, beaches, desert, mountains, food.

Next.js 16 (App Router, webpack) · React 19 · Supabase auth · MongoDB-with-seed-fallback ·
S3 (com27 bucket) · Anthropic Claude Sonnet 4.6 streaming · Amazon / Booking / Expedia / Agoda affiliates (tag `fs08-21`).

- **Prod:** https://mtd-rose.vercel.app
- **Repo:** https://github.com/flexappdev/mtd
- **Port:** `19007` (`npm run dev`)
- **Vercel project:** `prj_se87AIBer55ReEytbTCKWJXw4fSV` (matsiems scope)
- **Accent:** `#10b981`

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2.6 (App Router, `--webpack`) |
| Runtime | React 19, TypeScript 5.6 |
| Auth | Supabase (`mat@matsiems.com` gate on `/admin`) |
| Data | MongoDB (mtd_* collections) with in-memory seed fallback |
| Object storage | AWS S3, `com27` bucket, `mtd/*` prefix |
| AI | Anthropic Claude (`claude-sonnet-4-6` default, overridable via `MOROCCAI_MODEL`) |
| Payments | (none — affiliate-only) |
| Newsletter | Loops → Resend → echo fallback chain (`/api/newsletter`) |
| Styling | Tailwind v3 + custom mtd-v2.css cinematic layer |

## Routes

### Front office (public)

| Path | What |
|---|---|
| `/` | Cinematic home — featured destination hero, 9 horizontal rows (Top-10, regions, sights, videos, lists, hotels, restaurants, guides, wiki) |
| `/places` | Section index (regions / cities / sights / hotels / restaurants). Accepts `?q=` for unified search. |
| `/places/cities` · `/places/sights` · `/places/restaurants` | Tile grids over the seed |
| `/places/hotels` | Rich grid with `BookingCTA` (Booking / Expedia / Agoda) on each card |
| `/places/regions` | Region overview cards |
| `/places/regions/[id]` | Per-region detail — destination tiles, MoroccAI deep-link |
| `/lists` | Curated lists index (`LISTS` seed) |
| `/lists/[id]` | Per-list ranked detail — hotel lists use `HotelsGrid`, others use ordered tiles |
| `/lists/top-100-morocco-places` · `/lists/top-100-luxury-hotels` · `/lists/top-100-restaurants` · `/lists/cities` · `/lists/all` · `/lists/food` | Static slug views |
| `/morocco` | 33 legacy place cards across 6 categories |
| `/morocco/[slug]` | Destination detail — cinema hero, "Where to stay" `HotelsGrid`, Sights, Restaurants, MoroccAI CTA, SaveButton, Wikipedia summary fallback |
| `/guides` | Section index |
| `/guides/books` · `/guides/cookbooks` · `/guides/gear` · `/guides/beauty` | `GuidesGrid` with Amazon `AffiliateLink` (`tag=fs08-21`, `rel="sponsored nofollow"`) |
| `/media/images` · `/media/audio` · `/media/videos` · `/media/map` · `/media/pdf` | Tile grids over seed (map is region cards for now) |
| `/wiki` | Long-form articles index |
| `/moroccai` | 6 capability cards — each links to `/moroccai/chat?topic=…` |
| `/moroccai/chat` | Live chat against Claude Sonnet 4.6 (`runtime = "nodejs"`) — catalogue-grounded system prompt with prompt cache. Reads `?dest=`, `?region=`, `?topic=` for context seeding |
| `/saved` | Locally-saved destinations (`localStorage[mtd:saved]`) |
| `/random` | Server redirect to a random live destination |
| `/legal/affiliates` · `/legal/privacy` | Full FTC / UK-GDPR disclosure |
| `/scroller` · `/videos` · `/apps` · `/github` · `/prompts` | Shared FAD pages |

### API

| Path | Runtime | What |
|---|---|---|
| `POST /api/moroccai/stream` | `nodejs` | Streams Claude Sonnet 4.6 text. Body `{ messages, dest?, region?, topic? }`. System prompt block carries `cache_control: ephemeral`. |
| `POST /api/newsletter` | `nodejs` | Subscribe email. Tries Loops → Resend → echo. |
| `GET  /api/mtd/health` | — | Server liveness |
| `GET  /api/mtd/destinations` | — | DESTINATIONS list (Mongo with seed fallback) |
| `GET  /api/morocco` · `GET /api/morocco/[slug]` | — | Wikipedia summary proxy |
| `GET  /api/{apps,github,prompts,videos}` | — | Shared FAD endpoints |

### Admin (Supabase-gated, `mat@matsiems.com`)

`/admin` · `/admin/cms` · `/admin/bookings` · `/admin/affiliates` · `/admin/moroccai` · `/admin/mongo` · `/admin/s3` · `/admin/diagrams`

## Local development

```bash
git clone https://github.com/flexappdev/mtd
cd mtd
cp .env.local.example .env.local   # populate the keys below
npm install
npm run dev                         # http://localhost:19007
```

### Required env

| Variable | Used by | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | yes (admin auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | yes |
| `MONGO_URI` / `MONGODB_URI` | Mongo loader (`/api/mtd/destinations`, `/`) | no — falls back to seed |
| `ANTHROPIC_API_KEY` | `/api/moroccai/stream` | required for chat to work |
| `NEXT_PUBLIC_SITE_URL` | sitemap, OG metadataBase | optional (defaults to `https://moroccotopdestinations.com`) |
| `NEXT_PUBLIC_AMAZON_TAG` | `AffiliateLink` | optional (defaults to `fs08-21`) |
| `NEXT_PUBLIC_BOOKING_AID` · `NEXT_PUBLIC_EXPEDIA_CAMREF` · `NEXT_PUBLIC_AGODA_CID` | `BookingCTA` | optional (fall back to non-referral search URLs) |
| `LOOPS_API_KEY` *or* `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` | `/api/newsletter` | optional (echo mode without) |
| `S3_ACCESS_KEY` · `S3_SECRET_ACCESS_KEY` · `S3_BUCKET_NAME` | `/admin/s3` | optional |
| `MOROCCAI_MODEL` | `/api/moroccai/stream` | optional (defaults `claude-sonnet-4-6`) |

`scripts/sync-env.sh` is the canonical pull from `~/context-2026/agents/.env`.

## Scripts

```bash
npm run dev          # next dev --port 19007 --webpack
npm run build        # NODE_OPTIONS=--max-old-space-size=4096 next build --webpack
npm start            # next start --port 19007
npm run typecheck    # tsc --noEmit
npm run lint         # alias of typecheck

node scripts/seed-mongo.mjs            # idempotent upsert of v2 seed into mtd_* collections
node scripts/seed-mongo.mjs --reset    # drop + reseed
bash scripts/sync-env.sh               # sync env vars from central .env
```

## Architecture notes

- **Seed-first data.** Every page renders from `src/lib/mtd-v2/seed.ts` (DESTINATIONS, HOTELS, SIGHTS, RESTAURANTS, LISTS, GUIDES, REGIONS, FEATURED_VIDEOS, WIKI_ARTICLES). If `MONGO_URI` is set and Mongo is reachable, `loadDestinations()` reads from the `mtd_destinations` collection instead. The seed always works — Mongo is opt-in.
- **MoroccAI runtime is Node, not Edge.** The Anthropic SDK v0.100+ imports `node:child_process` via its agent-toolset module — Edge can't bundle that. Streaming works the same on Node and the chat doesn't need geo-replication.
- **System prompt is cached.** The catalogue block in `src/lib/moroccai/system-prompt.ts` ships with `cache_control: { type: "ephemeral" }` so multi-turn conversations re-use the cached context.
- **Affiliate disclosure is non-negotiable.** `AffiliateDisclosure` mounts above the sticky footer in the root layout and links to `/legal/affiliates` and `/legal/privacy`. Required for FTC, UK CMA, EU DSA compliance.
- **OG per route.** Global brand card at `src/app/opengraph-image.tsx`. Per-route variants for `/morocco/[slug]`, `/lists/[id]`, `/places/regions/[id]`. All use `runtime = "edge"` literals (inlined — see commit `05d7d49` for why re-exports break static resolution).
- **Security headers.** `next.config.ts` sets X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy `camera=() microphone=() geolocation=() interest-cohort=()`, HSTS `max-age=63072000; includeSubDomains; preload`.
- **Auth is single-user.** Middleware redirects everything except the public path allowlist to `/login` if there is no Supabase session for `mat@matsiems.com`. Set the `appai-dev-bypass=1` cookie for local Playwright runs.
- **Sitemap is dynamic.** `src/app/sitemap.ts` enumerates leaf pages + all 14 destinations + 5 regions + 18 lists.

## Repo layout

```
src/
├── app/
│   ├── (front office routes — see Routes table)
│   ├── opengraph-image.tsx               # global OG
│   ├── morocco/[slug]/opengraph-image.tsx
│   ├── lists/[id]/opengraph-image.tsx
│   ├── places/regions/[id]/opengraph-image.tsx
│   ├── sitemap.ts · robots.ts
│   └── api/
│       ├── moroccai/stream/route.ts      # Claude Sonnet 4.6 streaming (Node)
│       ├── newsletter/route.ts           # Loops → Resend → echo
│       └── mtd/{health,destinations}/route.ts
├── components/
│   ├── v2/
│   │   ├── FrontHomeV2.tsx · FrontShellV2.tsx
│   │   ├── Tile.tsx · BigRankTile · Row
│   │   ├── HotelsGrid.tsx · GuidesGrid.tsx · PageHeader.tsx · SectionPage.tsx
│   │   ├── BookingCTA.tsx · AffiliateLink.tsx · AffiliateDisclosure.tsx
│   │   └── SaveButton.tsx
│   ├── MonetisationFooter.tsx · NewsletterForm.tsx
│   ├── admin/AdminNav.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── mtd-v2/{seed,types}.ts            # canonical data
│   ├── moroccai/system-prompt.ts         # catalogue-grounded Claude prompt
│   ├── og.ts                             # OG payload helper
│   ├── saved.ts                          # localStorage favourites
│   ├── mongo.ts · mtd-data.ts · taxonomy.ts · supabase/{client,server,middleware}.ts
│   └── app-config.ts · fetchers.ts
└── styles/mtd-v2.css                     # cinematic shell + scroller-mode CSS hook

scripts/
├── seed-mongo.mjs                        # idempotent upsert of v2 seed
└── sync-env.sh                           # pull env from ~/context-2026
```

## Roadmap

Tracked in `~/APPS/logs/appai-backlog.json` under `pbi-2026-05-30-mtd-prodready`.

- ✅ P0 — every CTA is clickable
- ✅ P1 — leaf pages populated, dynamic `/lists/[id]` + `/places/regions/[id]`
- ✅ P2 — BookingCTA + AffiliateLink + GDPR disclosure
- ✅ P3 — enriched `/morocco/[slug]`
- ✅ P4 — MoroccAI chat (Claude Sonnet 4.6, prompt cache)
- ✅ P5 — scroller mode + ⭐ saved (localStorage)
- ✅ P6 — newsletter + MonetisationFooter
- ✅ P7 — `/admin/{bookings,affiliates,moroccai}`
- ✅ P8 — security headers, sitemap, OOM guard, per-route OG
- ⛔ P9 — Mongo seeder blocked at free-tier cluster's 500/500 collection cap; site degrades gracefully via seed fallback
- ⛔ Vercel CLI redeploy blocked on "Not authorized" (link-time GitHub Login Connection failed — fix is `vercel logout && vercel login`)

## License

UNLICENSED · private project of [Mat Siems](https://github.com/matsiems).
