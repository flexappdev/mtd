// MTD v2 — Cinematic front shell: dark translucent header w/ mega-menu nav,
// sticky footer with dice + scroller-mode toggle.

const NAV_V2 = [
  { id: 'fo-home', label: 'Home' },
  {
    id: 'fo-places', label: 'Places',
    menu: [
      { id: 'fo-places/regions',     label: 'Regions',     count: '5',     glyph: () => <IconMap size={14} /> },
      { id: 'fo-places/cities',      label: 'Cities',      count: '14',    glyph: () => <IconMapPin size={14} /> },
      { id: 'fo-places/sights',      label: 'Sights',      count: '212',   glyph: () => <IconStar size={14} /> },
      { id: 'fo-places/hotels',      label: 'Hotels',      count: '10,000', glyph: () => <IconBed size={14} /> },
      { id: 'fo-places/restaurants', label: 'Restaurants', count: '480',   glyph: () => <IconShoppingBag size={14} /> },
    ]
  },
  {
    id: 'fo-lists', label: 'Lists',
    menu: [
      { id: 'fo-lists/top100', label: 'Top 100 Morocco', count: '100', glyph: () => <IconStar size={14} /> },
      { id: 'fo-lists/cities', label: 'Top 50 cities',   count: '50',  glyph: () => <IconMapPin size={14} /> },
      { id: 'fo-lists/hotels', label: 'Top 100 hotels',  count: '100', glyph: () => <IconBed size={14} /> },
      { id: 'fo-lists/food',   label: 'Top 100 restaurants', count: '100', glyph: () => <IconShoppingBag size={14} /> },
      { id: 'fo-lists/all',    label: 'All lists',       count: '10k+', glyph: () => <IconLayoutLeft size={14} /> },
    ]
  },
  { id: 'fo-wiki', label: 'Wiki' },
  {
    id: 'fo-media', label: 'Media',
    menu: [
      { id: 'fo-media/images', label: 'Images', count: '4,200',  glyph: () => <IconImage size={14} /> },
      { id: 'fo-media/audio',  label: 'Audio',  count: '120',    glyph: () => <IconCircleDot size={14} /> },
      { id: 'fo-media/videos', label: 'Videos', count: '10,000', glyph: () => <IconEye size={14} /> },
      { id: 'fo-media/map',    label: 'Map',    count: 'live',   glyph: () => <IconMapPin size={14} /> },
      { id: 'fo-media/pdf',    label: 'PDFs',   count: '32',     glyph: () => <IconBookOpen size={14} /> },
    ]
  },
  {
    id: 'fo-guides', label: 'Guides',
    menu: [
      { id: 'fo-guides/books',     label: 'Guidebooks',    count: '64',  glyph: () => <IconBookOpen size={14} /> },
      { id: 'fo-guides/cookbooks', label: 'Cookbooks',     count: '28',  glyph: () => <IconBookOpen size={14} /> },
      { id: 'fo-guides/gear',      label: 'Travel gear',   count: '110', glyph: () => <IconShoppingBag size={14} /> },
      { id: 'fo-guides/beauty',    label: 'Argan & beauty', count: '40', glyph: () => <IconShoppingBag size={14} /> },
    ]
  },
  { id: 'fo-moroccai', label: 'MoroccAI', highlight: true },
];

