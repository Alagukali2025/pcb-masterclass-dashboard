import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Info, Layers } from 'lucide-react';

const ViaResonanceCalculator = () => {
  const [stubMil, setStubMil] = useState(40); // 40 mil is a typical short stub
  const [er, setEr] = useState(4.2);        // FR-4 default

  const stats = useMemo(() => {
    // fres = c / (4 * L * sqrt(Er))
    // c ≈ 11802.8 mil/ps (rounded for eng. use to 11800)
    // fres (GHz) = 11800 / (4 * stubMil * sqrt(er)) * 1000? 
    // Wait, let's use units:
    // f = 1 / (4 * (L_mil / 11.8 mil/ps) * sqrt(Er)) 
    // f (THz) if L is mil and c is mil/ps.
    // f (GHz) = 11800 / (4 * stubMil * Math.sqrt(er))
    
    const fres = 11800 / (4 * stubMil * Math.sqrt(er));

    let status = 'Safe';
    let statusColor = 'var(--success)';
    
    if (fres < 10) {
      status = 'Critical High-Speed Risk (Backdrilling Mandatory)';
      statusColor = 'var(--danger)';
    } else if (fres < 25) {
      status = 'Warning (Simulation Advised)';
      statusColor = 'var(--warning)';
    }

    return { fres, status, statusColor };
  }, [stubMil, er]);

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
        <div style={{ padding: 'var(--space-2)', background: 'rgba(212, 150, 58, 0.1)', borderRadius: 'var(--radius-md)', color: '#D4963A' }}>
          <Layers size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Via Stub Resonance Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Stub Length to Resonant Null Analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Stub Length Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Stub Length (mil)
          </label>
          <input 
            type="number" step="1" value={stubMil}
            onChange={(e) => setStubMil(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
          <small style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>Unused via barrel length</small>
        </div>

        {/* Er Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Dielectric Constant (εr)
          </label>
          <input 
            type="number" step="0.1" value={er}
            onChange={(e) => setEr(parseFloat(e.target.value) || 0)}
            style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Result Card */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-5)',
        border: stats.fres < 10 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Quarter-Wave Resonance Null (f_res)</span>
          <span style={{ color: stats.statusColor, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{stats.status}</span>
        </div>

        <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.fres.toFixed(1)} <small style={{ fontSize: '1rem', color: 'var(--text-tertiary)' }}>GHz</small></div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Deep Resonant Absorption Point</div>
        </div>

        <div style={{ marginTop: 'var(--space-5)', padding: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ color: '#D4963A', marginTop: '3px' }}><Info size={16} /></div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            At <strong>{stats.fres.toFixed(1)} GHz</strong>, the via stub acts as a shorted quarter-wave (1/4 wavelength) transmission line, effectively shorting the signal to ground. For interfaces like PCIe Gen 3/4 or DDR5, ensure f_res is significantly above the 3rd harmonic of your Nyquist frequency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViaResonanceCalculator;
