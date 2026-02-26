import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister, sendOtp as apiSendOtp } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: 'male', interestedIn: 'both', bio: '', otp: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & Details
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSendOtp = async () => {
    if (!form.email) {
      setError('Please enter your email first.');
      return;
    }
    setLoading(true); setError('');
    try {
      await apiSendOtp(form.email);
      setOtpSent(true);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (step === 1) {
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
    <div className="center" style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(168,85,247,.18) 0%, transparent 60%), var(--bg)', paddingTop: 40, paddingBottom: 40 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>💜</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }} className="grad-text">Join Pulse</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Your perfect match is waiting</p>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
          {error && <div className="alert-error" style={{ marginBottom: 20 }}>{error}</div>}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 1 ? (
              <div className="field">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
              </div>
            ) : (
              <>
                <div style={{ background: 'var(--surface2)', padding: '12px', borderRadius: 12, marginBottom: 8, textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>OTP sent to <strong>{form.email}</strong></p>
                  <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Change Email</button>
                </div>

                <div className="field">
                  <label>Verification Code</label>
                  <input name="otp" placeholder="Enter 6-digit OTP" value={form.otp} onChange={onChange} required maxLength="6" style={{ letterSpacing: '8px', textAlign: 'center', fontSize: 20, fontWeight: 700 }} />
                </div>

                <div className="field">
                  <label>Full Name</label>
                  <input name="name" placeholder="John Doe" value={form.name} onChange={onChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={onChange} required />
                  </div>
                  <div className="field">
                    <label>Age</label>
                    <input type="number" name="age" min="18" max="100" value={form.age} onChange={onChange} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
              </>
            )}

            <button type="submit" className="btn btn-grad" style={{ width: '100%', padding: '14px', marginTop: 4 }} disabled={loading}>
              {loading ? (step === 1 ? 'Sending OTP...' : 'Creating your profile...') : (step === 1 ? 'Get Verification Code' : 'Verify & Create Account ✦')}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--muted)', fontSize: 14 }}>
            Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
