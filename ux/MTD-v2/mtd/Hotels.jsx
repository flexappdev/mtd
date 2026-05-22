// MTD Hotels list + table (cross-destination & per-destination)

// Vendor pricing cell: shows lowest rate big, others muted with delta.
function VendorRatesCell({ rates }) {
  const valid = Object.entries(rates).filter(([, v]) => v != null);
  if (valid.length === 0) return <span className="rate-cell miss">—</span>;
  const lowest = Math.min(...valid.map(([, v]) => v));
  const lowestVendor = valid.find(([, v]) => v === lowest)?.[0];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
      {['booking', 'expedia', 'agoda', 'awin'].map(v => {
        const val = rates[v];
        if (val == null) return (
          <span key={v} className="vendor" style={{ opacity: 0.4 }}>
            <span className="vendor-dot" style={{ background: 'transparent', border: '1px dashed var(--border-hover)' }}></span>—
          </span>
        );
        const isBest = v === lowestVendor && valid.length > 1;
        return (
          <span key={v} className={'vendor ' + v} style={{
            color: isBest ? 'var(--success)' : 'var(--foreground-subtle)',
            borderColor: isBest ? 'color-mix(in oklch, var(--success) 40%, transparent)' : 'var(--border)',
            background: isBest ? 'var(--success-bg)' : 'var(--muted)',
          }}>
            <span className="vendor-dot"></span>€{val}
          </span>
        );
      })}
    </div>
  );
}

function HotelsTable({ rows, showDest = true }) {
  const D = window.MTD;
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Hotel</th>
          {showDest && <th>Destination</th>}
          <th>Stars</th>
          <th style={{ textAlign: 'right', paddingRight: 16 }}>Rates · per night</th>
          <th style={{ textAlign: 'right' }}>Clicks 30d</th>
          <th style={{ textAlign: 'right' }}>Revenue 30d</th>
          <th style={{ textAlign: 'right' }}>Updated</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(h => {
          const d = D.findDest(h.dest);
          const r = D.findRegion(d.region);
          return (
            <tr key={h.id}>
              <td className="strong">{h.name}</td>
              {showDest && (
                <td>
                  <span className="ws-label">
                    <span className={`ws-chip ws-chip-sm region-${r.accent}`}>{r.letter}</span>
                    {d.name}
                  </span>
                </td>
              )}
              <td className="mono" style={{ fontSize: 12, color: 'var(--warning)' }}>
                {'★'.repeat(h.stars)}<span style={{ color: 'var(--foreground-muted)' }}>{'★'.repeat(5 - h.stars)}</span>
              </td>
              <td style={{ textAlign: 'right', paddingRight: 16 }}><VendorRatesCell rates={h.rates} /></td>
              <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{formatNum(h.clicks30)}</td>
              <td className="mono" style={{ textAlign: 'right', fontSize: 12.5, color: 'var(--foreground)' }}>{formatEUR(h.rev30)}</td>
              <td style={{ textAlign: 'right', color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{h.updated}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function HotelsList() {
  const D = window.MTD;
  const [dest, setDest] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [vendor, setVendor] = React.useState('all');

  const rows = D.hotels.filter(h =>
    (dest === 'all' || h.dest === dest) &&
    (vendor === 'all' || h.rates[vendor] != null) &&
    (q === '' || h.name.toLowerCase().includes(q.toLowerCase()))
  );

  const totalRev = rows.reduce((s, h) => s + h.rev30, 0);
  const totalClicks = rows.reduce((s, h) => s + h.clicks30, 0);

  // Vendor coverage strip
  const vendors = ['booking', 'expedia', 'agoda', 'awin'];
  const coverage = Object.fromEntries(vendors.map(v => [
    v, D.hotels.filter(h => h.rates[v] != null).length
  ]));

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="type-h1" style={{ margin: 0 }}>Hotels</h1>
          <div className="type-meta" style={{ marginTop: 4 }}>{rows.length} of {D.hotels.length} · rates pulled hourly</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><IconRefresh size={14} /> Sync all vendors</button>
          <button className="btn btn-primary btn-sm"><IconPlus size={14} /> Add hotel</button>
        </div>
      </div>

      {/* Quick KPIs */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi">
          <div className="kpi-label">Hotels in view</div>
          <div className="kpi-value">{rows.length}</div>
          <div className="kpi-delta">{D.hotels.length} total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Clicks 30d</div>
          <div className="kpi-value">{formatNum(totalClicks)}</div>
          <div className="kpi-delta up">+12.1%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Revenue 30d</div>
          <div className="kpi-value">{formatEUR(totalRev)}</div>
          <div className="kpi-delta up">+€840</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avg. rate · lowest vendor</div>
          <div className="kpi-value">€{rows.length ? Math.round(rows.reduce((s, h) => s + Math.min(...Object.values(h.rates).filter(v => v != null)), 0) / rows.length) : 0}</div>
          <div className="kpi-delta">per night</div>
        </div>
      </div>

      {/* Vendor coverage strip */}
      <section className="panel" style={{ padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="type-eyebrow" style={{ flex: '0 0 auto' }}>VENDOR COVERAGE</div>
          {vendors.map(v => {
            const pct = Math.round(coverage[v] / D.hotels.length * 100);
            return (
              <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 180px', minWidth: 160 }}>
                <span className={'vendor ' + v}><span className="vendor-dot"></span>{v}</span>
                <div style={{ flex: 1, minWidth: 50 }}>
                  <div className="bar-track" style={{ height: 6 }}>
                    <div className="bar-fill" style={{ width: pct + '%' }}></div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--foreground-subtle)', minWidth: 56, textAlign: 'right' }}>
                  {coverage[v]}<span style={{ color: 'var(--foreground-muted)' }}>/{D.hotels.length}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="filter-bar">
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <IconSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.55 }} />
          <input className="input" style={{ paddingLeft: 30, height: 32 }}
                 placeholder="Search hotels" value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <select className="input" style={{ height: 32, flex: '0 0 200px' }} value={dest} onChange={e => setDest(e.target.value)}>
          <option value="all">All destinations</option>
          {D.destinations.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="input" style={{ height: 32, flex: '0 0 160px' }} value={vendor} onChange={e => setVendor(e.target.value)}>
          <option value="all">Any vendor</option>
          <option value="booking">Booking</option>
          <option value="expedia">Expedia</option>
          <option value="agoda">Agoda</option>
          <option value="awin">Awin</option>
        </select>
        <button className="btn btn-ghost btn-sm"><IconFilter size={14} /> More filters</button>
      </div>

      <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
        {rows.length === 0 ? (
          <div className="empty" style={{ margin: 20 }}>
            <div className="empty-title">No hotels match.</div>
            <div className="empty-body">Try clearing filters.</div>
          </div>
        ) : (
          <HotelsTable rows={rows} />
        )}
      </section>
    </div>
  );
}

Object.assign(window, { HotelsTable, HotelsList, VendorRatesCell });