function FrontHeaderV2({ route, onRoute }) {
  const role = useRole();
  const profile = ROLE_PROFILES[role];
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  const activeTop = route.split('/')[0];

  return (
    <header className={'fo-header fo-header-v2 ' + (scrolled ? 'scrolled' : '')}>
      <div className="fo-brand" onClick={() => onRoute('fo-home')}>
        <div className="fo-brand-mark">M</div>
        <div className="fo-brand-name">
          MoroccoTopDestinations
          <span>moroccotopdestinations.com</span>
        </div>
      </div>

      <nav className="fo-nav-v2">
        {NAV_V2.map(n => (
          <div key={n.id} className={'item' + (activeTop === n.id ? ' active' : '')}>
            <a className="item-trigger" onClick={() => onRoute(n.id)}
               style={n.highlight ? { color: '#c1272d' } : null}>
              {n.label}
              {n.menu && <IconChevronDown size={12} style={{ opacity: 0.6 }} />}
              {n.highlight && (
                <span style={{
                  marginLeft: 4, fontSize: 9, padding: '2px 5px',
                  background: 'rgba(193,39,45,0.2)', borderRadius: 4,
                  letterSpacing: 0.1, fontFamily: 'var(--font-mono)',
                  color: '#c1272d', textTransform: 'uppercase',
                }}>AI</span>
              )}
            </a>
            {n.menu && (
              <div className="item-menu">
                {n.menu.map(m => (
                  <a key={m.id} onClick={() => onRoute(m.id)}>
                    <span className="glyph">{m.glyph()}</span>
                    {m.label}
                    {m.count && <span className="count">{m.count}</span>}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="fo-search" style={{ marginLeft: 'auto', width: 240 }}>
        <span className="fo-search-icon"><IconSearch size={14} /></span>
        <input placeholder="Search Morocco…"
               style={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'transparent' }} />
      </div>

      <div className="fo-auth">
        {role !== 'guest' && (
          <a onClick={() => onRoute('fo-saved')} title="Saved"
             style={{ color: 'rgba(255,255,255,0.78)', padding: 8, cursor: 'pointer' }}>
            <IconStar size={16} />
          </a>
        )}
        {role === 'guest' && (
          <button className="fo-cta sm outline" onClick={() => setRole('user')} style={{
            color: 'white', borderColor: 'rgba(255,255,255,0.3)',
          }}>Sign in</button>
        )}
        {role === 'user' && (
          <div className="fo-avatar" title={profile.name}>{profile.avatar}</div>
        )}
        {role === 'admin' && (
          <React.Fragment>
            <span className="fo-role-tag admin">Admin</span>
            <div className="fo-avatar admin" title={profile.name}>{profile.avatar}</div>
          </React.Fragment>
        )}
      </div>
    </header>
  );
}

// ---------- Sticky footer (always visible) ----------
function StickyFooter({ scrollerMode, onToggleScroller, onRandom, route }) {
  const D = window.MTD;
  return (
    <div className="fo-sticky-footer">
      <div className="group">
        <button className="btn-dice" onClick={onRandom} title="Random pick (any item, any list)">
          <span style={{ fontSize: 18 }}>🎲</span>
          Random
        </button>
        <div className="mini-stats" style={{ marginLeft: 8 }}>
          <span><b>{D.destinations.length}</b> places</span>
          <span><b>{D.totalRanked.toLocaleString()}</b> ranked</span>
          <span><b>10,000</b> videos</span>
        </div>
      </div>
      <div className="group">
        <button className={'scroller-toggle' + (scrollerMode ? ' on' : '')}
                onClick={onToggleScroller}
                title="Scroller mode: every page becomes one long ranked feed">
          <span className="knob"></span>
          <span>Scroller mode</span>
          {scrollerMode && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>· top-down</span>}
        </button>
      </div>
    </div>
  );
}

// ---------- Reusable image tile (for rows / grids) ----------
function MtdImg({ seed, w = 800, h = 600, tint, style, children, className = '' }) {
  const [a, b] = tint || window.MTD.tint(seed);
  return (
    <div className={'mtd-photo ' + className}
         style={{
           '--tint-a': `color-mix(in oklch, ${a} 35%, transparent)`,
           backgroundImage: `url(${window.MTD.img(seed, w, h)})`,
           ...style,
         }}>
      {children}
    </div>
  );
}

function Tile({ seed, name, meta, rank, badge, duration, kind = 'landscape', onClick, tint }) {
  const [a, b] = tint || window.MTD.tint(seed);
  return (
    <a className={'tile tile-' + kind}
       onClick={onClick}
       style={{ '--tint-a': `color-mix(in oklch, ${a} 35%, transparent)` }}>
      <div className="tile-img" style={{
        backgroundImage: `url(${window.MTD.img(seed, 800, kind === 'portrait' ? 1200 : kind === 'thin' ? 1000 : 600)})`,
        background: `linear-gradient(135deg, color-mix(in oklch, ${a} 30%, transparent), color-mix(in oklch, ${b} 60%, transparent)),
                     url(${window.MTD.img(seed, 800, kind === 'portrait' ? 1200 : kind === 'thin' ? 1000 : 600)})`,
        backgroundSize: 'cover',
      }}></div>
      {rank && <span className={'tile-rank' + (rank <= 3 ? ' gold' : '')}>#{rank}</span>}
      {badge && <span className={'tile-badge ' + (badge === 'VIDEO' ? 'video' : '')}>{badge}</span>}
      {duration && <span className="tile-duration">{duration}</span>}
      <div className="tile-body">
        <div className="tile-name">{name}</div>
        {meta && <div className="tile-meta">{meta}</div>}
      </div>
    </a>
  );
}

// "Top 10" big-number tile, Netflix style
function BigRankTile({ seed, rank, name, meta, onClick }) {
  const [a] = window.MTD.tint(seed);
  return (
    <div className="tile-rank-big" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="num">{rank}</div>
      <div className="pic" style={{
        backgroundImage: `linear-gradient(180deg, transparent 30%, ${a} 100%), url(${window.MTD.img(seed, 400, 600)})`,
        backgroundSize: 'cover',
      }}>
        <div className="label">{name}<div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.8, marginTop: 2, fontWeight: 400 }}>{meta}</div></div>
      </div>
    </div>
  );
}

// Horizontal row component
function Row({ title, sub, items, render, onSeeAll }) {
  return (
    <div className="fo-row">
      <div className="fo-row-head">
        <h3>{title}</h3>
        {sub && <span className="sub">{sub}</span>}
        {onSeeAll && <a className="see-all" onClick={onSeeAll}>See all <IconChevronRight size={11} /></a>}
      </div>
      <div className="fo-row-scroll">
        {items.map((it, i) => render(it, i))}
      </div>
    </div>
  );
}

Object.assign(window, {
  FrontHeaderV2, StickyFooter, MtdImg, Tile, BigRankTile, Row, NAV_V2,
});
