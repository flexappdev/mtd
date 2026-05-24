import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { FEATURED_VIDEOS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export default function MediaVideosPage() {
  const tiles: SectionTile[] = FEATURED_VIDEOS.map((v) => ({
    id: v.id,
    title: v.title,
    subtitle: findDestination(v.dest)?.name,
    badge: v.duration,
    href: `/morocco/${v.dest}`,
    meta: [v.series, `${v.views} views`, v.date],
  }));
  return (
    <SectionPage
      crumb="Media · Videos"
      title="Videos"
      tagline="Walking tours, drone shots, sunrise dunes and food stories — curated from Morocco creators."
      stats={[
        { label: "Featured", value: FEATURED_VIDEOS.length },
        { label: "Library", value: "10,000" },
      ]}
      tiles={tiles}
    />
  );
}
