import Link from "next/link";
import { tint } from "@/lib/mtd-v2/seed";
import { MOROCCO_TOP100, slugify, type TopCategory } from "@/lib/top-travel/morocco";
import { bookingUrl, gygUrl, tracked } from "@/lib/top-travel/affiliate";

export const revalidate = 300;

export const metadata = {
  title: "Top 100 places in Morocco",
  description:
    "The definitive editorial ranking of Morocco: 100 cities, sights, landscapes and experiences, with where to stay and tours for each.",
};

const DEST = "morocco";
const REL = "sponsored nofollow noopener";

type Item = {
  rank: number;
  id: string;
  name: string;
  category: TopCategory;
  base: string;
  why: string;
  tour: boolean;
  dest?: string;
};

function items(): Item[] {
  return MOROCCO_TOP100.map(([name, category, base, why, tour, dest], i) => ({
    rank: i + 1,
    id: slugify(name),
    name,
    category,
    base,
    why,
    tour,
    dest,
  }));
}

export default function Top100Page() {
  const list = items();
  const tours = list.filter((x) => x.tour).length;
  const towns = new Set(list.map((x) => x.base)).size;

  return (
    <div className="space-y-8 p-8">
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
          MTD · Lists · Top 100
        </div>
        <h1 className="mt-3 text-4xl font-bold text-zinc-100">Top 100 places in Morocco</h1>
        <p className="mt-2 max-w-3xl text-zinc-400">
          From the night market in Marrakech to the dunes of Erg Chebbi: the 100 places that make a Morocco trip,
          ranked on how iconic, how unique and how easy to reach they are. Each one links to a hotel search near it
          and, where it makes sense, a bookable tour.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
          {[
            { label: "Ranked places", value: list.length },
            { label: "Bases to stay in", value: towns },
            { label: "With tours", value: tours },
          ].map((s) => (
            <span key={s.label}>
              <b className="text-zinc-100">{s.value}</b>
              <span className="ml-1.5 text-xs uppercase tracking-wider text-zinc-500">{s.label}</span>
            </span>
          ))}
        </div>
      </header>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((t) => {
          const [from, to] = tint(t.id);
          const label = `mtd-top100-${t.id}`;
          const hotelHref = tracked(bookingUrl(t.base, label), { dest: DEST, kind: "hotel", item: t.id });
          const tourHref = t.tour
            ? tracked(gygUrl(`${t.name} ${t.base}`, label), { dest: DEST, kind: "tour", item: t.id })
            : null;
          return (
            <li key={t.id} id={t.id} className="list-none">
              <article
                className="flex h-full flex-col rounded-lg border border-zinc-800 bg-zinc-900/60 p-4"
                style={{ borderLeftWidth: 3, borderLeftColor: from }}
              >
                <div
                  className="mb-3 flex h-24 items-end rounded-md p-2"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  <span className="font-mono text-2xl font-bold text-white/90">#{t.rank}</span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100">
                    {t.dest ? (
                      <Link href={`/morocco/${t.dest}`} className="hover:underline">
                        {t.name}
                      </Link>
                    ) : (
                      t.name
                    )}
                  </h2>
                  <span className="shrink-0 rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase text-zinc-400">
                    {t.category}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">Base: {t.base}</p>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-zinc-400">{t.why}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
                  <a
                    href={hotelHref}
                    target="_blank"
                    rel={REL}
                    className="rounded px-2.5 py-1 text-white"
                    style={{ background: "#003580", textDecoration: "none" }}
                  >
                    Hotels in {t.base}
                  </a>
                  {tourHref && (
                    <a
                      href={tourHref}
                      target="_blank"
                      rel={REL}
                      className="rounded px-2.5 py-1 text-white"
                      style={{ background: "#ff5533", textDecoration: "none" }}
                    >
                      Book a tour
                    </a>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] leading-relaxed text-zinc-500">
        Hotel and tour buttons are affiliate links to Booking.com and GetYourGuide. If you book through them we may
        earn a small commission at no extra cost to you. See our{" "}
        <Link href="/legal/affiliates" style={{ color: "var(--app-accent)" }}>
          affiliate policy
        </Link>
        .
      </p>
    </div>
  );
}
