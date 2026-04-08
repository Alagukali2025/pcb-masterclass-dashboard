import React, { useState, useMemo } from 'react';
import { Thermometer, Zap, Info, ShieldAlert, Layers, Wind } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const ThermalAnalysisTool = () => {
  // Via Thermal Inputs
  const [thicknessMil, setThicknessMil] = useState(62);
  const [drillMil, setDrillMil] = useState(10);
  const [platingUm, setPlatingUm] = useState(25); // 1 mil ≈ 25um
  
  // Relief Inputs
  const [padMil, setPadMil] = useState(40);
  const [spokeWidthMil, setSpokeWidthMil] = useState(10);
  const [spokeCount, setSpokeCount] = useState(4);

  const stats = useMemo(() => {
    // 1. Via Thermal Resistance
    // Rth = h / (k * A)
    // k_cu = 400 W/m-K
    // h_m = thicknessMil * 2.54e-5
    // A_m2 = pi * d_m * t_m 
    const h_m = thicknessMil * 2.54e-5;
    const d_m = drillMil * 2.54e-5;
    const t_m = platingUm * 1e-6;
    const area_m2 = Math.PI * d_m * t_m;
    const rThVia = h_m / (400 * area_m2);

    // 2. Thermal Relief Efficiency
    // Ratio of copper connection to full perimeter
    const perimeter = Math.PI * (padMil * 2.54e-5);
    const totalSpokeWidth = spokeCount * (spokeWidthMil * 2.54e-5);
    const reliefEfficiency = (totalSpokeWidth / perimeter) * 100;

    let reliefStatus = 'Balanced';
    let reliefColor = 'var(--success)';
    if (reliefEfficiency > 60) {
      reliefStatus = 'High (Solderability Risk)';
      reliefColor = 'var(--danger)';
    } else if (reliefEfficiency < 15) {
      reliefStatus = 'Low (Thermal Isolation Risk)';
      reliefColor = 'var(--warning)';
    }

    return { rThVia, reliefEfficiency, reliefStatus, reliefColor };
  }, [thicknessMil, drillMil, platingUm, padMil, spokeWidthMil, spokeCount]);

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
        <div style={{ padding: 'var(--space-2)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', color: '#EF4444' }}>
          <Thermometer size={24} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Thermal & Heat Dissipation Solver</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Copper & Via Thermal Path Engineering</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* Via Thermal Path Panel */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> Via Thermal Resistance
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <EngineeringInput
              label="Plating Thickness"
              unit="µm"
              value={platingUm}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setPlatingUm(parseFloat(val));
              }}
              step="1"
            />
            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#EF4444' }}>{stats.rThVia.toFixed(1)} <small style={{ fontSize: '0.8rem' }}>°C/W</small></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginTop: '4px' }}>Thermal Resistance (R_θja)</div>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              Note: A thermal via array (4x4) will reduce this to ~{ (stats.rThVia / 16).toFixed(1) } °C/W.
            </p>
          </div>
        </div>

        {/* Copper Relief Panel */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ margin: '0 0 var(--space-4) 0', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wind size={16} /> Thermal Relief Logic
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <EngineeringInput
                label="Spoke Width"
                unit="mil"
                value={spokeWidthMil}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setSpokeWidthMil(parseFloat(val));
                }}
                step="1"
              />
              <EngineeringInput
                label="Spoke Count"
                value={spokeCount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseInt(val))) return;
                  setSpokeCount(parseInt(val));
                }}
                step="1"
              />
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', border: `1px solid ${stats.reliefColor}33` }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stats.reliefEfficiency.toFixed(1)}%</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: stats.reliefColor, textTransform: 'uppercase', marginTop: '4px' }}>{stats.reliefStatus}</div>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
              Relief efficiency &gt; 60% leads to "cold solder joints" due to excessive heat sinking. Ensure spokes balance manufacturability vs current capacity.
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 'var(--space-3)', border: '1px solid var(--border-light)' }}>
        <div style={{ color: '#EF4444', marginTop: '3px' }}><ShieldAlert size={18} /></div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          <strong>Thermal Recommendation:</strong> 1oz Copper (35µm) has a heat dissipation coefficient of ~0.5 W/in² for a 20°C rise. For high-power Switch-Mode regulators, use multi-layer thermal via stitching to reference planes (min. 0.3mm drill, 1.0mm pitch).
        </div>
      </div>
    </div>
  );
};

export default ThermalAnalysisTool;
