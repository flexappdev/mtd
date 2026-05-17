import Link from "next/link";
import { MOROCCO_PLACES, CATEGORIES } from "@/lib/mtd-data";

export default function MoroccoPage() {
  return (
    <div className="space-y-8 p-8">
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
          MTD · Morocco
        </div>
        <h1 className="mt-3 text-4xl font-bold text-zinc-100">Morocco Travel</h1>
        <p className="mt-2 text-zinc-400">{MOROCCO_PLACES.length} places across {CATEGORIES.length} categories.</p>
      </header>

      {CATEGORIES.map((cat) => {
        const items = MOROCCO_PLACES.filter((i) => i.category === cat);
        return (
          <section key={cat} className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-100">{cat} <span className="ml-2 text-xs text-zinc-500">{items.length}</span></h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((i) => (
                <Link key={i.slug} href={`/morocco/${i.slug}`} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:border-zinc-700" style={{ borderLeftWidth: 3, borderLeftColor: "var(--app-accent)" }}>
                  <h3 className="text-sm font-semibold text-zinc-100">{i.name}</h3>
                  <p className="mt-1 text-xs text-zinc-400">{i.region}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
