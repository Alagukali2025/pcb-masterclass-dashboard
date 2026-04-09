import React, { useState, useMemo } from 'react';
import { Zap, ShieldAlert, Waves, CheckCircle2, AlertTriangle, Ruler } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import EngineeringInput from './EngineeringInput';

const EMICalculator = () => {
  const { activeStackup } = useDesign();
  const [riseTime, setRiseTime] = useState(1); // Default 1ns
  const [trUnit, setTrUnit] = useState('ns'); // 'ns' | 'ps'
  const [distanceUnit, setDistanceUnit] = useState('mm'); // 'mm' | 'mil'
  
  const MM_TO_MIL = 39.3701;

  const stats = useMemo(() => {
    // Standardize to ns
    const tr = trUnit === 'ns' ? riseTime : riseTime / 1000;
    if (isNaN(tr) || tr <= 0) return null;

    // Significant Frequency (Harmonic Bandwidth)
    const fmax = 0.35 / tr; // GHz
    const fmaxMhz = fmax * 1000;

    // Speed of Light in Board Material (Using SSOT Dk)
    const er = activeStackup.dk;
    const v = 300 / Math.sqrt(er); // mm/ns
    const lambda = v / fmax; // mm

    return {
      fmax: fmaxMhz,
      lambda: lambda,
      critical: lambda / 20, // Critical length mark
      antenna: lambda / 4,   // Peak radiation
    };
  }, [riseTime, trUnit]);

  const convertDist = (val) => {
    return distanceUnit === 'mil' ? (val * MM_TO_MIL).toFixed(1) : val.toFixed(2);
  };

  const isHighFreq = stats && stats.fmax > 1000;

  return (
    <div className="zdiff-calc slide-up" id="emi-bandwidth-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Zap size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 className="zdiff-title">EMI Bandwidth & Critical Length</h3>
            <p className="zdiff-subtitle">Harmonic Spectral Analysis — Edge-Rate Domain</p>
          </div>
        </div>

        <div className="zdiff-toggle-group">
          <button
            className={`zdiff-toggle-btn ${distanceUnit === 'mm' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setDistanceUnit('mm')}
          >
            mm
          </button>
          <button
            className={`zdiff-toggle-btn ${distanceUnit === 'mil' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setDistanceUnit('mil')}
          >
            mil
          </button>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Inputs & Theory ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Spectral Distribution Theory</span>
             <div className="flex justify-center py-6">
                <svg viewBox="-40 0 240 110" className="w-full max-w-[240px]">
                   <path d="M20 80 Q 50 20, 180 20" stroke="var(--accent-primary)" strokeWidth="2" fill="none" fillOpacity="0.2" />
                   <rect x="20" y="20" width="30" height="60" fill="var(--warning)" fillOpacity="0.1" />
                   <text x="35" y="95" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">Significant Bandwidth (0.35/Tr)</text>
                   <line x1="20" y1="80" x2="180" y2="80" stroke="var(--border-light)" strokeWidth="1" />
                   <line x1="20" y1="20" x2="20" y2="80" stroke="var(--border-light)" strokeWidth="1" />
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <EngineeringInput
                label="Significant Rise/Fall Time"
                unit={trUnit}
                value={riseTime}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "" || isNaN(parseFloat(val))) return;
                  setRiseTime(parseFloat(val));
                }}
                step="0.01"
              />
              <div className="flex gap-2 mt-2">
                <select 
                  value={trUnit} 
                  onChange={e => setTrUnit(e.target.value)}
                  className="zdiff-toggle-btn w-full"
                  style={{ fontSize: '0.75rem' }}
                >
                  <option value="ns">ns (Nanoseconds)</option>
                  <option value="ps">ps (Picoseconds)</option>
                </select>
              </div>
            </div>
            
            <div className="zdiff-input-group zdiff-input-group--action" style={{ gridColumn: 'span 2' }}>
               <label className="engineering-label">Protocol Note</label>
               <div className="p-3 bg-white/5 rounded-lg text-[0.7rem] text-tertiary italic">
                 "High-speed design is governed by Edge Rate, not clock frequency."
               </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: isHighFreq ? 'var(--danger-border)' : 'var(--accent-border)' }}>
            <div className="zdiff-result-label">fmax — Harmonic Boundary</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: isHighFreq ? 'var(--danger)' : 'var(--accent-primary)' }}>
                {stats ? stats.fmax.toFixed(0) : 0}
              </span>
              <span className="zdiff-result-unit">MHz</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Critical (λ/20)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>
                   {stats ? convertDist(stats.critical) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Resonant (λ/4)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--danger)' }}>
                   {stats ? convertDist(stats.antenna) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Wavelength (λ)</div>
                <div className="zdiff-result-sub-val">
                   {stats ? convertDist(stats.lambda) : 0} <small>{distanceUnit}</small>
                </div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Domain</div>
                <div className="zdiff-result-sub-val">{isHighFreq ? 'HF / SI Domain' : 'General Purpose'}</div>
              </div>
            </div>

            {/* Design Verdict */}
            <div className={`zdiff-verdict ${isHighFreq ? 'zdiff-verdict--danger' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">
                {isHighFreq ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="zdiff-verdict-title">EMI Impact Verdict</p>
                <p className="zdiff-verdict-body">
                  {isHighFreq 
                    ? `Gigahertz Domain detected. Traces > ${stats ? convertDist(stats.critical) : 0}${distanceUnit} require termination and skew matching.`
                    : `Low-frequency spectral content. Standard design rules apply.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;
