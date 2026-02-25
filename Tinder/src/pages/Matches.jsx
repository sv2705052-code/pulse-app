import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, getAiAnalysis } from '../services/api';

const MatchCard = ({ match, onMessage }) => {
  const [ai, setAi] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const u = match.otherUser;

  const runAI = async () => {
    if (ai) { setOpen(o => !o); return; }
    setAiLoading(true);
    try {
      const res = await getAiAnalysis(match._id);
      setAi(res.data);
      setOpen(true);
    } catch (e) {
      console.error(e);
      setAi({ error: 'AI analysis failed. Make sure the Gemini key is set.' });
      setOpen(true);
    } finally { setAiLoading(false); }
  };

  const initials = (u?.name || '?')[0].toUpperCase();
  const bg = `hsl(${(u?.name?.charCodeAt(0) * 17) % 360}, 50%, 25%)`;

  return (
    <div className="glass" style={{ overflow: 'hidden', marginBottom: 16 }}>
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', gap: 16 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', border: '2px solid var(--primary)' }}>
            {u?.profilePictureUrl
              ? <img src={u.profilePictureUrl} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          {u?.isOnline && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg)', boxShadow: '0 0 6px #22c55e' }} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 2 }}>{u?.name || 'Unknown'}</h3>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Matched {new Date(match.matchedAt).toLocaleDateString()}</p>
        </div>

        <button className="btn btn-grad" style={{ padding: '8px 18px', fontSize: 13 }} onClick={() => onMessage(u._id)}>
          💬 Chat
        </button>
      </div>

      {/* AI button */}
      <div style={{ padding: '0 20px 16px' }}>
        <button
          onClick={runAI}
          disabled={aiLoading}
          style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px dashed rgba(168,85,247,.5)', background: 'rgba(168,85,247,.08)', color: '#c4b5fd', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}
        >
          {aiLoading ? '✨ Analyzing compatibility…' : open ? '▲ Hide AI Analysis' : '🪄 Run AI Compatibility Analysis'}
        </button>
      </div>

      {/* AI Results */}
      {open && ai && !ai.error && (
        <div style={{ margin: '0 16px 16px', padding: 20, borderRadius: 16, background: 'rgba(168,85,247,.07)', border: '1px solid rgba(168,85,247,.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontWeight: 800, fontSize: 16 }}>Compatibility Report</h4>
            <div style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 99, padding: '4px 14px', fontSize: 22, fontWeight: 900, color: 'white' }}>
              {ai.matchPercentage}%
            </div>
          </div>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.6, marginBottom: 16 }}>{ai.compatibilitySummary}</p>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--muted)', marginBottom: 10 }}>Conversation Starters</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ai.conversationStarters?.map((s, i) => (
                <div key={i} style={{ padding: '10px 14px', background: 'var(--surface2)', borderRadius: 10, fontSize: 13, borderLeft: '3px solid var(--primary)', fontStyle: 'italic', color: 'rgba(255,255,255,.75)' }}>
                  "{s}"
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.25)', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f9a8d4', marginBottom: 4 }}>💡 AI Advice</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{ai.advice}</p>
          </div>
        </div>
      )}

      {open && ai?.error && (
        <div className="alert-error" style={{ margin: '0 16px 16px' }}>{ai.error}</div>
      )}
    </div>
  );
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMatches();
        setMatches(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80dvh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading matches…</p>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800 }} className="grad-text">Your Matches</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{matches.length} connection{matches.length !== 1 ? 's' : ''}</p>
      </div>

      {matches.length === 0 ? (
        <div className="glass" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>💜</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>No matches yet</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Keep swiping — your person is out there!</p>
          <button className="btn btn-grad" onClick={() => navigate('/swipe')}>Start Swiping →</button>
        </div>
      ) : (
        matches.map(m => <MatchCard key={m._id} match={m} onMessage={userId => navigate(`/messages/${userId}`)} />)
      )}
    </div>
  );
};

export default Matches;
