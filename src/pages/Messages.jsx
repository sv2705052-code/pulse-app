import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversation, sendMessage, getUserProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Messages = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const [msgs, setMsgs] = useState([]);
  const [partner, setPartner] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const endRef = useRef(null);

  useEffect(() => {
    load();
  }, [userId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const load = async () => {
    setLoading(true);
    try {
      const [convo, profile] = await Promise.all([
        getConversation(userId),
        getUserProfile(userId).catch(() => null),
      ]);
      setMsgs(convo.data || []);
      if (profile) setPartner(profile.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const send = async e => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await sendMessage(userId, text.trim());
      setMsgs(p => [...p, res.data]);
      setText('');
    } catch (e) { console.error(e); }
  };

  const isMine = msg => {
    const sid = msg.senderUser?._id || msg.senderUser;
    return sid === user?._id;
  };

  const initials = (partner?.name || '?')[0].toUpperCase();
  const bg = `hsl(${(partner?.name?.charCodeAt(0) || 65) * 17 % 360}, 50%, 25%)`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button onClick={() => navigate('/matches')} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>←</button>

        <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', flexShrink: 0, border: '2px solid var(--primary)' }}>
          {partner?.profilePictureUrl
            ? <img src={partner.profilePictureUrl} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initials}
        </div>

        <div>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>{partner?.name || 'Loading…'}</h3>
          <span style={{ fontSize: 12, color: partner?.isOnline ? '#22c55e' : 'var(--muted)' }}>
            {partner?.isOnline ? '● Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading
          ? <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 40 }}>Loading…</p>
          : msgs.length === 0
            ? <div style={{ textAlign: 'center', marginTop: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
              <p style={{ color: 'var(--muted)' }}>No messages yet. Say hi to {partner?.name || 'them'}!</p>
            </div>
            : msgs.map(m => {
              const mine = isMine(m);
              return (
                <div key={m._id || Math.random()} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '72%',
                    padding: '10px 16px',
                    borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: mine ? 'linear-gradient(135deg, #a855f7, #ec4899)' : 'var(--surface2)',
                    color: 'white',
                    border: mine ? 'none' : '1px solid var(--border)',
                    boxShadow: mine ? '0 4px 12px rgba(168,85,247,.3)' : 'none',
                  }}>
                    <p style={{ fontSize: 15, lineHeight: 1.5 }}>{m.content}</p>
                    <p style={{ fontSize: 10, marginTop: 4, opacity: .6, textAlign: mine ? 'right' : 'left' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              );
            })
        }
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} style={{ display: 'flex', gap: 10, padding: '16px 16px 20px', background: 'var(--surface)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={`Message ${partner?.name ?? ''}…`}
          style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 99, padding: '12px 20px', color: 'var(--text)', fontFamily: 'inherit', fontSize: 15 }}
        />
        <button type="submit" disabled={!text.trim()} className="btn btn-grad" style={{ borderRadius: '50%', width: 48, height: 48, padding: 0, fontSize: 20, flexShrink: 0 }}>
          ✈
        </button>
      </form>
    </div>
  );
};

export default Messages;
