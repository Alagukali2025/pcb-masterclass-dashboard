import React, { useState, useMemo } from 'react';
import { Zap, ShieldAlert, Info, Maximize2, CheckCircle2, Waves } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const ViaAdvancedCalculator = () => {
  const { activeStackup, updateStackup } = useDesign();
  const [unitSystem, setUnitSystem] = useState('mil'); 
  
  // Internal values kept in MILS for standard via formulas
  const [drill, setDrill] = useState(10); 
  const [pad, setPad] = useState(20); 
  const [antiPad, setAntiPad] = useState(30); 
  const [stub, setStub] = useState(40);

  // Sync board thickness and er from SSOT
  const thickness = activeStackup.height * MM_TO_MIL;
  const er = activeStackup.dk;

  const stats = useMemo(() => {
    // 1. Resonance (Quarter-wave)
    const fres = 11800 / (4 * stub * Math.sqrt(er));

    // 2. Inductance (L)
    const inductance = 0.00508 * thickness * (Math.log((4 * thickness) / drill) + 1);

    // 3. Capacitance (C)
    const capPf = (1.41 * er * (thickness / 1000) * (pad / 1000)) / ((antiPad - pad) / 1000);

    // 4. Characteristic Impedance
    const zVia = Math.sqrt(inductance / (capPf / 1000)) || 0;

    let status = 'Stable';
    let statusColor = 'var(--success)';
    
    if (fres < 10 || zVia > 70 || zVia < 35) {
      status = 'High Speed Risk';
      statusColor = 'var(--danger)';
    } else if (fres < 25) {
      status = 'Moderate SI Impact';
      statusColor = 'var(--warning)';
    }

    return { fres, inductance, capPf, zVia, status, statusColor };
  }, [stub, drill, pad, antiPad, thickness, er]);

  const handleInputChange = (key, value) => {
    if (value === "" || isNaN(parseFloat(value))) return;
    const rawValue = parseFloat(value);
    
    if (key === 'thickness' || key === 'dk') {
      const mmValue = (key === 'thickness' && unitSystem === 'mil') ? rawValue / MM_TO_MIL : rawValue;
      const ssotKey = key === 'thickness' ? 'height' : 'dk';
      updateStackup({ [ssotKey]: mmValue });
      return;
    }

    const milValue = unitSystem === 'mm' ? rawValue * MM_TO_MIL : rawValue;
    if (key === 'drill') setDrill(milValue);
    if (key === 'pad') setPad(milValue);
    if (key === 'antiPad') setAntiPad(milValue);
    if (key === 'stub') setStub(milValue);
  };

  const convertValue = (val) => {
    return unitSystem === 'mm' ? (val / MM_TO_MIL).toFixed(3) : val.toFixed(1);
  };

  return (
    <div className="zdiff-calc slide-up" id="via-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(212, 150, 58, 0.1)' }}>
            <Maximize2 size={18} style={{ color: '#D4963A' }} />
          </div>
          <div>
            <h3 className="zdiff-title">Advanced Via Parasitic Solver</h3>
            <p className="zdiff-subtitle">Electromagnetic & SI Impact Analysis — High-Frequency Focus</p>
          </div>
        </div>

        <div className="zdiff-toggle-group">
          <button
            className={`zdiff-toggle-btn ${unitSystem === 'mm' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setUnitSystem('mm')}
          >
            mm
          </button>
          <button
            className={`zdiff-toggle-btn ${unitSystem === 'mil' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setUnitSystem('mil')}
          >
            mil
          </button>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Visualization & Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
            <span className="zdiff-diagram-label">Mechanical Via Cross-Section</span>
            <div className="flex justify-center py-4">
              <svg viewBox="0 0 200 160" className="w-full max-w-[240px]">
                {/* Board Layers */}
                <rect x="40" y="20" width="120" height="120" fill="var(--success)" fillOpacity="0.05" rx="4" />
                <line x1="40" y1="40" x2="160" y2="40" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="80" x2="160" y2="80" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="120" x2="160" y2="120" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                
                {/* Anti-pad area */}
                <rect x={100 - (antiPad/drill)*10} y="20" width={(antiPad/drill)*20} height="120" fill="var(--bg-primary)" fillOpacity="0.4" />
                
                {/* Via Barrel */}
                <rect x="92" y="15" width="16" height="130" fill="var(--warning)" rx="2" fillOpacity="0.3" stroke="var(--warning)" strokeWidth="1" />
                
                {/* Capture Pads */}
                <rect x="75" y="18" width="50" height="4" fill="var(--warning)" rx="1" />
                <rect x="75" y="138" width="50" height="4" fill="var(--warning)" rx="1" />
                
                {/* Stub indication */}
                <rect x="94" y="80" width="12" height="60" fill="var(--warning)" fillOpacity="0.8" rx="1" />
                
                <text x="100" y="110" textAnchor="middle" fill="var(--warning)" fontSize="10" fontWeight="bold">STUB</text>
              </svg>
            </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Drill Diameter"
              unit={unitSystem}
              value={convertValue(drill)}
              onChange={e => handleInputChange('drill', e.target.value)}
              step="0.1"
            />
            <EngineeringInput
              label="Pad Diameter"
              unit={unitSystem}
              value={convertValue(pad)}
              onChange={e => handleInputChange('pad', e.target.value)}
              step="0.1"
            />
            <EngineeringInput
              label="Anti-Pad Dia."
              unit={unitSystem}
              value={convertValue(antiPad)}
              onChange={e => handleInputChange('antiPad', e.target.value)}
              step="0.1"
            />
            <EngineeringInput
              label="Stub Length"
              unit={unitSystem}
              value={convertValue(stub)}
              onChange={e => handleInputChange('stub', e.target.value)}
              step="0.1"
              className="zdiff-input-group--orange"
            />
            <EngineeringInput
              label="Board Thick."
              unit={unitSystem}
              value={convertValue(thickness)}
              onChange={e => handleInputChange('thickness', e.target.value)}
              step="0.1"
            />
            <EngineeringInput
              label="εr (Dk)"
              value={er}
              onChange={e => handleInputChange('dk', e.target.value)}
              step="0.01"
              min="1"
            />
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Z_via — Characteristic Impedance</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.zVia > 60 || stats.zVia < 40 ? 'var(--warning)' : 'var(--success)' }}>
                {stats.zVia.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">Ω</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Inductance (L)</div>
                <div className="zdiff-result-sub-val">{stats.inductance.toFixed(3)} <small>nH</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Capacitance (C)</div>
                <div className="zdiff-result-sub-val">{stats.capPf.toFixed(3)} <small>pF</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Resonance (f₀)</div>
                <div className="zdiff-result-sub-val" style={{ color: stats.fres < 15 ? 'var(--danger)' : 'inherit' }}>
                  {stats.fres.toFixed(1)} <small>GHz</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">SI Status</div>
                <div className="zdiff-result-sub-val" style={{ color: stats.statusColor }}>{stats.status}</div>
              </div>
            </div>

            {/* Technical Verdict */}
            <div className={`zdiff-verdict ${stats.fres < 15 ? 'zdiff-verdict--danger' : stats.fres < 25 ? 'zdiff-verdict--warn' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">
                {stats.fres < 15 ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="zdiff-verdict-title">Electromagnetic Verdict</p>
                <p className="zdiff-verdict-body">
                  {stats.fres < 15 
                    ? `Critical resonance detected at ${stats.fres.toFixed(1)} GHz. Via STUB must be removed via back-drilling.`
                    : `Via impedance is ${stats.zVia.toFixed(1)}Ω. ${Math.abs(stats.zVia - 50) > 7 ? 'Optimization suggested for 50Ω match.' : 'Excellent match for 50Ω systems.'}`}
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Quick Via Presets</h5>
             <div className="zdiff-presets-grid">
                <button className="zdiff-preset-btn" onClick={() => { setDrill(8); setPad(18); setAntiPad(28); }}>
                  <span className="zdiff-preset-name">0.2mm High-Density</span>
                  <span className="zdiff-preset-ohm">8/18 mil</span>
                </button>
                <button className="zdiff-preset-btn" onClick={() => { setDrill(10); setPad(20); setAntiPad(30); }}>
                  <span className="zdiff-preset-name">Standard Through</span>
                  <span className="zdiff-preset-ohm">10/20 mil</span>
                </button>
                <button className="zdiff-preset-btn" onClick={() => { setDrill(12); setPad(24); setAntiPad(34); }}>
                  <span className="zdiff-preset-name">Power Via</span>
                  <span className="zdiff-preset-ohm">12/24 mil</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViaAdvancedCalculator;
