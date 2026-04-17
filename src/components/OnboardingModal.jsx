import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, 
  Car, 
  Activity, 
  Zap, 
  Smartphone, 
  Factory, 
  ShieldCheck,
  ChevronRight,
  Cpu
} from 'lucide-react';

const SECTORS = [
  { id: 'Aerospace', title: 'Aerospace & Defense', icon: Rocket, color: '#3b82f6', desc: 'Focus on mission-critical Class 3 reliability standards.' },
  { id: 'Automotive', title: 'Automotive Systems', icon: Car, color: '#ef4444', desc: 'AEC-Q100 compliance and thermal-mechanical ruggedness.' },
  { id: 'Medical', title: 'Medical Electronics', icon: Activity, color: '#10b981', desc: 'Life-critical signal integrity and low-noise diagnostics.' },
  { id: 'Power', title: 'Power & Energy', icon: Zap, color: '#f59e0b', desc: 'High-voltage layout, busbars, and thermal management.' },
  { id: 'Consumer', title: 'Consumer Tech', icon: Smartphone, color: '#a855f7', desc: 'High-density interconnect (HDI) and cost-optimized layout.' },
  { id: 'Industrial', title: 'Industrial Controls', icon: Factory, color: '#6366f1', desc: 'EMI/EMC ruggedness and resilient connectivity solutions.' },
];

export default function OnboardingModal() {
  const { userData, updateProfileData } = useAuth();
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Don't show if not logged in or owner (Owner exclusion is handled in App.jsx but this is a fail-safe)
  if (!userData || userData.isOwner || userData.industry) return null;

  const handleComplete = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError(null);
    
    try {
      const result = await updateProfileData({
        ...userData,
        full_name: userData.name,
        industry: selected
      });
      
      if (!result.success) {
        setError(result.error || "Failed to initialize workspace. Please try again.");
      }
    } catch (err) {
      console.error("Onboarding crash:", err);
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="onboarding-overlay glass-morphism fade-in">
      <div className="onboarding-modal slide-up">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Cpu size={32} className="accent-color" />
            <div className="logo-line" />
            <ShieldCheck size={20} className="verified-color" />
          </div>
          <h1>Welcome, Engineer</h1>
          <p>Please select your primary industrial sector to optimize your Hub experience.</p>
        </div>

        <div className="sectors-grid">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isSelected = selected === sector.id;
            
            return (
              <div 
                key={sector.id} 
                className={`sector-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelected(sector.id)}
                style={{ '--accent': sector.color }}
              >
                <div className="sector-icon">
                  <Icon size={28} />
                </div>
                <div className="sector-info">
                  <h3>{sector.title}</h3>
                  <p>{sector.desc}</p>
                </div>
                <div className="selection-indicator">
                  <CheckCircle size={16} />
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="onboarding-error slide-up">
            <ShieldCheck size={16} className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        <div className="onboarding-footer">
          <button 
            className={`onboarding-submit ${!selected ? 'disabled' : ''}`}
            onClick={handleComplete}
            disabled={!selected || isSaving}
          >
            {isSaving ? (
              <span>PROVISIONING WORKSPACE...</span>
            ) : (
              <>
                <span>INITIALIZE DASHBOARD</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
          <p className="footer-note">Selection can be modified later in your Profile Settings.</p>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ size }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
