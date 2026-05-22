// MTD Dashboard
function Dashboard({ onOpenDest, onRoute }) {
  const D = window.MTD;
  const liveCount = D.destinations.filter(d => d.status === 'live').length;
  const previewCount = D.destinations.filter(d => d.status === 'preview').length;
  const draftCount = D.destinations.filter(d => d.status === 'draft' || d.status === 'qa').length;
  const totalRev = D.destinations.reduce((s, d) => s + d.rev30, 0);
  const totalClicks = D.destinations.reduce((s, d) => s + d.clicks30, 0);
  const totalHotels = D.hotels.length;
  const needsReview = D.ideas.filter(i => i.status === 'pending' || i.status === 'in-review').length;
  const maxRev = Math.max(...D.destinations.map(d => d.rev30));

  const topByRev = [...D.destinations].sort((a, b) => b.rev30 - a.rev30).slice(0, 8);
  const recentIdeas = D.ideas.slice(0, 5);

  // Vendor sync overview — one per vendor agent
  const vendors = [
    { key: 'booking',    label: 'Booking.com',     short: 'Bk', status: 'live', last: '12m ago', stat: '47 / 47 fresh',    rev30: 5240 },
    { key: 'expedia',    label: 'Expedia',         short: 'Ex', status: 'live', last: '24m ago', stat: '38 / 47 covered',  rev30: 2180 },
    { key: 'agoda',      label: 'Agoda',           short: 'Ag', status: 'warn', last: '2h ago',  stat: '7 errors / 168',   rev30: 1640 },
    { key: 'awin',       label: 'Awin program',    short: 'Aw', status: 'live', last: '14h ago', stat: '6 / 20 hotels',    rev30: 920  },
    { key: 'amazon',     label: 'Amazon affiliates', short: 'Az', status: 'live', last: '4d ago', stat: '7 ASIN linked',    rev30: 1455 },
    { key: 'wikivoyage', label: 'Wikivoyage',      short: 'Wv', status: 'live', last: '6h ago',  stat: '14 / 14 destinations', rev30: null },
    { key: 'wikipedia',  label: 'Wikipedia',       short: 'Wp', status: 'live', last: '2d ago',  stat: '14 / 14 destinations', rev30: null },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Dashboard</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>30-day revenue, clicks, and what needs attention</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconPlus size={14} /> New idea</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Create destination</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-icon"><IconMap size={14} /></div>
          <div className="kpi-label">Destinations</div>
          <div className="kpi-value">{D.destinations.length}</div>
          <div className="kpi-delta">{liveCount} live · {previewCount} preview · {draftCount} draft</div>
        </div>
        <div className="kpi">
          <div className="kpi-icon"><IconEye size={14} /></div>
          <div className="kpi-label">Pageviews 30d</div>
          <div className="kpi-value">412k</div>
          <div className="kpi-delta up">+18.4% vs prev</div>
          <div className="kpi-spark">
            <Sparkline seed="views" n={20} trend="up" width={'100%'} />
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon"><IconArrowUpRight size={14} /></div>
          <div className="kpi-label">Affiliate clicks 30d</div>
          <div className="kpi-value">{formatNum(totalClicks)}</div>
          <div className="kpi-delta up">+12.1%</div>
          <div className="kpi-spark">
            <Sparkline seed="clicks" n={20} trend="up" width={'100%'} />
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-icon"><IconTrendUp size={14} /></div>
          <div className="kpi-label">Revenue 30d</div>
          <div className="kpi-value">{formatEUR(totalRev)}</div>
          <div className="kpi-delta up">+€5,240 vs prev</div>
        </div>
        <div className="kpi">
          <div className="kpi-icon"><IconBed size={14} /></div>
          <div className="kpi-label">Hotels indexed</div>
          <div className="kpi-value">{totalHotels}</div>
          <div className="kpi-delta">across 4 vendors</div>
        </div>
        <div className="kpi">
          <div className="kpi-icon"><IconAlert size={14} /></div>
          <div className="kpi-label">Needs review</div>
          <div className="kpi-value" style={{ color: 'var(--warning)' }}>{needsReview}</div>
          <div className="kpi-delta">1 agent in warn</div>
        </div>
      </div>

      {/* Top destinations + Activity */}
      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <h3 className="type-h3" style={{ margin: 0 }}>Top destinations · revenue 30d</h3>
            <a className="link" onClick={() => onRoute('destinations')}>View all <IconChevronRight size={12} /></a>
          </div>
          {topByRev.map(d => {
            const pct = (d.rev30 / maxRev) * 100;
            const r = window.MTD.findRegion(d.region);
            return (
              <div key={d.id} className="bar-row" onClick={() => onOpenDest(d)} style={{ cursor: 'pointer' }}>
                <div className="bar-label">
                  <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>
                  <span className="bar-name">{d.name}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: pct + '%' }}></div>
                </div>
                <div className="bar-val">{formatEUR(d.rev30)}</div>
              </div>
            );
          })}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3 className="type-h3" style={{ margin: 0 }}>Activity</h3>
            <div className="seg">
              <button className="active">All</button>
              <button>Syncs</button>
              <button>Revenue</button>
            </div>
          </div>
          <div className="feed">
            {D.activity.map((e, i) => (
              <div key={i} className="feed-item">
                <div className="feed-glyph">
                  {e.kind === 'publish' && <IconCheck size={12} />}
                  {e.kind === 'sync'    && <IconRefresh size={12} />}
                  {e.kind === 'click'   && <IconTrendUp size={12} />}
                  {e.kind === 'flag'    && <IconAlert size={12} />}
                  {e.kind === 'import'  && <IconBookOpen size={12} />}
                  {e.kind === 'idea'    && <IconLightbulb size={12} />}
                </div>
                <div className="feed-body" dangerouslySetInnerHTML={{ __html: e.text }}></div>
                <div className="feed-time">{e.time}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Vendor sync row */}
      <div className="section-bar">
        <h3 className="type-h3" style={{ margin: 0 }}>Vendor sync</h3>
        <a className="link" onClick={() => onRoute('agents')}>Manage agents <IconChevronRight size={12} /></a>
      </div>
      <div className="agent-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {vendors.map(v => (
          <div key={v.key} className={'vendor-card ' + v.key}>
            <div className="vc-mark">{v.short}</div>
            <div className="vc-body" style={{ minWidth: 0 }}>
              <div className="vc-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.label}</div>
              <div className="vc-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.last} · {v.stat}</div>
              {v.rev30 != null && (
                <div className="vc-meta" style={{ color: 'var(--success)' }}>{formatEUR(v.rev30)} 30d</div>
              )}
            </div>
            <StatusBadge s={v.status} />
          </div>
        ))}
      </div>

      {/* Recent ideas */}
      <div className="section-bar">
        <h3 className="type-h3" style={{ margin: 0 }}>Recent ideas</h3>
        <a className="link" onClick={() => onRoute('ideas')}>View all <IconChevronRight size={12} /></a>
      </div>
      <section className="panel" style={{ padding: 0 }}>
        {recentIdeas.map(i => {
          const d = i.dest === 'cross' ? null : window.MTD.findDest(i.dest);
          const r = d && window.MTD.findRegion(d.region);
          return (
            <div key={i.id} className="idea-row" style={{ padding: '12px 16px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--foreground)', fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{i.title}</div>
                <div className="type-meta" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="mono">{i.id}</span>
                  <span>·</span>
                  <span>{i.src}</span>
                  <span>·</span>
                  {d ? (
                    <span className="ws-label">
                      <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>
                      {d.name}
                    </span>
                  ) : <span>cross-destination</span>}
                </div>
              </div>
              <span className={'tag'} style={{
                color: i.priority === 'high' ? 'var(--destructive)' : i.priority === 'med' ? 'var(--warning)' : 'var(--foreground-muted)',
                borderColor: 'transparent', background: 'transparent', padding: '2px 0'
              }}>{i.priority} priority</span>
              <StatusBadge s={i.status} />
              <span className="type-meta" style={{ width: 60, textAlign: 'right' }}>{i.date}</span>
            </div>
          );
        })}
      </section>
    </div>
  );
}

Object.assign(window, { Dashboard });
