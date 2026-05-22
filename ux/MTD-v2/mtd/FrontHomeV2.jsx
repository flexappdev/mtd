// MTD v2 — Cinematic Netflix-style home + Places page.

function FrontHomeV2({ onRoute, onOpenDest, saved, onToggleSave }) {
  const D = window.MTD;
  const role = useRole();
  const visible = D.destinations.filter(d => role === 'admin' || d.status === 'live' || d.status === 'preview');
  const top = [...visible].sort((a, b) => b.clicks30 - a.clicks30);
  const featured = top[0]; // Marrakech
  const [a, b] = D.tint(featured.id + '-hero');

  return (
    <React.Fragment>
      {/* ===== CINEMATIC HERO ===== */}
      <section className="fo-hero-cinema">
        <div className="fo-hero-cinema-img" style={{
          backgroundImage: `url(${D.img(featured.id + '-hero', 1920, 1080)})`,
        }}></div>
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
            Red walls, palm courtyards, snake-charmers at dusk. {featured.position}. Our
            full guide — {featured.hotels} hotels, {featured.sights} sights, {featured.facts} facts —
            with live rates updated hourly.
          </p>
          <div className="cta-row">
            <button className="btn-play" onClick={() => onOpenDest(featured)}>
              <span style={{ fontSize: 18 }}>▶</span>
              Open guide
            </button>
            <button className="btn-more" onClick={() => onRoute('fo-lists/top100')}>
              <IconPlus size={16} /> More info
            </button>
            <button className="btn-more" onClick={() => onRoute('fo-moroccai')}
                    style={{ background: 'rgba(193,39,45,0.18)', borderColor: 'rgba(193,39,45,0.4)', color: '#c1272d' }}>
              <span style={{ fontSize: 16 }}>✦</span> Ask MoroccAI
            </button>
          </div>
        </div>
      </section>

      {/* ===== ROW: Top 10 — big-number Netflix layout ===== */}
      <Row title="Top 10 places in Morocco"
           sub="Editorial ranking · this week"
           items={top.slice(0, 10)}
           render={(d, i) => (
             <BigRankTile key={d.id}
                          rank={i + 1}
                          seed={d.id}
                          name={d.name}
                          meta={D.findRegion(d.region).name}
                          onClick={() => onOpenDest(d)} />
           )}
           onSeeAll={() => onRoute('fo-lists/top100')} />

      {/* ===== ROW: Continue exploring (saved) ===== */}
      {Object.keys(saved).filter(k => saved[k]).length > 0 && (
        <Row title="Continue exploring"
             sub={role === 'guest' ? '' : 'Your saved trips'}
             items={Object.keys(saved).filter(k => saved[k]).map(id => D.findDest(id)).filter(Boolean)}
             render={(d) => (
               <Tile key={d.id} seed={d.id} kind="landscape"
                     name={d.name}
                     meta={D.findRegion(d.region).name}
                     onClick={() => onOpenDest(d)} />
             )}
             onSeeAll={() => onRoute('fo-saved')} />
      )}

      {/* ===== ROW: By region (square tiles) ===== */}
      <Row title="By region"
           sub="Five flavours of Morocco"
           items={D.regions}
           render={(r) => (
             <Tile key={r.id} seed={'region-' + r.id} kind="square"
                   name={r.name}
                   meta={D.destinations.filter(d => d.region === r.id).length + ' destinations'}
                   onClick={() => onRoute('fo-places/regions')} />
           )}
           onSeeAll={() => onRoute('fo-places/regions')} />

      {/* ===== ROW: Sights & landmarks (portrait posters) ===== */}
      <Row title="Sights & landmarks"
           sub="Mosques, ksars, dunes, medersas"
           items={D.sights.slice(0, 12)}
           render={(s, i) => (
             <Tile key={s.id} seed={s.id} kind="portrait"
                   name={s.name}
                   meta={D.findDest(s.dest)?.name + (s.unesco ? ' · UNESCO' : '')}
                   badge={s.unesco ? 'UNESCO' : null}
                   onClick={() => onRoute('fo-places/sights')} />
           )}
           onSeeAll={() => onRoute('fo-places/sights')} />

      {/* ===== ROW: From Siems Production (videos) ===== */}
      <Row title="From Siems Production"
           sub="335 of 10,000 episodes · youtube.com/user/siemsproduction"
           items={D.featuredVideos.slice(0, 12)}
           render={(v) => (
             <Tile key={v.id} seed={'video-' + v.id} kind="wide"
                   name={v.title}
                   meta={v.views + ' views · ' + v.date}
                   badge="VIDEO"
                   duration={v.duration}
                   onClick={() => onRoute('fo-media/videos')} />
           )}
           onSeeAll={() => onRoute('fo-media/videos')} />

      {/* ===== ROW: Top 100 lists ===== */}
      <Row title="Top 100s"
           sub={`${D.allLists().length} ranked lists · 10,000+ entries`}
           items={D.lists.slice(0, 10)}
           render={(l) => (
             <Tile key={l.id} seed={'list-' + l.hero} kind="landscape"
                   name={l.title}
                   meta={l.items + ' entries · ' + l.curator}
                   badge={l.trending ? 'TRENDING' : null}
                   onClick={() => onRoute('fo-lists/' + l.id)} />
           )}
           onSeeAll={() => onRoute('fo-lists/all')} />

      {/* ===== ROW: Hotels & riads ===== */}
      <Row title="Where to stay"
           sub="Live rates · Booking, Expedia, Agoda"
           items={D.hotels.slice(0, 12)}
           render={(h) => {
             const minRate = Math.min(...Object.values(h.rates).filter(v => v != null));
             return (
               <Tile key={h.id} seed={'hotel-' + h.id} kind="square"
                     name={h.name}
                     meta={'★'.repeat(h.stars) + ' · from €' + minRate}
                     onClick={() => onRoute('fo-places/hotels')} />
             );
           }}
           onSeeAll={() => onRoute('fo-places/hotels')} />

      {/* ===== ROW: Restaurants ===== */}
      <Row title="Restaurants & rooftops"
           items={D.restaurants}
           render={(r) => (
             <Tile key={r.id} seed={'rest-' + r.id} kind="landscape"
                   name={r.name}
                   meta={r.kind + ' · ' + r.price + ' · ' + D.findDest(r.dest)?.name}
                   onClick={() => onRoute('fo-places/restaurants')} />
           )}
           onSeeAll={() => onRoute('fo-places/restaurants')} />

      {/* ===== ROW: Guides shop ===== */}
      <Row title="Read & gear up"
           sub="Editor's picks · Amazon affiliate"
           items={D.guides}
           render={(g) => (
             <Tile key={g.id} seed={'guide-' + g.id} kind="thin"
                   name={g.title}
                   meta={g.price + ' · ★ ' + g.rating}
                   badge="SHOP"
                   onClick={() => onRoute('fo-guides')} />
           )}
           onSeeAll={() => onRoute('fo-guides/books')} />

      {/* ===== Promo strip ===== */}
      <div className="fo-promo-strip">
        <div className="fo-promo">
          <MtdImg seed="promo-ai" w={720} h={405} style={{ position: 'absolute', inset: 0 }} />
          <div className="body">
            <h4>Ask MoroccAI ✦</h4>
            <p>"Plan me 10 days in Morocco from Marrakech." Done in 30 seconds.</p>
          </div>
        </div>
        <div className="fo-promo" onClick={() => onRoute('fo-lists/all')}>
          <MtdImg seed="promo-lists" w={720} h={405} style={{ position: 'absolute', inset: 0 }} />
          <div className="body">
            <h4>10,000+ ranked entries</h4>
            <p>Every sight, hotel, restaurant scored across {D.allLists().length} top-N lists.</p>
          </div>
        </div>
        <div className="fo-promo" onClick={() => onRoute('fo-media/videos')}>
          <MtdImg seed="promo-videos" w={720} h={405} style={{ position: 'absolute', inset: 0 }} />
          <div className="body">
            <h4>10,000 Morocco videos</h4>
            <p>335 from Siems Production, the rest from the wider community.</p>
          </div>
        </div>
        <div className="fo-promo" onClick={() => onRoute('fo-random')}>
          <MtdImg seed="promo-random" w={720} h={405} style={{ position: 'absolute', inset: 0 }} />
          <div className="body">
            <h4>🎲 Random Morocco</h4>
            <p>One click, one new place. Surprise yourself.</p>
          </div>
        </div>
      </div>

      {/* ===== ROW: Wiki ===== */}
      <Row title="From the Wiki"
           sub="Sourced from Wikipedia · CC-BY-SA"
           items={D.wikiArticles.slice(0, 8)}
           render={(w) => (
             <Tile key={w.id} seed={'wiki-' + w.id} kind="landscape"
                   name={w.title}
                   meta={w.length + ' · updated ' + w.updated}
                   badge="WIKI"
                   onClick={() => onRoute('fo-wiki')} />
           )}
           onSeeAll={() => onRoute('fo-wiki')} />
    </React.Fragment>
  );
}

