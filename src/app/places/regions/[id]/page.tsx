import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { DESTINATIONS, HOTELS, REGIONS, SIGHTS, img, tint } from "@/lib/mtd-v2/seed";

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
