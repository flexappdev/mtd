import Link from "next/link";
import { PageHeader } from "@/components/v2/PageHeader";
import { listArticles, stats } from "@/lib/wikivoyage";

export const revalidate = 300;

export const metadata = {
  title: "Wiki",
  description: "Every Wikivoyage article on Morocco — 83 city, region, sight and route pages, summarised and linked. CC BY-SA 4.0.",
};

export default function WikiPage() {
  const articles = listArticles();
  const s = stats();
  const sorted = [...articles].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Wiki"
        title="Morocco wiki"
        tagline="Every Wikivoyage article on Morocco — city, region, sight and route pages. Summarised, image-linked and credited under CC BY-SA 4.0."
        stats={[
          { label: "Articles", value: s.count },
          { label: "With image", value: s.with_thumb },
          { label: "Source", value: "Wikivoyage" },
        ]}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((a) => (
          <Link
            key={a.slug}
            href={`/wiki/${a.slug}`}
            className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-700"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              className="aspect-[16/10] w-full bg-zinc-800"
              style={
                a.thumbnail
                  ? {
                      backgroundImage: `url(${a.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            />
            <div className="p-4">
              <h2 className="text-sm font-semibold text-zinc-100">{a.title}</h2>
              {a.description && (
                <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{a.description}</p>
              )}
              {a.extract && (
                <p className="mt-2 line-clamp-3 text-xs text-zinc-400">{a.extract}</p>
              )}
            </div>
          </Link>
        ))}
      </section>

      <footer className="text-center text-xs text-zinc-500">
        Sourced from{" "}
        <a href="https://en.wikivoyage.org/wiki/Morocco" className="underline hover:text-zinc-300" target="_blank" rel="noreferrer">
          Wikivoyage · Morocco
        </a>
        {" — "}content licensed{" "}
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" className="underline hover:text-zinc-300" target="_blank" rel="noreferrer">
          CC BY-SA 4.0
        </a>
        . Crawled {new Date(s.crawled_at).toISOString().slice(0, 10)}.
      </footer>
    </div>
  );
}
