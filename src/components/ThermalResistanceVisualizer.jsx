import React, { useState, useMemo } from 'react';
import { Thermometer, Wind, ShieldAlert, Layers, Cpu } from 'lucide-react';

const ThermalResistanceVisualizer = () => {
  const [power, setPower] = useState(5.0); // Watts
  const [ambient, setAmbient] = useState(25); // °C
  
  // Resistance values (C/W)
  const [rJC, setRJC] = useState(1.2); // Junction to Case
  const [rCS, setRCS] = useState(0.5); // Case to Sink (TIM)
  const [rSA, setRSA] = useState(15.0); // Sink to Ambient

  const stats = useMemo(() => {
    const totalR = rJC + rCS + rSA;
    const tempRise = power * totalR;
    const junctionTemp = ambient + tempRise;
    
    let status = 'Safe';
    let color = 'var(--success)';
    
    if (junctionTemp > 125) {
      status = 'CRITICAL (FAILURE)';
      color = 'var(--danger)';
    } else if (junctionTemp > 100) {
      status = 'Warning (High)';
      color = 'var(--warning)';
    }
    
    return { totalR, junctionTemp, tempRise, status, color };
  }, [power, ambient, rJC, rCS, rSA]);

  return (
    <div className="si-tool-card fade-in" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
      <div className="si-tool-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="si-tool-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          <Thermometer size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>R<sub>θJA</sub> Stackup Visualizer</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Model the cumulative heat flow path from Silicon to Ambient Air.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 'var(--space-8)', alignItems: 'center' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="zdiff-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={14} /> Power Parameters
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Power Dissipation (W)</label>
                <input 
                  type="number" 
                  value={power} 
                  onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                  style={{ width: '60px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Ambient Temp (°C)</label>
                <input 
                   type="number" 
                   value={ambient} 
                   onChange={(e) => setAmbient(parseFloat(e.target.value) || 0)}
                   style={{ width: '60px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.8rem' }}
                />
              </div>
            </div>
          </div>

          <div className="zdiff-panel" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: '8px', marginTop: '12px' }}>
            <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={14} /> Thermal Resistance (C/W)
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'Rθjc (Junction to Case)', val: rJC, set: setRJC },
                { label: 'Rθcs (Case to Sink/TIM)', val: rCS, set: setRCS },
                { label: 'Rθsa (Sink to Ambient)', val: rSA, set: setRSA }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.label}</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={item.val} 
                    onChange={(e) => item.set(parseFloat(e.target.value) || 0)}
                    style={{ width: '60px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.8rem' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer */}
        <div style={{ position: 'relative', height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Silicon Die */}
          <div style={{ 
            width: '120px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #FF4B2B, #FF416C)', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(255, 65, 108, 0.3)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 4,
            cursor: 'default'
          }}>
            SILICON DIE ({stats.junctionTemp.toFixed(1)}°C)
          </div>
          
          {/* Rjc path */}
          <div style={{ width: '2px', height: '30px', background: `linear-gradient(to bottom, #FF416C, #EF4444)`, opacity: 0.6 }}></div>

          {/* Device Case */}
          <div style={{ 
            width: '160px', 
            height: '30px', 
            background: 'rgba(255,255,255,0.1)', 
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '2px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.65rem',
            color: 'var(--text-secondary)',
            zIndex: 3
          }}>
            DEVICE CASE
          </div>

          {/* Rcs path (TIM) */}
          <div style={{ width: '160px', height: '8px', background: '#4A5568', opacity: 0.8, borderRadius: '2px', margin: '2px 0' }}></div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginBottom: '4px' }}>TIM / Grease</div>

          {/* Heatsink */}
          <div style={{ 
            width: '200px', 
            height: '60px', 
            background: 'linear-gradient(to bottom, #4A5568, #2D3748)', 
            clipPath: 'polygon(0% 0%, 10% 0%, 10% 100%, 20% 100%, 20% 0%, 30% 0%, 30% 100%, 40% 100%, 40% 0%, 50% 0%, 50% 100%, 60% 100%, 60% 0%, 70% 0%, 70% 100%, 80% 100%, 80% 0%, 90% 0%, 90% 100%, 100% 100%, 100% 0%, 0% 0%)',
            zIndex: 2,
            transform: 'rotate(180deg)',
            opacity: 0.9
          }}></div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '-10px' }}>HEATSINK</div>

          {/* Rsa path (Ambient) */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Wind size={24} style={{ color: '#63B3ED', opacity: 0.6 }} />
            <div style={{ fontSize: '0.75rem', color: '#63B3ED' }}>AMBIENT AIR ({ambient}°C)</div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 'var(--space-4)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.totalR.toFixed(1)}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Total Rθja (C/W)</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: 'var(--space-4)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>+{stats.tempRise.toFixed(1)}°</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Total Temp Rise</div>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: 'var(--space-4)', borderRadius: '8px', textAlign: 'center', border: `1px solid ${stats.color}44` }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.color }}>{stats.junctionTemp.toFixed(1)}°C</div>
          <div style={{ fontSize: '0.7rem', color: stats.color, fontWeight: 'bold' }}>{stats.status}</div>
        </div>
      </div>

      <div className="zdiff-verdict zdiff-verdict--info" style={{ marginTop: 'var(--space-4)' }}>
        <div className="zdiff-verdict-icon"><ShieldAlert size={18} /></div>
        <div style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>
          <strong>Engineering Insight:</strong> Reducing <strong>Rθsa</strong> (using a larger heatsink or forced airflow) is the most effective way to lower junction temperature. If Rθjc is high, no amount of heatsinking will help — you must select a component with better internal thermal conductivity.
        </div>
      </div>
    </div>
  );
};

export default ThermalResistanceVisualizer;
