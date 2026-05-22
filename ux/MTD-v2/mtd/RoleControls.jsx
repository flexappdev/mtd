// MTD role controls — role switcher, admin toolbar, gates.
// Three roles: 'guest' | 'user' | 'admin'.
// Roles are global via window.MTD_ROLE; components read it via useRole() hook.

const ROLE_PROFILES = {
  guest: { label: 'Guest',     avatar: '?',  name: 'Visitor' },
  user:  { label: 'User',      avatar: 'A',  name: 'Aïcha Bensalem' },
  admin: { label: 'Admin',     avatar: 'M',  name: 'Mat (admin)' },
};

// hook for any component that needs to react to role changes
function useRole() {
  const [role, setRole] = React.useState(window.MTD_ROLE || 'admin');
  React.useEffect(() => {
    const h = (e) => setRole(e.detail);
    window.addEventListener('mtd-role-change', h);
    return () => window.removeEventListener('mtd-role-change', h);
  }, []);
  return role;
}

// Set role globally + broadcast
function setRole(r) {
  window.MTD_ROLE = r;
  document.body.classList.remove('role-guest', 'role-user', 'role-admin');
  document.body.classList.add('role-' + r);
  window.dispatchEvent(new CustomEvent('mtd-role-change', { detail: r }));
}

// <Gate role="user|admin">children</Gate>
// Renders children if the current role is at-or-above the threshold,
// else renders the fallback (sign-in CTA or whatever).
const ROLE_RANK = { guest: 0, user: 1, admin: 2 };
function Gate({ role: minRole, fallback = null, children }) {
  const role = useRole();
  const ok = ROLE_RANK[role] >= ROLE_RANK[minRole];
  return ok ? <>{children}</> : fallback;
}

// Hidden-by-default for admin-only UI (analytics, drafts, etc.)
function AdminOnly({ children }) {
  const role = useRole();
  if (role !== 'admin') return null;
  return <>{children}</>;
}

function GuestOnly({ children }) {
  const role = useRole();
  if (role !== 'guest') return null;
  return <>{children}</>;
}

// Floating role switcher — bottom-center pill
function RoleSwitcher({ view, onSwitchView }) {
  const role = useRole();
  const roles = ['guest', 'user', 'admin'];

  return (
    <div className="role-switcher">
      <span className="role-switcher-label">Preview as</span>
      {roles.map(r => (
        <button
          key={r}
          className={(role === r ? 'active ' : '') + (r === 'admin' ? 'admin' : '')}
          onClick={() => setRole(r)}>
          {ROLE_PROFILES[r].label}
        </button>
      ))}
      {role === 'admin' && (
        <React.Fragment>
          <span className="divider"></span>
          <button className="view-btn" onClick={onSwitchView}>
            {view === 'front' ? '→ Back office' : '← Front office'}
          </button>
        </React.Fragment>
      )}
    </div>
  );
}

// Admin floating bar (appears on front office for admin role only)
function AdminBar({ pageLabel, stats, onOpenBO }) {
  return (
    <div className="admin-bar">
      <span className="admin-bar-label">Admin · {pageLabel || 'front'}</span>
      {stats && stats.map((s, i) => (
        <button key={i} title={s.title}>
          <IconEye size={12} /> {s.value}
        </button>
      ))}
      <button onClick={() => alert('Inline edit — not wired in mock')}>
        <IconPencil size={12} /> Edit
      </button>
      <button onClick={onOpenBO}>
        <IconLayoutLeft size={12} /> Back office
      </button>
    </div>
  );
}

// Small inline admin "edit" chip
function AdminChip({ children = 'edit' }) {
  return (
    <AdminOnly>
      <span className="admin-chip" onClick={(e) => { e.stopPropagation(); alert('Edit ' + children); }}>
        <IconPencil size={10} /> {children}
      </span>
    </AdminOnly>
  );
}

// Inline admin analytics chip (e.g. "1.2k views")
function AdminStat({ children }) {
  return (
    <AdminOnly>
      <span className="admin-stat">{children}</span>
    </AdminOnly>
  );
}

// LockedSection — wraps content with a sign-in overlay for guest
function LockedSection({ title, body, minRole = 'user', children }) {
  const role = useRole();
  const ok = ROLE_RANK[role] >= ROLE_RANK[minRole];
  if (ok) return <>{children}</>;
  return (
    <div className="fo-lock">
      <div className="fo-lock-inner">{children}</div>
      <div className="fo-lock-overlay">
        <IconEye size={20} />
        <h4>{title || 'Sign in to view'}</h4>
        <p>{body || 'Create a free MTD account to unlock insider tips, save destinations and write reviews.'}</p>
        <button className="fo-cta sm" onClick={() => setRole('user')}>
          Sign in &amp; unlock
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  ROLE_PROFILES, useRole, setRole, Gate, AdminOnly, GuestOnly,
  RoleSwitcher, AdminBar, AdminChip, AdminStat, LockedSection,
});
