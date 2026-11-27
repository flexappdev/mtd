/** Pure helpers shared by server pages and client players (no server imports). */

export function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function isoDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `PT${m ? `${m}M` : ""}${s % 60}S`;
}

/** "1:02:03" | "0:52" -> seconds */
export function chapterSeconds(t: string): number {
  return t
    .split(":")
    .map((p) => Number(p) || 0)
    .reduce((acc, p) => acc * 60 + p, 0);
}

export function youtubeEmbed(id: string, start?: number, autoplay = false): string {
  const q = new URLSearchParams({ playsinline: "1", rel: "0", modestbranding: "1" });
  if (start) q.set("start", String(Math.floor(start)));
  if (autoplay) q.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${q.toString()}`;
}
