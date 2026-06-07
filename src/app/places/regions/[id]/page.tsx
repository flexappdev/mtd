import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { DESTINATIONS, HOTELS, REGIONS, SIGHTS, img, tint } from "@/lib/mtd-v2/seed";
import { findArticleForRegion } from "@/lib/wikivoyage";

export const revalidate = 300;

export async function generateStaticParams() {
  return REGIONS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const region = REGIONS.find((r) => r.id === id);
  if (!region) return { title: "Region not found" };
  return {
    title: region.name,
    description: `${region.name} — Moroccan destinations, sights and hotels.`,
  };
}

export default async function RegionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const region = REGIONS.find((r) => r.id === id);
  if (!region) notFound();

  const destsInRegion = DESTINATIONS.filter((d) => d.region === region.id);
  const sightsInRegion = SIGHTS.filter((s) => {
    const dest = DESTINATIONS.find((d) => d.id === s.dest);
    return dest?.region === region.id;
  });
  const hotelsInRegion = HOTELS.filter((h) => {
    const dest = DESTINATIONS.find((d) => d.id === h.dest);
    return dest?.region === region.id;
  });
  const wv = findArticleForRegion(region.id);

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb={`Places · Regions · ${region.name}`}
        title={region.name}
        tagline={`${destsInRegion.length} destinations · ${sightsInRegion.length} sights · ${hotelsInRegion.length} hotels & riads`}
        stats={[
          { label: "Destinations", value: destsInRegion.length },
          { label: "Sights", value: sightsInRegion.length },
          { label: "Hotels", value: hotelsInRegion.length },
        ]}
      >
        <div className="mt-5">
          <Link
            href={`/moroccai?region=${region.id}`}
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-200 hover:border-zinc-600"
          >
            ✦ Ask MoroccAI to plan {region.name}
          </Link>
        </div>
      </PageHeader>

      {wv && (
        <section
          className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6"
          style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-100">From Wikivoyage</h2>
            <Link
              href={`/wiki/${wv.slug}`}
              className="text-[11px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200"
              style={{ textDecoration: "none" }}
            >
              full article →
            </Link>
          </div>
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {wv.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={wv.thumbnail}
                alt={wv.title}
                className="h-40 w-full shrink-0 rounded-md object-cover md:w-72"
              />
            )}
            <div>
              {wv.description && (
                <div className="mb-2 text-[11px] uppercase tracking-wider text-zinc-500">{wv.description}</div>
              )}
              {wv.extract && <p className="text-sm leading-relaxed text-zinc-300">{wv.extract}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {destsInRegion.map((d) => {
          const [from, to] = tint(d.id);
          const hero = img(d.id + "-hero", 800, 600);
          return (
            <Link
              key={d.id}
              href={`/morocco/${d.id}`}
              className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-700"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="aspect-[16/10] w-full"
                style={{
                  backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${from} 30%, transparent), color-mix(in oklch, ${to} 60%, transparent)), url(${hero})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{d.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">{d.position}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {d.hotels} hotels · {d.sights} sights
                </p>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
