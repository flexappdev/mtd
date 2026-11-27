import type { Metadata } from "next";
import { SubscribeCTA } from "@/components/videos/SubscribeCTA";
import { toCardData } from "@/components/videos/VideoCard";
import { countriesInOrder, getChannel, getSiteVideos, tierOf } from "@/lib/travel-videos";

import { VideosBrowser } from "./VideosBrowser";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Travel videos",
  description:
    "Every Morocco travel short and film from Siems Production (@MatSiems), then North Africa, the Middle East and the rest of the world.",
  alternates: { canonical: "/videos" },
};

type SP = Promise<{ kind?: string; country?: string; q?: string }>;

export default async function VideosPage({ searchParams }: { searchParams: SP }) {
  const [videos, channel, sp] = await Promise.all([getSiteVideos(), getChannel(), searchParams]);
  const morocco = videos.filter((v) => tierOf(v) === "morocco").length;
  const mena = videos.filter((v) => tierOf(v) === "mena").length;

  return (
    <main className="fo-main">
      <div className="tv-page">
        <div className="tv-eyebrow">
          <b>▶ {channel.name}</b> · {channel.handle}
        </div>
        <h1>Travel videos</h1>
        <p className="tv-lede">
          {videos.length > 0
            ? `${morocco} Morocco ${morocco === 1 ? "video" : "videos"} first, then ${mena} from North Africa & the Middle East, then ${videos.length - morocco - mena} more from the channel. Vertical shorts and long-form films, with new ones every day.`
            : "Our travel videos are on their way. In the meantime, catch them on YouTube."}
        </p>
        {videos.length > 0 ? (
          <VideosBrowser
            videos={videos.map((v) => ({ ...toCardData(v), tier: tierOf(v) }))}
            countries={countriesInOrder(videos)}
            initial={{
              kind: sp.kind === "short" || sp.kind === "long" ? sp.kind : "all",
              country: sp.country ?? "",
              q: sp.q ?? "",
            }}
          />
        ) : (
          <div className="tv-empty" style={{ marginTop: 24 }}>
            The video catalogue is temporarily unavailable.{" "}
            <a href={channel.url} target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
              Watch on YouTube {channel.handle}
            </a>
            .
          </div>
        )}
      </div>
      <SubscribeCTA channel={channel} total={videos.length} showWatchAll={false} />
    </main>
  );
}
