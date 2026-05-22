// MTD Destinations list + table.
function DestinationsTable({ rows, onRow, dense }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Destination</th>
          <th>Region</th>
          <th>Status</th>
          <th style={{ textAlign: 'right' }}>Hotels</th>
          <th style={{ textAlign: 'right' }}>Sights</th>
          {!dense && <th style={{ textAlign: 'right' }}>Clicks 30d</th>}
          <th style={{ textAlign: 'right' }}>Revenue 30d</th>
          {!dense && <th>Trend</th>}
          <th style={{ textAlign: 'right' }}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(d => {
          const r = window.MTD.findRegion(d.region);
          return (
            <tr key={d.id} onClick={() => onRow && onRow(d)} style={{ cursor: onRow ? 'pointer' : 'default' }}>
              <td className="strong">
                <div className="dest-cell">
                  <DestThumb d={d} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <div className="dc-name">{d.name}</div>
                    <div className="dc-slug">{d.id}</div>
                  </div>
                </div>
              </td>
              <td><RegionChip region={d.region} /></td>
              <td><StatusBadge s={d.status} /></td>
              <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{d.hotels}</td>
              <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{d.sights}</td>
              {!dense && <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{formatNum(d.clicks30)}</td>}
              <td className="mono" style={{ textAlign: 'right', fontSize: 12.5, color: d.rev30 ? 'var(--foreground)' : 'var(--foreground-muted)' }}>{formatEUR(d.rev30)}</td>
              {!dense && (
                <td>
                  <Sparkline seed={d.id} n={14}
                             trend={d.rev30 > 3000 ? 'up' : d.rev30 < 500 ? 'down' : null} />
                </td>
              )}
              <td style={{ textAlign: 'right', color: 'var(--foreground-muted)' }}>{d.updated}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DestinationsList({ onOpenDest }) {
  const D = window.MTD;
  const [region, setRegion] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [view, setView] = React.useState('table');

  const rows = D.destinations.filter(d =>
    (region === 'all' || d.region === region) &&
    (status === 'all' || d.status === status) &&
    (q === '' || (d.name + d.id).toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Destinations</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>{rows.length} of {D.destinations.length} · cities, regions and sights</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconRefresh size={14} /> Sync all</button>
          <button className="btn btn-secondary btn-sm">Export CSV</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Create destination</button>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '0 0 260px' }}>
          <IconSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.55 }} />
          <input className="input" style={{ paddingLeft: 30, height: 32 }}
                 placeholder="Search destinations" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="input" style={{ height: 32, flex: '0 0 180px' }} value={region} onChange={e => setRegion(e.target.value)}>
          <option value="all">All regions</option>
          {D.regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select className="input" style={{ height: 32, flex: '0 0 140px' }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="live">Live</option>
          <option value="preview">Preview</option>
          <option value="qa">QA</option>
          <option value="draft">Draft</option>
        </select>
        <button className="btn btn-ghost btn-sm"><IconFilter size={14} /> More filters</button>
        <div style={{ flex: 1 }} />
        <div className="seg">
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
          <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>Grid</button>
        </div>
      </div>

      {view === 'table' ? (
        <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          {rows.length === 0 ? (
            <div className="empty" style={{ margin: 20 }}>
              <div className="empty-title">No destinations match these filters.</div>
              <div className="empty-body">Clear filters, or create a new destination.</div>
              <button className="btn btn-primary btn-sm">+ Create destination</button>
            </div>
          ) : (
            <DestinationsTable rows={rows} onRow={onOpenDest} />
          )}
        </section>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {rows.map(d => {
            const r = window.MTD.findRegion(d.region);
            return (
              <div key={d.id} className="panel" style={{ padding: 16, cursor: 'pointer' }} onClick={() => onOpenDest(d)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <DestThumb d={d} size="lg" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--foreground)', fontSize: 15, fontWeight: 600 }}>{d.name}</div>
                    <div className="type-meta" style={{ marginTop: 4 }}>{d.position}</div>
                  </div>
                  <StatusBadge s={d.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12 }}>
                  <RegionChip region={d.region} />
                  <span className="mono" style={{ color: 'var(--foreground-muted)' }}>{d.hotels} hotels · {formatEUR(d.rev30)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { DestinationsTable, DestinationsList });
