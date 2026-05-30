import Link from "next/link";
import { Plus } from "lucide-react";
import {
  DESTINATIONS,
  FEATURED_VIDEOS,
  GUIDES,
  HOTELS,
  LISTS,
  REGIONS,
  RESTAURANTS,
  SIGHTS,
  WIKI_ARTICLES,
  findDestination,
  findRegion,
  img,
} from "@/lib/mtd-v2/seed";
import type { Destination } from "@/lib/mtd-v2/types";
import { BigRankTile, Row, Tile } from "./Tile";

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function guideKindHref(kind: string): string {
  if (kind === "guidebook") return "/guides/books";
  if (kind === "cookbook") return "/guides/cookbooks";
  if (kind === "beauty") return "/guides/beauty";
  return "/guides/gear";
}

export function FrontHomeV2({ destinations = DESTINATIONS }: { destinations?: Destination[] }) {
  const visible = destinations.filter((d) => d.status === "live" || d.status === "preview");
  const ranked = [...visible].sort((a, b) => b.clicks30 - a.clicks30);
  const featured = ranked[0];

  if (!featured) {
    return (
      <main className="fo-main">
        <section className="fo-section-v2">
          <div className="head">
            <div>
              <h2>No destinations yet</h2>
              <div className="sub">Seed data unavailable.</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="fo-main">
      <section className="fo-hero-cinema">
        <div
          className="fo-hero-cinema-img"
          style={{ backgroundImage: `url(${img(featured.id + "-hero", 1920, 1080)})` }}
        />
        <div className="fo-hero-cinema-inner">
          <div className="featured-meta">
            <b>★ FEATURED THIS WEEK</b>
            <span>·</span>
            <span>{featured.position}</span>
            <span>·</span>
            <span>{formatNum(featured.clicks30)} clicks · 30d</span>
          </div>
          <h1>{featured.name}</h1>
          <p>
            Red walls, palm courtyards, snake-charmers at dusk. {featured.position}. Our full guide — {featured.hotels}{" "}
            hotels, {featured.sights} sights, {featured.facts} facts — with live rates updated hourly.
          </p>
          <div className="cta-row">
            <Link href={`/morocco/${featured.id}`} className="btn-play" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: 18 }}>▶</span>
              Open guide
            </Link>
            <Link href={`/places/cities`} className="btn-more" style={{ textDecoration: "none" }}>
              <Plus size={16} /> More info
            </Link>
            <Link
              href={`/moroccai?dest=${featured.id}`}
              className="btn-more"
              style={{
                background: "rgba(193,39,45,0.18)",
                borderColor: "rgba(193,39,45,0.4)",
                color: "#c1272d",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 16 }}>✦</span> Ask MoroccAI
            </Link>
          </div>
        </div>
      </section>

      <Row title="Top 10 places in Morocco" sub="Editorial ranking · this week">
        {ranked.slice(0, 10).map((d, i) => (
          <BigRankTile
            key={d.id}
            rank={i + 1}
            seed={d.id}
            name={d.name}
            meta={findRegion(d.region)?.name}
            href={`/morocco/${d.id}`}
          />
        ))}
      </Row>

      <Row title="By region" sub="Five flavours of Morocco">
        {REGIONS.map((r) => (
          <Tile
            key={r.id}
            seed={"region-" + r.id}
            kind="square"
            name={r.name}
            meta={DESTINATIONS.filter((d) => d.region === r.id).length + " destinations"}
            href={`/places/regions#${r.id}`}
          />
        ))}
      </Row>

      <Row title="Sights & landmarks" sub="Mosques, ksars, dunes, medersas">
        {SIGHTS.slice(0, 12).map((s) => (
          <Tile
            key={s.id}
            seed={s.id}
            kind="portrait"
            name={s.name}
            meta={(findDestination(s.dest)?.name ?? "") + (s.unesco ? " · UNESCO" : "")}
            badge={s.unesco ? "UNESCO" : null}
            href={`/morocco/${s.dest}#${s.id}`}
          />
        ))}
      </Row>

      <Row title="From Siems Production" sub={`${FEATURED_VIDEOS.length} of 10,000 episodes · youtube.com/user/siemsproduction`}>
        {FEATURED_VIDEOS.map((v) => (
          <Tile
            key={v.id}
            seed={"video-" + v.id}
            kind="wide"
            name={v.title}
            meta={`${v.views} views · ${v.date}`}
            badge="VIDEO"
            duration={v.duration}
            href={`/media/videos#${v.id}`}
          />
        ))}
      </Row>

      <Row title="Top 100s" sub={`${LISTS.length} ranked lists · 10,000+ entries`}>
        {LISTS.slice(0, 10).map((l) => (
          <Tile
            key={l.id}
            seed={"list-" + l.hero}
            kind="landscape"
            name={l.title}
            meta={`${l.items} entries · ${l.curator}`}
            badge={l.trending ? "TRENDING" : null}
            href={`/lists/${l.id}`}
          />
        ))}
      </Row>

      <Row title="Where to stay" sub="Live rates · Booking, Expedia, Agoda">
        {HOTELS.slice(0, 12).map((h) => {
          const minRate = Math.min(
            ...Object.values(h.rates).filter((v): v is number => v != null),
          );
          return (
            <Tile
              key={h.id}
              seed={"hotel-" + h.id}
              kind="square"
              name={h.name}
              meta={`${"★".repeat(h.stars)} · from €${minRate}`}
              href={`/places/hotels#${h.id}`}
            />
          );
        })}
      </Row>

      <Row title="Restaurants & rooftops">
        {RESTAURANTS.map((r) => (
          <Tile
            key={r.id}
            seed={"rest-" + r.id}
            kind="landscape"
            name={r.name}
            meta={`${r.kind} · ${r.price} · ${findDestination(r.dest)?.name ?? ""}`}
            href={`/places/restaurants#${r.id}`}
          />
        ))}
      </Row>

      <Row title="Read & gear up" sub="Editor's picks · Amazon affiliate">
        {GUIDES.map((g) => (
          <Tile
            key={g.id}
            seed={"guide-" + g.id}
            kind="thin"
            name={g.title}
            meta={`${g.price} · ★ ${g.rating}`}
            badge="SHOP"
            href={guideKindHref(g.kind)}
          />
        ))}
      </Row>

      <div className="fo-promo-strip">
        <Link href="/moroccai" className="fo-promo" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="mtd-photo"
            style={{ backgroundImage: `url(${img("promo-ai", 720, 405)})`, position: "absolute", inset: 0 }}
          />
          <div className="body">
            <h4>Ask MoroccAI ✦</h4>
            <p>“Plan me 10 days in Morocco from Marrakech.” Done in 30 seconds.</p>
          </div>
        </Link>
        <Link href="/lists" className="fo-promo" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="mtd-photo"
            style={{ backgroundImage: `url(${img("promo-lists", 720, 405)})`, position: "absolute", inset: 0 }}
          />
          <div className="body">
            <h4>10,000+ ranked entries</h4>
            <p>Every sight, hotel, restaurant scored across {LISTS.length} top-N lists.</p>
          </div>
        </Link>
        <Link href="/media/videos" className="fo-promo" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="mtd-photo"
            style={{ backgroundImage: `url(${img("promo-videos", 720, 405)})`, position: "absolute", inset: 0 }}
          />
          <div className="body">
            <h4>10,000 Morocco videos</h4>
            <p>335 from Siems Production, the rest from the wider community.</p>
          </div>
        </Link>
        <Link href="/random" className="fo-promo" style={{ textDecoration: "none", color: "inherit" }}>
          <div
            className="mtd-photo"
            style={{ backgroundImage: `url(${img("promo-random", 720, 405)})`, position: "absolute", inset: 0 }}
          />
          <div className="body">
            <h4>🎲 Random Morocco</h4>
            <p>One click, one new place. Surprise yourself.</p>
          </div>
        </Link>
      </div>

      <Row title="From the Wiki" sub="Sourced from Wikipedia · CC-BY-SA">
        {WIKI_ARTICLES.map((w) => {
          const dest = w.dest !== "cross" ? findDestination(w.dest) : undefined;
          return (
            <Tile
              key={w.id}
              seed={"wiki-" + w.id}
              kind="landscape"
              name={w.title}
              meta={`${w.length} · updated ${w.updated}`}
              badge="WIKI"
              href={dest ? `/morocco/${dest.id}` : "/wiki"}
            />
          );
        })}
      </Row>
    </main>
  );
}
