import Link from "next/link";
import { img, tint } from "@/lib/mtd-v2/seed";

type Kind = "landscape" | "portrait" | "square" | "wide" | "thin";

type TileProps = {
  seed: string;
  imageUrl?: string;
  name: string;
  meta?: string;
  rank?: number;
  badge?: string | null;
  duration?: string;
  kind?: Kind;
  href?: string;
  external?: boolean;
};

export function Tile({
  seed,
  imageUrl,
  name,
  meta,
  rank,
  badge,
  duration,
  kind = "landscape",
  href,
  external,
}: TileProps) {
  const [a, b] = tint(seed);
  const w = 800;
  const h = kind === "portrait" ? 1200 : kind === "thin" ? 1000 : 600;
  const imgUrl = imageUrl ?? img(seed, w, h);

  const inner = (
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

  if (!href) return inner;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="sponsored noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
  );
}

export function BigRankTile({
  seed,
  imageUrl,
  rank,
  name,
  meta,
  href,
}: {
  seed: string;
  imageUrl?: string;
  rank: number;
  name: string;
  meta?: string;
  href?: string;
}) {
  const [a] = tint(seed);
  const imgUrl = imageUrl ?? img(seed, 400, 600);

  const inner = (
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

  if (!href) return inner;
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {inner}
    </Link>
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
