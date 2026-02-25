import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import api from '../services/api';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [discoverable, setDiscoverable] = useState(user?.isDiscoverable !== false);
  const [togglingDiscover, setTogglingDiscover] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    interests: user?.interests?.join(', ') || '',
    profilePictureUrl: user?.profilePictureUrl || '',
    city: user?.location?.city || '',
  });

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        bio: form.bio,
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        profilePictureUrl: form.profilePictureUrl,
        ...(form.city && { location: { city: form.city } }),
      });
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally { setSaving(false); }
  };

  const toggleDiscoverable = async () => {
    setTogglingDiscover(true);
    try {
      await api.put('/users/profile', { isDiscoverable: !discoverable });
      setDiscoverable(d => !d);
    } catch (e) { console.error(e); }
    finally { setTogglingDiscover(false); }
  };

  const avatar = form.profilePictureUrl || user?.profilePictureUrl;
  const initials = (user?.name || '?')[0].toUpperCase();

  // Profile completeness
  const checks = {
    photo: !!avatar,
    bio: !!(user?.bio?.trim()),
    interests: !!(user?.interests?.length > 0),
    location: !!(user?.location?.city),
  };
  const pct = Math.round((Object.values(checks).filter(Boolean).length / 4) * 100);

  return (
    <div className="page">
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }} className="grad-text">My Profile</h1>
        <button onClick={logout} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Logout</button>
      </div>

      {/* ─── Profile Completeness Banner ─── */}
      {pct < 100 && (
        <div style={{ background: 'rgba(255,45,85,.08)', border: '1px solid rgba(255,45,85,.25)', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontWeight: 700, fontSize: 14 }}>Complete your profile to appear in searches</p>
            <span style={{ background: 'var(--grad)', borderRadius: 99, padding: '2px 10px', fontSize: 13, fontWeight: 800, color: 'white' }}>{pct}%</span>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--grad)', borderRadius: 99, transition: 'width .5s' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            {[[checks.photo, '📸 Photo'], [checks.bio, '📝 Bio'], [checks.interests, '🏷️ Interests'], [checks.location, '📍 Location']].map(([done, label], i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: done ? 'rgba(34,197,94,.12)' : 'rgba(255,45,85,.1)', color: done ? '#4ade80' : 'var(--primary)', border: `1px solid ${done ? 'rgba(34,197,94,.3)' : 'rgba(255,45,85,.3)'}` }}>
                {done ? '✓' : '○'} {label}
              </span>
            ))}
          </div>
          <button className="btn btn-grad" style={{ marginTop: 14, fontSize: 13, padding: '10px 20px' }} onClick={() => setEditing(true)}>
            Complete Profile →
          </button>
        </div>
      )}

      {/* ─── Discovery Toggle ─── */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>
            {discoverable ? '👀 Visible to others' : '🙈 Hidden from search'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {discoverable ? 'Your profile is showing on the Swipe page' : 'You won\'t appear on anyone\'s swipe page'}
          </p>
        </div>
        <button
          onClick={toggleDiscoverable}
          disabled={togglingDiscover}
          style={{
            width: 52, height: 28, borderRadius: 99, border: 'none', cursor: 'pointer',
            background: discoverable ? 'var(--grad)' : 'var(--surface2)',
            position: 'relative', transition: 'background .3s', flexShrink: 0,
            boxShadow: discoverable ? '0 0 12px var(--glow)' : 'none',
          }}
        >
          <div style={{ position: 'absolute', top: 3, left: discoverable ? 27 : 3, width: 22, height: 22, borderRadius: '50%', background: 'white', transition: 'left .3s', boxShadow: '0 2px 6px rgba(0,0,0,.35)' }} />
        </button>
      </div>

      {/* ─── Avatar ─── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 130, height: 130 }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', padding: 3, background: 'var(--grad)', boxShadow: '0 0 28px var(--glow)' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', background: 'var(--surface2)', border: '3px solid var(--surface)' }}>
              {avatar
                ? <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, fontWeight: 800, background: 'var(--grad)', color: 'white' }}>{initials}</div>
              }
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
            style={{ position: 'absolute', bottom: 4, right: 4, width: 34, height: 34, borderRadius: '50%', background: 'var(--grad)', border: '3px solid var(--bg)', color: 'white', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px var(--glow)' }}
            title="Edit profile"
          >✏️</button>
        </div>

        <h2 style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>{user?.name}</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          {user?.age ? `${user.age} yrs` : ''}{user?.age && user?.location?.city ? ' • ' : ''}{user?.location?.city || ''}
        </p>
      </div>

      {/* ─── Profile Card ─── */}
      <div className="glass" style={{ padding: 24 }}>
        {!editing ? (
          <div>
            <p style={{ fontSize: 15, color: user?.bio ? 'rgba(255,240,243,.75)' : 'var(--muted)', lineHeight: 1.7, marginBottom: 20, fontStyle: user?.bio ? 'normal' : 'italic' }}>
              {user?.bio || 'No bio yet. Click Edit to add one!'}
            </p>

            {user?.interests?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Interests</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.interests.map((t, i) => <span key={i} className="tag">{t}</span>)}
                </div>
              </div>
            )}

            <button className="btn btn-grad" style={{ width: '100%' }} onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18 }}>Edit Profile</h3>

            <div className="field">
              <label>📸 Profile Photo</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                {avatar && (
                  <img src={avatar} alt="Preview" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '2px solid var(--primary)' }} />
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: 13, width: '100%', border: '1px dashed var(--muted)' }}
                    onClick={() => document.getElementById('photo-upload').click()}
                  >
                    📂 Choose from Device
                  </button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm(p => ({ ...p, profilePictureUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>Or paste an image URL below:</p>
                  <input name="profilePictureUrl" placeholder="https://example.com/photo.jpg" value={form.profilePictureUrl} onChange={onChange} style={{ fontSize: 13 }} />
                </div>
              </div>
            </div>

            <div className="field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={onChange} required />
            </div>

            <div className="field">
              <label>📝 Bio — this shows on your card</label>
              <textarea name="bio" rows={4} value={form.bio} onChange={onChange} placeholder="Tell people who you are…" />
            </div>

            <div className="field">
              <label>🏷️ Interests (comma-separated) — helps AI match you better</label>
              <input name="interests" value={form.interests} onChange={onChange} placeholder="Reading, Hiking, Coffee…" />
            </div>

            <div className="field">
              <label>📍 City</label>
              <input name="city" value={form.city} onChange={onChange} placeholder="Mumbai, Delhi, Bangalore…" />
            </div>

            <div style={{ background: 'rgba(255,45,85,.06)', border: '1px dashed rgba(255,45,85,.3)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              💡 <strong style={{ color: 'var(--text)' }}>Tip:</strong> A complete profile with a photo shows up higher and gets way more matches!
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-grad" style={{ flex: 2 }} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
