import React, { useState } from 'react';
import {
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  ArrowLeft,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// — password strength helpers —
const requirements = (pw, confirm) => [
  { label: 'Minimum 8 characters', met: pw.length >= 8 },
  { label: 'One number', met: /\d/.test(pw) },
  { label: 'One special character', met: /[!@#$%^&*]/.test(pw) },
  { label: 'Passwords match', met: pw === confirm && pw.length > 0 },
];
const strength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[!@#$%^&*]/.test(pw)) s++;
  return s; // 0–4
};
const strengthLabel = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
const strengthColor = { 0: 'var(--bg-tertiary)', 1: '#ef4444', 2: '#f59e0b', 3: '#3b82f6', 4: '#10b981' };

export default function ProfileMenu({ userData, logout, theme, toggleTheme, onClose }) {
  const navigate = useNavigate();
  const { changePassword } = useAuth();
  // views: 'main' | 'settings' | 'change-password'
  const [activeView, setActiveView] = useState('main');

  // change-password state
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState(null); // 'success' | 'error' | null
  const [pwError, setPwError] = useState('');

  if (!userData) return null;

  const reqs = requirements(newPw, confirmPw);
  const allMet = reqs.every(r => r.met);
  const pwStrength = strength(newPw);

  const handleChangePassword = async () => {
    if (!allMet) return;
    setPwLoading(true);
    setPwStatus(null);
    const result = await changePassword(newPw);
    setPwLoading(false);
    if (result.success) {
      setPwStatus('success');
      setTimeout(() => setActiveView('settings'), 2000);
    } else {
      setPwStatus('error');
      setPwError(result.error || 'Failed to update password.');
    }
  };

  const resetPwForm = () => {
    setNewPw(''); setConfirmPw('');
    setShowPw(false); setPwStatus(null); setPwError('');
  };

  // ── MAIN VIEW ────────────────────────────────────────────────
  const renderMainView = () => (
    <div className="menu-view fade-in">
      <div className="menu-header">
        <div className={`menu-avatar-large ${userData.isOwner ? 'owner-avatar' : ''}`}
          style={{ position: 'relative' }}>
          {userData.picture
            ? <img src={userData.picture} alt="" className="user-avatar-img" />
            : (userData.initials || '??')}
          {userData.isOwner && (
            <div className={`owner-rank-badge ${theme === 'light' ? 'light' : ''}`}>
              <ShieldCheck size={10} /><span>Owner</span>
            </div>
          )}
        </div>
        <div className="menu-user-info">
          <div className="menu-user-row">
            <span className="menu-user-name">{userData.name}</span>
          </div>
          <span className="menu-user-email">{userData.email}</span>
        </div>
      </div>

      <div className="menu-body">
        <div className="menu-group-label">Account Management</div>

        <div className="menu-item" onClick={() => { navigate('/profile', { state: { from: '/', fromLabel: 'Dashboard' } }); onClose(); }}>
          <User size={18} /><span>My Profile</span>
          <ChevronRight size={14} className="menu-chevron" />
        </div>

        <div className="menu-item" onClick={() => setActiveView('settings')}>
          <Settings size={18} /><span>Settings</span>
          <ChevronRight size={14} className="menu-chevron" />
        </div>

        <div className="menu-divider" />

        <div className="menu-item logout" onClick={() => { logout(); onClose(); }}>
          <LogOut size={18} /><span>Log out</span>
        </div>
      </div>
    </div>
  );

  // ── SETTINGS VIEW ────────────────────────────────────────────
  const renderSettingsView = () => (
    <div className="menu-view slide-in-right">
      <div className="menu-sub-header">
        <button className="back-btn" onClick={() => setActiveView('main')}><ArrowLeft size={18} /></button>
        <h3>Settings</h3>
      </div>
      <div className="menu-body">
        <div className="menu-group-label">Preferences</div>

        <div className="menu-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <div className="menu-item-content">
            <span>Display Mode</span>
            <span className="menu-item-subtext">{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
          </div>
          <div className={`toggle-indicator ${theme === 'light' ? 'active' : ''}`} />
        </div>

        <div className="menu-item disabled">
          <Bell size={18} />
          <div className="menu-item-content">
            <span>Notifications</span>
            <span className="menu-item-subtext">Email & Push alerts</span>
          </div>
          <div className="toggle-indicator" />
        </div>

        <div className="menu-divider" />
        <div className="menu-group-label">Security</div>

        <div className="menu-item" onClick={() => { resetPwForm(); setActiveView('change-password'); }}>
          <Shield size={18} />
          <div className="menu-item-content">
            <span>Change Password</span>
            <span className="menu-item-subtext">Update your login password</span>
          </div>
          <ChevronRight size={14} className="menu-chevron" />
        </div>
      </div>
    </div>
  );

  // ── CHANGE PASSWORD VIEW ──────────────────────────────────────
  const renderChangePasswordView = () => (
    <div className="menu-view slide-in-right">
      <div className="menu-sub-header">
        <button className="back-btn" onClick={() => { resetPwForm(); setActiveView('settings'); }}>
          <ArrowLeft size={18} />
        </button>
        <h3>Change Password</h3>
      </div>

      {pwStatus === 'success' ? (
        <div className="pw-success-state">
          <CheckCircle2 size={40} className="pw-success-icon" />
          <p className="pw-success-text">Password updated!</p>
          <span className="pw-success-sub">Returning to settings…</span>
        </div>
      ) : (
        <div className="menu-body">
          {/* New Password */}
          <div className="pw-field-group">
            <label className="pw-label">New Password</label>
            <div className="pw-input-wrap">
              <Lock size={14} className="pw-field-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                className="pw-input"
                autoComplete="new-password"
              />
              <button className="pw-toggle-btn" onClick={() => setShowPw(v => !v)} type="button">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {/* Strength bar */}
            {newPw.length > 0 && (
              <div className="pw-strength-row">
                <div className="pw-strength-bar">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="pw-strength-seg"
                      style={{ background: i <= pwStrength ? strengthColor[pwStrength] : 'var(--bg-tertiary)' }} />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: strengthColor[pwStrength] }}>
                  {strengthLabel[pwStrength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="pw-field-group">
            <label className="pw-label">Confirm Password</label>
            <div className="pw-input-wrap">
              <KeyRound size={14} className="pw-field-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="pw-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="pw-checklist">
            {reqs.map((r, i) => (
              <div key={i} className={`pw-check-item ${r.met ? 'met' : ''}`}>
                {r.met ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {pwStatus === 'error' && (
            <div className="pw-error-msg">
              <AlertCircle size={14} /><span>{pwError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            className={`pw-submit-btn ${!allMet || pwLoading ? 'disabled' : ''}`}
            onClick={handleChangePassword}
            disabled={!allMet || pwLoading}
          >
            {pwLoading ? <><RefreshCw size={14} className="spin" /><span>Updating…</span></> : <><Shield size={14} /><span>Update Password</span></>}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="profile-menu-overlay glass-morphism">
      {activeView === 'main'            && renderMainView()}
      {activeView === 'settings'        && renderSettingsView()}
      {activeView === 'change-password' && renderChangePasswordView()}
    </div>
  );
}
