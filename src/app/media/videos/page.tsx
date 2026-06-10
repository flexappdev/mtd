import { FEATURED_VIDEOS, findDestination } from "@/lib/mtd-v2/seed";
import { PageHeader } from "@/components/v2/PageHeader";

export const revalidate = 300;

export const metadata = {
  title: "Videos",
  description: "Walking tours, drone shots, sunrise dunes, food — curated from Morocco creators.",
};

export default function MediaVideosPage() {
  const withEmbed = FEATURED_VIDEOS.filter((v) => v.embedUrl);
  const withoutEmbed = FEATURED_VIDEOS.filter((v) => !v.embedUrl);

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Media · Videos"
        title="Videos"
        tagline="Walking tours, drone shots, sunrise dunes and food stories — curated from Morocco creators."
        stats={[
          { label: "Featured", value: FEATURED_VIDEOS.length },
          { label: "Library", value: "10,000+" },
        ]}
      />

      {withEmbed.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Watch now
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {withEmbed.map((v) => (
              <article key={v.id} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60">
                <div className="aspect-video w-full">
                  <iframe
                    src={v.embedUrl}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{v.title}</h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {v.series} · {v.views} views · {v.duration}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {withoutEmbed.length > 0 && (
        <section>
          {withEmbed.length > 0 && (
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              In the catalogue
            </h2>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {withoutEmbed.map((v) => {
              const dest = findDestination(v.dest);
              return (
                <article
                  key={v.id}
                  className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                >
                  <div
                    className="grid h-16 w-24 shrink-0 place-items-center rounded"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      fontSize: 24,
                    }}
                  >
                    ▶
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-zinc-100 line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      {dest?.name ?? v.dest} · {v.duration} · {v.views} views
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wider text-zinc-600">
                      {v.series}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-xs text-zinc-600 border-t border-zinc-800 pt-4">
        Run <code className="rounded bg-zinc-800 px-1">node scripts/wire-videos.mjs --patch</code> to
        populate YouTube embeds for all {FEATURED_VIDEOS.length} videos.
      </p>
    </div>
  );
}
