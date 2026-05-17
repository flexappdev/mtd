import Link from "next/link";
import { notFound } from "next/navigation";
import { MOROCCO_PLACES, getWikiSummary } from "@/lib/mtd-data";

export const revalidate = 3600;

export default async function MoroccoPlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = MOROCCO_PLACES.find((x) => x.slug === slug);
  if (!place) notFound();
  const wiki = await getWikiSummary(place.name);

  return (
    <div className="space-y-8 p-8">
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <Link href="/morocco" className="text-[11px] uppercase tracking-wider text-zinc-500 hover:text-zinc-300">← all Morocco</Link>
        <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
          {place.category} · {place.region}
        </div>
        <h1 className="mt-3 text-4xl font-bold text-zinc-100">{place.name}</h1>
      </header>

      {wiki && (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6" style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}>
          <div className="flex flex-col items-start gap-6 md:flex-row">
            {wiki.thumbnail && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={wiki.thumbnail} alt={wiki.title} className="h-48 w-full shrink-0 rounded-md object-cover md:w-72" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-zinc-100">{wiki.title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{wiki.extract}</p>
              {wiki.url && (<a className="mt-3 inline-block text-xs text-zinc-300 underline" href={wiki.url} target="_blank" rel="noreferrer">Read on Wikipedia →</a>)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
