import React, { useState, useMemo } from 'react';
import { Activity, Thermometer, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';

const DDRTimingCalculator = () => {
  const [generation, setGeneration] = useState('DDR4');
  const [mts, setMts] = useState(3200);
  const [skewMil, setSkewMil] = useState(25);
  const [er, setEr] = useState(4.2); // Default for FR-4

  const generations = {
    DDR3: { minMts: 800, maxMts: 2133, defaultMts: 1600, color: '#0ea5e9' },
    DDR4: { minMts: 1600, maxMts: 3200, defaultMts: 2400, color: '#f59e0b' },
    DDR5: { minMts: 3200, maxMts: 6400, defaultMts: 4800, color: '#ef4444' }
  };

  const stats = useMemo(() => {
    // UI = Unit Interval (Bit Time) in ps. UI = 1 / (DataRate * 10^6) seconds.
    // In ps: UI = 1,000,000 / mts
    const ui = 1000000 / mts;
    
    // Vp = Prop Velocity mil/ps
    // Vp = c / sqrt(Er) where c ≈ 11.8 mil/ps (in vacuum)
    // For standard Stripline: Vp ≈ 11.8 / sqrt(4.5) ≈ 5.6 mil/ps
    // For standard Microstrip: Vp ≈ 11.8 / sqrt(3.3) ≈ 6.5 mil/ps
    // Using a mid-range stripline default:
    const vp = 11.8 / Math.sqrt(er);
    
    const skewPs = skewMil / vp;
    const closurePct = (skewPs / ui) * 100;
    
    let status = 'Safe';
    let statusColor = 'var(--success)';
    if (closurePct > 15) {
      status = 'Critical Failure Risk';
      statusColor = 'var(--danger)';
    } else if (closurePct > 5) {
      status = 'Marginal - Simulation Required';
      statusColor = 'var(--warning)';
    }

    return { ui, skewPs, closurePct, status, statusColor, vp };
  }, [mts, skewMil, er]);

  const handleGenChange = (gen) => {
    setGeneration(gen);
    setMts(generations[gen].defaultMts);
  };

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
        <div style={{ padding: 'var(--space-2)', background: 'var(--accent-light)', borderRadius: 'var(--radius-md)', color: 'var(--accent-hover)' }}>
          <Activity size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>DDR Timing Margin Calculator</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Advanced Skew-to-UI Eye Closure Analysis</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Generation Toggle */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>DDR Generation</label>
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-primary)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            {Object.keys(generations).map(gen => (
              <button
                key={gen}
                onClick={() => handleGenChange(gen)}
                style={{
                  flex: 1,
                  padding: 'var(--space-2) var(--space-1)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: generation === gen ? generations[gen].color : 'transparent',
                  color: generation === gen ? 'white' : 'var(--text-tertiary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {gen}
              </button>
            ))}
          </div>
        </div>

        {/* MT/s Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Data Rate (MT/s)
          </label>
          <input 
            type="range" 
            min={generations[generation].minMts} 
            max={generations[generation].maxMts} 
            step={200}
            value={mts}
            onChange={(e) => setMts(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: generations[generation].color }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginTop: 'var(--space-1)' }}>
            <span style={{ color: generations[generation].color }}>{mts} MT/s</span>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>UI: {stats.ui.toFixed(1)} ps</span>
          </div>
        </div>

        {/* PCB Skew Input */}
        <div className="input-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Total PCB Skew (mil)
          </label>
          <input 
            type="number"
            value={skewMil}
            onChange={(e) => setSkewMil(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: '100%',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2) var(--space-3)',
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          />
          <p style={{ margin: 'var(--space-1) 0 0', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Electrical Delay: <strong>{stats.skewPs.toFixed(1)} ps</strong>
          </p>
        </div>
      </div>

      {/* Result Gauge */}
      <div style={{ 
        background: 'var(--bg-primary)', 
        borderRadius: 'var(--radius-lg)', 
        padding: 'var(--space-5)',
        border: `1px solid ${stats.statusColor}33`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Eye Closure Analysis</span>
          <span style={{ color: stats.statusColor, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stats.status}</span>
        </div>
        
        <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
          <div style={{ 
            height: '100%', 
            width: `${Math.min(100, stats.closurePct)}%`, 
            background: stats.statusColor,
            boxShadow: `0 0 10px ${stats.statusColor}66`,
            transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.closurePct.toFixed(1)}%</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Window Compaction (UI)</div>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.ui - stats.skewPs).toFixed(1)}ps</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Residual Data Eye</div>
          </div>
        </div>

        {stats.closurePct > 10 && (
          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <ShieldAlert size={18} color="var(--danger)" />
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              <strong>Caution:</strong> Skew consumes over 10% of bit time. This significantly reduces setup/hold margin after accounting for controller jitter and crosstalk.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-4)', fontSize: '0.7rem', color: 'var(--text-tertiary)', textAlign: 'right', fontStyle: 'italic' }}>
        *Calculated using Vp = {stats.vp.toFixed(1)} mil/ps (Stripline @ Er={er})
      </div>
    </div>
  );
};

export default DDRTimingCalculator;
