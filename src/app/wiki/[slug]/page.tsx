import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { findArticleBySlug, listArticles } from "@/lib/wikivoyage";

export const revalidate = 300;

export async function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findArticleBySlug(slug);
  if (!a) return { title: "Wiki — article not found" };
  return {
    title: a.title,
    description: a.description ?? a.extract?.slice(0, 160) ?? `${a.title} on Wikivoyage`,
  };
}

export default async function WikiArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findArticleBySlug(slug);
  if (!a) notFound();

  const updated = a.timestamp ? new Date(a.timestamp).toISOString().slice(0, 10) : null;

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Wiki"
        title={a.title}
        tagline={a.description ?? undefined}
        stats={[
          ...(updated ? [{ label: "Updated", value: updated }] : []),
          ...(a.coordinates ? [{ label: "Coords", value: `${a.coordinates.lat.toFixed(2)}, ${a.coordinates.lon.toFixed(2)}` }] : []),
          { label: "Source", value: "Wikivoyage" },
        ]}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/wiki"
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-300 hover:border-zinc-600"
          >
            ← all wiki
          </Link>
          <Link
            href={`/moroccai/chat?topic=trip-plan&dest=${slug}`}
            className="rounded border border-red-700/60 bg-red-900/20 px-3 py-1.5 text-xs uppercase tracking-wider text-red-200 hover:bg-red-900/40"
          >
            ✦ Ask MoroccAI
          </Link>
          <a
            href={a.url}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-300 hover:border-zinc-600"
          >
            Read on Wikivoyage →
          </a>
        </div>
      </PageHeader>

      <section
        className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6"
        style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
      >
        <div className="flex flex-col items-start gap-6 md:flex-row">
          {a.thumbnail && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={a.thumbnail}
              alt={a.title}
              className="h-auto w-full shrink-0 rounded-md object-cover md:w-80"
            />
          )}
          <div className="flex-1 space-y-3 text-sm leading-relaxed text-zinc-300">
            {a.extract_html ? (
              <div
                className="prose prose-invert max-w-none text-zinc-300"
                dangerouslySetInnerHTML={{ __html: a.extract_html }}
              />
            ) : a.extract ? (
              <p className="whitespace-pre-wrap text-zinc-300">{a.extract}</p>
            ) : (
              <p className="text-zinc-500">No summary available.</p>
            )}
            <p className="mt-4 text-xs text-zinc-500">
              Content from{" "}
              <a href={a.url} target="_blank" rel="noreferrer" className="underline">
                Wikivoyage · {a.title}
              </a>
              , licensed{" "}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline">
                CC BY-SA 4.0
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
