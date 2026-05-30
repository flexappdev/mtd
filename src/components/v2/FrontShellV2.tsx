"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogIn, LogOut, Search, Settings, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DEV_BYPASS_COOKIE } from "@/lib/app-config";

type NavMenuItem = { id: string; label: string; count?: string; href: string };
type NavItem = { id: string; label: string; href?: string; menu?: NavMenuItem[]; highlight?: boolean };

const NAV: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "places",
    label: "Places",
    href: "/places",
    menu: [
      { id: "regions", label: "Regions", count: "5", href: "/places/regions" },
      { id: "cities", label: "Cities", count: "14", href: "/places/cities" },
      { id: "sights", label: "Sights", count: "212", href: "/places/sights" },
      { id: "hotels", label: "Hotels", count: "10,000", href: "/places/hotels" },
      { id: "restaurants", label: "Restaurants", count: "480", href: "/places/restaurants" },
    ],
  },
  {
    id: "lists",
    label: "Lists",
    href: "/lists",
    menu: [
      { id: "top100", label: "Top 100 Morocco", count: "100", href: "/lists/top100" },
      { id: "cities", label: "Top 50 cities", count: "50", href: "/lists/cities" },
      { id: "hotels", label: "Top 100 hotels", count: "100", href: "/lists/hotels" },
      { id: "food", label: "Top 100 restaurants", count: "100", href: "/lists/food" },
      { id: "all", label: "All lists", count: "10k+", href: "/lists/all" },
    ],
  },
  { id: "wiki", label: "Wiki", href: "/wiki" },
  {
    id: "media",
    label: "Media",
    href: "/media",
    menu: [
      { id: "images", label: "Images", count: "4,200", href: "/media/images" },
      { id: "audio", label: "Audio", count: "120", href: "/media/audio" },
      { id: "videos", label: "Videos", count: "10,000", href: "/media/videos" },
      { id: "map", label: "Map", count: "live", href: "/media/map" },
      { id: "pdf", label: "PDFs", count: "32", href: "/media/pdf" },
    ],
  },
  {
    id: "guides",
    label: "Guides",
    href: "/guides",
    menu: [
      { id: "books", label: "Guidebooks", count: "64", href: "/guides/books" },
      { id: "cookbooks", label: "Cookbooks", count: "28", href: "/guides/cookbooks" },
      { id: "gear", label: "Travel gear", count: "110", href: "/guides/gear" },
      { id: "beauty", label: "Argan & beauty", count: "40", href: "/guides/beauty" },
    ],
  },
  { id: "moroccai", label: "MoroccAI", href: "/moroccai", highlight: true },
];

type SessionState =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "user"; email: string };

export function FrontHeaderV2() {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<SessionState>({ kind: "loading" });
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const hasSupabase =
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!hasSupabase) {
      setSession({ kind: "anon" });
      return;
    }
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (cancelled) return;
        const email = data.user?.email;
        setSession(email ? { kind: "user", email } : { kind: "anon" });
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
        if (cancelled) return;
        const email = s?.user?.email;
        setSession(email ? { kind: "user", email } : { kind: "anon" });
      });
      return () => {
        cancelled = true;
        sub.subscription.unsubscribe();
      };
    } catch {
      setSession({ kind: "anon" });
    }
  }, []);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    document.cookie = `${DEV_BYPASS_COOKIE}=; path=/; max-age=0`;
    setSession({ kind: "anon" });
    router.refresh();
  }

  return (
    <header className={`fo-header${scrolled ? " scrolled" : ""}`}>
      <Link href="/" className="fo-brand" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="fo-brand-mark">M</div>
        <div className="fo-brand-name">
          MoroccoTopDestinations
          <span>moroccotopdestinations.com</span>
        </div>
      </Link>

      <nav className="fo-nav-v2">
        {NAV.map((n) => (
          <div key={n.id} className="item">
            {n.href ? (
              <Link
                href={n.href}
                className="item-trigger"
                style={n.highlight ? { color: "#c1272d", textDecoration: "none" } : { textDecoration: "none" }}
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
              </Link>
            ) : (
              <button className="item-trigger" type="button">
                {n.label}
                {n.menu && <ChevronDown size={12} style={{ opacity: 0.6 }} />}
              </button>
            )}
            {n.menu && (
              <div className="item-menu">
                {n.menu.map((m) => (
                  <Link key={m.id} href={m.href}>
                    {m.label}
                    {m.count && <span className="count">{m.count}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <form className="fo-search" action="/places" method="get" role="search">
        <span className="fo-search-icon">
          <Search size={14} />
        </span>
        <input name="q" placeholder="Search Morocco…" aria-label="Search Morocco" />
      </form>

      <div className="fo-auth">
        <a title="Saved" style={{ color: "rgba(255,255,255,0.78)", padding: 8, cursor: "pointer" }}>
          <Star size={16} />
        </a>
        {session.kind === "user" ? (
          <>
            <Link
              href="/admin"
              title={`Admin — ${session.email}`}
              style={{ color: "rgba(255,255,255,0.78)", padding: 8, textDecoration: "none" }}
            >
              <Settings size={16} />
            </Link>
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.78)",
                padding: 8,
                cursor: "pointer",
              }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link
            href="/login"
            title="Sign in"
            style={{ color: "rgba(255,255,255,0.78)", padding: 8, textDecoration: "none" }}
          >
            <LogIn size={16} />
          </Link>
        )}
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
        <Link href="/random" className="btn-dice" title="Random pick" prefetch={false} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 18 }}>🎲</span>
          Random
        </Link>
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.7 }}>
              · top-down
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
