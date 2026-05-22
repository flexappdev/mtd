// MTD Front Office pages: Home, Destinations list, Hotels list, Saved.

// ---------- Reusable DestCard ----------
function DestCard({ d, onOpen, saved, onToggleSave, variant }) {
  const role = useRole();
  const r = window.MTD.findRegion(d.region);
  const style = {
    '--thumb-from': d.thumb?.[0] || r.thumb[0],
    '--thumb-to':   d.thumb?.[1] || r.thumb[1],
  };
  // Guest sees a "sign in to save" affordance; user/admin can actually save.
  const handleSave = (e) => {
    e.stopPropagation();
    if (role === 'guest') { setRole('user'); return; }
    onToggleSave && onToggleSave(d.id);
  };
  return (
    <a className={'fo-dest-card ' + (variant || '')} style={style} onClick={() => onOpen(d)}>
      <div className="fo-dest-cover">
        <span className="fo-dest-cover-initial">{d.initial}</span>
        <AdminOnly>
          <div className="fo-dest-admin-flag">
            <span className="admin-status-pill">
              <span className="dot" style={{
                background: d.status === 'live' ? 'var(--success)' :
                            d.status === 'preview' ? 'var(--info)' :
                            d.status === 'qa' ? 'var(--warning)' : 'var(--foreground-muted)'
              }}></span>
              {d.status}
            </span>
          </div>
        </AdminOnly>
      </div>
      <div className="fo-dest-body">
        <div className="fo-dest-body-text">
          <div className="fo-dest-name">
            {d.name}
            <AdminOnly>
              <span className="admin-stat"><IconEye size={10} style={{ verticalAlign: '-1px' }} /> <b>{formatNum(d.clicks30)}</b></span>
            </AdminOnly>
          </div>
          <div className="fo-dest-tag">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 999, background: 'var(--ws-' + (r.accent === 'imperial' ? 'core' : r.accent === 'coast' ? 'lists' : r.accent === 'atlas' ? 'travel' : r.accent === 'sahara' ? 'bo' : 'context') + ')' }}></span>
            {r.name} · {d.position}
          </div>
        </div>
        <button className={'fo-dest-save' + (saved ? ' saved' : '')}
                title={role === 'guest' ? 'Sign in to save' : (saved ? 'Saved' : 'Save')}
                onClick={handleSave}>
          {saved ? <IconCheck size={14} /> : <IconPlus size={14} />}
        </button>
      </div>
    </a>
  );
}

