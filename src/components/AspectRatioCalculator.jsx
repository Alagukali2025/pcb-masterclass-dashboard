import React, { useState, useMemo } from 'react';
import { Ruler, Activity, AlertTriangle, CheckCircle2, Drill, ShieldCheck, Waves } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const AspectRatioCalculator = () => {
  const [unitSystem, setUnitSystem] = useState('mm'); // 'mm' | 'mil'
  const [mode, setMode] = useState('aspect'); // 'aspect' | 'stub'

  // Aspect Ratio State (Internal in mm)
  const [thickness, setThickness] = useState(1.6);
  const [drill, setDrill] = useState(0.2);

  // Via Stub State (Internal in mm)
  const [stubLength, setStubLength] = useState(0.5);
  const [dk, setDk] = useState(4.2);

  const stats = useMemo(() => {
    const aspect = parseFloat((thickness / drill).toFixed(2));
    const resonantFreq = parseFloat((75 / (stubLength * Math.sqrt(dk))).toFixed(2));
    
    return { aspect, resonantFreq };
  }, [thickness, drill, stubLength, dk]);

  const handleInputChange = (key, value) => {
    if (value === "" || isNaN(parseFloat(value))) return;
    const rawValue = parseFloat(value);
    const mmValue = unitSystem === 'mil' ? rawValue / MM_TO_MIL : rawValue;
    
    if (key === 'thickness') setThickness(mmValue);
    if (key === 'drill') setDrill(mmValue);
    if (key === 'stub') setStubLength(mmValue);
  };

  const convertValue = (mmVal) => {
    const num = parseFloat(mmVal) || 0;
    return unitSystem === 'mil' ? (num * MM_TO_MIL).toFixed(2) : num.toFixed(2);
  };

  const isHighRiskAspect = stats.aspect > 10;
  const isOptimalAspect = stats.aspect <= 8;
  const isHighRiskStub = stats.resonantFreq < 15;

  return (
    <div className="zdiff-calc slide-up" id="via-technology-center">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            {mode === 'aspect' ? <Ruler size={18} style={{ color: '#3b82f6' }} /> : <Activity size={18} style={{ color: '#f97316' }} />}
          </div>
          <div>
            <h3 className="zdiff-title">Via Technology Center</h3>
            <p className="zdiff-subtitle">Advanced Drill Aspect Ratio & Signal Integrity Stub Center</p>
          </div>
        </div>

        <div className="zdiff-toggle-group">
          <button
            className={`zdiff-toggle-btn ${unitSystem === 'mm' ? 'zdiff-toggle-btn--active-green' : ''}`}
            onClick={() => setUnitSystem('mm')}
          >
            mm
          </button>
          <button
            className={`zdiff-toggle-btn ${unitSystem === 'mil' ? 'zdiff-toggle-btn--active-green' : ''}`}
            onClick={() => setUnitSystem('mil')}
          >
            mil
          </button>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Visualization & Core Mode ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">{mode === 'aspect' ? 'Mechanical Aspect Ratio Scale' : 'Resonant Null Propagation'}</span>
             <div className="flex justify-center py-6">
                {mode === 'aspect' ? (
                  <svg viewBox="0 0 100 120" className="w-full max-w-[120px]">
                     <rect x="30" y="10" width="40" height="100" fill="var(--success)" fillOpacity="0.05" stroke="var(--border-light)" />
                     {/* Drill Hole */}
                     <rect x="45" y="10" width="10" height="100" fill="var(--bg-primary)" stroke="var(--warning)" strokeWidth="1" />
                     <text x="50" y="118" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">Ratio {stats.aspect}:1</text>
                  </svg>
                ) : (
                  <svg viewBox="0 0 200 100" className="w-full max-w-[200px]">
                    <path d="M0,50 Q25,0 50,50 T100,50 T150,50 T200,50" fill="none" stroke="var(--warning)" strokeWidth="1" strokeOpacity="0.6" />
                    <rect x="90" y="20" width="20" height="60" fill="var(--warning)" fillOpacity="0.1" />
                  </svg>
                )}
             </div>
          </div>

          <div className="zdiff-input-grid">
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${mode === 'aspect' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setMode('aspect')}>Aspect Ratio</button>
                <button className={`zdiff-toggle-btn flex-1 ${mode === 'stub' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setMode('stub')}>Stub Resonance</button>
              </div>
            </div>

            {mode === 'aspect' ? (
              <>
                <EngineeringInput
                  label="Board Thickness"
                  unit={unitSystem}
                  value={convertValue(thickness)}
                  onChange={e => handleInputChange('thickness', e.target.value)}
                  step="0.1"
                />
                <EngineeringInput
                  label="Drill Diameter"
                  unit={unitSystem}
                  value={convertValue(drill)}
                  onChange={e => handleInputChange('drill', e.target.value)}
                  step="0.1"
                  className="zdiff-input-group--orange"
                />
              </>
            ) : (
              <>
                <EngineeringInput
                  label="Unused Stub"
                  unit={unitSystem}
                  value={convertValue(stubLength)}
                  onChange={e => handleInputChange('stub', e.target.value)}
                  step="0.1"
                />
                <EngineeringInput
                  label="εr (Dielectric Constant)"
                  unit="Dk"
                  value={dk}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "" || isNaN(parseFloat(val))) return;
                    setDk(parseFloat(val));
                  }}
                  step="0.1"
                />
              </>
            )}
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: (mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? 'var(--danger-border)' : 'var(--success-border)' }}>
            <div className="zdiff-result-label">{mode === 'aspect' ? 'Calculated Drill Ratio' : 'Resonant Null (f₀)'}</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: (mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? 'var(--danger)' : 'var(--success)' }}>
                {mode === 'aspect' ? stats.aspect : stats.resonantFreq}
              </span>
              <span className="zdiff-result-unit">{mode === 'aspect' ? ':1' : 'GHz'}</span>
            </div>

            <div className="zdiff-result-sub-grid">
               <div className="zdiff-result-sub">
                 <div className="zdiff-result-sub-label">IPC Class 2</div>
                 <div className="zdiff-result-sub-val">{mode === 'aspect' ? '10:1 Limit' : 'Transparent'}</div>
               </div>
               <div className="zdiff-result-sub">
                 <div className="zdiff-result-sub-label">Status</div>
                 <div className="zdiff-result-sub-val" style={{ color: (mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? 'var(--danger)' : 'var(--success)' }}>
                    {(mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? 'Critical' : 'Optimal'}
                 </div>
               </div>
            </div>

            {/* Verdict */}
            <div className={`zdiff-verdict ${(mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? 'zdiff-verdict--danger' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">{(mode === 'aspect' ? isHighRiskAspect : isHighRiskStub) ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</div>
              <div>
                <p className="zdiff-verdict-title">{mode === 'aspect' ? 'Manufacturing Verdict' : 'SI Domain Verdict'}</p>
                <p className="zdiff-verdict-body">
                  {mode === 'aspect' 
                    ? (isHighRiskAspect ? 'Aspect ratio exceeds 10:1. Excessive risk of barrel copper plating voiding.' : 'Safe for standard volume mechanical drilling.')
                    : (isHighRiskStub ? `High attenuation at ${stats.resonantFreq}GHz. Controlled depth back-drilling required.` : 'Stub is electrically transparent for current bandwidth.')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Quick Geometry Injection</h5>
             <div className="zdiff-presets-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
                <button className="zdiff-preset-btn" onClick={() => { setThickness(1.6); setDrill(0.2); }}>1.6mm@0.2mm</button>
                <button className="zdiff-preset-btn" onClick={() => { setThickness(2.4); setDrill(0.25); }}>2.4mm@0.25mm</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspectRatioCalculator;
