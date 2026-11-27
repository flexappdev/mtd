import Link from "next/link";
import type { TravelVideo } from "@/lib/travel-videos";
import { VideoCard } from "./VideoCard";

/** Horizontal rail in the site's Netflix-style Row look, with a "see all" link. */
export function VideoRail({
  title,
  sub,
  videos,
  seeAll,
  flush = false,
}: {
  title: string;
  sub?: string;
  videos: TravelVideo[];
  seeAll?: { href: string; label?: string };
  flush?: boolean;
}) {
  if (videos.length === 0) return null;
  return (
    <div className={`fo-row${flush ? " tv-rail-flush" : ""}`}>
      <div className="fo-row-head">
        <h3>{title}</h3>
        {sub && <span className="sub">{sub}</span>}
        {seeAll && (
          <Link href={seeAll.href} className="see-all">
            {seeAll.label ?? "See all"} →
          </Link>
        )}
      </div>
      <div className="fo-row-scroll">
        {videos.map((v) => (
          <VideoCard key={v.id} v={v} />
        ))}
      </div>
    </div>
  );
}