// ---------- Home ----------
function FrontHome({ onOpenDest, onRoute, saved, onToggleSave }) {
  const D = window.MTD;
  const role = useRole();
  // Guest sees only LIVE destinations. Admin sees everything (including drafts).
  const visible = D.destinations.filter(d =>
    role === 'admin' ? true : (d.status === 'live' || d.status === 'preview')
  );
  const featured = [...visible].sort((a, b) => b.clicks30 - a.clicks30).slice(0, 6);
  const regionCounts = D.regions.map(r => ({
    ...r,
    count: D.destinations.filter(d => d.region === r.id && d.status === 'live').length
  }));

  return (
    <React.Fragment>
      {/* HERO */}
      <section className="fo-hero">
        <div className="fo-hero-bg"></div>
        <div className="fo-hero-grain"></div>
        <div className="fo-hero-inner">
          <div>
            <div className="fo-eyebrow">Independent travel guide · est. 2018</div>
            <h1>
              The whole of Morocco,<br />from <em>Marrakech</em> to the <em>dunes</em>.
            </h1>
            <p>
              14 hand-picked destinations, 156 vetted hotels with live rates from Booking,
              Expedia and Agoda, and travel facts sourced straight from Wikipedia &amp;
              Wikivoyage. No fluff.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="fo-cta" onClick={() => onRoute('fo-destinations')}>
                Browse destinations <IconArrowRight size={14} />
              </button>
              <button className="fo-cta outline" onClick={() => onRoute('fo-hotels')}>
                Find a hotel
              </button>
            </div>
            <div className="fo-hero-meta">
              <div><b>14</b>destinations</div>
              <div><b>156</b>hotels indexed</div>
              <div><b>5</b>regions covered</div>
              <div><b>4</b>booking partners</div>
            </div>
          </div>
          <div className="fo-hero-side">
            <div className="fo-eyebrow">Trending this week</div>
            {featured.slice(0, 3).map(d => {
              const r = D.findRegion(d.region);
              return (
                <div key={d.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 12, borderRadius: 10,
                  background: 'color-mix(in oklch, var(--card) 70%, transparent)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }} onClick={() => onOpenDest(d)}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 8,
                    background: `linear-gradient(135deg, ${d.thumb?.[0] || r.thumb[0]}, ${d.thumb?.[1] || r.thumb[1]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 600,
                  }}>{d.initial}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                    <div className="type-meta">{r.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--foreground)' }}>{formatNum(d.clicks30)}</div>
                    <div className="type-meta" style={{ fontSize: 10.5 }}>clicks 30d</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOP DESTINATIONS */}
      <section className="fo-section">
        <div className="fo-section-head">
          <div>
            <h2>
              Top destinations
              <AdminChip>Featured rules</AdminChip>
            </h2>
            <div className="sub">Hand-picked by editors, ranked by 30-day demand.</div>
          </div>
          <a className="link" onClick={() => onRoute('fo-destinations')}>View all 14 <IconChevronRight size={12} /></a>
        </div>
        <div className="fo-dest-grid">
          {featured.map(d => (
            <DestCard key={d.id} d={d} onOpen={onOpenDest}
                      saved={saved[d.id]} onToggleSave={onToggleSave} />
          ))}
        </div>
      </section>

      {/* REGIONS */}
      <section className="fo-section tight">
        <div className="fo-section-head">
          <div>
            <h2>By region</h2>
            <div className="sub">Five distinct flavours of Morocco — pick a vibe.</div>
          </div>
        </div>
        <div className="fo-region-strip">
          {regionCounts.map(r => (
            <a key={r.id} className="fo-region-tile" style={{ '--thumb-from': r.thumb[0], '--thumb-to': r.thumb[1] }}
               onClick={() => onRoute('fo-regions')}>
              <div className="fo-region-tile-letter">{r.letter}</div>
              <div className="fo-region-tile-name">{r.name}</div>
              <div className="fo-region-tile-count">{r.count} destinations</div>
            </a>
          ))}
        </div>
      </section>

      {/* WHERE TO STAY (hotels strip) */}
      <section className="fo-section">
        <div className="fo-section-head">
          <div>
            <h2>Where to stay
              <AdminStat><IconArrowUpRight size={10} style={{ verticalAlign: '-1px' }} /> <b>+12%</b> click-through</AdminStat>
            </h2>
            <div className="sub">Live rates across Booking, Expedia and Agoda. Updated hourly.</div>
          </div>
          <a className="link" onClick={() => onRoute('fo-hotels')}>All hotels <IconChevronRight size={12} /></a>
        </div>
        <div className="fo-dest-grid">
          {D.hotels.slice(0, 4).map(h => {
            const dest = D.findDest(h.dest);
            const r = D.findRegion(dest.region);
            const minRate = Math.min(...Object.values(h.rates).filter(v => v != null));
            return (
              <a key={h.id} className="fo-dest-card" style={{
                '--thumb-from': dest.thumb?.[0] || r.thumb[0],
                '--thumb-to': dest.thumb?.[1] || r.thumb[1],
              }}>
                <div className="fo-dest-cover">
                  <span className="fo-dest-cover-initial">{h.name[0]}</span>
                </div>
                <div className="fo-dest-body">
                  <div className="fo-dest-body-text">
                    <div className="fo-dest-name" style={{ fontSize: 14 }}>{h.name}</div>
                    <div className="fo-dest-tag">
                      <span className="fo-hotel-stars">{'★'.repeat(h.stars)}</span>
                      · {dest.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontWeight: 600, color: 'var(--foreground)' }}>{formatEUR(minRate)}</div>
                    <div className="type-meta" style={{ fontSize: 10.5 }}>/ night</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* EDITOR'S BRIEF */}
      <section className="fo-section tight">
        <div className="fo-section-head">
          <div>
            <h2>Travel notes</h2>
            <div className="sub">Short, sharp facts — sourced from Wikipedia, edited by humans.</div>
          </div>
        </div>
        <div className="fo-dest-grid cols-2">
          {D.facts.slice(0, 4).map((f, i) => {
            const dest = D.findDest(f.dest);
            const r = dest && D.findRegion(dest.region);
            return (
              <div key={i} className="fo-fact" style={{ background: 'var(--card)' }}>
                <div className="fo-fact-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="fo-fact-body">
                  <div className="fo-fact-text">{f.text}</div>
                  <div className="fo-fact-src">
                    {dest && (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        color: 'var(--foreground-subtle)',
                      }}>
                        <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>
                        {dest.name}
                      </span>
                    )}
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>via {f.src}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
}

// ---------- Destinations list ----------
function FrontDestinations({ onOpenDest, saved, onToggleSave }) {
  const D = window.MTD;
  const role = useRole();
  const [filter, setFilter] = React.useState('all');
  const visible = D.destinations.filter(d =>
    role === 'admin' ? true : (d.status === 'live' || d.status === 'preview')
  );
  const filtered = filter === 'all' ? visible : visible.filter(d => d.region === filter);

  return (
    <section className="fo-section">
      <div className="fo-section-head">
        <div>
          <h2>
            All destinations
            <AdminStat>{visible.length} visible · <b>{D.destinations.length - visible.length}</b> hidden draft</AdminStat>
          </h2>
          <div className="sub">
            {role === 'admin'
              ? 'Admin view — drafts and QA destinations included.'
              : '14 places worth flying for. Sortable by region.'}
          </div>
        </div>
        <div className="seg">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          {D.regions.map(r => (
            <button key={r.id} className={filter === r.id ? 'active' : ''} onClick={() => setFilter(r.id)}>{r.name}</button>
          ))}
        </div>
      </div>
      <div className="fo-dest-grid">
        {filtered.map(d => (
          <DestCard key={d.id} d={d} onOpen={onOpenDest}
                    saved={saved[d.id]} onToggleSave={onToggleSave} />
        ))}
      </div>
    </section>
  );
}

// ---------- Hotels list ----------
function FrontHotels({ saved, onToggleSave }) {
  const D = window.MTD;
  const role = useRole();
  const [sort, setSort] = React.useState('popular');
  const sorted = [...D.hotels].sort((a, b) =>
    sort === 'popular' ? b.clicks30 - a.clicks30 :
    sort === 'price'   ? Math.min(...Object.values(a.rates).filter(Boolean)) - Math.min(...Object.values(b.rates).filter(Boolean)) :
    b.stars - a.stars
  );

  return (
    <section className="fo-section">
      <div className="fo-section-head">
        <div>
          <h2>
            Hotels &amp; riads
            <AdminStat><b>{D.hotels.length}</b> indexed · 4 vendors</AdminStat>
          </h2>
          <div className="sub">156 properties across 14 destinations. Best price wins.</div>
        </div>
        <div className="seg">
          <button className={sort === 'popular' ? 'active' : ''} onClick={() => setSort('popular')}>Popular</button>
          <button className={sort === 'price' ? 'active' : ''} onClick={() => setSort('price')}>Price</button>
          <button className={sort === 'stars' ? 'active' : ''} onClick={() => setSort('stars')}>Rating</button>
        </div>
      </div>

      <div>
        {sorted.map(h => {
          const dest = D.findDest(h.dest);
          const r = D.findRegion(dest.region);
          const rates = Object.entries(h.rates).filter(([, v]) => v != null);
          const minRate = Math.min(...rates.map(([, v]) => v));
          const minVendor = rates.find(([, v]) => v === minRate)[0];
          return (
            <div key={h.id} className="fo-hotel-card" style={{
              '--thumb-from': dest.thumb?.[0] || r.thumb[0],
              '--thumb-to': dest.thumb?.[1] || r.thumb[1],
            }}>
              <div className="fo-hotel-cover" style={{ fontSize: 28 }}>{h.name[0]}</div>
              <div>
                <div className="fo-hotel-name">{h.name}</div>
                <div className="fo-hotel-meta">
                  <span className="fo-hotel-stars">{'★'.repeat(h.stars)}</span>
                  <RegionChip region={dest.region} />
                  · {dest.name}
                  <span>·</span>
                  {rates.map(([v]) => (
                    <span key={v} className={'vendor ' + v}>
                      <span className="vendor-dot"></span>{v}
                    </span>
                  ))}
                  <AdminOnly>
                    <span className="admin-stat"><IconArrowUpRight size={10} /> <b>{formatNum(h.clicks30)}</b> clicks · {formatEUR(h.rev30)} rev</span>
                  </AdminOnly>
                </div>
              </div>
              <div className="fo-hotel-price">
                <div className="fo-hotel-price-label">from</div>
                <div className="fo-hotel-price-amount">{formatEUR(minRate)}</div>
                <div className="fo-hotel-price-vendor">on {minVendor}</div>
                <button className="fo-cta sm" style={{ marginTop: 10 }} onClick={(e) => {
                  e.stopPropagation();
                  if (role === 'guest') { alert('Sign in to track this booking. Redirecting to ' + minVendor + '…'); setRole('user'); }
                  else alert('Opening ' + minVendor + ' affiliate link…');
                }}>
                  See deal <IconArrowUpRight size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Saved (user / admin only) ----------
function FrontSaved({ saved, onOpenDest, onToggleSave, onRoute }) {
  const D = window.MTD;
  const role = useRole();
  const savedIds = Object.keys(saved).filter(k => saved[k]);
  const savedDests = savedIds.map(id => D.findDest(id)).filter(Boolean);

  // Guest sees a sign-in CTA at this route
  if (role === 'guest') {
    return (
      <section className="fo-section">
        <div className="fo-saved-empty">
          <IconBed size={32} style={{ opacity: 0.5, marginBottom: 16 }} />
          <h3>Saved trips are a member feature</h3>
          <p style={{ maxWidth: 380, margin: '0 auto 20px' }}>
            Create a free MTD account to bookmark destinations, build a trip
            shortlist and get price alerts on hotels.
          </p>
          <button className="fo-cta" onClick={() => setRole('user')}>Create free account</button>
        </div>
      </section>
    );
  }

  return (
    <section className="fo-section">
      <div className="fo-section-head">
        <div>
          <h2>
            Your saved trips
            <AdminStat>Personalised by activity</AdminStat>
          </h2>
          <div className="sub">{savedDests.length} destination{savedDests.length === 1 ? '' : 's'} saved · last activity 2h ago</div>
        </div>
      </div>
      {savedDests.length === 0 ? (
        <div className="fo-saved-empty">
          <h3>Nothing saved yet.</h3>
          <p>Tap the + on any destination card to add it to your shortlist.</p>
          <button className="fo-cta outline sm" onClick={() => onRoute('fo-destinations')}>Browse destinations</button>
        </div>
      ) : (
        <div className="fo-dest-grid">
          {savedDests.map(d => (
            <DestCard key={d.id} d={d} onOpen={onOpenDest}
                      saved={true} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </section>
  );
}

Object.assign(window, { DestCard, FrontHome, FrontDestinations, FrontHotels, FrontSaved });
