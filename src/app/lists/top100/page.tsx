import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { DESTINATIONS, SIGHTS, REGIONS, findRegion } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Top 100 places in Morocco",
  description: "The definitive editorial ranking — cities, sights and regions in one list.",
};

type Entry = { id: string; title: string; subtitle?: string; meta?: string[]; score: number; href?: string };

function build(): Entry[] {
  const dests: Entry[] = DESTINATIONS.map((d) => ({
    id: `d-${d.id}`,
    title: d.name,
    subtitle: `${d.position} · ${findRegion(d.region)?.name ?? d.region}`,
    meta: ["destination", `${d.clicks30.toLocaleString()} clicks/30d`],
    score: d.clicks30,
    href: `/morocco/${d.id}`,
  }));
  const sights: Entry[] = SIGHTS.map((s) => ({
    id: `s-${s.id}`,
    title: s.name,
    subtitle: s.kind,
    meta: ["sight", s.unesco ? "UNESCO" : "—"],
    score: s.clicks30,
    href: `/morocco/${s.dest}`,
  }));
  const regions: Entry[] = REGIONS.map((r, i) => ({
    id: `r-${r.id}`,
    title: r.name,
    subtitle: "Region",
    meta: ["region", r.id],
    score: 5000 - i * 500,
  }));
  return [...dests, ...sights, ...regions].sort((a, b) => b.score - a.score).slice(0, 100);
}

export default function Top100Page() {
  const entries = build();
  const tiles: SectionTile[] = entries.map((e, i) => ({
    id: e.id,
    title: `#${i + 1} · ${e.title}`,
    subtitle: e.subtitle,
    meta: e.meta,
    href: e.href,
  }));
  return (
    <SectionPage
      crumb="Lists · Top 100"
      title="Top 100 places in Morocco"
      tagline="The definitive editorial ranking — cities, sights and regions, scored on clicks and curation."
      stats={[{ label: "Ranked items", value: tiles.length }]}
      tiles={tiles}
    />
  );
}
