// MTD v2 — Wiki, Media, Guides, Random, MoroccAI, Scroller-mode pages.

// ---------- Wiki ----------
function FrontWiki({ onRoute }) {
  const D = window.MTD;
  const [active, setActive] = React.useState(D.wikiArticles[0]);
  const dest = D.findDest(active.dest);
  const seed = 'wiki-' + active.id;

  const sections = [
    'Overview', 'History', 'Geography', 'Culture', 'Cuisine', 'Sights', 'Travel', 'References'
  ];

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 280 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('wiki-hero', 1920, 500)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">WIKI · SOURCED FROM WIKIPEDIA · CC-BY-SA 4.0</div>
          <h1>Morocco Wiki</h1>
        </div>
      </section>

      <div className="wiki-layout">
        <div className="wiki-article">
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18,
          }}>
            {D.wikiArticles.map(a => (
              <button key={a.id}
                      onClick={() => setActive(a)}
                      style={{
                        background: active.id === a.id ? '#c1272d' : 'rgba(255,255,255,0.06)',
                        color: active.id === a.id ? 'black' : 'rgba(255,255,255,0.8)',
                        border: '1px solid var(--border)',
                        borderRadius: 999,
                        padding: '6px 12px',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: 'var(--font-sans)',
                      }}>{a.title}</button>
            ))}
          </div>

          <h1>{active.title}</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 18, letterSpacing: 0.06 }}>
            From Wikipedia · {active.length} · last updated {active.updated}
          </div>

          <p className="lede">
            {active.title.includes('Morocco') ? 'Morocco' : active.title.split(' ')[0]}, officially mapped across our {D.regions.length} regions, sits at the crossroads of Berber, Arab, Sephardic and Andalusian cultures.
            This article is a continuously-updated mirror of the Wikipedia entry, with editorial cross-links into MTD destinations, hotels and itineraries.
          </p>

          {sections.map((s, i) => (
            <div key={s} id={'sec-' + i}>
              <h2>{s}</h2>
              <p>
                {/* Placeholder body — three short paragraphs per section, mostly to demonstrate the layout. */}
                {s === 'Overview' && (
                  <>It would be impossible to summarise {active.title.toLowerCase()} in a single paragraph. The country (or city, or topic) is shaped by three thousand years of layered influence — Phoenician, Roman, Berber, Arab, Andalusian — and by a coastline that touches both the Atlantic and the Mediterranean.</>
                )}
                {s !== 'Overview' && (
                  <>The {s.toLowerCase()} of {active.title.toLowerCase()} is one of the most discussed aspects in the literature. {Math.floor(Math.random()*900 + 100)} citations are linked from this section to the full Wikipedia article. We mirror them locally so the affiliate disclosures and our editorial commentary appear inline.</>
                )}
              </p>
              <p>
                Cross-linked MTD entries: {' '}
                {dest ? <><a onClick={() => onRoute('fo-destinations')}>{dest.name}</a>, </> : null}
                <a onClick={() => onRoute('fo-places/sights')}>top sights</a>,{' '}
                <a onClick={() => onRoute('fo-lists/top100')}>top 100 places</a>.
              </p>
            </div>
          ))}
        </div>

        <aside>
          <div className="wiki-infobox">
            <div className="img" style={{ backgroundImage: `url(${D.img(seed, 600, 450)})` }}></div>
            <div className="body">
              <div className="row"><span>Article</span><span>{active.title}</span></div>
              <div className="row"><span>Length</span><span>{active.length}</span></div>
              <div className="row"><span>Updated</span><span>{active.updated}</span></div>
              <div className="row"><span>License</span><span>CC-BY-SA</span></div>
              <div className="row"><span>Source</span><span><a className="link" style={{ color: '#c1272d' }}>wikipedia.org</a></span></div>
            </div>
          </div>

          <div className="wiki-toc">
            <h4>Contents</h4>
            {sections.map((s, i) => (
              <a key={s} onClick={() => document.getElementById('sec-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {i + 1}. {s}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </React.Fragment>
  );
}

// ---------- Media (tabs: images / audio / videos / map / pdf) ----------
function FrontMedia({ subroute, onRoute }) {
  const D = window.MTD;
  const tab = subroute || 'images';
  if (tab === 'videos') return <FrontVideos onRoute={onRoute} />;

  const tabs = [
    { id: 'images', label: 'Images', count: '4,200', icon: () => <IconImage size={13} /> },
    { id: 'audio',  label: 'Audio',  count: '120',   icon: () => <IconCircleDot size={13} /> },
    { id: 'videos', label: 'Videos', count: '10k',   icon: () => <IconEye size={13} /> },
    { id: 'map',    label: 'Map',    count: 'live',  icon: () => <IconMapPin size={13} /> },
    { id: 'pdf',    label: 'PDFs',   count: '32',    icon: () => <IconBookOpen size={13} /> },
  ];

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 240 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('media-hero', 1920, 500)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">MEDIA · IMAGES · AUDIO · VIDEO · MAP · PDF</div>
          <h1 style={{ textTransform: 'capitalize' }}>{tab}</h1>
        </div>
      </section>

      <div className="media-tabs">
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => onRoute('fo-media/' + t.id)}>
            {t.icon()} {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <section className="fo-section-v2">
        {tab === 'images' && (
          <div>
            <div className="head"><div><h2>4,200 images</h2><div className="sub">Wikipedia-Commons, partner photographers, and Siems Production stills.</div></div></div>
            <div style={{
              columnCount: 4,
              columnGap: 14,
            }}>
              {D.mediaImages.map(im => (
                <div key={im.id} className="mtd-photo" style={{
                  marginBottom: 14,
                  breakInside: 'avoid',
                  borderRadius: 8,
                  aspectRatio: im.w === 'tall' ? '3/4' : '4/3',
                  backgroundImage: `url(${D.img(im.seed, 600, im.w === 'tall' ? 800 : 450)})`,
                }}>
                  <div style={{
                    position: 'absolute', bottom: 8, left: 10,
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'rgba(255,255,255,0.85)', zIndex: 1,
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  }}>
                    {D.findDest(im.dest)?.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'audio' && (
          <div>
            <div className="head"><div><h2>Field recordings & music</h2><div className="sub">Public-domain ambient + commissioned tracks from Berber and Gnaoua musicians.</div></div></div>
            <div className="fo-list">
              {D.mediaAudio.map((a, i) => (
                <div key={a.id} className="fo-list-row" style={{ gridTemplateColumns: '48px 80px 1fr 100px auto auto' }}>
                  <div className={'fo-list-rank' + (i < 3 ? ' top' : '')}>{i + 1}</div>
                  <div className="fo-list-thumb" style={{
                    backgroundImage: `linear-gradient(135deg, rgba(193,39,45,0.4), rgba(0,0,0,0.4)), url(${D.img('audio-' + a.id, 200, 140)})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 18, color: 'white', zIndex: 1, position: 'relative' }}>▶</span>
                  </div>
                  <div>
                    <div className="fo-list-name">{a.title}</div>
                    <div className="fo-list-meta">{a.kind} · {D.findDest(a.dest)?.name}</div>
                  </div>
                  <div className="fo-list-tag" style={{ fontFamily: 'var(--font-mono)', color: 'white' }}>{a.duration}</div>
                  <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  <span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pdf' && (
          <div>
            <div className="head"><div><h2>Downloadable guides & maps</h2><div className="sub">Printable PDFs — itineraries, medina maps, packing lists.</div></div></div>
            <div className="fo-grid cols-3">
              {D.mediaPdfs.map(p => (
                <div key={p.id} className="fo-box" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="mtd-photo" style={{ aspectRatio: '4/3', borderRadius: 6, backgroundImage: `url(${D.img('pdf-' + p.id, 600, 450)})` }}></div>
                  <div className="fo-box-rank">PDF · {p.pages} pages · {p.size}</div>
                  <div className="fo-box-name">{p.title}</div>
                  <div className="fo-box-meta">{D.findDest(p.dest)?.name || 'Morocco-wide'}</div>
                  <button className="fo-cta sm" style={{ marginTop: 8, width: '100%' }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'map' && (
          <div>
            <div className="head"><div><h2>Map of Morocco</h2><div className="sub">All 14 destinations, plotted. Live cluster pins.</div></div></div>
            <div className="fo-map">
              <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0 }}>
                <path d="M120,150 Q200,80 320,90 Q450,100 540,150 Q620,200 680,280 Q700,360 660,440 Q580,510 460,520 Q340,510 240,480 Q160,440 130,360 Q100,260 120,150 Z"
                      fill="rgba(193,39,45,0.08)" stroke="rgba(193,39,45,0.4)" strokeWidth="2" />
                {D.destinations.map(d => {
                  const h = D.hash(d.id);
                  const x = 160 + (h % 480);
                  const y = 140 + ((h >> 8) % 340);
                  return (
                    <g key={d.id} style={{ cursor: 'pointer' }}>
                      <circle cx={x} cy={y} r="8" fill="#c1272d" />
                      <circle cx={x} cy={y} r="18" fill="none" stroke="#c1272d" strokeWidth="1" opacity="0.4" />
                      <text x={x + 12} y={y - 6} fill="white" fontSize="11" fontFamily="JetBrains Mono">{d.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </section>
    </React.Fragment>
  );
}

// ---------- Guides (Amazon shop) ----------
function FrontGuides({ subroute, onRoute }) {
  const D = window.MTD;
  const filter = subroute || 'all';
  const items = filter === 'all' ? D.guides :
                filter === 'books' ? D.guides.filter(g => g.kind === 'guidebook') :
                filter === 'cookbooks' ? D.guides.filter(g => g.kind === 'cookbook') :
                filter === 'gear' ? D.guides.filter(g => g.kind === 'gear') :
                filter === 'beauty' ? D.guides.filter(g => g.kind === 'beauty') :
                D.guides;
  const KINDS = [
    { id: 'all',       label: 'All',         count: D.guides.length },
    { id: 'books',     label: 'Guidebooks',  count: D.guides.filter(g => g.kind === 'guidebook').length },
    { id: 'cookbooks', label: 'Cookbooks',   count: D.guides.filter(g => g.kind === 'cookbook').length },
    { id: 'gear',      label: 'Travel gear', count: D.guides.filter(g => g.kind === 'gear').length },
    { id: 'beauty',    label: 'Argan & beauty', count: D.guides.filter(g => g.kind === 'beauty').length },
  ];

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 320 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('guides-hero', 1920, 600)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip">SHOP · AMAZON AFFILIATE · WE EARN A SMALL COMMISSION</div>
          <h1>Guides &amp; gear</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '8px 0 0' }}>
            Read the books we read. Pack what we pack. Every link goes to Amazon.
          </p>
        </div>
      </section>

      <div className="media-tabs">
        {KINDS.map(t => (
          <button key={t.id} className={filter === t.id ? 'active' : ''} onClick={() => onRoute('fo-guides/' + t.id)}>
            {t.label} <span className="count">{t.count}</span>
          </button>
        ))}
      </div>

      <section className="fo-section-v2">
        <div className="head">
          <div><h2 style={{ textTransform: 'capitalize' }}>{filter === 'all' ? 'All guides & gear' : filter}</h2><div className="sub">{items.length} products · sorted by rating</div></div>
        </div>
        <div className="fo-grid cols-5">
          {items.map(g => (
            <a key={g.id} className="shop-card">
              <div className="shop-cover mtd-photo" style={{ backgroundImage: `url(${D.img('guide-' + g.id, 400, 540)})` }}></div>
              <div className="shop-title">{g.title}</div>
              <div className="shop-meta">{g.kind} · ASIN {g.asin}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="shop-price">{g.price}</span>
                <span className="rating">★ {g.rating} ({g.reviews})</span>
              </div>
              <div className="cta">View on Amazon</div>
            </a>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

// ---------- Random hub ----------
function FrontRandom({ onRoute, onOpenDest }) {
  const D = window.MTD;
  const [pick, setPick] = React.useState(null);
  const roll = () => {
    const items = D.allItems();
    setPick(items[Math.floor(Math.random() * items.length)]);
  };

  React.useEffect(() => { roll(); }, []);

  if (!pick) return <div className="random-stage"><div className="die">🎲</div></div>;

  const list = D.pickRandom(D.allLists());
  const seed = pick.id;
  const kindLabel = pick._kind || 'item';

  return (
    <section className="random-stage">
      <div className="die" onClick={roll}>🎲</div>
      <div className="meta-strip" style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.12, textTransform: 'uppercase', marginBottom: 12,
      }}>
        Random click · random list · random item
      </div>
      <h2>You got</h2>
      <div className="pick">
        <div className="img" style={{ backgroundImage: `url(${D.img(seed, 600, 450)})` }}></div>
        <div className="body">
          <div className="kind">{kindLabel}</div>
          <h3>{pick.name || pick.title}</h3>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 14 }}>
            {pick.dest ? `In ${D.findDest(pick.dest)?.name || pick.dest}` : ''}
            {pick.region ? ` · ${D.findRegion(pick.region)?.name}` : ''}
            {pick.kind && typeof pick.kind === 'string' ? ` · ${pick.kind}` : ''}
          </div>
          <div style={{ fontSize: 12, color: '#c1272d', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: 0.06, textTransform: 'uppercase' }}>
            From the list →
          </div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'white', marginBottom: 14 }}>{list.title}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="fo-cta sm" onClick={() => {
              if (kindLabel === 'destination') onOpenDest && onOpenDest(pick);
              else onRoute('fo-lists/' + list.id);
            }}>Open <IconArrowRight size={12} /></button>
            <button className="fo-cta sm outline" onClick={roll}>🎲 Roll again</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- MoroccAI agent ----------
function FrontMoroccAI({ onRoute, onOpenDest }) {
  const D = window.MTD;
  const [messages, setMessages] = React.useState([
    { role: 'assistant', text: "I'm MoroccAI ✦. I can plan trips, book hotels, find restaurants, build top-N lists or pull facts straight from the Wiki. Try something like \"plan me 10 days starting Marrakech\" or \"find a luxury riad with a rooftop\"." },
  ]);
  const [preview, setPreview] = React.useState({
    kind: 'home',
    title: 'Live preview',
    body: 'Whatever the agent does will render here. Hit a suggested action below to start.',
  });
  const [input, setInput] = React.useState('');

  const send = (raw) => {
    const txt = (raw || input).trim();
    if (!txt) return;
    const next = [...messages, { role: 'user', text: txt }];

    // Route to a canned response based on intent
    let assistantText = '';
    let action = '';
    let newPreview = preview;

    if (/plan|itinerary|days/i.test(txt)) {
      assistantText = "Drafted a 10-day itinerary from Marrakech. Hotels picked from our luxury top-100. Check the preview — confirm and I'll save it.";
      action = 'plan_itinerary';
      newPreview = {
        kind: 'itinerary',
        title: '10 days, starting Marrakech',
        items: [
          { day: 1,  city: 'Marrakech',  note: 'arrive, riad in medina',           seed: 'marrakech-d1' },
          { day: 2,  city: 'Marrakech',  note: 'souks, Jardin Majorelle',          seed: 'marrakech-d2' },
          { day: 3,  city: 'Atlas Mts.', note: 'Imlil + Berber lunch',             seed: 'atlas-d3' },
          { day: 4,  city: 'Aït Benhaddou', note: 'film tour + kasbah ruins',      seed: 'aitben-d4' },
          { day: 5,  city: 'Merzouga',   note: 'camel trek to Erg Chebbi',         seed: 'merzouga-d5' },
          { day: 6,  city: 'Merzouga',   note: 'sunrise on the dunes',             seed: 'merzouga-d6' },
          { day: 7,  city: 'Fes',        note: 'tannery + medina walking tour',    seed: 'fes-d7' },
          { day: 8,  city: 'Chefchaouen',note: 'blue alleys at dawn',              seed: 'chefchaouen-d8' },
          { day: 9,  city: 'Essaouira',  note: 'seaside / Skala',                  seed: 'essaouira-d9' },
          { day: 10, city: 'Marrakech',  note: 'depart',                           seed: 'marrakech-d10' },
        ],
      };
    } else if (/hotel|riad|stay/i.test(txt)) {
      assistantText = "Pulled 6 luxury hotels with rooftops, sorted on rate and rating. Preview is live. Want to filter by city or budget?";
      action = 'find_hotels';
      newPreview = { kind: 'hotels', title: 'Luxury rooftop riads', items: D.hotels.filter(h => h.stars >= 4).slice(0, 6) };
    } else if (/restaur|eat|food/i.test(txt)) {
      assistantText = "Top restaurants ranked by 30-day demand. Pinned the snail stall at #3 because it deserves it.";
      action = 'find_restaurants';
      newPreview = { kind: 'restaurants', title: 'Restaurants ranked', items: [...D.restaurants].sort((a, b) => b.clicks30 - a.clicks30).slice(0, 6) };
    } else if (/list|top/i.test(txt)) {
      assistantText = "Here are the most relevant top-N lists. Tap any to open.";
      action = 'find_lists';
      newPreview = { kind: 'lists', title: 'Most relevant lists', items: D.lists.slice(0, 6) };
    } else if (/map/i.test(txt)) {
      assistantText = "Plotted everything on the map. Pins are clickable.";
      action = 'show_map';
      newPreview = { kind: 'map', title: 'Map of Morocco', items: D.destinations };
    } else if (/wiki|fact|history/i.test(txt)) {
      assistantText = "Pulled the Wikipedia entry. Updated Apr 28 2026.";
      action = 'fetch_wiki';
      newPreview = { kind: 'wiki', title: D.wikiArticles[0].title, article: D.wikiArticles[0] };
    } else {
      assistantText = "I can plan trips, find hotels, restaurants, build lists, show the map, fetch wiki entries, or roll a random pick. Tell me what you need.";
    }

    next.push({ role: 'assistant', text: assistantText, action });
    setMessages(next);
    setPreview(newPreview);
    setInput('');
  };

  const suggestions = [
    'Plan me 10 days from Marrakech',
    'Luxury riad with a rooftop',
    'Top restaurants in Fes',
    'Top 50 desert camps',
    'Map of all UNESCO sites',
    'Wiki — Berber people',
  ];

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 200 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('moroccai-hero', 1920, 400)})` }}></div>
        <div className="fo-hero-mini-inner" style={{ paddingBottom: 20 }}>
          <div className="meta-strip" style={{ color: '#c1272d' }}>✦ MOROCCAI · AI TRAVEL AGENT · PREVIEW EVERYTHING BEFORE YOU CONFIRM</div>
          <h1>MoroccAI</h1>
        </div>
      </section>

      <div className="ai-page">
        <div className="ai-chat">
          <div className="ai-chat-head">
            <div className="ai-avatar">✦</div>
            <div>
              <div style={{ fontWeight: 600, color: 'white' }}>MoroccAI</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>online · trained on 10,000 entries</div>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>v1.18.2</span>
          </div>

          <div className="ai-chat-msgs">
            {messages.map((m, i) => (
              <div key={i} className={'ai-msg ' + m.role}>
                {m.text}
                {m.action && <div className="action"><IconCircleDot size={11} /> action: {m.action}</div>}
              </div>
            ))}
          </div>

          <div className="ai-suggest">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}>{s}</button>
            ))}
          </div>

          <div className="ai-input-row">
            <input value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && send()}
                   placeholder="Tell MoroccAI what you want…" />
            <button className="fo-cta sm" onClick={() => send()}>
              <IconArrowRight size={14} /> Send
            </button>
          </div>
        </div>

        {/* Live preview pane */}
        <div className="ai-preview">
          <div className="ai-preview-head">
            <div className="dot"></div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.08, textTransform: 'uppercase' }}>Live preview</div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: 15, marginTop: 2 }}>{preview.title}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{preview.kind}</span>
          </div>

          {preview.kind === 'home' && (
            <div style={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', padding: 32, fontSize: 14 }}>
              {preview.body}
            </div>
          )}

          {preview.kind === 'itinerary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {preview.items.map(it => (
                <div key={it.day} style={{
                  display: 'grid', gridTemplateColumns: '40px 80px 1fr',
                  gap: 12, alignItems: 'center',
                  padding: 8, border: '1px solid var(--border)', borderRadius: 8,
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#c1272d', letterSpacing: 0.06 }}>DAY {it.day}</div>
                  <div className="mtd-photo" style={{
                    aspectRatio: '4/3', borderRadius: 4,
                    backgroundImage: `url(${D.img(it.seed, 200, 150)})`,
                  }}></div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 13.5 }}>{it.city}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12 }}>{it.note}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="fo-cta sm" style={{ flex: 1 }}>✓ Confirm & save</button>
                <button className="fo-cta sm outline">Tweak</button>
              </div>
            </div>
          )}

          {preview.kind === 'hotels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {preview.items.map(h => {
                const minRate = Math.min(...Object.values(h.rates).filter(v => v != null));
                return (
                  <div key={h.id} style={{
                    display: 'grid', gridTemplateColumns: '80px 1fr auto',
                    gap: 12, alignItems: 'center', padding: 8, borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                  }}>
                    <div className="mtd-photo" style={{
                      aspectRatio: '1', borderRadius: 4,
                      backgroundImage: `url(${D.img('hotel-' + h.id, 200, 200)})`,
                    }}></div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 600, fontSize: 13.5 }}>{h.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11.5, fontFamily: 'var(--font-mono)' }}>
                        {'★'.repeat(h.stars)} · {D.findDest(h.dest)?.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: 'white' }}>€{minRate}</div>
                      <button className="fo-cta sm" style={{ marginTop: 4, padding: '4px 10px', fontSize: 11 }}>Book</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {preview.kind === 'restaurants' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {preview.items.map((r, i) => (
                <div key={r.id} style={{
                  display: 'grid', gridTemplateColumns: '32px 1fr auto',
                  gap: 12, alignItems: 'center', padding: 10, borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                }}>
                  <div className={'fo-list-rank' + (i < 3 ? ' top' : '')}>{i + 1}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600 }}>{r.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{r.kind} · {r.price} · {D.findDest(r.dest)?.name}</div>
                  </div>
                  <button className="fo-cta sm" style={{ padding: '4px 10px', fontSize: 11 }}>Reserve</button>
                </div>
              ))}
            </div>
          )}

          {preview.kind === 'lists' && (
            <div className="fo-grid cols-2" style={{ gap: 10 }}>
              {preview.items.map(l => (
                <a key={l.id} className="list-card" style={{ aspectRatio: '3/2' }} onClick={() => onRoute('fo-lists/' + l.id)}>
                  <div className="list-card-img" style={{ backgroundImage: `url(${D.img('list-' + l.hero, 400, 270)})` }}>
                    <div className="list-card-rank">{l.items}</div>
                  </div>
                  <div className="list-card-body">
                    <div className="list-card-title" style={{ fontSize: 13 }}>{l.title}</div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {preview.kind === 'map' && (
            <div className="fo-map" style={{ height: '100%', minHeight: 360 }}>
              <svg viewBox="0 0 800 600">
                <path d="M120,150 Q200,80 320,90 Q450,100 540,150 Q620,200 680,280 Q700,360 660,440 Q580,510 460,520 Q340,510 240,480 Q160,440 130,360 Q100,260 120,150 Z"
                      fill="rgba(193,39,45,0.06)" stroke="rgba(193,39,45,0.4)" strokeWidth="2" />
                {preview.items.slice(0, 14).map(d => {
                  const h = D.hash(d.id);
                  const x = 160 + (h % 480);
                  const y = 140 + ((h >> 8) % 340);
                  return (
                    <g key={d.id}>
                      <circle cx={x} cy={y} r="7" fill="#c1272d" />
                      <text x={x + 10} y={y - 4} fill="white" fontSize="10" fontFamily="JetBrains Mono">{d.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {preview.kind === 'wiki' && (
            <div>
              <div className="mtd-photo" style={{ aspectRatio: '4/3', borderRadius: 8, backgroundImage: `url(${D.img('wiki-' + preview.article.id, 600, 450)})`, marginBottom: 12 }}></div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.55 }}>
                {preview.article.title} — {preview.article.length}. Last updated {preview.article.updated}.
                Mirrored from Wikipedia under CC-BY-SA 4.0.
              </div>
              <button className="fo-cta sm outline" style={{ marginTop: 10 }} onClick={() => onRoute('fo-wiki')}>Open full article</button>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

// ---------- Scroller mode (one long ranked feed of everything) ----------
function ScrollerMode() {
  const D = window.MTD;
  // Flatten + rank items. Editorial favourites first, then by clicks, then random.
  const editorial = D.lists.slice(0, 4).flatMap(l =>
    D.shuffled(D.allItems(), l.id).slice(0, 8).map((it, i) => ({ ...it, _bucket: l.title, _rank: i + 1, _hero: l.hero }))
  );
  const restAll = D.allItems().sort((a, b) => (b.clicks30 || 0) - (a.clicks30 || 0));

  return (
    <React.Fragment>
      <section className="fo-hero-mini" style={{ minHeight: 220 }}>
        <div className="fo-hero-mini-img" style={{ backgroundImage: `url(${D.img('scroller-hero', 1920, 400)})` }}></div>
        <div className="fo-hero-mini-inner">
          <div className="meta-strip" style={{ color: '#c1272d' }}>🎲 SCROLLER MODE · ONE LONG FEED · TOP-DOWN</div>
          <h1>Everything, ranked</h1>
        </div>
      </section>

      {/* Editorial top buckets */}
      {D.lists.slice(0, 4).map(l => (
        <section key={l.id} className="fo-section-v2" style={{ paddingTop: 32, paddingBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
            <h3 style={{ fontSize: 18, color: '#c1272d', margin: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.08 }}>
              ★ {l.title}
            </h3>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{l.items} entries · editorial</span>
          </div>
          <div className="fo-list">
            {D.shuffled(D.allItems(), l.id).slice(0, 8).map((it, i) => (
              <div key={l.id + '-' + i} className="fo-list-row">
                <div className={'fo-list-rank' + (i < 3 ? ' top' : '')}>{i + 1}</div>
                <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img(it.id + '-' + l.id, 200, 140)})` }}></div>
                <div>
                  <div className="fo-list-name">{it.name || it.title}</div>
                  <div className="fo-list-meta">{it._kind}{it.dest ? ' · ' + (D.findDest(it.dest)?.name || it.dest) : ''}</div>
                </div>
                <div className="fo-list-tag">{l.title.split(' ').slice(0, 4).join(' ')}</div>
                <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                <span></span>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* The long random tail */}
      <section className="fo-section-v2" style={{ paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14 }}>
          <h3 style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 0.08 }}>
            🎲 Everything else, in random order
          </h3>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{restAll.length} entries</span>
        </div>
        <div className="fo-list">
          {restAll.slice(0, 80).map((it, i) => (
            <div key={'rest-' + i} className="fo-list-row">
              <div className="fo-list-rank">{i + 1}</div>
              <div className="fo-list-thumb" style={{ backgroundImage: `url(${D.img(it.id || ('any-' + i), 200, 140)})` }}></div>
              <div>
                <div className="fo-list-name">{it.name || it.title}</div>
                <div className="fo-list-meta">{it._kind}</div>
              </div>
              <div className="fo-list-tag">{it._kind}</div>
              <IconChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span></span>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
}

Object.assign(window, { FrontWiki, FrontMedia, FrontGuides, FrontRandom, FrontMoroccAI, ScrollerMode });
