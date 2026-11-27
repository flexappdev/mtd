"use client";

import { useEffect, useMemo, useState } from "react";
import { VideoCard, type VideoCardData } from "@/components/videos/VideoCard";
import type { Tier } from "@/lib/travel-videos";

type Item = VideoCardData & { tier: Tier };
type Kind = "all" | "short" | "long";

const TIERS: { id: Tier; label: string }[] = [
  { id: "morocco", label: "Morocco" },
  { id: "mena", label: "North Africa & Middle East" },
  { id: "more", label: "More from the channel" },
];

const PAGE = 48;

function norm(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function VideosBrowser({
  videos,
  countries,
  initial,
}: {
  videos: Item[];
  countries: { country: string; count: number; tier: Tier }[];
  initial: { kind: Kind; country: string; q: string };
}) {
  const [kind, setKind] = useState<Kind>(initial.kind);
  const [country, setCountry] = useState(initial.country);
  const [q, setQ] = useState(initial.q);
  const [limit, setLimit] = useState<Record<Tier, number>>({ morocco: PAGE, mena: PAGE, more: PAGE });

  // Keep the URL shareable without a navigation.
  useEffect(() => {
    const p = new URLSearchParams();
    if (kind !== "all") p.set("kind", kind);
    if (country) p.set("country", country);
    if (q.trim()) p.set("q", q.trim());
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `/videos?${qs}` : "/videos");
  }, [kind, country, q]);

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    return videos.filter(
      (v) =>
        (kind === "all" || v.kind === kind) &&
        (!country || v.country === country) &&
        (!needle || norm(`${v.title} ${v.place} ${v.country}`).includes(needle)),
    );
  }, [videos, kind, country, q]);

  const groups = TIERS.map((t) => ({ ...t, items: filtered.filter((v) => v.tier === t.id) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <>
      <div className="tv-filters" role="search">
        <div className="tv-seg" role="group" aria-label="Video type">
          {(
            [
              ["all", "All"],
              ["short", "Shorts"],
              ["long", "Films"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} type="button" className={kind === k ? "on" : ""} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {label}
            </button>
          ))}
        </div>
        <select className="tv-select" aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.country} value={c.country}>
              {c.country} ({c.count})
            </option>
          ))}
        </select>
        <input
          className="tv-input"
          type="search"
          placeholder="Search places, countries…"
          aria-label="Search videos"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <span className="tv-count">
          {filtered.length} / {videos.length}
        </span>
      </div>

      {groups.length === 0 && <div className="tv-empty">No videos match. Try another country or search.</div>}

      {groups.map((g) => {
        const filmsHere = g.items.filter((v) => v.kind === "long");
        const shortsHere = g.items.filter((v) => v.kind === "short");
        const shown = shortsHere.slice(0, limit[g.id]);
        return (
          <section key={g.id} className="tv-section" aria-label={g.label}>
            <h2>
              {g.label} <span>{g.items.length}</span>
            </h2>
            {filmsHere.length > 0 && (
              <div className="tv-grid long" style={{ marginBottom: shown.length ? 18 : 0 }}>
                {filmsHere.map((v) => (
                  <VideoCard key={v.id} v={v} showKind={kind === "all"} />
                ))}
              </div>
            )}
            {shown.length > 0 && (
              <div className="tv-grid">
                {shown.map((v) => (
                  <VideoCard key={v.id} v={v} showKind={kind === "all"} />
                ))}
              </div>
            )}
            {shortsHere.length > shown.length && (
              <div className="tv-more">
                <button
                  type="button"
                  className="tv-btn tv-btn-ghost"
                  onClick={() => setLimit((l) => ({ ...l, [g.id]: l[g.id] + PAGE * 2 }))}
                >
                  Show more ({shortsHere.length - shown.length} left)
                </button>
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}
