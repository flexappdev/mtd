// Destination detail page — tabs: Overview, Hotels, Sights, Sources, Activity.
function DestinationDetail({ destId, onBack }) {
  const D = window.MTD;
  const d = D.findDest(destId) || D.destinations[0];
  const r = D.findRegion(d.region);
  const [tab, setTab] = React.useState('overview');

  const hotelsHere = D.hotels.filter(h => h.dest === d.id);
  const factsHere = D.facts.filter(f => f.dest === d.id);
  const amazonHere = D.amazon.filter(a => a.dest === d.id);
  const sourcesHere = D.sources.filter(s => s.dest === d.id);

  return (
    <div>
      <div className="breadcrumb">
        <a onClick={onBack}>Destinations</a>
        <IconChevronRight size={12} style={{ opacity: 0.5 }} />
        <span className="mono">{d.id}</span>
      </div>

      <div className="page-head">
        <div className="dest-hero">
          <DestThumb d={d} size="lg" />
          <div>
            <h1 className="type-h1" style={{ margin: 0, fontSize: 28 }}>{d.name}</h1>
            <div className="meta-strip">
              <RegionChip region={d.region} />
              <span>·</span>
              <span>{d.position}</span>
              <span>·</span>
              <span className="mono" style={{ color: 'var(--foreground-subtle)' }}>moroccotopdestinations.com/{d.id}</span>
              <span>·</span>
              <StatusBadge s={d.status} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><IconExternal size={14} /> Local</button>
          <button className="btn btn-secondary btn-sm"><IconExternal size={14} /> Preview</button>
          <button className="btn btn-primary btn-sm"><IconExternal size={14} /> View on site</button>
          <button className="btn btn-ghost btn-icon"><IconMore size={16} /></button>
        </div>
      </div>

      {/* Per-destination KPIs */}
      <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="kpi">
          <div className="kpi-label">Hotels indexed</div>
          <div className="kpi-value">{d.hotels}</div>
          <div className="kpi-delta">3 vendors covered</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Clicks 30d</div>
          <div className="kpi-value">{formatNum(d.clicks30)}</div>
          <div className="kpi-delta up">+9.4%</div>
          <div className="kpi-spark"><Sparkline seed={d.id + '-c'} n={20} trend="up" width={'100%'} /></div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Revenue 30d</div>
          <div className="kpi-value">{formatEUR(d.rev30)}</div>
          <div className="kpi-delta up">€420 vs prev</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Sights · facts</div>
          <div className="kpi-value">{d.sights}<span style={{ fontSize: 14, color: 'var(--foreground-muted)', marginLeft: 8 }}>· {d.facts}</span></div>
          <div className="kpi-delta">last refresh {d.updated}</div>
        </div>
      </div>

      <div className="tabs">
        {['overview', 'hotels', 'sights', 'sources', 'amazon'].map(t => (
          <div key={t} className={'tab' + (tab === t ? ' active' : '')}
               style={{ textTransform: 'capitalize' }}
               onClick={() => setTab(t)}>
            {t === 'sources' ? 'Sources & sync' : t === 'amazon' ? 'Amazon CTAs' : t}
            {t === 'hotels' && <span className="tag" style={{ marginLeft: 6, fontSize: 10 }}>{hotelsHere.length}</span>}
          </div>
        ))}
      </div>

      <div style={{ paddingTop: 20 }}>
        {tab === 'overview' && (
          <div className="split">
            <section className="panel">
              <div className="type-eyebrow" style={{ marginBottom: 8 }}>DESCRIPTION</div>
              <p className="type-body">
                {d.position}. Editorial summary auto-drafted from Wikivoyage and Wikipedia, then hand-edited.
                Hotel rates refresh hourly across Booking, Expedia and Agoda; Amazon CTAs are picked weekly.
              </p>
              <div style={{ height: 16 }} />
              <div className="type-eyebrow" style={{ marginBottom: 8 }}>TOP FACTS · {factsHere.length || 'placeholder'}</div>
              {(factsHere.length ? factsHere : [
                { text: 'Editorial draft — pull from Wikipedia to populate.', src: 'placeholder', updated: '—' }
              ]).map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 18, color: 'var(--foreground-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, paddingTop: 2 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ flex: 1, fontSize: 13, color: 'var(--foreground-subtle)', lineHeight: 1.55 }}>
                    {f.text}
                    <div className="type-meta" style={{ marginTop: 4, display: 'flex', gap: 8 }}>
                      <span className={'src-badge ' + (f.src === 'placeholder' ? 'miss' : 'fresh')}>
                        <span className="dot"></span>{f.src}
                      </span>
                      <span>{f.updated}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-ghost btn-sm"><IconRefresh size={14} /> Re-fetch from Wikipedia</button>
              </div>
            </section>
            <section className="panel">
              <div className="panel-head">
                <h3 className="type-h3" style={{ margin: 0 }}>Best-selling hotels</h3>
                <a className="link" onClick={() => setTab('hotels')}>View all <IconChevronRight size={12} /></a>
              </div>
              {hotelsHere.slice(0, 5).map(h => (
                <div key={h.id} className="idea-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--foreground)', fontSize: 13, fontWeight: 500 }}>{h.name}</div>
                    <div className="type-meta" style={{ marginTop: 3, display: 'flex', gap: 6 }}>
                      {Object.entries(h.rates).filter(([, v]) => v != null).slice(0, 3).map(([vendor]) => (
                        <span key={vendor} className={'vendor ' + vendor}>
                          <span className="vendor-dot"></span>{vendor}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 12.5, color: 'var(--foreground)' }}>{formatEUR(Math.min(...Object.values(h.rates).filter(v => v != null)))}</div>
                    <div className="type-meta" style={{ fontSize: 11, marginTop: 2 }}>{formatEUR(h.rev30)} rev</div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {tab === 'hotels' && (
          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <HotelsTable rows={hotelsHere} showDest={false} />
          </section>
        )}

        {tab === 'sights' && (
          <section className="panel">
            <div className="empty">
              <div className="empty-title">{d.sights} sights catalogued.</div>
              <div className="empty-body">Sourced from Wikivoyage · last import {d.updated}. The sights inventory view is in the design backlog.</div>
              <button className="btn btn-secondary btn-sm"><IconBookOpen size={14} /> Re-import from Wikivoyage</button>
            </div>
          </section>
        )}

        {tab === 'sources' && (
          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Title</th>
                  <th>URL</th>
                  <th style={{ textAlign: 'right' }}>Items</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Pulled</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sourcesHere.length === 0 ? (
                  <tr><td colSpan={7}>
                    <div className="empty" style={{ margin: 12 }}>
                      <div className="empty-title">No sources linked.</div>
                      <div className="empty-body">Run wikivoyage-importer to seed this destination.</div>
                    </div>
                  </td></tr>
                ) : sourcesHere.map((s, i) => (
                  <tr key={i}>
                    <td><span className={'vendor ' + s.kind}><span className="vendor-dot"></span>{s.kind}</span></td>
                    <td className="strong">{s.title}</td>
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--foreground-muted)' }}>{s.url}</td>
                    <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{s.items}</td>
                    <td><StatusBadge s={s.status} /></td>
                    <td className="mono" style={{ textAlign: 'right', fontSize: 11.5, color: 'var(--foreground-muted)' }}>{s.pulled}</td>
                    <td style={{ width: 70, textAlign: 'right' }}>
                      <span className="row-action" title="Re-sync"><IconRefresh size={14} /></span>
                      <span className="row-action" title="Open"><IconExternal size={14} /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === 'amazon' && (
          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            {amazonHere.length === 0 ? (
              <div className="empty" style={{ margin: 20 }}>
                <div className="empty-title">No Amazon CTAs linked.</div>
                <div className="empty-body">Run amazon-asin to suggest relevant products.</div>
                <button className="btn btn-secondary btn-sm"><IconSparkles size={14} /> Suggest ASINs</button>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>ASIN</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Clicks 30d</th>
                    <th style={{ textAlign: 'right' }}>Revenue 30d</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {amazonHere.map(a => (
                    <tr key={a.asin}>
                      <td className="strong">{a.product}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{a.asin}</td>
                      <td><StatusBadge s={a.status} /></td>
                      <td className="mono" style={{ textAlign: 'right', fontSize: 12 }}>{formatNum(a.clicks30)}</td>
                      <td className="mono" style={{ textAlign: 'right', fontSize: 12.5, color: 'var(--foreground)' }}>{formatEUR(a.rev30)}</td>
                      <td style={{ width: 70, textAlign: 'right' }}>
                        <span className="row-action"><IconExternal size={14} /></span>
                        <span className="row-action"><IconCopy size={14} /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

// Utility panel for destination detail
function DestUtilityPanel({ destId }) {
  const d = window.MTD.findDest(destId) || window.MTD.destinations[0];
  const baseUrl = (env) => env === 'prod' ? `moroccotopdestinations.com/${d.id}` : `${env}.mtd.dev/${d.id}`;

  return (
    <div>
      <div className="util-section">
        <div className="type-eyebrow">URLS</div>
        <UrlRow label="Local"   href={`localhost:3000/${d.id}`} />
        <UrlRow label="Preview" href={baseUrl('preview')} />
        <UrlRow label="Prod"    href={baseUrl('prod')} live={d.status === 'live'} />
      </div>

      <div className="util-section">
        <div className="type-eyebrow">CMS</div>
        <div className="util-row">
          <IconHash size={14} />
          <span className="mono" style={{ flex: 1, color: 'var(--foreground-subtle)' }}>cms / pages / {d.id}.mdx</span>
          <IconExternal size={14} style={{ opacity: 0.6 }} />
        </div>
      </div>

      <div className="util-section">
        <div className="type-eyebrow">CONTENT</div>
        <div className="meta-row"><span>Status</span><StatusBadge s={d.status} /></div>
        <div className="meta-row"><span>Region</span><RegionChip region={d.region} /></div>
        <div className="meta-row"><span>Hotels</span><span className="mono">{d.hotels}</span></div>
        <div className="meta-row"><span>Sights</span><span className="mono">{d.sights}</span></div>
        <div className="meta-row"><span>Facts</span><span className="mono">{d.facts}</span></div>
        <div className="meta-row"><span>Last edit</span><span>{d.updated}</span></div>
      </div>

      <div className="util-section">
        <div className="type-eyebrow">AFFILIATE VENDORS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['booking','expedia','agoda','awin','amazon'].map(v => (
            <div key={v} className="util-row">
              <span className={'vendor ' + v}><span className="vendor-dot"></span>{v}</span>
              <span style={{ flex: 1 }}></span>
              <StatusBadge s={v === 'agoda' ? 'warn' : 'live'} />
            </div>
          ))}
        </div>
      </div>

      <div className="util-section">
        <div className="type-eyebrow">QUICK ACTIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><IconRefresh size={14} /> Re-sync hotel rates</button>
          <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><IconBookOpen size={14} /> Re-import from Wikivoyage</button>
          <button className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><IconSparkles size={14} /> Suggest Amazon ASINs</button>
          {d.status !== 'live'
            ? <button className="btn btn-primary btn-sm" style={{ justifyContent: 'flex-start' }}><IconCheck size={14} /> Promote to live</button>
            : <button className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Mark as paused</button>
          }
        </div>
      </div>
    </div>
  );
}

function UrlRow({ label, href, live }) {
  return (
    <div className="util-row">
      <span className="type-meta" style={{ width: 52 }}>{label}</span>
      <span className="mono" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--foreground-subtle)' }}>{href}</span>
      {live && <span style={{ background: 'var(--success)', width: 6, height: 6, borderRadius: 999, display: 'inline-block' }}></span>}
      <IconExternal size={14} style={{ opacity: 0.6, cursor: 'pointer' }} />
    </div>
  );
}

Object.assign(window, { DestinationDetail, DestUtilityPanel });
