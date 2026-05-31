import { BookingCTA } from "./BookingCTA";
import { findDestination, img, tint } from "@/lib/mtd-v2/seed";
import type { Hotel } from "@/lib/mtd-v2/types";

type Props = {
  hotels: Hotel[];
  showCity?: boolean;
  emptyMessage?: string;
};

export function HotelsGrid({ hotels, showCity = true, emptyMessage }: Props) {
  if (hotels.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
        {emptyMessage ?? "No hotels here yet."}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {hotels.map((h) => {
        const dest = findDestination(h.dest);
        const [from, to] = tint("hotel-" + h.id);
        const heroUrl = img("hotel-" + h.id, 800, 600);
        const minRate = Math.min(
          ...Object.values(h.rates).filter((v): v is number => v != null),
        );

        return (
          <article
            key={h.id}
            id={h.id}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 transition-colors hover:border-zinc-700"
          >
            <div
              className="aspect-[16/10] w-full"
              style={{
                backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${from} 30%, transparent), color-mix(in oklch, ${to} 60%, transparent)), url(${heroUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-zinc-100">{h.name}</h3>
                <span
                  className="shrink-0 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-yellow-400"
                  title={`${h.stars} stars`}
                >
                  {"★".repeat(h.stars)}
                </span>
              </div>
              {showCity && dest && (
                <p className="mt-1 text-xs text-zinc-500">{dest.name}</p>
              )}
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                from <b className="text-zinc-100">€{minRate}</b>
                <span className="ml-2">{h.clicks30.toLocaleString()} clicks/30d</span>
              </p>
              <div className="mt-3">
                <BookingCTA hotel={h} />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
