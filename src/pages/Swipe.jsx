import React, { useState, useEffect } from 'react';
import { getSwipeUsers, likeUser, passUser } from '../services/api';

const Swipe = () => {
  const [users, setUsers] = useState([]);
  const [idx, setIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'
  const [matchNotif, setMatchNotif] = useState(null); // { name, photo }

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getSwipeUsers();
      setUsers(res.data || []);
      setIdx(0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const animateThen = (dir, action) => {
    setSwipeDir(dir);
    setTimeout(async () => {
      try {
        const result = await action();
        // Show match notification if both liked each other
        if (result?.data?.match?.isMatched) {
          const matchedUser = users[idx];
          setMatchNotif({ name: matchedUser.name, photo: matchedUser.profilePictureUrl });
          setTimeout(() => setMatchNotif(null), 3500);
        }
      } catch { }
      setSwipeDir(null);
      setIdx(p => p + 1);
    }, 350);
  };

  const handleLike = () => animateThen('right', () => likeUser(users[idx]._id));
  const handlePass = () => animateThen('left', () => passUser(users[idx]._id));

  const cardStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: 400,
    height: 560,
    borderRadius: 28,
    overflow: 'hidden',
    userSelect: 'none',
    transition: 'transform .35s cubic-bezier(.4,0,.2,1), opacity .35s',
    transform: swipeDir === 'right' ? 'translateX(110%) rotate(20deg)' : swipeDir === 'left' ? 'translateX(-110%) rotate(-20deg)' : 'none',
    opacity: swipeDir ? 0 : 1,
    boxShadow: '0 20px 60px rgba(0,0,0,.7)',
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: 'var(--bg)', gap: 20 }}>
      <style>{`
        @keyframes heartbeat {
          0%   { transform: scale(1);    opacity: 1; }
          14%  { transform: scale(1.3);  }
          28%  { transform: scale(1);    }
          42%  { transform: scale(1.2);  }
          70%  { transform: scale(1);    opacity: 1; }
          100% { transform: scale(1);    opacity: 0.6; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
      {/* Heart container */}
      <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--primary)', animation: 'pulse-ring 1.4s ease-out infinite', opacity: 0 }} />
        <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '2px solid var(--primary)', animation: 'pulse-ring 1.4s ease-out infinite .35s', opacity: 0 }} />
        <span style={{ fontSize: 44, animation: 'heartbeat 1.4s ease infinite', display: 'block', lineHeight: 1 }}>❤</span>
      </div>
      {/* Loading bar */}
      <div style={{ width: 200, height: 4, background: 'var(--surface2)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--grad)', borderRadius: 99, animation: 'loading-bar 1.4s ease-in-out infinite' }} />
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>Finding your matches…</p>
      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );

  if (idx >= users.length) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '90dvh', textAlign: 'center', gap: 20 }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800 }}>You've seen everyone!</h2>
      <p style={{ color: 'var(--muted)', maxWidth: 280 }}>Check back soon for new profiles, or refresh to see them again.</p>
      <button className="btn btn-grad" onClick={fetchUsers}>Refresh →</button>
    </div>
  );

  const u = users[idx];
  const bgFallback = `hsl(${(u.name.charCodeAt(0) * 13) % 360}, 60%, 30%)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 20px 100px', minHeight: '100dvh', background: 'radial-gradient(ellipse at 50% -10%, rgba(255,45,85,.15), transparent 60%), var(--bg)' }}>

      {/* ─── Match notification popup ─── */}
      {matchNotif && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7,4,13,.88)', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, animation: 'fadeIn .3s ease' }}>
          <style>{`@keyframes fadeIn { from { opacity:0; } to { opacity:1; } } @keyframes pop { 0%{transform:scale(.7)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }`}</style>
          <div style={{ fontSize: 72, animation: 'pop .5s cubic-bezier(.175,.885,.32,1.275)' }}>💘</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, background: 'linear-gradient(135deg, #ff2d55, #ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>It's a Match!</h2>
          {matchNotif.photo && <img src={matchNotif.photo} alt={matchNotif.name} style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff2d55', boxShadow: '0 0 24px rgba(255,45,85,.6)' }} />}
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>You and <strong style={{ color: 'var(--text)' }}>{matchNotif.name}</strong> liked each other!</p>
          <button className="btn btn-grad" style={{ marginTop: 8 }} onClick={() => setMatchNotif(null)}>Keep Swiping →</button>
        </div>
      )}

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }} className="grad-text">Pulse</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Live</span>
        </div>
      </div>

      {/* Card */}
      <div style={cardStyle}>
        {u.profilePictureUrl
          ? <img src={u.profilePictureUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: bgFallback, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, fontWeight: 800, color: 'rgba(255,255,255,.3)' }}>{u.name[0]}</div>
        }

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(to top, rgba(7,4,13,.97) 0%, rgba(7,4,13,.6) 40%, transparent 100%)' }} />

        {/* Info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px 28px' }}>
          {u.hasLikedMe && (
            <div style={{ display: 'inline-block', background: 'var(--grad)', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, boxShadow: '0 4px 12px rgba(255,45,85,.4)' }}>
              Liked You 💜
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{u.name}</h2>
            <span style={{ fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,.6)' }}>{u.age}</span>
          </div>

          {u.location?.city && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.55)', fontSize: 13, marginBottom: 10 }}>
              <span>📍</span> {u.location.city}{u.location.country ? `, ${u.location.country}` : ''}
            </div>
          )}

          {u.bio && <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', marginBottom: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{u.bio}</p>}

          {u.interests?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {u.interests.slice(0, 4).map((t, i) => (
                <span key={i} style={{ background: 'rgba(168,85,247,.25)', border: '1px solid rgba(168,85,247,.4)', color: '#c4b5fd', padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 30 }}>
        <button onClick={handlePass} style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(255,32,85,.4)', background: 'rgba(255,32,85,.1)', color: '#ff2055', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >✕</button>

        <button onClick={handleLike} style={{ width: 72, height: 72, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', cursor: 'pointer', fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px rgba(168,85,247,.5)', transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >♥</button>

        <button onClick={fetchUsers} style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid rgba(168,85,247,.3)', background: 'rgba(168,85,247,.08)', color: 'var(--muted)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title="Refresh"
        >↺</button>
      </div>

      <p style={{ marginTop: 16, color: 'var(--muted)', fontSize: 12 }}>← Pass &nbsp;|&nbsp; Like ♥ &nbsp;|&nbsp; Refresh ↺</p>
    </div>
  );
};

export default Swipe;