// ---------- Places (multi-tab: regions/cities/sights/hotels/restaurants) ----------
function FrontPlaces({ subroute, onRoute, onOpenDest, saved, onToggleSave }) {
  const D = window.MTD;
  const role = useRole();
  const tab = subroute || 'cities';
  const [view, setView] = React.useState('tiles');

  const TABS = [
    { id: 'regions',     label: 'Regions',     count: D.regions.length, icon: () => <IconMap size={13} /> },
    { id: 'cities',      label: 'Cities',      count: D.destinations.length, icon: () => <IconMapPin size={13} /> },
    { id: 'sights',      label: 'Sights',      count: D.sights.length, icon: () => <IconStar size={13} /> },
    { id: 'hotels',      label: 'Hotels',      count: '10k', icon: () => <IconBed size={13} /> },
    { id: 'restaurants', label: 'Restaurants', count: '480', icon: () => <IconShoppingBag size={13} /> },
  ];

  const heroSeed = 'places-' + tab;
  let items, render;
  if (tab === 'regions') {
    items = D.regions.map((r, i) => ({ ...r, _rank: i + 1, _id: r.id, _name: r.name, _meta: D.destinations.filter(d => d.region === r.id).length + ' destinations', _seed: 'region-' + r.id }));
  } else if (tab === 'cities') {
    const visible = D.destinations.filter(d => role === 'admin' || d.status === 'live' || d.status === 'preview');
    items = visible.sort((a, b) => b.clicks30 - a.clicks30).map((d, i) => ({ ...d, _rank: i + 1, _id: d.id, _name: d.name, _meta: D.findRegion(d.region).name + ' · ' + d.hotels + ' hotels', _seed: d.id, _onClick: () => onOpenDest(d) }));
  } else if (tab === 'sights') {
    items = [...D.sights].sort((a, b) => b.clicks30 - a.clicks30).map((s, i) => ({ ...s, _rank: i + 1, _id: s.id, _name: s.name, _meta: D.findDest(s.dest)?.name + ' · ' + s.kind + (s.unesco ? ' · UNESCO' : ''), _seed: s.id }));
  } else if (tab === 'hotels') {
    items = [...D.hotels].sort((a, b) => b.clicks30 - a.clicks30).map((h, i) => {
      const minRate = Math.min(...Object.values(h.rates).filter(v => v != null));
      return { ...h, _rank: i + 1, _id: h.id, _name: h.name, _meta: '★'.repeat(h.stars) + ' · from €' + minRate + ' · ' + D.findDest(h.dest)?.name, _seed: 'hotel-' + h.id };
    });
  } else if (tab === 'restaurants') {
    items = [...D.restaurants].sort((a, b) => b.clicks30 - a.clicks30).map((r, i) => ({ ...r, _rank: i + 1, _id: r.id, _name: r.name, _meta: r.kind + ' · ' + r.price + ' · ' + D.findDest(r.dest)?.name, _seed: 'rest-' + r.id }));
  }

  return (
    <React.Fragment>
      <section className="fo-hero-mini">
        <div className="fo-hero-mini-img" style={{
          backgroundImage: `url(${D.img(heroSeed, 1920, 600)})`,
        }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">PLACES · MOROCCO</div>
          <h1 style={{ textTransform: 'capitalize' }}>{tab}</h1>
        </div>
      </section>

      <div className="media-tabs">
        {TABS.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''}
                  onClick={() => onRoute('fo-places/' + t.id)}>
            {t.icon()} {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <section className="fo-section-v2">
        <div className="head">
          <div>
            <h2 style={{ textTransform: 'capitalize' }}>
              All {tab}
              <AdminStat>{items.length} listed</AdminStat>
            </h2>
            <div className="sub">Ranked by 30-day demand. Tap a view.</div>
          </div>
          <ViewSwitch view={view} onChange={setView} />
        </div>

        <ItemsView view={view} items={items} onOpenDest={onOpenDest} kind={tab} />
      </section>
    </React.Fragment>
  );
}

// Reusable view switcher for places / lists / hotels / etc
function ViewSwitch({ view, onChange, options }) {
  const opts = options || [
    { id: 'tiles',    label: 'Tiles',    icon: () => <IconDashboard size={11} /> },
    { id: 'list',     label: 'List',     icon: () => <IconHash size={11} /> },
    { id: 'boxes',    label: 'Boxes',    icon: () => <IconLayoutLeft size={11} /> },
    { id: 'sections', label: 'Sections', icon: () => <IconBookOpen size={11} /> },
    { id: 'map',      label: 'Map',      icon: () => <IconMapPin size={11} /> },
  ];
  return (
    <div className="view-switch">
      {opts.map(o => (
        <button key={o.id} className={view === o.id ? 'active' : ''} onClick={() => onChange(o.id)}>
          {o.icon()} {o.label}
        </button>
      ))}
    </div>
  );
}

// Generic items renderer
function ItemsView({ view, items, onOpenDest, kind }) {
  const D = window.MTD;
  if (view === 'tiles') {
    return (
      <div className="fo-grid">
        {items.map(it => (
          <Tile key={it._id} seed={it._seed}
                kind={kind === 'sights' || kind === 'hotels' ? 'portrait' : 'landscape'}
                rank={it._rank}
                name={it._name}
                meta={it._meta}
                onClick={it._onClick || (() => {})} />
        ))}
      </div>
    );
  }
  if (view === 'list') {
    return (
      <div className="fo-list">
        {items.map(it => (
          <div key={it._id} className="fo-list-row" onClick={it._onClick}>
            <div className={'fo-list-rank' + (it._rank <= 3 ? ' top' : '')}>{it._rank}</div>
            <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img(it._seed, 200, 140)})` }}></div>
            <div>
              <div className="fo-list-name">{it._name}</div>
              <div className="fo-list-meta">{it._meta}</div>
            </div>
            <div className="fo-list-tag">{kind}</div>
            <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span></span>
          </div>
        ))}
      </div>
    );
  }
  if (view === 'boxes') {
    return (
      <div className="fo-boxes">
        {items.map(it => (
          <div key={it._id} className="fo-box" onClick={it._onClick}>
            <div className="fo-box-rank">#{it._rank} · {kind}</div>
            <div className="fo-box-name">{it._name}</div>
            <div className="fo-box-meta">{it._meta}</div>
          </div>
        ))}
      </div>
    );
  }
  if (view === 'sections') {
    // group by region for places, by kind otherwise
    const groups = {};
    items.forEach(it => {
      const k = it.region ? D.findRegion(it.region)?.name : (it.kind || 'all');
      (groups[k] = groups[k] || []).push(it);
    });
    return (
      <div>
        {Object.entries(groups).map(([k, arr]) => (
          <div key={k} style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, color: 'white', margin: '0 0 12px', textTransform: 'capitalize' }}>{k} <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>· {arr.length}</span></h3>
            <div className="fo-grid">
              {arr.map(it => (
                <Tile key={it._id} seed={it._seed} kind="landscape" rank={it._rank}
                      name={it._name} meta={it._meta} onClick={it._onClick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (view === 'map') {
    return (
      <div className="fo-map">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          {/* Simplified Morocco outline */}
          <path d="M120,150 Q200,80 320,90 Q450,100 540,150 Q620,200 680,280 Q700,360 660,440 Q580,510 460,520 Q340,510 240,480 Q160,440 130,360 Q100,260 120,150 Z"
                fill="rgba(193,39,45,0.06)" stroke="rgba(193,39,45,0.35)" strokeWidth="1.5" />
          {items.slice(0, 30).map((it, i) => {
            const h = D.hash(it._seed);
            const x = 150 + (h % 480);
            const y = 130 + ((h >> 8) % 360);
            return (
              <g key={it._id}>
                <circle cx={x} cy={y} r="6" fill="#c1272d" opacity="0.9" />
                <circle cx={x} cy={y} r="14" fill="none" stroke="#c1272d" strokeWidth="1" opacity="0.4" />
                <text x={x + 10} y={y - 4} fill="white" fontSize="10" fontFamily="JetBrains Mono">{it._name}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  return null;
}

Object.assign(window, { FrontHomeV2, FrontPlaces, ViewSwitch, ItemsView });
