// MTD v2 — Lists catalogue + Top-N detail + Videos page.

// ---------- Lists catalogue ----------
function FrontLists({ subroute, onRoute, onOpenDest }) {
  const D = window.MTD;
  const sub = subroute;

  // If subroute is a specific list slug — show that list
  if (sub && sub !== 'all' && sub !== 'top100' && sub !== 'cities' && sub !== 'hotels' && sub !== 'food') {
    const list = D.allLists().find(l => l.id === sub);
    if (list) return <ListDetail list={list} onRoute={onRoute} onOpenDest={onOpenDest} />;
  }

  // Shortcut routes — pick a featured list
  if (sub === 'top100')  return <ListDetail list={D.lists[0]} onRoute={onRoute} onOpenDest={onOpenDest} />;
  if (sub === 'hotels')  return <ListDetail list={D.lists.find(l => l.id === 'top-100-luxury-hotels')} onRoute={onRoute} onOpenDest={onOpenDest} />;
  if (sub === 'food')    return <ListDetail list={D.lists.find(l => l.id === 'top-100-restaurants')} onRoute={onRoute} onOpenDest={onOpenDest} />;
  if (sub === 'cities')  return <ListDetail list={D.lists[1]} onRoute={onRoute} onOpenDest={onOpenDest} />;

  // Catalogue (default + 'all')
  const lists = D.allLists();
  const [filter, setFilter] = React.useState('all');
  const [view, setView] = React.useState('tiles');
  const filtered = filter === 'all' ? lists : lists.filter(l => l.kind === filter);
  const KINDS = ['all', 'places', 'hotels', 'food', 'sights', 'media'];

  return (
    <React.Fragment>
      <section className="fo-hero-mini">
        <div className="fo-hero-mini-img" style={{
          backgroundImage: `url(${D.img('lists-hero', 1920, 600)})`,
        }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">★ TOP-OF-MOROCCO · {D.totalRanked.toLocaleString()} RANKED ENTRIES</div>
          <h1>Lists</h1>
        </div>
      </section>

      <section className="fo-section-v2">
        <div className="head">
          <div>
            <h2>{filtered.length} ranked lists</h2>
            <div className="sub">From top-100 places to top-25 hammams. Editorial &amp; community-curated.</div>
          </div>
          <ViewSwitch view={view} onChange={setView} options={[
            { id: 'tiles', label: 'Tiles', icon: () => <IconDashboard size={11} /> },
            { id: 'list',  label: 'List',  icon: () => <IconHash size={11} /> },
            { id: 'boxes', label: 'Boxes', icon: () => <IconLayoutLeft size={11} /> },
          ]} />
        </div>

        <div className="seg" style={{ marginBottom: 20 }}>
          {KINDS.map(k => (
            <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}
                    style={{ textTransform: 'capitalize' }}>{k}</button>
          ))}
        </div>

        {view === 'tiles' && (
          <div className="fo-grid cols-3">
            {filtered.map(l => (
              <a key={l.id} className="list-card" onClick={() => onRoute('fo-lists/' + l.id)}>
                <div className="list-card-img" style={{ backgroundImage: `url(${D.img('list-' + (l.hero || l.id), 600, 400)})` }}>
                  <div className={'list-card-rank' + (l.trending ? ' gold' : '')}>{l.items}</div>
                </div>
                <div className="list-card-body">
                  <div className="list-card-title">{l.title}</div>
                  <div className="list-card-meta">
                    {l.curator} · {l.kind}{l.trending ? ' · TRENDING' : ''}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {view === 'list' && (
          <div className="fo-list">
            {filtered.map((l, i) => (
              <div key={l.id} className="fo-list-row" onClick={() => onRoute('fo-lists/' + l.id)}>
                <div className={'fo-list-rank' + (i < 3 ? ' top' : '')}>{i + 1}</div>
                <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img('list-' + (l.hero || l.id), 200, 140)})` }}></div>
                <div>
                  <div className="fo-list-name">{l.title}</div>
                  <div className="fo-list-meta">{l.items} entries · {l.curator}{l.trending ? ' · TRENDING' : ''}</div>
                </div>
                <div className="fo-list-tag">{l.kind}</div>
                <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span></span>
              </div>
            ))}
          </div>
        )}

        {view === 'boxes' && (
          <div className="fo-boxes">
            {filtered.map(l => (
              <div key={l.id} className="fo-box" onClick={() => onRoute('fo-lists/' + l.id)}>
                <div className="fo-box-rank">{l.items} entries · {l.kind}</div>
                <div className="fo-box-name">{l.title}</div>
                <div className="fo-box-meta">{l.curator}{l.trending ? ' · TRENDING' : ''}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

// ---------- Top-N list detail (e.g. top 100 places) ----------
function ListDetail({ list, onRoute, onOpenDest }) {
  const D = window.MTD;
  const [view, setView] = React.useState('big');
  if (!list) return <div className="fo-section-v2"><div className="fo-saved-empty"><h3>List not found</h3></div></div>;

  // Build N items from a relevant pool, deterministically.
  const pool =
    list.kind === 'hotels' ? D.hotels :
    list.kind === 'food'   ? D.restaurants :
    list.kind === 'sights' ? D.sights :
    list.kind === 'media'  ? D.featuredVideos :
    D.destinations;
  const N = Math.min(list.items, 100);
  const shuffled = D.shuffled(pool, list.id);
  const ranked = Array.from({ length: N }, (_, i) => {
    const base = shuffled[i % shuffled.length];
    return {
      rank: i + 1,
      id: base.id + '-' + i,
      name: base.name || base.title,
      meta: list.kind === 'hotels'
              ? '★'.repeat(base.stars || 4) + ' · ' + D.findDest(base.dest)?.name
            : list.kind === 'food'
              ? base.kind + ' · ' + base.price + ' · ' + D.findDest(base.dest)?.name
            : list.kind === 'sights'
              ? D.findDest(base.dest)?.name + (base.unesco ? ' · UNESCO' : '')
            : list.kind === 'media'
              ? base.duration + ' · ' + base.views + ' views'
            : (D.findRegion(base.region)?.name || ''),
      seed: list.id + '-' + (base.id || i),
      base,
    };
  });

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 400 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('list-' + list.hero, 1920, 800)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">{list.curator.toUpperCase()} · {list.kind.toUpperCase()} · {N} ENTRIES</div>
          <h1>{list.title}</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 700, margin: '8px 0 0', lineHeight: 1.55 }}>
            {list.description || `A ranked list of ${N} entries.`}
          </p>
        </div>
      </section>

      <section className="fo-section-v2" style={{ paddingTop: 32 }}>
        <div className="head">
          <div>
            <h2>The ranking</h2>
            <div className="sub">Top {N} · ordered by editorial weight + 30-day demand</div>
          </div>
          <ViewSwitch view={view} onChange={setView} options={[
            { id: 'big',   label: 'Big',    icon: () => <IconDashboard size={11} /> },
            { id: 'tiles', label: 'Tiles',  icon: () => <IconLayoutLeft size={11} /> },
            { id: 'list',  label: 'List',   icon: () => <IconHash size={11} /> },
          ]} />
        </div>

        {view === 'big' && (
          <div className="fo-row-scroll" style={{ paddingLeft: 0, paddingRight: 0 }}>
            {ranked.slice(0, 10).map(it => (
              <BigRankTile key={it.id} rank={it.rank} seed={it.seed} name={it.name} meta={it.meta}
                           onClick={() => onOpenDest && it.base.region && onOpenDest(it.base)} />
            ))}
          </div>
        )}
        {view === 'big' && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.1, marginBottom: 12 }}>
              #11 — #{N}
            </div>
            <div className="fo-grid cols-5">
              {ranked.slice(10).map(it => (
                <Tile key={it.id} seed={it.seed} kind="portrait" rank={it.rank}
                      name={it.name} meta={it.meta} />
              ))}
            </div>
          </div>
        )}

        {view === 'tiles' && (
          <div className="fo-grid cols-4">
            {ranked.map(it => (
              <Tile key={it.id} seed={it.seed} kind="portrait" rank={it.rank}
                    name={it.name} meta={it.meta} />
            ))}
          </div>
        )}

        {view === 'list' && (
          <div className="fo-list">
            {ranked.map(it => (
              <div key={it.id} className="fo-list-row">
                <div className={'fo-list-rank' + (it.rank <= 3 ? ' top' : '')}>{it.rank}</div>
                <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img(it.seed, 200, 140)})` }}></div>
                <div>
                  <div className="fo-list-name">{it.name}</div>
                  <div className="fo-list-meta">{it.meta}</div>
                </div>
                <div className="fo-list-tag">{list.kind}</div>
                <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span></span>
              </div>
            ))}
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

// ---------- Videos page ----------
function FrontVideos({ onRoute }) {
  const D = window.MTD;
  const [view, setView] = React.useState('tiles');
  const [activeVideo, setActiveVideo] = React.useState(D.featuredVideos[0]);
  // synthesize placeholder cards for the rest of the 10,000 catalog
  const placeholderVideos = Array.from({ length: 36 }, (_, i) => ({
    id: 'v-p-' + i,
    title: D.videoSeries[i % D.videoSeries.length] + ' · Episode ' + (21 + i),
    dest: D.destinations[i % D.destinations.length].id,
    duration: (10 + (i % 50)) + ':' + ((i * 7) % 60).toString().padStart(2, '0'),
    views: (10 + (i * 13) % 800) + 'k',
    date: ((i % 12) + 1) + ' weeks ago',
    series: D.videoSeries[i % D.videoSeries.length],
    real: false,
  }));
  const allVideos = D.featuredVideos.concat(placeholderVideos);

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 360 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('videos-hero', 1920, 600)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">VIDEOS · YOUTUBE.COM/USER/SIEMSPRODUCTION · 335 REAL · 10,000 PLANNED</div>
          <h1>Watch Morocco</h1>
        </div>
      </section>

      <section className="fo-section-v2">
        <div className="fo-grid cols-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="video-player" style={{
              backgroundImage: `linear-gradient(135deg, rgba(193,39,45,0.4), rgba(0,0,0,0.7)), url(${D.img('video-' + activeVideo.id, 1280, 720)})`,
              backgroundSize: 'cover',
            }}>
              <div className="play"><div className="play-btn">▶</div></div>
              <div style={{
                position: 'absolute', bottom: 12, left: 16, right: 16,
                color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.8, letterSpacing: 0.08, textTransform: 'uppercase' }}>
                  {activeVideo.series} · {activeVideo.duration}
                </div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>{activeVideo.title}</div>
              </div>
            </div>
            <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.7)' }}>
              <div style={{ display: 'flex', gap: 14, fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                <span>{activeVideo.views} views</span>
                <span>·</span>
                <span>{activeVideo.date}</span>
                <span>·</span>
                <span>{D.findDest(activeVideo.dest)?.name}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Episode from <a className="link" style={{ color: '#c1272d' }}>Siems Production</a>.
                Original recording, available on YouTube. Embedded for preview here.
              </p>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 17, color: 'white', margin: '0 0 12px' }}>Up next</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 480, overflowY: 'auto' }}>
              {allVideos.slice(0, 12).map(v => (
                <div key={v.id} onClick={() => setActiveVideo(v)}
                     style={{
                       display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10,
                       cursor: 'pointer', padding: 6, borderRadius: 8,
                       background: activeVideo.id === v.id ? 'rgba(193,39,45,0.12)' : 'transparent',
                     }}>
                  <div className="mtd-photo" style={{
                    aspectRatio: '16/9',
                    backgroundImage: `url(${D.img('video-' + v.id, 240, 135)})`,
                    borderRadius: 4,
                  }}>
                    <span style={{
                      position: 'absolute', bottom: 4, right: 4,
                      fontFamily: 'var(--font-mono)', fontSize: 10,
                      background: 'rgba(0,0,0,0.75)', color: 'white',
                      padding: '1px 4px', borderRadius: 2, zIndex: 1,
                    }}>{v.duration}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'white', lineHeight: 1.3 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
                      {v.views} · {v.date}{v.real ? '' : ' · placeholder'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="fo-section-v2">
        <div className="head">
          <div>
            <h2>All series</h2>
            <div className="sub">{D.videoSeries.length} themed series · 10,000 episodes catalogued</div>
          </div>
          <ViewSwitch view={view} onChange={setView} options={[
            { id: 'tiles', label: 'Tiles', icon: () => <IconDashboard size={11} /> },
            { id: 'list',  label: 'List',  icon: () => <IconHash size={11} /> },
          ]} />
        </div>

        {view === 'tiles' ? (
          <Row title="Series catalogue"
               sub={`${D.videoSeries.length} series · scroll for more`}
               items={D.videoSeries}
               render={(s, i) => (
                 <Tile key={s} seed={'series-' + s} kind="square"
                       name={s}
                       meta={(10 + i * 7) + ' episodes'}
                       badge="SERIES" />
               )} />
        ) : (
          <div className="fo-list">
            {D.videoSeries.map((s, i) => (
              <div key={s} className="fo-list-row">
                <div className={'fo-list-rank' + (i < 3 ? ' top' : '')}>{i + 1}</div>
                <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img('series-' + s, 200, 140)})` }}></div>
                <div>
                  <div className="fo-list-name">{s}</div>
                  <div className="fo-list-meta">{10 + i * 7} episodes · {(80 + i * 31) % 999}k views total</div>
                </div>
                <div className="fo-list-tag">series</div>
                <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span></span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="fo-section-v2">
        <div className="head"><div><h2>Recent uploads</h2><div className="sub">From the real 335-video catalog plus placeholders for the rest of the 10,000.</div></div></div>
        <div className="fo-grid cols-4">
          {allVideos.slice(0, 16).map(v => (
            <Tile key={v.id} seed={'video-' + v.id} kind="wide"
                  name={v.title}
                  meta={v.views + ' · ' + v.date + (v.real ? '' : ' · placeholder')}
                  badge="VIDEO"
                  duration={v.duration}
                  onClick={() => setActiveVideo(v)} />
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { FrontLists, ListDetail, FrontVideos });
