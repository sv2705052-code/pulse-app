import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister, sendOtp as apiSendOtp, googleLogin as apiGoogleLogin } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: 'male', interestedIn: 'both', bio: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true); setError('');
    try {
      const res = await apiGoogleLogin(credentialResponse.credential);
      login(res.data.token, res.data.user);
      navigate('/swipe');
    } catch (err) {
      setError('Google registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    if (!form.email || !form.name || !form.password || !form.age) {
      setError('Please fill in all required fields before requesting an OTP.');
      return;
    }
    setLoading(true); setError('');
    try {
      await apiSendOtp(form.email);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOtp();
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await apiRegister(form);
      login(res.data.token, res.data.user);
      navigate('/swipe');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const selectStyle = { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', fontFamily: 'inherit', fontSize: 15, width: '100%' };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="center" style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(168,85,247,.18) 0%, transparent 60%), var(--bg)', paddingTop: 40, paddingBottom: 40 }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 6 }}>💜</div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }} className="grad-text">Join Pulse</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Your perfect match is waiting</p>
          </div>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field">
              <label>Full Name</label>
              <input name="name" placeholder="John Doe" value={form.name} onChange={onChange} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Age</label>
                <input type="number" name="age" min="18" max="100" value={form.age} onChange={onChange} required />
              </div>
              <div className="field">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={onChange} style={selectStyle}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Interested In</label>
                <select name="interestedIn" value={form.interestedIn} onChange={onChange} style={selectStyle}>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="both">Everyone</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Bio (optional)</label>
              <textarea name="bio" rows={3} placeholder="Tell people about yourself..." value={form.bio} onChange={onChange} style={{ resize: 'none' }} />
            </div>

            {otpSent && (
              <div className="field" style={{ animation: 'fadeIn .3s ease' }}>
                <label>Verification Code (OTP sent to email)</label>
                <input name="otp" placeholder="Enter 6-digit OTP" value={form.otp} onChange={onChange} required maxLength="6" style={{ letterSpacing: '8px', textAlign: 'center', fontSize: 20, fontWeight: 700, background: 'rgba(168,85,247,.1)', border: '1px solid var(--primary)' }} />
              </div>
            )}

            {!otpSent ? (
              <button type="button" className="btn btn-grad" style={{ width: '100%', padding: '14px', marginTop: 4 }} onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send Verification Code ✦'}
              </button>
            ) : (
              <button type="submit" className="btn btn-grad" style={{ width: '100%', padding: '14px', marginTop: 4 }} disabled={loading}>
                {loading ? 'Creating your profile...' : 'Verify & Create Account ✦'}
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0', color: 'var(--muted)', fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              OR
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Authentication Failed')}
                theme="dark"
                shape="pill"
                size="large"
                width="100%"
              />
            </div>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 14 }}>
            Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
