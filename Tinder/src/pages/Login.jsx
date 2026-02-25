import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await apiLogin(form);
      login(res.data.token, res.data.user);
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="center" style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(168,85,247,.18) 0%, transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(236,72,153,.12) 0%, transparent 60%), var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>💜</div>
          <h1 style={{ fontSize: 32, fontWeight: 800 }} className="grad-text">Pulse</h1>
          <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>Find your perfect match</p>
        </div>

        <div className="glass" style={{ padding: '36px 32px' }}>
          <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 24 }}>Welcome back</h2>

          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="field">
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
            </div>
            <button type="submit" className="btn btn-grad" style={{ width: '100%', marginTop: 6, padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In ✦'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)', fontSize: 14 }}>
            No account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
