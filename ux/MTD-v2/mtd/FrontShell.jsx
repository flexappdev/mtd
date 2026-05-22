// MTD Front Office shell (public moroccotopdestinations.com)
// Header, footer, routing wrapper.

function FrontHeader({ route, onRoute, onSwitchView }) {
  const role = useRole();
  const profile = ROLE_PROFILES[role];

  const navItems = [
    { id: 'fo-home',         label: 'Home' },
    { id: 'fo-destinations', label: 'Destinations' },
    { id: 'fo-hotels',       label: 'Hotels' },
    { id: 'fo-regions',      label: 'Regions' },
    { id: 'fo-guides',       label: 'Travel guides' },
  ];
  // user/admin get Saved
  if (role !== 'guest') navItems.push({ id: 'fo-saved', label: 'Saved' });

  return (
    <header className="fo-header">
      <div className="fo-brand" onClick={() => onRoute('fo-home')}>
        <div className="fo-brand-mark">M</div>
        <div className="fo-brand-name">
          Morocco Top Destinations
          <span>moroccotopdestinations.com</span>
        </div>
      </div>

      <nav className="fo-nav">
        {navItems.map(n => (
          <a key={n.id}
             className={route === n.id || route.startsWith(n.id + '/') ? 'active' : ''}
             onClick={() => onRoute(n.id)}>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="fo-search">
        <span className="fo-search-icon"><IconSearch size={14} /></span>
        <input placeholder="Search destinations, hotels…" />
      </div>

      <div className="fo-auth">
        {role === 'guest' && (
          <React.Fragment>
            <button className="fo-cta outline sm" onClick={() => setRole('user')}>Sign in</button>
            <button className="fo-cta sm" onClick={() => setRole('user')}>Sign up</button>
          </React.Fragment>
        )}
        {role === 'user' && (
          <React.Fragment>
            <button className="btn btn-ghost btn-icon" title="Notifications"><IconBell size={16} /></button>
            <div className="fo-avatar" title={profile.name}>{profile.avatar}</div>
          </React.Fragment>
        )}
        {role === 'admin' && (
          <React.Fragment>
            <span className="fo-role-tag admin">Admin</span>
            <button className="btn btn-ghost btn-icon" title="Notifications"><IconBell size={16} /></button>
            <div className="fo-avatar admin" title={profile.name}>{profile.avatar}</div>
          </React.Fragment>
        )}
      </div>
    </header>
  );
}

function FrontFooter() {
  return (
    <footer className="fo-footer">
      <div className="fo-footer-inner">
        <div className="fo-footer-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div className="fo-brand-mark" style={{ width: 28, height: 28, fontSize: 13 }}>M</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Morocco Top Destinations</div>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--foreground-muted)', lineHeight: 1.55, maxWidth: 320 }}>
            Independent travel guide to Morocco. Hotel prices are aggregated from Booking,
            Expedia, Agoda and Awin; product CTAs are Amazon affiliates. Facts &amp; sights
            are sourced from Wikipedia &amp; Wikivoyage under CC-BY-SA.
          </div>
        </div>
        <div className="fo-footer-col">
          <h4>Explore</h4>
          <a>Destinations</a>
          <a>Hotels</a>
          <a>Regions</a>
          <a>Travel guides</a>
          <a>Best of Morocco</a>
        </div>
        <div className="fo-footer-col">
          <h4>Account</h4>
          <a>Sign in</a>
          <a>Create account</a>
          <a>Saved trips</a>
          <a>Help &amp; support</a>
        </div>
        <div className="fo-footer-col">
          <h4>About</h4>
          <a>Editorial policy</a>
          <a>Sources</a>
          <a>Affiliate disclosure</a>
          <a>Privacy</a>
          <a>Contact</a>
        </div>
      </div>
      <div className="fo-footer-bottom">
        <span>© 2026 moroccotopdestinations.com · v1.18.2</span>
        <span>14 destinations · 156 hotels · 5 regions</span>
      </div>
    </footer>
  );
}

Object.assign(window, { FrontHeader, FrontFooter });
