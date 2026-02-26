import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getNotifications } from '../services/api';

const NAV_ITEMS = [
  { path: '/swipe', icon: '🔥', label: 'Swipe' },
  { path: '/matches', icon: '💜', label: 'Matches' },
  { path: '/notifications', icon: '🔔', label: 'Alerts' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const res = await getNotifications();
        setHasUnread(res.data.some(n => !n.isRead));
      } catch (e) { /* ignore */ }
    };
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [pathname]);

  // Hide navigation on messages page to avoid overlapping the chat input
  if (pathname.startsWith('/messages/')) {
    return null;
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-h)',
      background: 'rgba(7,4,13,.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(139,92,246,.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 800,
      padding: '0 10px',
    }}>
      {NAV_ITEMS.map(({ path, icon, label }) => {
        const active = pathname === path || pathname.startsWith(path + '/');
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              cursor: 'pointer',
              padding: '6px 20px',
              borderRadius: 14,
              transition: 'all .2s',
              color: active ? 'var(--primary)' : 'var(--muted)',
            }}
          >
            <span style={{ position: 'relative', fontSize: 24, filter: active ? 'drop-shadow(0 0 8px rgba(168,85,247,.7))' : 'none', transition: 'filter .2s' }}>
              {icon}
              {label === 'Alerts' && hasUnread && (
                <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: '#ff2d55', borderRadius: '50%', border: '2px solid rgba(7,4,13,.92)' }} />
              )}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</span>
            {active && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 6px var(--primary)', marginTop: -2 }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
