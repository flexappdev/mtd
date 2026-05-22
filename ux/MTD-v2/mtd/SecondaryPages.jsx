// MTD secondary pages: Agents, Ideas, Sources, Amazon CTAs.

function AgentsList() {
  const D = window.MTD;
  const [filter, setFilter] = React.useState('all');
  const rows = D.agents.filter(a => filter === 'all' || a.kind === filter);

  const liveCount = D.agents.filter(a => a.status === 'live').length;
  const warnCount = D.agents.filter(a => a.status === 'warn').length;
  const totalRuns = D.agents.reduce((s, a) => s + a.runs7, 0);
  const totalErrors = D.agents.reduce((s, a) => s + a.errors7, 0);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Agents</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>Content scrapers, vendor sync workers, and enrichers</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconRefresh size={14} /> Run all now</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Create agent</button>
        </div>
      </div>

      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi">
          <div className="kpi-label">Agents</div>
          <div className="kpi-value">{D.agents.length}</div>
          <div className="kpi-delta">{liveCount} live · {warnCount} warn</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Runs · 7d</div>
          <div className="kpi-value">{formatNum(totalRuns)}</div>
          <div className="kpi-delta">across all agents</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Errors · 7d</div>
          <div className="kpi-value" style={{ color: totalErrors > 0 ? 'var(--warning)' : 'var(--foreground)' }}>{totalErrors}</div>
          <div className="kpi-delta">{((totalErrors / totalRuns) * 100).toFixed(2)}% error rate</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Next scheduled</div>
          <div className="kpi-value" style={{ fontSize: 20 }}>booking-prices</div>
          <div className="kpi-delta">in 48m · hourly cadence</div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="seg">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'importer' ? 'active' : ''} onClick={() => setFilter('importer')}>Importers</button>
          <button className={filter === 'sync' ? 'active' : ''} onClick={() => setFilter('sync')}>Vendor sync</button>
          <button className={filter === 'enricher' ? 'active' : ''} onClick={() => setFilter('enricher')}>Enrichers</button>
        </div>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Source</th>
              <th>Kind</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Schedule</th>
              <th style={{ textAlign: 'right' }}>Runs 7d</th>
              <th style={{ textAlign: 'right' }}>Errors</th>
              <th>Coverage</th>
              <th style={{ textAlign: 'right' }}>Last run</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(a => (
              <tr key={a.id}>
                <td className="strong mono" style={{ fontSize: 12.5 }}>{a.id}</td>
                <td><span className={'vendor ' + a.vendor}><span className="vendor-dot"></span>{a.vendor}</span></td>
                <td style={{ textTransform: 'capitalize' }}>{a.kind}</td>
                <td style={{ color: 'var(--foreground-subtle)' }}>{a.domain}</td>
                <td><StatusBadge s={a.status} /></td>
                <td className="mono" style={{ fontSize: 11.5 }}>{a.schedule}</td>
                <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{a.runs7}</td>
                <td className="mono" style={{ textAlign: 'right', fontSize: 12, color: a.errors7 > 5 ? 'var(--warning)' : 'var(--foreground-muted)' }}>{a.errors7}</td>
                <td className="mono" style={{ fontSize: 11.5, color: 'var(--foreground-muted)' }}>{a.covered}</td>
                <td style={{ textAlign: 'right', color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{a.last}</td>
                <td style={{ width: 70, textAlign: 'right' }}>
                  <span className="row-action" title="Run now"><IconRefresh size={14} /></span>
                  <span className="row-action" title="More"><IconMore size={14} /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function IdeasList() {
  const D = window.MTD;
  const [pri, setPri] = React.useState('all');
  const [stat, setStat] = React.useState('all');
  const rows = D.ideas.filter(i =>
    (pri === 'all' || i.priority === pri) &&
    (stat === 'all' || i.status === stat)
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Ideas</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>Content backlog — editorial briefs, auto-flagged refreshes, and source suggestions</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm">Export</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> New idea</button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="seg">
          <button className={stat === 'all' ? 'active' : ''} onClick={() => setStat('all')}>All ({D.ideas.length})</button>
          <button className={stat === 'pending' ? 'active' : ''} onClick={() => setStat('pending')}>Pending</button>
          <button className={stat === 'in-review' ? 'active' : ''} onClick={() => setStat('in-review')}>In review</button>
          <button className={stat === 'queued' ? 'active' : ''} onClick={() => setStat('queued')}>Queued</button>
        </div>
        <select className="input" style={{ height: 32, flex: '0 0 140px' }} value={pri} onChange={e => setPri(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="med">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {rows.map(i => {
          const d = i.dest === 'cross' ? null : D.findDest(i.dest);
          const r = d && D.findRegion(d.region);
          const priColor = i.priority === 'high' ? 'var(--destructive)' : i.priority === 'med' ? 'var(--warning)' : 'var(--foreground-muted)';
          return (
            <div key={i.id} className="idea-row" style={{ padding: '14px 16px' }}>
              <span style={{
                width: 4, height: 36, borderRadius: 2,
                background: priColor, flexShrink: 0
              }}></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--foreground)', fontSize: 13.5, fontWeight: 500, marginBottom: 4 }}>{i.title}</div>
                <div className="type-meta" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="mono">{i.id}</span>
                  <span>·</span>
                  <span className={'src-badge ' + (i.src === 'auto-flag' ? 'stale' : 'fresh')}>
                    <span className="dot"></span>{i.src}
                  </span>
                  {d && <>
                    <span>·</span>
                    <span className="ws-label">
                      <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>{d.name}
                    </span>
                  </>}
                </div>
              </div>
              <span className="tag" style={{ color: priColor, borderColor: 'transparent', background: 'transparent' }}>
                {i.priority} priority
              </span>
              <StatusBadge s={i.status} />
              <span className="type-meta" style={{ width: 64, textAlign: 'right' }}>{i.date}</span>
              <span className="row-action" title="More"><IconMore size={14} /></span>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function SourcesList() {
  const D = window.MTD;
  // Cross-destination sources view — aggregate per (destination, kind) by counting hotels & last sync.
  const rows = D.destinations.flatMap(d => {
    const wv = { dest: d, kind: 'wikivoyage', title: d.name, items: d.sights, pulled: d.updated, status: d.status === 'draft' ? 'miss' : 'fresh' };
    const wp = { dest: d, kind: 'wikipedia', title: d.name, items: d.facts, pulled: d.updated, status: d.status === 'draft' ? 'miss' : 'fresh' };
    return [wv, wp];
  });

  const stats = {
    wikivoyage: D.destinations.filter(d => d.status !== 'draft').length,
    wikipedia:  D.destinations.filter(d => d.status !== 'draft').length,
    booking:    D.destinations.filter(d => d.hotels > 0).length,
    expedia:    D.destinations.filter(d => d.status === 'live').length,
    agoda:      D.destinations.filter(d => d.hotels >= 10).length,
    awin:       4,
    amazon:     D.amazon.length,
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Sources</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>Wikivoyage · Wikipedia · Booking · Expedia · Agoda · Awin · Amazon</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconRefresh size={14} /> Re-sync all</button>
        </div>
      </div>

      <div className="agent-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[
          { key: 'wikivoyage', label: 'Wikivoyage',  short: 'Wv', desc: 'Sights & itineraries' },
          { key: 'wikipedia',  label: 'Wikipedia',   short: 'Wp', desc: 'Top facts' },
          { key: 'booking',    label: 'Booking.com', short: 'Bk', desc: 'Hotel rates' },
          { key: 'expedia',    label: 'Expedia',     short: 'Ex', desc: 'Hotel rates' },
          { key: 'agoda',      label: 'Agoda',       short: 'Ag', desc: 'Hotel rates' },
          { key: 'awin',       label: 'Awin',        short: 'Aw', desc: 'Affiliate deals' },
          { key: 'amazon',     label: 'Amazon',      short: 'Az', desc: 'Product CTAs' },
        ].map(v => (
          <div key={v.key} className={'vendor-card ' + v.key} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <div className="vc-mark">{v.short}</div>
              <div className="vc-body">
                <div className="vc-name">{v.label}</div>
                <div className="vc-meta" style={{ fontFamily: 'var(--font-sans)' }}>{v.desc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'baseline' }}>
              <span className="mono" style={{ fontSize: 18, color: 'var(--foreground)' }}>{stats[v.key]}</span>
              <span className="type-meta" style={{ fontSize: 11 }}>covered</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-bar">
        <h3 className="type-h3" style={{ margin: 0 }}>Source coverage by destination</h3>
        <a className="link">Filter <IconChevronRight size={12} /></a>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Region</th>
              <th>Wikivoyage</th>
              <th>Wikipedia</th>
              <th>Booking</th>
              <th>Expedia</th>
              <th>Agoda</th>
              <th>Awin</th>
              <th style={{ textAlign: 'right' }}>Last refresh</th>
            </tr>
          </thead>
          <tbody>
            {D.destinations.map(d => {
              const cov = (covered) => covered
                ? <span className="src-badge fresh"><span className="dot"></span>fresh</span>
                : <span className="src-badge miss"><span className="dot"></span>missing</span>;
              const stale = (yes) => yes
                ? <span className="src-badge stale"><span className="dot"></span>stale</span>
                : null;
              return (
                <tr key={d.id}>
                  <td className="strong"><div className="dest-cell"><DestThumb d={d} size="sm" /><div className="dc-name">{d.name}</div></div></td>
                  <td><RegionChip region={d.region} /></td>
                  <td>{cov(d.status !== 'draft')}</td>
                  <td>{cov(d.status !== 'draft')}</td>
                  <td>{cov(d.hotels > 0)}</td>
                  <td>{cov(d.status === 'live')}</td>
                  <td>{d.id === 'marrakech' ? stale(true) : cov(d.hotels >= 10)}</td>
                  <td>{cov(d.hotels >= 20)}</td>
                  <td className="mono" style={{ textAlign: 'right', fontSize: 11.5, color: 'var(--foreground-muted)' }}>{d.updated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function AmazonList() {
  const D = window.MTD;
  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Amazon CTAs</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>ASINs surfaced as call-to-actions on destination pages</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconSparkles size={14} /> Suggest more</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Add ASIN</button>
        </div>
      </div>

      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi">
          <div className="kpi-label">Active ASINs</div>
          <div className="kpi-value">{D.amazon.filter(a => a.status === 'live').length}</div>
          <div className="kpi-delta">{D.amazon.length} total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Clicks 30d</div>
          <div className="kpi-value">{formatNum(D.amazon.reduce((s, a) => s + a.clicks30, 0))}</div>
          <div className="kpi-delta up">+8.2%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Revenue 30d</div>
          <div className="kpi-value">{formatEUR(D.amazon.reduce((s, a) => s + a.rev30, 0))}</div>
          <div className="kpi-delta up">+€95</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Conversion</div>
          <div className="kpi-value">3.1%</div>
          <div className="kpi-delta">last sync 4d ago</div>
        </div>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Destination</th>
              <th>ASIN</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Clicks 30d</th>
              <th style={{ textAlign: 'right' }}>Revenue 30d</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {D.amazon.map(a => {
              const d = a.dest === 'sahara' ? D.findDest('merzouga') : D.findDest(a.dest);
              const r = d && D.findRegion(d.region);
              return (
                <tr key={a.asin}>
                  <td className="strong">{a.product}</td>
                  <td>{d ? <span className="ws-label">
                    <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>{d.name}
                  </span> : <span style={{ color: 'var(--foreground-muted)' }}>cross</span>}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{a.asin}</td>
                  <td><StatusBadge s={a.status} /></td>
                  <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{formatNum(a.clicks30)}</td>
                  <td className="mono" style={{ textAlign: 'right', fontSize: 12.5, color: 'var(--foreground)' }}>{formatEUR(a.rev30)}</td>
                  <td style={{ width: 70, textAlign: 'right' }}>
                    <span className="row-action"><IconExternal size={14} /></span>
                    <span className="row-action"><IconCopy size={14} /></span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

Object.assign(window, { AgentsList, IdeasList, SourcesList, AmazonList });
