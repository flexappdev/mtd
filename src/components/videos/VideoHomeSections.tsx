import Link from "next/link";
import {
  TIER_LABEL,
  byTier,
  countriesInOrder,
  films,
  formatDuration,
  pickFeatured,
  placeLink,
  type TravelChannel,
  type TravelVideo,
} from "@/lib/travel-videos";
import { SubscribeCTA } from "./SubscribeCTA";
import { VideoRail } from "./VideoRail";

/** Video-first hero: featured film (or newest/first Morocco video) with its poster. */
export function VideoHero({ videos, channel }: { videos: TravelVideo[]; channel: TravelChannel }) {
  const v = pickFeatured(videos);
  if (!v) return null;
  const place = placeLink(v);
  return (
    <section className="tv-hero" aria-label="Featured video">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="tv-hero-bg" style={{ backgroundImage: `url(${v.poster_url})` }} />
      <div className="tv-hero-inner">
        <div>
          <div className="featured-meta">
            <b>▶ {v.kind === "long" ? "FEATURED FILM" : "NOW SHOWING"}</b>
            <span>·</span>
            <span>{[v.place !== v.country ? v.place : null, v.country].filter(Boolean).join(", ")}</span>
            <span>·</span>
            <span>{formatDuration(v.duration)}</span>
          </div>
          <h1>{v.title}</h1>
          {v.description && <p>{v.description}</p>}
          <div className="cta-row">
            <Link href={`/videos/${v.id}`} className="tv-btn tv-btn-play">
              <span style={{ fontSize: 18 }}>▶</span> Watch now
            </Link>
            {place && !place.external && (
              <Link href={place.href} className="tv-btn tv-btn-ghost">
                {v.place} guide
              </Link>
            )}
            <a
              href={`${channel.url}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="tv-btn tv-btn-yt"
            >
              Subscribe {channel.handle}
            </a>
          </div>
        </div>
        <Link href={`/videos/${v.id}`} className={`tv-hero-poster ${v.kind}`} aria-label={`Watch ${v.title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.poster_url} alt={v.title} />
          <span className="play">▶</span>
        </Link>
      </div>
    </section>
  );
}

/** Rails right under the hero: Morocco, North Africa & Middle East, films, subscribe. */
export function VideoTopRails({ videos, channel }: { videos: TravelVideo[]; channel: TravelChannel }) {
  const morocco = byTier(videos, "morocco");
  const mena = byTier(videos, "mena");
  const longs = films(videos);
  const menaCountries = countriesInOrder(mena).map((c) => c.country);
  return (
    <>
      <VideoRail
        title="Morocco on film"
        sub={`${morocco.length} ${morocco.length === 1 ? "video" : "videos"} · more every week`}
        videos={morocco}
        seeAll={{ href: "/videos?country=Morocco" }}
      />
      <VideoRail
        title={TIER_LABEL.mena}
        sub={menaCountries.slice(0, 5).join(" · ") + (menaCountries.length > 5 ? " …" : "")}
        videos={mena}
        seeAll={{ href: "/videos" }}
      />
      <VideoRail
        title="Long-form travel films"
        sub={`${longs.length} films · ~8 min with chapters`}
        videos={longs}
        seeAll={{ href: "/videos?kind=long" }}
      />
      <SubscribeCTA channel={channel} total={videos.length} />
    </>
  );
}

/** Replaces the old placeholder "From Siems Production" row. */
export function VideoChannelRail({ videos }: { videos: TravelVideo[] }) {
  const more = byTier(videos, "more").filter((v) => v.kind === "short").slice(0, 24);
  return (
    <VideoRail
      title={TIER_LABEL.more}
      sub={`${byTier(videos, "more").length} destinations worldwide from Siems Production`}
      videos={more}
      seeAll={{ href: "/videos", label: "Watch all" }}
    />
  );
}
