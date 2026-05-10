import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function IconGroups() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function IconKeyboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="10" x2="6" y2="10" />
      <line x1="10" y1="10" x2="10" y2="10" />
      <line x1="14" y1="10" x2="14" y2="10" />
      <line x1="18" y1="10" x2="18" y2="10" />
      <line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  );
}

function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: 'G', desc: 'Buka halaman Grup' },
    { key: 'H', desc: 'Buka Dashboard (Home)' },
    { key: 'N', desc: 'Buat Grup / Task baru' },
    { key: 'D', desc: 'Toggle Dark Mode' },
    { key: 'Esc', desc: 'Kembali ke halaman sebelumnya' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 380 }}>
        <div className="modal-title">⌨️ Keyboard Shortcuts</div>
        <p className="modal-text">Shortcut aktif saat tidak sedang mengetik di kolom input.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {shortcuts.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
              <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{s.desc}</span>
              <kbd style={{
                background: 'var(--gray-100)', border: '1px solid var(--gray-300)',
                borderRadius: 6, padding: '2px 10px', fontSize: 12,
                fontFamily: "'DM Mono', monospace", fontWeight: 600, color: 'var(--gray-700)'
              }}>
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="modal-actions" style={{ marginTop: 20 }}>
          <button className="btn btn-primary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [showShortcuts, setShowShortcuts] = useState(false);

  useKeyboardShortcuts({ onToggleDark: toggle });

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="app-layout">
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}

      <aside className="sidebar desktop-only">
        <div className="sidebar-header">
          <div className="sidebar-logo">Study<span>Group</span></div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/groups" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <IconGroups />
            Grup Saya
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <IconDashboard />
            Tugas Saya
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', gap: 6, padding: '0 10px', marginBottom: 8 }}>
            <button
              className="sidebar-icon-btn"
              onClick={toggle}
              title={`${theme === 'dark' ? 'Light' : 'Dark'} mode (D)`}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <button
              className="sidebar-icon-btn"
              onClick={() => setShowShortcuts(true)}
              title="Keyboard shortcuts"
            >
              <IconKeyboard />
            </button>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-name">{user?.name}</div>
            <button className="logout-btn" onClick={handleLogout} title="Keluar">
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-header mobile-only">
          <div className="sidebar-logo">Study<span>Group</span></div>
        </div>
        <div className="scroll-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
