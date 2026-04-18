import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export default function RegisterForm() {
  const { register } = useAuth();
  const { pushToast } = useNotifications();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';

    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      pushToast('Account created! Welcome to NexusShop.', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: msg });
      pushToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 'weak', label: 'Weak' };
    if (score === 2) return { level: 'fair', label: 'Fair' };
    if (score === 3) return { level: 'good', label: 'Good' };
    return { level: 'strong', label: 'Strong' };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <Link to="/" className="auth-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">NEXUS<span className="logo-accent">shop</span></span>
        </Link>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join NexusShop and start exploring</p>
      </div>

      {/* Form */}
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <div className="auth-error-banner">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.general}
          </div>
        )}

        {/* Name */}
        <div className={`auth-field ${errors.name ? 'has-error' : ''}`}>
          <label className="auth-label" htmlFor="name">Full Name</label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <input
              id="name"
              name="name"
              type="text"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              autoFocus
            />
          </div>
          {errors.name && <p className="auth-field-error">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className={`auth-field ${errors.email ? 'has-error' : ''}`}>
          <label className="auth-label" htmlFor="email">Email</label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="auth-field-error">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className={`auth-field ${errors.password ? 'has-error' : ''}`}>
          <label className="auth-label" htmlFor="password">Password</label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {strength && (
            <div className="password-strength">
              <div className="strength-bars">
                {['weak', 'fair', 'good', 'strong'].map((lvl, i) => (
                  <div
                    key={lvl}
                    className={`strength-bar ${
                      ['weak', 'fair', 'good', 'strong'].indexOf(strength.level) >= i ? `active ${strength.level}` : ''
                    }`}
                  />
                ))}
              </div>
              <span className={`strength-label ${strength.level}`}>{strength.label}</span>
            </div>
          )}
          {errors.password && <p className="auth-field-error">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className={`auth-field ${errors.confirm ? 'has-error' : ''}`}>
          <label className="auth-label" htmlFor="confirm">Confirm Password</label>
          <div className="auth-input-wrapper">
            <svg className="auth-input-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="confirm"
              name="confirm"
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {form.confirm && form.password === form.confirm && (
              <span className="auth-input-check">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
          </div>
          {errors.confirm && <p className="auth-field-error">{errors.confirm}</p>}
        </div>

        {/* Submit */}
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? <span className="auth-spinner" /> : 'Create Account'}
        </button>

        <p className="auth-terms">
          By creating an account you agree to our{' '}
          <Link to="/terms" className="auth-link">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/privacy" className="auth-link">Privacy Policy</Link>.
        </p>
      </form>

      {/* Footer */}
      <p className="auth-switch">
        Already have an account?{' '}
        <Link to="/login" className="auth-switch-link">Sign in</Link>
      </p>
    </div>
  );
}