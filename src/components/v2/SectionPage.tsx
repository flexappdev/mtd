import Link from "next/link";
import { tint } from "@/lib/mtd-v2/seed";

export type SectionTile = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  href?: string;
  meta?: string[];
};

type Props = {
  crumb: string;
  title: string;
  tagline?: string;
  stats?: Array<{ label: string; value: string | number }>;
  tiles: SectionTile[];
  emptyMessage?: string;
};

export function SectionPage({ crumb, title, tagline, stats, tiles, emptyMessage }: Props) {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--app-accent)" }}
          />
          MTD · {crumb}
        </div>
        <h1 className="mt-3 text-4xl font-bold text-zinc-100">{title}</h1>
        {tagline && <p className="mt-2 max-w-3xl text-zinc-400">{tagline}</p>}
        {stats && stats.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            {stats.map((s) => (
              <span key={s.label}>
                <b className="text-zinc-100">{s.value}</b>
                <span className="ml-1.5 text-xs uppercase tracking-wider text-zinc-500">{s.label}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {tiles.length === 0 ? (
        <section
          className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400"
          style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}
        >
          {emptyMessage ?? "Content coming soon."}
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tiles.map((t) => {
            const [from, to] = tint(t.id);
            const card = (
              <article
                className="group h-full rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700"
                style={{ borderLeftWidth: 3, borderLeftColor: from }}
              >
                <div
                  className="mb-3 h-32 rounded-md"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                />
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100">{t.title}</h2>
                  {t.badge && (
                    <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase text-zinc-400">
                      {t.badge}
                    </span>
                  )}
                </div>
                {t.subtitle && <p className="mt-1 text-xs text-zinc-500">{t.subtitle}</p>}
                {t.meta && t.meta.length > 0 && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {t.meta.join(" · ")}
                  </p>
                )}
              </article>
            );
            return t.href ? (
              <Link key={t.id} href={t.href} className="block" style={{ textDecoration: "none" }}>
                {card}
              </Link>
            ) : (
              <div key={t.id}>{card}</div>
            );
          })}
        </section>
      )}
    </div>
  );
}
