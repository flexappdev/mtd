import { img, tint } from "@/lib/mtd-v2/seed";

type Kind = "landscape" | "portrait" | "square" | "wide" | "thin";

export function Tile({
  seed,
  name,
  meta,
  rank,
  badge,
  duration,
  kind = "landscape",
}: {
  seed: string;
  name: string;
  meta?: string;
  rank?: number;
  badge?: string | null;
  duration?: string;
  kind?: Kind;
}) {
  const [a, b] = tint(seed);
  const w = 800;
  const h = kind === "portrait" ? 1200 : kind === "thin" ? 1000 : 600;
  const imgUrl = img(seed, w, h);

  return (
    <div className={`tile tile-${kind}`} style={{ ["--tint-a" as never]: `color-mix(in oklch, ${a} 35%, transparent)` }}>
      <div
        className="tile-img"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in oklch, ${a} 30%, transparent), color-mix(in oklch, ${b} 60%, transparent)), url(${imgUrl})`,
          backgroundSize: "cover",
        }}
      />
      {rank != null && <span className={`tile-rank${rank <= 3 ? " gold" : ""}`}>#{rank}</span>}
      {badge && <span className={`tile-badge ${badge === "VIDEO" ? "video" : ""}`}>{badge}</span>}
      {duration && <span className="tile-duration">{duration}</span>}
      <div className="tile-body">
        <div className="tile-name">{name}</div>
        {meta && <div className="tile-meta">{meta}</div>}
      </div>
    </div>
  );
}

export function BigRankTile({ seed, rank, name, meta }: { seed: string; rank: number; name: string; meta?: string }) {
  const [a] = tint(seed);
  const imgUrl = img(seed, 400, 600);

  return (
    <div className="tile-rank-big">
      <div className="num">{rank}</div>
      <div
        className="pic"
        style={{
          backgroundImage: `linear-gradient(180deg, transparent 30%, ${a} 100%), url(${imgUrl})`,
          backgroundSize: "cover",
        }}
      >
        <div className="label">
          {name}
          {meta && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: 0.8, marginTop: 2, fontWeight: 400 }}>
              {meta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Row({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fo-row">
      <div className="fo-row-head">
        <h3>{title}</h3>
        {sub && <span className="sub">{sub}</span>}
      </div>
      <div className="fo-row-scroll">{children}</div>
    </div>
  );
}
