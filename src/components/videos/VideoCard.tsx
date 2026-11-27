import Link from "next/link";
import type { TravelVideo } from "@/lib/travel-videos";
import { formatDuration } from "@/lib/travel-videos-format";

export type VideoCardData = Pick<
  TravelVideo,
  "id" | "kind" | "title" | "place" | "country" | "duration" | "poster_url" | "youtube_id"
>;

/** Poster card: duration badge + "On YouTube" (published) vs "New" (queued) badge. */
export function VideoCard({ v, showKind = false }: { v: VideoCardData; showKind?: boolean }) {
  const onYouTube = !!v.youtube_id;
  return (
    <Link href={`/videos/${v.id}`} className={`tv-card ${v.kind}`}>
      <div className="poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={v.poster_url} alt={v.title} loading="lazy" decoding="async" />
        <span className={`tv-badge ${onYouTube ? "yt" : "new"}`}>{onYouTube ? "On YouTube" : "New"}</span>
        {showKind && <span className="tv-badge kind">{v.kind === "long" ? "Film" : "Short"}</span>}
        <span className="tv-duration">{formatDuration(v.duration)}</span>
      </div>
      <div className="title">{v.title}</div>
      <div className="meta">
        {v.place && v.place !== v.country ? `${v.place} · ${v.country}` : v.country}
      </div>
    </Link>
  );
}

/** Slim the catalog entry down for client props. */
export function toCardData(v: TravelVideo): VideoCardData {
  return {
    id: v.id,
    kind: v.kind,
    title: v.title,
    place: v.place,
    country: v.country,
    duration: v.duration,
    poster_url: v.poster_url,
    youtube_id: v.youtube_id,
  };
}
