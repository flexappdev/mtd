import Link from "next/link";
import { CHANNEL_FALLBACK, type TravelChannel } from "@/lib/travel-videos";

export function SubscribeCTA({
  channel = CHANNEL_FALLBACK,
  total,
  showWatchAll = true,
}: {
  channel?: TravelChannel;
  total?: number;
  showWatchAll?: boolean;
}) {
  return (
    <section className="tv-subscribe" aria-label="Subscribe on YouTube">
      <div className="tv-subscribe-inner">
        <div className="text">
          <h4>Subscribe on YouTube {channel.handle}</h4>
          <p>
            New travel shorts and films from {channel.name} every day
            {total ? ` · ${total} videos and counting` : ""}. Morocco first, then the rest of the world.
          </p>
        </div>
        <div className="actions">
          <a
            href={`${channel.url}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="tv-btn tv-btn-yt"
          >
            ▶ Subscribe {channel.handle}
          </a>
          {showWatchAll && (
            <Link href="/videos" className="tv-btn tv-btn-ghost">
              Watch all videos
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
