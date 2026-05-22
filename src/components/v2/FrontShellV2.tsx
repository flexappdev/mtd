"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Search, Star } from "lucide-react";

type NavMenuItem = { id: string; label: string; count?: string };
type NavItem = { id: string; label: string; menu?: NavMenuItem[]; highlight?: boolean };

const NAV: NavItem[] = [
  { id: "home", label: "Home" },
  {
    id: "places",
    label: "Places",
    menu: [
      { id: "regions", label: "Regions", count: "5" },
      { id: "cities", label: "Cities", count: "14" },
      { id: "sights", label: "Sights", count: "212" },
      { id: "hotels", label: "Hotels", count: "10,000" },
      { id: "restaurants", label: "Restaurants", count: "480" },
    ],
  },
  {
    id: "lists",
    label: "Lists",
    menu: [
      { id: "top100", label: "Top 100 Morocco", count: "100" },
      { id: "cities", label: "Top 50 cities", count: "50" },
      { id: "hotels", label: "Top 100 hotels", count: "100" },
      { id: "food", label: "Top 100 restaurants", count: "100" },
      { id: "all", label: "All lists", count: "10k+" },
    ],
  },
  { id: "wiki", label: "Wiki" },
  {
    id: "media",
    label: "Media",
    menu: [
      { id: "images", label: "Images", count: "4,200" },
      { id: "audio", label: "Audio", count: "120" },
      { id: "videos", label: "Videos", count: "10,000" },
      { id: "map", label: "Map", count: "live" },
      { id: "pdf", label: "PDFs", count: "32" },
    ],
  },
  {
    id: "guides",
    label: "Guides",
    menu: [
      { id: "books", label: "Guidebooks", count: "64" },
      { id: "cookbooks", label: "Cookbooks", count: "28" },
      { id: "gear", label: "Travel gear", count: "110" },
      { id: "beauty", label: "Argan & beauty", count: "40" },
    ],
  },
  { id: "moroccai", label: "MoroccAI", highlight: true },
];

export function FrontHeaderV2() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fo-header${scrolled ? " scrolled" : ""}`}>
      <div className="fo-brand">
        <div className="fo-brand-mark">M</div>
        <div className="fo-brand-name">
          MoroccoTopDestinations
          <span>moroccotopdestinations.com</span>
        </div>
      </div>

      <nav className="fo-nav-v2">
        {NAV.map((n) => (
          <div key={n.id} className="item">
            <button
              className="item-trigger"
              style={n.highlight ? { color: "#c1272d" } : undefined}
              type="button"
            >
              {n.label}
              {n.menu && <ChevronDown size={12} style={{ opacity: 0.6 }} />}
              {n.highlight && (
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: 9,
                    padding: "2px 5px",
                    background: "rgba(193,39,45,0.2)",
                    borderRadius: 4,
                    letterSpacing: 0.1,
                    fontFamily: "var(--font-mono)",
                    color: "#c1272d",
                    textTransform: "uppercase",
                  }}
                >
                  AI
                </span>
              )}
            </button>
            {n.menu && (
              <div className="item-menu">
                {n.menu.map((m) => (
                  <a key={m.id}>
                    {m.label}
                    {m.count && <span className="count">{m.count}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="fo-search">
        <span className="fo-search-icon">
          <Search size={14} />
        </span>
        <input placeholder="Search Morocco…" />
      </div>

      <div className="fo-auth">
        <a title="Saved" style={{ color: "rgba(255,255,255,0.78)", padding: 8, cursor: "pointer" }}>
          <Star size={16} />
        </a>
      </div>
    </header>
  );
}

export function StickyFooter({
  destinations,
  totalRanked,
}: {
  destinations: number;
  totalRanked: number;
}) {
  const [scrollerMode, setScrollerMode] = useState(false);

  return (
    <div className="fo-sticky-footer">
      <div className="group">
        <button className="btn-dice" title="Random pick" type="button">
          <span style={{ fontSize: 18 }}>🎲</span>
          Random
        </button>
        <div className="mini-stats" style={{ marginLeft: 8 }}>
          <span>
            <b>{destinations}</b> places
          </span>
          <span>
            <b>{totalRanked.toLocaleString()}</b> ranked
          </span>
          <span>
            <b>10,000</b> videos
          </span>
        </div>
      </div>
      <div className="group">
        <button
          className={`scroller-toggle${scrollerMode ? " on" : ""}`}
          onClick={() => setScrollerMode((s) => !s)}
          type="button"
          title="Scroller mode: every page becomes one long ranked feed"
        >
          <span className="knob" />
          <span>Scroller mode</span>
          {scrollerMode && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.7 }}>· top-down</span>
          )}
        </button>
      </div>
    </div>
  );
}
