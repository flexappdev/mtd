import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Attribution } from "@/components/videos/Attribution";
import { SubscribeCTA } from "@/components/videos/SubscribeCTA";
import { VideoPlayer } from "@/components/videos/VideoPlayer";
import { VideoRail } from "@/components/videos/VideoRail";
import {
  TIER_LABEL,
  chapterSeconds,
  formatDuration,
  getCatalog,
  getSiteVideos,
  getVideo,
  isoDuration,
  placeLink,
  relatedVideos,
  tierOf,
  youtubeEmbed,
  type TravelVideoDetail,
} from "@/lib/travel-videos";

export const revalidate = 900;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://moroccotopdestinations.com";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const v = await getVideo(id);
  if (!v) return { title: "Video" };
  const description = (v.hook ? `${v.hook}. ` : "") + v.description;
  return {
    title: v.title,
    description,
    alternates: { canonical: `/videos/${v.id}` },
    openGraph: {
      type: "video.other",
      title: v.title,
      description,
      url: `/videos/${v.id}`,
      images: [{ url: v.poster_url, alt: v.title }],
      videos: v.youtube_id ? [{ url: `https://www.youtube.com/watch?v=${v.youtube_id}` }] : [{ url: v.video_url }],
    },
    twitter: { card: "summary_large_image", title: v.title, description, images: [v.poster_url] },
  };
}

function videoJsonLd(v: TravelVideoDetail, uploadFallback: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.description || v.title,
    thumbnailUrl: [v.poster_url],
    uploadDate: v.published_at ?? uploadFallback,
    duration: isoDuration(v.duration),
    contentUrl: v.video_url,
    ...(v.youtube_id ? { embedUrl: youtubeEmbed(v.youtube_id) } : {}),
    url: `${SITE_URL}/videos/${v.id}`,
    inLanguage: "en",
    contentLocation: { "@type": "Place", name: [v.place, v.country].filter(Boolean).join(", ") },
    publisher: { "@type": "Organization", name: "Siems Production", url: "https://www.youtube.com/@MatSiems" },
    ...(v.chapters.length
      ? {
          hasPart: v.chapters.map((c, i) => ({
            "@type": "Clip",
            name: c.label,
            startOffset: chapterSeconds(c.t),
            endOffset: v.chapters[i + 1] ? chapterSeconds(v.chapters[i + 1].t) : Math.round(v.duration),
            url: v.youtube_id
              ? `https://www.youtube.com/watch?v=${v.youtube_id}&t=${chapterSeconds(c.t)}`
              : `${SITE_URL}/videos/${v.id}#t=${chapterSeconds(c.t)}`,
          })),
        }
      : {}),
  };
}

export default async function VideoPage({ params }: Params) {
  const { id } = await params;
  const [v, all, catalog] = await Promise.all([getVideo(id), getSiteVideos(), getCatalog()]);
  if (!v) notFound();

  const place = placeLink(v);
  const related = relatedVideos(v, all, 16);
  const sameCountry = related.filter((r) => r.country === v.country);
  const others = related.filter((r) => r.country !== v.country);
  const tier = tierOf(v);
  const ld = videoJsonLd(v, catalog?.generated_at ?? new Date().toISOString());

  const info = (
    <div>
      <div className="tv-crumbs">
        <Link href="/videos">Videos</Link> ·{" "}
        <Link href={`/videos?country=${encodeURIComponent(v.country)}`}>{v.country}</Link>
        {TIER_LABEL[tier] !== v.country && <> · {TIER_LABEL[tier]}</>}
      </div>
      <h1>{v.title}</h1>
      <div className="tv-facts">
        <span className="tv-chip accent">{v.kind === "long" ? "Film" : "Short"} · {formatDuration(v.duration)}</span>
        {v.place && v.place !== v.country && <span className="tv-chip">📍 {v.place}</span>}
        <Link className="tv-chip" href={`/videos?country=${encodeURIComponent(v.country)}`}>
          {v.country}
        </Link>
        <span className="tv-chip">{v.youtube_id ? "On YouTube" : "New · premiering soon"}</span>
      </div>
      {v.hook && <p className="tv-hook">{v.hook}</p>}
      {v.description && <p className="tv-desc">{v.description}</p>}
      <div className="tv-actions">
        {place &&
          (place.external ? (
            <a className="tv-btn tv-btn-ghost" href={place.href} target="_blank" rel="noopener noreferrer">
              {v.place} guide on World Best Places ↗
            </a>
          ) : (
            <Link className="tv-btn tv-btn-play" href={place.href}>
              Open the {v.place} guide
            </Link>
          ))}
        {v.youtube_url && (
          <a className="tv-btn tv-btn-yt" href={v.youtube_url} target="_blank" rel="noopener noreferrer">
            ▶ Watch on YouTube
          </a>
        )}
      </div>
    </div>
  );

  return (
    <main className="fo-main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="tv-watch">
        {v.kind === "short" ? (
          <div className="tv-watch-grid short">
            <div>
              <VideoPlayer
                kind="short"
                title={v.title}
                youtubeId={v.youtube_id}
                videoUrl={v.video_url}
                posterUrl={v.poster_url}
                chapters={v.chapters}
              />
            </div>
            {info}
          </div>
        ) : (
          <div className="tv-watch-grid long">
            <VideoPlayer
              kind="long"
              title={v.title}
              youtubeId={v.youtube_id}
              videoUrl={v.video_url}
              posterUrl={v.poster_url}
              chapters={v.chapters}
            >
              {info}
            </VideoPlayer>
          </div>
        )}

        {v.segments.length > 0 && (
          <section className="tv-block" aria-label="In this video">
            <h2>In this video</h2>
            <div className="tv-segments">
              {v.segments.map((s, i) => (
                <article key={i} className="tv-segment">
                  <div className="kicker">{s.kicker}</div>
                  <div className="big">{s.big}</div>
                  <p className="text">{s.text}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {sameCountry.length > 0 && (
          <div className="tv-block">
            <VideoRail
              flush
              title={`More from ${v.country}`}
              videos={sameCountry}
              seeAll={{ href: `/videos?country=${encodeURIComponent(v.country)}` }}
            />
          </div>
        )}
        {others.length > 0 && (
          <div className="tv-block">
            <VideoRail
              flush
              title={tier === "more" ? "More from the channel" : `More from ${TIER_LABEL[tier]}`}
              videos={others}
              seeAll={{ href: "/videos", label: "All videos" }}
            />
          </div>
        )}

        <Attribution text={v.attribution} />
      </div>
      <SubscribeCTA channel={catalog?.channel} total={all.length} />
    </main>
  );
}
