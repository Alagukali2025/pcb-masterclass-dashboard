import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Cpu, ShieldCheck, Lock, ChevronRight, Mail, Phone, User as UserIcon, Factory, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    industry: 'Aerospace'
  });

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    alert('Direct login is currently disabled for maintenance. Please use "GOOGLE ACCOUNT" to sign in securely.');
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Supabase handles the redirection to Google automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-container">
      <button 
        className="back-nav-btn slide-up" 
        onClick={() => navigate('/')}
        aria-label="Return to Dashboard"
      >
        <ArrowLeft size={18} />
        <span>Return to Hub</span>
      </button>

      <div className="login-card-wrapper slide-up">
        {/* Card Header Branding */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-hex">
              <Cpu size={32} className="logo-icon-svg" />
            </div>
            <div className="logo-text-group">
              <h1 className="login-title">PCB DESIGN HUB</h1>
              <p className="login-subtitle">SECURE ENGINEERING HUB</p>
            </div>
          </div>
        </div>

        <div className="auth-card glass-morphism">
          <div className="auth-card-inner">
            <h2 className="auth-step-title">
              {mode === 'login' ? 'ENGINEER SIGN IN' : 'CREATE PROFESSIONAL PROFILE'}
            </h2>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {mode === 'login' ? (
                <>
                  <div className="form-group">
                    <label>EMAIL ADDRESS</label>
                    <div className="input-field">
                      <Mail size={18} className="field-icon" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>PASSWORD</label>
                    <div className="input-field">
                      <Lock size={18} className="field-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="forgot-password">
                    <a href="#">FORGOT PASSWORD?</a>
                  </div>

                  <button type="submit" className="auth-main-btn">
                    <span>SIGN IN</span>
                    <LogIn size={20} />
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>FULL NAME</label>
                    <div className="input-field">
                      <UserIcon size={18} className="field-icon" />
                      <input
                        type="text"
                        placeholder="Designer Full Name"
                        value={regData.name}
                        onChange={(e) => setRegData({...regData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>OFFICIAL EMAIL</label>
                    <div className="input-field">
                      <Mail size={18} className="field-icon" />
                      <input
                        type="email"
                        placeholder="name@company.com"
                        value={regData.email}
                        onChange={(e) => setRegData({...regData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>PHONE</label>
                    <div className="input-field">
                      <Phone size={18} className="field-icon" />
                      <input
                        type="tel"
                        placeholder="+1 555..."
                        value={regData.phone}
                        onChange={(e) => setRegData({...regData, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>INDUSTRIAL SECTOR</label>
                    <div className="input-field">
                      <Factory size={18} className="field-icon" />
                      <select
                        value={regData.industry}
                        onChange={(e) => setRegData({...regData, industry: e.target.value})}
                        required
                        className="auth-select"
                      >
                        <option value="Aerospace">Aerospace Sector</option>
                        <option value="Automotive">Automotive Systems</option>
                        <option value="Industrial">Industrial Controls</option>
                        <option value="Military">Defense & Military</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="auth-main-btn">
                    <span>CREATE PROFILE</span>
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Divider */}
              <div className="auth-divider">
                <span className="divider-label">OR CONTINUE WITH</span>
              </div>

              {/* Google Login */}
              <button 
                type="button" 
                className="google-auth-btn"
                onClick={handleGoogleLogin}
              >
                <div className="google-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <span>GOOGLE ACCOUNT</span>
              </button>
            </form>

            <div className="auth-footer">
              {mode === 'login' ? (
                <>
                  <span className="footer-message">NEW TO PCB DESIGN HUB?</span>
                  <button className="auth-switch-btn" onClick={() => setMode('register')}>
                    CREATE ACCOUNT
                  </button>
                </>
              ) : (
                <>
                  <span className="footer-message">ALREADY AN ENGINEER?</span>
                  <button className="auth-switch-btn" onClick={() => setMode('login')}>
                    SIGN IN NOW
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="auth-decorative-stripe"></div>
        </div>

        <p className="auth-copyright">
          © 2026 PCB DESIGN HUB | SECURE ENGINEERING SYSTEMS
        </p>
      </div>
    </div>
  );
}


