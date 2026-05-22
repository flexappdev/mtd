// MTD Front Office — destination detail page (public view of a destination).

function FrontDestinationDetail({ destId, onRoute, saved, onToggleSave }) {
  const D = window.MTD;
  const d = D.findDest(destId) || D.destinations[0];
  const r = D.findRegion(d.region);
  const role = useRole();
  const isSaved = !!saved[d.id];

  const hotelsHere = D.hotels.filter(h => h.dest === d.id);
  const factsHere  = D.facts.filter(f => f.dest === d.id);
  const amazonHere = D.amazon.filter(a => a.dest === d.id);

  // Mock reviews — visible publicly, but submission is gated.
  const reviews = [
    { who: 'Sara K.',     when: '2 weeks ago', stars: 5, text: 'Stayed near Jemaa el-Fna for four nights. The riad recommendations on this page were spot-on — Riad Yasmine had the best rooftop in the medina.' },
    { who: 'Tom R.',      when: '1 month ago',  stars: 4, text: 'Loved the souk maps. Pickup-from-airport info was slightly out of date but everything else held up.' },
    { who: 'Linnea B.',   when: '2 months ago', stars: 5, text: 'I bought the Lonely Planet through the link here and the cooking pot. Both arrived in time. Trip was perfect.' },
  ];

  const style = {
    '--thumb-from': d.thumb?.[0] || r.thumb[0],
    '--thumb-to':   d.thumb?.[1] || r.thumb[1],
  };

  return (
    <React.Fragment>
      {/* HERO */}
      <section className="fo-detail-hero" style={style}>
        <div className="fo-detail-hero-bg"></div>
        <div className="fo-detail-hero-inner">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(255,255,255,0.7)', fontSize: 12.5, marginBottom: 24,
            fontFamily: 'var(--font-mono)',
          }}>
            <a onClick={() => onRoute('fo-home')} style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>home</a>
            <IconChevronRight size={12} />
            <a onClick={() => onRoute('fo-destinations')} style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>destinations</a>
            <IconChevronRight size={12} />
            <span style={{ color: 'white' }}>{d.id}</span>
            <AdminOnly>
              <span style={{ marginLeft: 8 }}>
                <span className="admin-status-pill">
                  <span className="dot" style={{
                    background: d.status === 'live' ? 'var(--success)' :
                                d.status === 'preview' ? 'var(--info)' :
                                d.status === 'qa' ? 'var(--warning)' : 'var(--foreground-muted)'
                  }}></span>
                  {d.status}
                </span>
              </span>
            </AdminOnly>
          </div>
          <h1>{d.name}<AdminChip>title</AdminChip></h1>
          <div className="fo-detail-hero-meta">
            <span><RegionChip region={d.region} /></span>
            <span className="dot"></span>
            <span>{d.position}</span>
            <span className="dot"></span>
            <span><IconBed size={13} style={{ verticalAlign: '-2px' }} /> {d.hotels} hotels</span>
            <span className="dot"></span>
            <span><IconMapPin size={13} style={{ verticalAlign: '-2px' }} /> {d.sights} sights</span>
            <AdminOnly>
              <span className="dot"></span>
              <span className="admin-stat" style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(255,255,255,0.85)' }}>
                <IconArrowUpRight size={10} /> <b>{formatNum(d.clicks30)}</b> clicks · {formatEUR(d.rev30)} 30d
              </span>
            </AdminOnly>
          </div>
          <div className="fo-detail-actions">
            {/* Save button — guest sees sign-in, user/admin can actually save */}
            {role === 'guest' ? (
              <button className="fo-cta outline" onClick={() => setRole('user')}>
                <IconPlus size={14} /> Sign in to save
              </button>
            ) : (
              <button className={'fo-cta ' + (isSaved ? '' : 'outline')}
                      onClick={() => onToggleSave(d.id)}>
                {isSaved ? <IconCheck size={14} /> : <IconPlus size={14} />}
                {isSaved ? 'Saved' : 'Save trip'}
              </button>
            )}
            <button className="fo-cta outline">
              <IconBed size={14} /> See {d.hotels} hotels
            </button>
            <AdminOnly>
              <button className="fo-cta outline" onClick={() => alert('Open in back office')}>
                <IconPencil size={14} /> Edit in back office
              </button>
            </AdminOnly>
          </div>
        </div>
      </section>

      {/* Two-column grid: prose left, sticky card right */}
      <div className="fo-detail-grid">
        <div>
          {/* INTRO */}
          <section style={{ marginBottom: 48 }}>
            <h2>About {d.name}<AdminChip>intro</AdminChip></h2>
            <div className="fo-prose">
              <p data-admin-edit>
                {d.position}. {d.name} sits in {r.name}, one of the five regions we cover
                in depth. This page is updated continuously — hotel rates refresh hourly
                from Booking, Expedia and Agoda; sights and itineraries come from
                Wikivoyage; the top facts below are pulled from Wikipedia and edited
                by our team.
              </p>
              <p data-admin-edit>
                Last refresh: {d.updated}. Best months to visit are typically March–May
                and September–November when temperatures sit between 18°C and 28°C.
              </p>
            </div>
          </section>

          {/* TOP FACTS — first 3 visible to all, rest gated for guest */}
          <section style={{ marginBottom: 48 }}>
            <h2>
              Top facts
              <AdminChip>facts</AdminChip>
              <AdminStat>via <b>wikipedia-facts</b> · {d.updated}</AdminStat>
            </h2>
            <div className="fo-fact-list">
              {(factsHere.length ? factsHere : [
                { text: `Founded as one of the earliest urban settlements in ${r.name}. The historic medina is recognised for its preserved architecture.`, src: 'wikipedia', updated: '6d ago' },
                { text: `${d.name} is a major hub for ${d.position.toLowerCase()} — drawing visitors year-round.`, src: 'wikivoyage', updated: '4d ago' },
                { text: 'The local cuisine combines Berber, Arab and Andalusian influences. Tagines, couscous and mint tea are staples.', src: 'wikipedia', updated: '8d ago' },
              ]).map((f, i) => (
                <div key={i} className="fo-fact">
                  <div className="fo-fact-num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="fo-fact-body">
                    <div className="fo-fact-text">{f.text}</div>
                    <div className="fo-fact-src">
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--success)' }}></span>
                      via {f.src} · {f.updated}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* INSIDER TIPS — locked for guest */}
          <section style={{ marginBottom: 48 }}>
            <h2>
              Insider tips
              {role !== 'guest' && (
                <span className="fo-role-tag" style={{ marginLeft: 10, verticalAlign: 'middle' }}>Members</span>
              )}
              <AdminChip>tips</AdminChip>
            </h2>
            <LockedSection
              title="Members get the insider playbook"
              body="Local guides, lesser-known hotels and the best-time-to-visit calendar. Free with an MTD account.">
              <div className="fo-fact-list">
                <div className="fo-fact">
                  <div className="fo-fact-num">★</div>
                  <div className="fo-fact-body">
                    <div className="fo-fact-text">
                      Avoid Jemaa el-Fna entirely on Friday afternoons — the square is rebuilt
                      from scratch and you'll lose half your day to setup. Go Thursday night or
                      Saturday morning instead.
                    </div>
                    <div className="fo-fact-src">
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ws-lists)' }}></span>
                      editor · 3 weeks ago
                    </div>
                  </div>
                </div>
                <div className="fo-fact">
                  <div className="fo-fact-num">★</div>
                  <div className="fo-fact-body">
                    <div className="fo-fact-text">
                      The riad you actually want isn't the one on Booking. Email Riad Yasmine
                      directly and you'll pay ~€20 less per night with a better room.
                    </div>
                    <div className="fo-fact-src">
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ws-lists)' }}></span>
                      editor · 1 month ago
                    </div>
                  </div>
                </div>
              </div>
            </LockedSection>
          </section>

          {/* HOTELS */}
          <section style={{ marginBottom: 48 }}>
            <h2>
              Where to stay in {d.name}
              <AdminChip>hotels list</AdminChip>
            </h2>
            <div style={{ color: 'var(--foreground-muted)', fontSize: 13.5, marginBottom: 16 }}>
              {hotelsHere.length} hotels · live rates from {role === 'admin' ? '4 vendors' : 'Booking, Expedia & Agoda'}
            </div>
            {hotelsHere.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--foreground-muted)',
                            border: '1px dashed var(--border)', borderRadius: 10 }}>
                No hotels indexed yet for {d.name}.
              </div>
            ) : hotelsHere.slice(0, 4).map(h => {
              const rates = Object.entries(h.rates).filter(([, v]) => v != null);
              const minRate = Math.min(...rates.map(([, v]) => v));
              const minVendor = rates.find(([, v]) => v === minRate)[0];
              return (
                <div key={h.id} className="fo-hotel-card" style={style}>
                  <div className="fo-hotel-cover" style={{ fontSize: 24 }}>{h.name[0]}</div>
                  <div>
                    <div className="fo-hotel-name">{h.name}</div>
                    <div className="fo-hotel-meta">
                      <span className="fo-hotel-stars">{'★'.repeat(h.stars)}</span>
                      {rates.map(([v]) => (
                        <span key={v} className={'vendor ' + v}>
                          <span className="vendor-dot"></span>{v}
                        </span>
                      ))}
                      <AdminOnly>
                        <span className="admin-stat"><IconArrowUpRight size={10} /> <b>{formatNum(h.clicks30)}</b> · {formatEUR(h.rev30)}</span>
                      </AdminOnly>
                    </div>
                  </div>
                  <div className="fo-hotel-price">
                    <div className="fo-hotel-price-label">from</div>
                    <div className="fo-hotel-price-amount">{formatEUR(minRate)}</div>
                    <div className="fo-hotel-price-vendor">on {minVendor}</div>
                    <button className="fo-cta sm" style={{ marginTop: 8 }} onClick={() => {
                      if (role === 'guest') alert('Redirecting to ' + minVendor + '…');
                      else alert('Opening ' + minVendor + ' affiliate link');
                    }}>See deal <IconArrowUpRight size={11} /></button>
                  </div>
                </div>
              );
            })}
          </section>

          {/* AMAZON CTAs */}
          {amazonHere.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <h2>
                Gear &amp; reading for {d.name}
                <AdminChip>amazon CTAs</AdminChip>
              </h2>
              <div style={{ color: 'var(--foreground-muted)', fontSize: 12.5, marginBottom: 14 }}>
                Editor's picks · Amazon affiliate links · we earn a small commission.
              </div>
              <div className="fo-amazon-strip">
                {amazonHere.map(a => (
                  <div key={a.asin} className="fo-amazon-card">
                    <div className="fo-amazon-cover">{a.asin.slice(0, 6)}</div>
                    <div>
                      <div className="fo-amazon-product">{a.product}</div>
                      <div className="fo-amazon-asin">
                        ASIN {a.asin}
                        <AdminOnly>
                          <span className="admin-stat" style={{ marginLeft: 8 }}>
                            <b>{formatNum(a.clicks30)}</b> · {formatEUR(a.rev30)}
                          </span>
                        </AdminOnly>
                      </div>
                    </div>
                    <button className="fo-cta sm outline" style={{ width: '100%' }}>
                      View on Amazon <IconExternal size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* REVIEWS — visible to all, submission gated */}
          <section style={{ marginBottom: 48 }}>
            <h2>
              Reviews
              <AdminStat>{reviews.length} · avg ★ 4.7 · 0 flagged</AdminStat>
            </h2>
            {reviews.map((rv, i) => (
              <div key={i} className="fo-review">
                <div className="fo-review-avatar">{rv.who[0]}</div>
                <div className="fo-review-body">
                  <div className="fo-review-head">
                    <span className="fo-review-name">{rv.who}</span>
                    <span className="fo-hotel-stars">{'★'.repeat(rv.stars)}</span>
                    <span className="fo-review-meta">· {rv.when}</span>
                    <AdminOnly>
                      <span className="admin-chip" style={{ marginLeft: 'auto' }}>moderate</span>
                    </AdminOnly>
                  </div>
                  <div className="fo-review-text">{rv.text}</div>
                </div>
              </div>
            ))}

            {/* Reviews CTA — guest sees sign-in; user/admin sees write box */}
            <div style={{ marginTop: 20 }}>
              {role === 'guest' ? (
                <div style={{
                  padding: 20, border: '1px dashed var(--border)', borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, color: 'var(--foreground)', marginBottom: 8 }}>
                    Been to {d.name}? Share your trip.
                  </div>
                  <button className="fo-cta sm" onClick={() => setRole('user')}>Sign in to write a review</button>
                </div>
              ) : (
                <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--card)' }}>
                  <div className="fo-eyebrow">Write a review</div>
                  <textarea
                    placeholder="What was your trip like?"
                    style={{
                      width: '100%', minHeight: 70,
                      background: 'var(--muted)', border: '1px solid var(--border)',
                      color: 'var(--foreground)', borderRadius: 8, padding: 10,
                      fontFamily: 'var(--font-sans)', fontSize: 13, resize: 'vertical',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <span className="fo-hotel-stars" style={{ fontSize: 20, color: 'var(--foreground-muted)' }}>★★★★★</span>
                    <button className="fo-cta sm">Post review</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SOURCES — admin sees full table; users see attribution line; guest sees just attribution */}
          <section>
            <h2>
              Sources &amp; attribution
              <AdminStat>last sync {d.updated}</AdminStat>
            </h2>
            <div className="fo-prose">
              <p style={{ fontSize: 13.5 }}>
                Facts on this page are derived from <a className="link">Wikipedia</a> and
                <a className="link"> Wikivoyage</a> under <span className="mono">CC-BY-SA 4.0</span>.
                Hotel rates are aggregated from Booking, Expedia and Agoda.
              </p>
            </div>
          </section>
        </div>

        {/* STICKY SIDEBAR */}
        <aside>
          <div className="fo-info-card">
            <div className="fo-eyebrow">At a glance</div>
            <div className="row"><span className="k">Region</span><span className="v"><RegionChip region={d.region} /></span></div>
            <div className="row"><span className="k">Best months</span><span className="v">Mar–May, Sep–Nov</span></div>
            <div className="row"><span className="k">Currency</span><span className="v">MAD (Dirham)</span></div>
            <div className="row"><span className="k">Language</span><span className="v">Arabic, Berber, French</span></div>
            <div className="row"><span className="k">Hotels</span><span className="v">{d.hotels} indexed</span></div>
            <div className="row"><span className="k">Sights</span><span className="v">{d.sights} catalogued</span></div>
            <AdminOnly>
              <div className="row"><span className="k">Status</span><span className="v"><StatusBadge s={d.status} /></span></div>
              <div className="row"><span className="k">Clicks 30d</span><span className="v mono">{formatNum(d.clicks30)}</span></div>
              <div className="row"><span className="k">Revenue 30d</span><span className="v mono">{formatEUR(d.rev30)}</span></div>
              <div className="row"><span className="k">Last update</span><span className="v">{d.updated}</span></div>
            </AdminOnly>

            {role === 'guest' && (
              <button className="fo-cta fo-info-cta" onClick={() => setRole('user')}>
                <IconPlus size={14} /> Sign in to save
              </button>
            )}
            {role === 'user' && (
              <button className={'fo-cta fo-info-cta' + (isSaved ? '' : ' outline')}
                      onClick={() => onToggleSave(d.id)}>
                {isSaved ? <IconCheck size={14} /> : <IconPlus size={14} />}
                {isSaved ? 'Saved to your trips' : 'Save to your trips'}
              </button>
            )}
            {role === 'admin' && (
              <React.Fragment>
                <button className={'fo-cta fo-info-cta' + (isSaved ? '' : ' outline')}
                        onClick={() => onToggleSave(d.id)}>
                  {isSaved ? <IconCheck size={14} /> : <IconPlus size={14} />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="fo-cta fo-info-cta outline" style={{ marginTop: 8 }}
                        onClick={() => alert('Open in back office')}>
                  <IconLayoutLeft size={14} /> Open in back office
                </button>
              </React.Fragment>
            )}
          </div>
        </aside>
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { FrontDestinationDetail });
