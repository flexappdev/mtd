import Link from "next/link";
import { GitCommit, ExternalLink, Tag } from "lucide-react";
import pkg from "../../../package.json";

export const metadata = {
  title: "Version history · MTD",
  description: "Morocco Travel Directory release notes.",
};

export const dynamic = "force-static";

type Release = {
  version: string;
  date: string;
  headline: string;
  commit?: string;
  bullets: string[];
};

const ACCENT = "#10b981";
const REPO = "flexappdev/mtd";

const RELEASES: Release[] = [
  {
    version: "3.0.0",
    date: "2026-07-20",
    commit: "e58c694",
    headline: "FLEET migration — 9 collections consolidated",
    bullets: [
      "Migrated from dedicated `mtd` Mongo DB to shared FLEET database with {app:'mtd'} discriminator",
      "9 collections consolidated into FLEET.items / FLEET.lists / FLEET.media",
      "Freed cluster capacity for further fleet expansion (per MONGO-FLEET-SCHEMA.md)",
    ],
  },
  {
    version: "2.6.0",
    date: "2026-07-15",
    commit: "fe54d9c",
    headline: "476-item Morocco directory via Wikipedia category walk",
    bullets: [
      "Wikipedia category walk yielding 476 Morocco-related items",
      "Full directory coverage: cities, regions, sights, souks, medinas",
      "Editorial classifier tuned to Moroccan geography",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-06-13",
    commit: "3c28862",
    headline: "AI image + video pipeline · 8 diagrams · GA4 Consent v2",
    bullets: [
      "42 FLUX hero images live on s3://com27/mtd",
      "12 YouTube embeds wired into seed.ts",
      "8 architecture diagrams shipped to /diagrams",
      "GA4 Consent Mode v2 + 4 event helpers + JSON-LD structured data",
      "GA4 G-ZJTKS68ZZK activated via xmas analytics.ts pattern",
      "Moroccan-star favicon on red (icon.svg)",
    ],
  },
  {
    version: "2.4.0",
    date: "2026-06-05",
    commit: "809f961",
    headline: "Leaflet map + Wikivoyage ingest + per-route OG",
    bullets: [
      "Real Leaflet map at /media/map — 83 Morocco pins, click-through to guides",
      "83 Wikivoyage Morocco articles ingested + /wiki + detail pages wired",
      "Per-route OG images (destinations / lists / regions)",
      "MoroccAI switched to nodejs runtime to unblock Edge streaming",
    ],
  },
  {
    version: "2.0.0",
    date: "2026-05-31",
    commit: "c29b091",
    headline: "P0–P9 prod-readiness — MoroccAI Edge chat + admin tabs",
    bullets: [
      "P4: MoroccAI chat live — Claude Sonnet 4.6 Edge streaming",
      "P3: /morocco/[slug] enriched with hero + hotels + sights + restaurants + MoroccAI deep-link",
      "P5: scroller-mode persistence + ⭐ saved (localStorage)",
      "P7: admin tabs — Bookings, Affiliates, MoroccAI",
      "P6: MonetisationFooter (archetype=place) above sticky footer",
      "P8: production hardening — security headers, sitemap, build OOM guard",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-05-24",
    commit: "05d7d49",
    headline: "V1 — auth + admin backbone + Morocco seed",
    bullets: [
      "Supabase auth (mat@matsiems.com gate)",
      "/admin backbone with Mongo browser + CMS editors",
      "Morocco seed data + basic /places, /regions, /cities routes",
      "First Vercel deploy → mtd-rose.vercel.app",
    ],
  },
];

export default function VersionsPage() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
          <Tag className="h-3.5 w-3.5" style={{ color: ACCENT }} />
          MTD · Version history
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">v{pkg.version}</h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Every release of Morocco Travel Directory with a short summary of what shipped. Newest first.
          Source of truth:{" "}
          <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:underline"
            style={{ color: ACCENT }}
          >
            {REPO}
            <ExternalLink className="h-3 w-3" />
          </a>
          .
        </p>
      </header>

      <ol className="space-y-8">
        {RELEASES.map((r) => (
          <li
            key={r.version}
            className="relative rounded-lg border p-5"
            style={{ borderLeftWidth: 3, borderLeftColor: ACCENT }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-semibold">v{r.version}</h2>
              <time className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                {r.date}
              </time>
            </div>
            <p className="mt-1 text-sm">{r.headline}</p>
            {r.commit && (
              <a
                href={`https://github.com/${REPO}/commit/${r.commit}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono hover:underline"
                title="View commit on GitHub"
                style={{ color: ACCENT }}
              >
                <GitCommit className="h-3 w-3" />
                {r.commit}
              </a>
            )}
            <ul className="mt-4 space-y-1.5">
              {r.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <footer className="pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">← Back to home</Link>
        <Link href="/diagrams" className="hover:underline">Architecture diagrams →</Link>
      </footer>
    </div>
  );
}
