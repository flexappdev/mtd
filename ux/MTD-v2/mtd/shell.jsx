// MTD common components: Shell, Header, Sidebar, status badges, region chips, etc.

function StatusBadge({ s }) {
  const map = {
    live:    { cls: 'live',    dot: 'var(--success)',     label: 'Live' },
    preview: { cls: 'preview', dot: 'var(--info)',        label: 'Preview' },
    draft:   { cls: 'neutral', dot: 'var(--foreground-muted)', label: 'Draft' },
    qa:      { cls: 'warn',    dot: 'var(--warning)',     label: 'QA' },
    fail:    { cls: 'fail',    dot: 'var(--destructive)', label: 'Failed' },
    fresh:   { cls: 'live',    dot: 'var(--success)',     label: 'Fresh' },
    stale:   { cls: 'warn',    dot: 'var(--warning)',     label: 'Stale' },
    warn:    { cls: 'warn',    dot: 'var(--warning)',     label: 'Rate-limited' },
    pending: { cls: 'neutral', dot: 'var(--foreground-muted)', label: 'Pending' },
    'in-review': { cls: 'preview', dot: 'var(--info)', label: 'In review' },
    queued:  { cls: 'neutral', dot: 'var(--foreground-muted)', label: 'Queued' },
  }[s] || { cls: 'neutral', dot: 'var(--foreground-muted)', label: s };
  return (
    <span className={'badge ' + map.cls}>
      <span className="badge-dot" style={{ background: map.dot }}></span>{map.label}
    </span>
  );
}

function RegionChip({ region, size = 'sm', showLabel = true }) {
  const r = window.MTD.findRegion(region);
  if (!r) return null;
  return (
    <span className="ws-label">
      <span className={`ws-chip ${size === 'sm' ? 'ws-chip-sm' : ''} region-${r.accent}`}>{r.letter}</span>
      {showLabel && r.name}
    </span>
  );
}

function DestThumb({ d, size = 'md' }) {
  const r = window.MTD.findRegion(d.region);
  const cls = size === 'lg' ? 'dest-thumb lg' : size === 'sm' ? 'dest-thumb sm' : 'dest-thumb';
  const style = {
    '--thumb-from': d.thumb?.[0] || r.thumb[0],
    '--thumb-to':   d.thumb?.[1] || r.thumb[1],
  };
  return <div className={cls} style={style}><span>{d.initial}</span></div>;
}

function VendorPill({ kind, value }) {
  return (
    <span className={'vendor ' + kind}>
      <span className="vendor-dot"></span>
      {value !== undefined ? value : kind}
    </span>
  );
}

// Sparkline of N pseudo-random heights, seeded from a string for stability.
function seededHeights(seed, n = 14) {
  let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    out.push(15 + (h % 80));
  }
  return out;
}

function Sparkline({ seed = 'x', n = 14, trend, width = 80 }) {
  const heights = seededHeights(seed, n);
  // Optionally tilt heights to convey a trend
  if (trend === 'up')    heights[heights.length - 1] = Math.max(85, heights[heights.length - 1]);
  if (trend === 'down')  heights[heights.length - 1] = Math.min(25, heights[heights.length - 1]);
  return (
    <span className={'spark ' + (trend === 'up' ? 'up' : trend === 'down' ? 'down' : '')} style={{ width }}>
      {heights.map((h, i) => <span key={i} style={{ height: `${h}%` }}></span>)}
    </span>
  );
}

function formatEUR(n) {
  if (!n) return '—';
  return '€' + n.toLocaleString('en-US');
}
function formatNum(n) {
  if (n === undefined || n === null) return '—';
  return n.toLocaleString('en-US');
}

