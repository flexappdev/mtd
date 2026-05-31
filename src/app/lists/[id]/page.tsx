import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/v2/PageHeader";
import { HotelsGrid } from "@/components/v2/HotelsGrid";
import {
  DESTINATIONS,
  HOTELS,
  LISTS,
  RESTAURANTS,
  SIGHTS,
  findDestination,
  findRegion,
} from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export async function generateStaticParams() {
  return LISTS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = LISTS.find((l) => l.id === id);
  if (!list) return { title: "List not found" };
  return {
    title: list.title,
    description: list.description ?? `${list.title} — ${list.items} ranked entries.`,
  };
}

type Row = {
  rank: number;
  id: string;
  name: string;
  sub: string;
  href: string;
  meta: string[];
};

function ranked(kind: string): Row[] {
  if (kind === "hotels") {
    return [...HOTELS]
      .sort((a, b) => b.clicks30 - a.clicks30)
      .map((h, i) => ({
        rank: i + 1,
        id: h.id,
        name: h.name,
        sub: findDestination(h.dest)?.name ?? "",
        href: `/places/hotels#${h.id}`,
        meta: ["★".repeat(h.stars), `${h.clicks30.toLocaleString()} clicks`],
      }));
  }
  if (kind === "sights") {
    return [...SIGHTS]
      .sort((a, b) => b.clicks30 - a.clicks30)
      .map((s, i) => ({
        rank: i + 1,
        id: s.id,
        name: s.name,
        sub: findDestination(s.dest)?.name ?? s.kind,
        href: `/morocco/${s.dest}#${s.id}`,
        meta: [s.kind, ...(s.unesco ? ["UNESCO"] : [])],
      }));
  }
  if (kind === "food") {
    return [...RESTAURANTS]
      .sort((a, b) => b.clicks30 - a.clicks30)
      .map((r, i) => ({
        rank: i + 1,
        id: r.id,
        name: r.name,
        sub: findDestination(r.dest)?.name ?? "",
        href: `/places/restaurants#${r.id}`,
        meta: [r.kind, r.price],
      }));
  }
  // "places", "media" and others fall back to destinations
  return [...DESTINATIONS]
    .sort((a, b) => b.clicks30 - a.clicks30)
    .map((d, i) => ({
      rank: i + 1,
      id: d.id,
      name: d.name,
      sub: findRegion(d.region)?.name ?? d.region,
      href: `/morocco/${d.id}`,
      meta: [d.position],
    }));
}

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = LISTS.find((l) => l.id === id);
  if (!list) notFound();
  const rows = ranked(list.kind);

  const isHotelList = list.kind === "hotels";

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb={`Lists · ${list.kind}`}
        title={list.title}
        tagline={list.description}
        stats={[
          { label: "Items in list", value: list.items },
          { label: "Curator", value: list.curator },
          ...(list.trending ? [{ label: "Trend", value: "▲" as string }] : []),
        ]}
      >
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/moroccai?topic=lists"
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-200 hover:border-zinc-600"
          >
            ✦ Ask MoroccAI about this list
          </Link>
          <Link
            href="/lists/all"
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs uppercase tracking-wider text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
          >
            ← all lists
          </Link>
        </div>
      </PageHeader>

      {isHotelList ? (
        <HotelsGrid hotels={[...HOTELS].sort((a, b) => b.clicks30 - a.clicks30)} />
      ) : (
        <ol className="space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 transition-colors hover:border-zinc-700"
                style={{ textDecoration: "none" }}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded font-mono text-sm font-bold"
                  style={{
                    background: r.rank <= 3 ? "rgba(255,200,90,0.18)" : "rgba(255,255,255,0.05)",
                    color: r.rank <= 3 ? "#ffd479" : "#a1a1aa",
                  }}
                >
                  #{r.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-zinc-100">{r.name}</div>
                  <div className="truncate text-xs text-zinc-500">{r.sub}</div>
                </div>
                <div className="hidden font-mono text-[10px] uppercase tracking-wider text-zinc-500 sm:block">
                  {r.meta.join(" · ")}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {rows.length < list.items && (
        <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-4 text-center text-xs text-zinc-500">
          Showing {rows.length} of {list.items} — the rest is being curated.
        </p>
      )}
    </div>
  );
}
