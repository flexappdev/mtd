import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { findItemBySlug, listItems } from "@/lib/wikipedia-morocco";

export const revalidate = 300;

export async function generateStaticParams() {
  return listItems().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findItemBySlug(slug);
  if (!a) return { title: "Topic — not found" };
  return {
    title: `${a.title} — Morocco`,
    description: a.description ?? a.extract?.slice(0, 160) ?? `${a.title} on Wikipedia`,
    alternates: { canonical: `/topics/${slug}` },
    openGraph: a.thumbnail ? { images: [{ url: a.thumbnail, width: a.thumbnail_w ?? 800, height: a.thumbnail_h ?? 600 }] } : undefined,
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findItemBySlug(slug);
  if (!a) notFound();

  const updated = a.timestamp ? new Date(a.timestamp).toISOString().slice(0, 10) : null;

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb={`Topics · ${a.kind}`}
        title={a.title}
        tagline={a.description ?? undefined}
        stats={[
          { label: "Kind", value: a.kind },
          ...(updated ? [{ label: "Updated", value: updated }] : []),
          ...(a.coordinates ? [{ label: "Coords", value: `${a.coordinates.lat.toFixed(2)}, ${a.coordinates.lon.toFixed(2)}` }] : []),
          { label: "Source", value: "Wikipedia" },
        ]}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/topics"
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-300 hover:border-zinc-600"
          >
            ← all topics
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
            Read on Wikipedia →
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
                Wikipedia · {a.title}
              </a>
              , licensed{" "}
              <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer" className="underline">
                CC BY-SA 3.0
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
