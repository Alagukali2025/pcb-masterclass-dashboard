import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Info, TrendingDown } from 'lucide-react';

const PITargetCalculator = () => {
  const [voltage, setVoltage] = useState(1.1); // Typical DDR5/Core voltage
  const [ripple, setRipple] = useState(5);   // 5% standard
  const [current, setCurrent] = useState(10); // 10A transient

  const stats = useMemo(() => {
    // Ztarget = (V * Ripple%) / I_transient
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // in mΩ

    let status = 'Standard';
    let statusColor = 'var(--success)';
    
    if (zTarget < 10) {
      status = 'Extreme (Requires VIP/Interposer)';
      statusColor = 'var(--danger)';
    } else if (zTarget < 30) {
      status = 'Challenging (Low-ESL required)';
      statusColor = 'var(--warning)';
    }

    return { vRipple, zTarget, status, statusColor };
  }, [voltage, ripple, current]);

  return (
    <div className="si-tool-card" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      margin: 'var(--space-6) 0',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <div style={{ padding: 'var(--space-2)', background: 'rgba(55, 138, 221, 0.1)', borderRadius: 'var(--radius-md)', color: '#378ADD' }}>
          <TrendingDown size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>PDN Target Impedance Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Power Integrity (PI) Limit Analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Voltage Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Rail Voltage (V)
          </label>
          <input 
            type="number" step="0.1" value={voltage}
            onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Ripple Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Max Ripple (%)
          </label>
          <input 
            type="number" step="1" value={ripple}
            onChange={(e) => setRipple(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>

        {/* Transient Current Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Transient Current (A)
          </label>
          <input 
            type="number" step="1" value={current}
            onChange={(e) => setCurrent(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Result Card */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-5)',
        border: `1px solid ${stats.statusColor}33`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Target Impedance Limit</span>
          <span style={{ color: stats.statusColor, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{stats.status}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.zTarget.toFixed(1)}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>mΩ (Max Z)</div>
          </div>
          <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{(stats.vRipple * 1000).toFixed(0)}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>mV (Budget)</div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ color: '#378ADD', marginTop: '3px' }}><Info size={16} /></div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            PDN Impedance must remain below <strong>{stats.zTarget.toFixed(1)} mΩ</strong> from DC up to the 5th harmonic of the highest switching frequency to prevent rail collapse during high-speed transient events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PITargetCalculator;