// ---------- Header ----------
function Header({ onNewIdea }) {
  return (
    <header className="hd">
      <div className="hd-ctx">
        <span className="type-meta">Morocco Top Destinations</span>
        <IconChevronRight size={14} style={{ opacity: 0.5, margin: '0 2px' }} />
        <span className="type-meta" style={{ color: 'var(--foreground-subtle)' }}>moroccotopdestinations.com</span>
      </div>

      <div className="hd-search">
        <IconSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.55 }} />
        <input className="input" style={{ paddingLeft: 32, height: 32, fontSize: 12.5 }}
               placeholder="Search destinations, hotels, ideas…" />
        <span className="kbd">⌘K</span>
      </div>

      <div className="hd-actions">
        <button className="btn btn-secondary btn-sm" onClick={onNewIdea}>
          <IconPlus size={14} /> New idea
        </button>
        <button className="btn btn-ghost btn-icon" aria-label="notifications"><IconBell size={16} /></button>
        <button className="btn btn-ghost btn-icon" aria-label="theme" onClick={() => {
          const root = document.documentElement;
          root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
        }}><IconMoon size={16} /></button>
        <div className="avatar">M</div>
      </div>
    </header>
  );
}

// ---------- Sidebar ----------
function Sidebar({ route, onRoute }) {
  const items = [
    { id: 'dashboard',    label: 'Dashboard',    Icon: IconDashboard },
    { id: 'destinations', label: 'Destinations', Icon: IconMap },
    { id: 'hotels',       label: 'Hotels',       Icon: IconBed },
    { id: 'amazon',       label: 'Amazon CTAs',  Icon: IconShoppingBag },
    { id: 'sources',      label: 'Sources',      Icon: IconBookOpen },
    { id: 'agents',       label: 'Agents',       Icon: IconBot },
    { id: 'ideas',        label: 'Ideas',        Icon: IconLightbulb },
  ];
  const bottom = [{ id: 'settings', label: 'Settings', Icon: IconSettings }];

  return (
    <aside className="sb">
      <div className="sb-brand">
        <div className="sb-mark">M</div>
        <div className="sb-name">MTD <span>back office</span></div>
      </div>

      <div className="sb-group">
        <div className="type-eyebrow" style={{ padding: '0 10px 6px' }}>MAIN</div>
        {items.map(({ id, label, Icon }) => (
          <a key={id}
             className={'nav-item' + (route === id ? ' active' : '')}
             onClick={() => onRoute(id)}>
            <Icon size={16} /> <span className="nav-label">{label}</span>
          </a>
        ))}
      </div>

      <div className="sb-group">
        <div className="type-eyebrow" style={{ padding: '0 10px 6px' }}>PINNED</div>
        <a className="nav-item" onClick={() => onRoute('dest:marrakech')}>
          <span className="ws-chip ws-chip-sm region-imperial">I</span> <span className="nav-label">marrakech</span>
        </a>
        <a className="nav-item" onClick={() => onRoute('dest:chefchaouen')}>
          <span className="ws-chip ws-chip-sm region-mediterranean">N</span> <span className="nav-label">chefchaouen</span>
        </a>
        <a className="nav-item" onClick={() => onRoute('dest:merzouga')}>
          <span className="ws-chip ws-chip-sm region-sahara">S</span> <span className="nav-label">merzouga</span>
        </a>
      </div>

      <div style={{ flex: 1 }} />

      <div className="sb-group">
        {bottom.map(({ id, label, Icon }) => (
          <a key={id} className={'nav-item' + (route === id ? ' active' : '')} onClick={() => onRoute(id)}>
            <Icon size={16} /> <span className="nav-label">{label}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

// ---------- AppShell ----------
function AppShell({ route, onRoute, children, rightPanel, collapsed }) {
  return (
    <div className={'shell' + (collapsed ? ' collapsed' : '')}>
      <Header onNewIdea={() => alert('New idea — not wired in mock')} />
      <Sidebar route={route} onRoute={onRoute} />
      <main className="main">
        <div className={'main-inner' + (rightPanel ? ' with-panel' : '')}>
          <div className="main-content">{children}</div>
          {rightPanel && <aside className="util">{rightPanel}</aside>}
        </div>
      </main>
      <footer className="ft">
        <span><span className="pulse"></span> env: <span className="mono">production</span></span>
        <span>build <span className="mono">v1.18.2 · 4172</span></span>
        <span>14 destinations · 5 regions · 8 agents · 156 hotels</span>
      </footer>
    </div>
  );
}

Object.assign(window, {
  StatusBadge, RegionChip, DestThumb, VendorPill, Sparkline,
  formatEUR, formatNum, Header, Sidebar, AppShell,
});
