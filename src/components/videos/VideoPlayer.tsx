"use client";

import { useRef, useState, type ReactNode } from "react";
import type { TravelChapter } from "@/lib/travel-videos";
import { chapterSeconds, youtubeEmbed } from "@/lib/travel-videos-format";

type Props = {
  kind: "short" | "long";
  title: string;
  youtubeId: string | null;
  videoUrl: string;
  posterUrl: string;
  chapters: TravelChapter[];
  /** Rendered between the player and the chapter list (title, description…). */
  children?: ReactNode;
};

/**
 * YouTube embed when the video is published, otherwise the S3 mp4. Chapters
 * seek either by reloading the embed with ?start= or by setting currentTime.
 */
export function VideoPlayer({ kind, title, youtubeId, videoUrl, posterUrl, chapters, children }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const seek = (i: number, t: string) => {
    const s = chapterSeconds(t);
    setActive(i);
    if (youtubeId) {
      setStart(s);
    } else if (videoRef.current) {
      videoRef.current.currentTime = s;
      void videoRef.current.play().catch(() => {});
    }
    playerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <>
      <div ref={playerRef} className={`tv-player ${kind}`}>
        {youtubeId ? (
          <iframe
            key={start ?? "init"}
            src={youtubeEmbed(youtubeId, start ?? undefined, start != null)}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            controls
            playsInline
            preload="none"
            aria-label={title}
          />
        )}
      </div>
      {children}
      {chapters.length > 0 && (
        <section className="tv-block" aria-label="Chapters">
          <h2>Chapters</h2>
          <ol className="tv-chapters">
            {chapters.map((c, i) => (
              <li key={`${c.t}-${i}`}>
                <button type="button" className={active === i ? "on" : ""} onClick={() => seek(i, c.t)}>
                  <span className="t">{c.t}</span>
                  <span>{c.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
