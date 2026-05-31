"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { readSaved, writeSaved } from "@/lib/saved";
import {
  DESTINATIONS,
  findRegion,
  img,
  tint,
} from "@/lib/mtd-v2/seed";
import type { Destination } from "@/lib/mtd-v2/types";

function lookup(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}

export function SavedClient() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSavedIds(readSaved());
    setHydrated(true);
    function onChange() {
      setSavedIds(readSaved());
    }
    window.addEventListener("mtd:saved-changed", onChange);
    return () => window.removeEventListener("mtd:saved-changed", onChange);
  }, []);

  function remove(id: string) {
    const next = savedIds.filter((x) => x !== id);
    writeSaved(next);
    setSavedIds(next);
  }

  if (!hydrated) {
    return <div className="p-8 text-sm text-zinc-500">Loading saved places…</div>;
  }

  if (savedIds.length === 0) {
    return (
      <div className="space-y-6 p-8">
        <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
            MTD · Saved
          </div>
          <h1 className="mt-3 text-4xl font-bold text-zinc-100">Your saved places</h1>
          <p className="mt-2 text-zinc-400">Stored locally in this browser. Clear cookies and they go.</p>
        </header>
        <section className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/30 p-8 text-sm text-zinc-400">
          You haven&apos;t saved any places yet. Open a destination page and tap{" "}
          <span className="inline-flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] uppercase">
            <Star size={10} /> Save
          </span>
          .
          <p className="mt-4">
            <Link href="/places/cities" className="text-emerald-400 underline">
              Browse cities →
            </Link>
          </p>
        </section>
      </div>
    );
  }

  const rows = savedIds.map(lookup).filter((d): d is Destination => Boolean(d));

  return (
    <div className="space-y-6 p-8">
      <header className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: "var(--app-accent)" }} />
          MTD · Saved
        </div>
        <h1 className="mt-3 text-4xl font-bold text-zinc-100">Your saved places</h1>
        <p className="mt-2 text-zinc-400">
          {rows.length} saved · stored locally in this browser. Clear cookies and they go.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((d) => {
          const [from, to] = tint(d.id);
          const hero = img(d.id + "-hero", 800, 600);
          return (
            <article
              key={d.id}
              className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60"
            >
              <Link href={`/morocco/${d.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="aspect-[16/10] w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${from} 30%, transparent), color-mix(in oklch, ${to} 60%, transparent)), url(${hero})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-zinc-100">{d.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{findRegion(d.region)?.name ?? d.region}</p>
                </div>
              </Link>
              <div className="border-t border-zinc-800 px-4 py-2 text-right">
                <button
                  type="button"
                  onClick={() => remove(d.id)}
                  className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
