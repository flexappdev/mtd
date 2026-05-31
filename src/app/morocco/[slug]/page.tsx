import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { HotelsGrid } from "@/components/v2/HotelsGrid";
import { MOROCCO_PLACES, getWikiSummary } from "@/lib/mtd-data";
import {
  DESTINATIONS,
  HOTELS,
  RESTAURANTS,
  SIGHTS,
  findRegion,
  img,
} from "@/lib/mtd-v2/seed";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v2 = DESTINATIONS.find((d) => d.id === slug);
  if (v2) {
    return {
      title: v2.name,
      description: `${v2.name} — ${v2.position}. ${v2.hotels} hotels, ${v2.sights} sights, ${v2.facts} facts.`,
    };
  }
  const legacy = MOROCCO_PLACES.find((x) => x.slug === slug);
  if (legacy) return { title: legacy.name, description: `${legacy.name} — ${legacy.region}` };
  return { title: "Place" };
}

export default async function MoroccoPlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v2 = DESTINATIONS.find((d) => d.id === slug);
  const legacy = MOROCCO_PLACES.find((x) => x.slug === slug);
  if (!v2 && !legacy) notFound();

  const displayName = v2?.name ?? legacy!.name;
  const heroSeed = v2 ? `${v2.id}-hero` : `${legacy!.slug}-hero`;
  const heroUrl = img(heroSeed, 1920, 800);

  const hotelsHere = v2 ? HOTELS.filter((h) => h.dest === v2.id) : [];
  const sightsHere = v2 ? SIGHTS.filter((s) => s.dest === v2.id) : [];
  const restosHere = v2 ? RESTAURANTS.filter((r) => r.dest === v2.id) : [];

  const regionName = v2 ? findRegion(v2.region)?.name ?? v2.region : legacy?.region;
  const wiki = await getWikiSummary(displayName);

  return (
    <div className="space-y-10 p-8">
      <section
        className="relative -mx-8 -mt-8 mb-2 overflow-hidden border-b border-zinc-800"
        style={{ height: "min(50vh, 460px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(9,9,11,0.95) 90%), url(${heroUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative flex h-full w-full items-end p-8">
          <div className="max-w-3xl">
            <Link href="/morocco" className="text-[11px] uppercase tracking-wider text-zinc-300 hover:text-white" style={{ textDecoration: "none" }}>
              ← all Morocco
            </Link>
            <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-300">
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
              {v2 ? `${v2.kind} · ${regionName}` : `${legacy!.category} · ${regionName}`}
            </div>
            <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">{displayName}</h1>
            {v2 && (
              <p className="mt-2 text-base text-zinc-300">{v2.position}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {hotelsHere.length > 0 && (
                <a
                  href="#hotels"
                  className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-emerald-500"
                  style={{ textDecoration: "none" }}
                >
                  ▶ Stay in {displayName}
                </a>
              )}
              <Link
                href={`/moroccai?dest=${v2?.id ?? legacy?.slug ?? ""}`}
                className="rounded border border-red-700/60 bg-red-900/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-200 hover:bg-red-900/40"
                style={{ textDecoration: "none" }}
              >
                ✦ Ask MoroccAI
              </Link>
              <Link
                href="/random"
                prefetch={false}
                className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-800"
                style={{ textDecoration: "none" }}
              >
                🎲 Random place
              </Link>
            </div>
          </div>
        </div>
      </section>

      {v2 && (
        <PageHeader
          crumb={`Morocco · ${regionName}`}
          title={`${displayName} at a glance`}
          stats={[
            { label: "Hotels", value: v2.hotels },
            { label: "Sights", value: v2.sights },
            { label: "Facts", value: v2.facts },
            { label: "Clicks/30d", value: v2.clicks30.toLocaleString() },
          ]}
        />
      )}

      {wiki && (
        <section
          className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6"
          style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
        >
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {wiki.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={wiki.thumbnail}
                alt={wiki.title}
                className="h-48 w-full shrink-0 rounded-md object-cover md:w-72"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{wiki.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{wiki.extract}</p>
              {wiki.url && (
                <a
                  className="mt-3 inline-block text-xs text-zinc-300 underline"
                  href={wiki.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read on Wikipedia →
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {hotelsHere.length > 0 && (
        <section id="hotels" className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Where to stay in {displayName}
            <span className="ml-2 text-xs text-zinc-500">{hotelsHere.length}</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Live rates across Booking, Expedia and Agoda. Click any logo to compare.
          </p>
          <HotelsGrid hotels={hotelsHere} showCity={false} />
        </section>
      )}

      {sightsHere.length > 0 && (
        <section id="sights" className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Sights to see
            <span className="ml-2 text-xs text-zinc-500">{sightsHere.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sightsHere.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100">{s.name}</h3>
                  {s.unesco && (
                    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] uppercase text-zinc-300">
                      UNESCO
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-zinc-500">{s.kind}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {"★".repeat(s.stars)} · {s.clicks30.toLocaleString()} clicks/30d
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {restosHere.length > 0 && (
        <section id="restaurants" className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Restaurants & cafés
            <span className="ml-2 text-xs text-zinc-500">{restosHere.length}</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {restosHere.map((r) => (
              <article
                key={r.id}
                id={r.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
              >
                <h3 className="text-sm font-semibold text-zinc-100">{r.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{r.kind}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {"★".repeat(r.stars)} · {r.price}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-red-900/40 bg-gradient-to-br from-red-950/40 to-zinc-950 p-6">
        <h2 className="text-lg font-semibold text-zinc-100">
          ✦ MoroccAI: plan your trip to {displayName}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Ask anything — best riad under €150, 3-day itinerary, vegetarian-friendly tagine
          spots, getting from {displayName} to the next stop. MoroccAI grounds answers in
          this catalogue and links you straight to bookable hotels.
        </p>
        <div className="mt-4">
          <Link
            href={`/moroccai?dest=${v2?.id ?? legacy?.slug ?? ""}`}
            className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-600"
            style={{ textDecoration: "none" }}
          >
            ✦ Open MoroccAI →
          </Link>
        </div>
      </section>
    </div>
  );
}
