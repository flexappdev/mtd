import { AffiliateBadge, AffiliateLink } from "./AffiliateLink";
import { img, tint } from "@/lib/mtd-v2/seed";
import type { Guide } from "@/lib/mtd-v2/types";

type Props = {
  guides: Guide[];
  emptyMessage?: string;
};

export function GuidesGrid({ guides, emptyMessage }: Props) {
  if (guides.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
        {emptyMessage ?? "No products here yet."}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {guides.map((g) => {
        const [from, to] = tint("guide-" + g.id);
        const heroUrl = img("guide-" + g.hero, 600, 800);
        return (
          <AffiliateLink key={g.id} asin={g.asin}>
            <article
              id={g.id}
              className="group h-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-700"
            >
              <div
                className="aspect-[3/4] w-full"
                style={{
                  backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${from} 30%, transparent), color-mix(in oklch, ${to} 60%, transparent)), url(${heroUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-zinc-100">{g.title}</h3>
                  <AffiliateBadge />
                </div>
                <p className="mt-1 text-[11px] text-zinc-500">
                  ★ {g.rating} <span className="text-zinc-600">({g.reviews.toLocaleString()})</span>
                </p>
                <p className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <span className="text-zinc-100">{g.price}</span>
                  <span>Amazon</span>
                </p>
              </div>
            </article>
          </AffiliateLink>
        );
      })}
    </section>
  );
}
