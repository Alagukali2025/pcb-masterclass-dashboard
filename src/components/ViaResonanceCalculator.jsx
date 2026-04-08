import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Info, Layers, CheckCircle2 } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const ViaResonanceCalculator = () => {
  const [unitSystem, setUnitSystem] = useState('mil');
  const [stub, setStub] = useState(40); // Internal in MILS
  const [er, setEr] = useState(4.2);

  const stats = useMemo(() => {
    // fres (GHz) = 11800 / (4 * stubMil * sqrt(er))
    const fres = 11800 / (4 * stub * Math.sqrt(er));

    let status = 'Safe';
    let statusColor = 'var(--success)';
    if (fres < 10) {
      status = 'Critical';
      statusColor = 'var(--danger)';
    } else if (fres < 25) {
      status = 'Warning';
      statusColor = 'var(--warning)';
    }

    return { fres, status, statusColor };
  }, [stub, er]);

  const handleInputChange = (value) => {
    if (value === "" || isNaN(parseFloat(value))) return;
    const rawValue = parseFloat(value);
    const milValue = unitSystem === 'mm' ? rawValue * MM_TO_MIL : rawValue;
    setStub(milValue);
  };

  const convertValue = (milVal) => {
    return unitSystem === 'mm' ? (milVal / MM_TO_MIL).toFixed(2) : milVal.toFixed(1);
  };

  return (
    <div className="zdiff-calc slide-up" id="via-resonance-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(212, 150, 58, 0.1)' }}>
            <Layers size={18} style={{ color: '#D4963A' }} />
          </div>
          <div>
            <h3 className="zdiff-title">Via Stub Resonance Solver</h3>
            <p className="zdiff-subtitle">Stub Length to Resonant Null Analysis — Quarter-Wave Focus</p>
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
        {/* ── Left Side: Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Vertical Via Stub Animation</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 100 120" className="w-full max-w-[120px]">
                   <rect x="30" y="20" width="40" height="80" fill="var(--success)" fillOpacity="0.05" rx="4" />
                   <rect x="45" y="20" width="10" height="20" fill="var(--warning)" fillOpacity="1" />
                   <rect x="45" y="40" width="10" height="60" fill="var(--warning)" fillOpacity="0.2" stroke="var(--warning)" strokeWidth="1" />
                   <text x="50" y="118" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">Resonance: {stats.fres.toFixed(1)} GHz</text>
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Unused Stub Length"
              unit={unitSystem}
              value={convertValue(stub)}
              onChange={e => handleInputChange(e.target.value)}
              step="0.1"
              style={{ gridColumn: 'span 2' }}
            />
            <EngineeringInput
              label="εr (Dielectric Constant)"
              unit="Dk"
              value={er}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setEr(parseFloat(val));
              }}
              step="0.1"
              min="1"
              style={{ gridColumn: 'span 2' }}
            />
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Quarter-Wave Null (f₀)</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.fres.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">GHz</span>
            </div>

            <div className="zdiff-result-sub-grid">
               <div className="zdiff-result-sub">
                 <div className="zdiff-result-sub-label">λ/4 Marker</div>
                 <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>Full Reflection</div>
               </div>
               <div className="zdiff-result-sub">
                 <div className="zdiff-result-sub-label">Domain Status</div>
                 <div className="zdiff-result-sub-val" style={{ color: stats.statusColor }}>{stats.status}</div>
               </div>
            </div>

            {/* Verdict */}
            <div className={`zdiff-verdict ${stats.fres < 15 ? 'zdiff-verdict--danger' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">{stats.fres < 15 ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}</div>
              <div>
                <p className="zdiff-verdict-title">Signal Absorption Verdict</p>
                <p className="zdiff-verdict-body">
                   {stats.fres < 15 
                     ? `Resonance null at ${stats.fres.toFixed(1)} GHz is too high. Back-drilling required for Gen4/5 links.` 
                     : 'Resonant null is outside the target operating bandwidth.'}
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Mitigation Rules</h5>
             <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[0.7rem] text-tertiary">
                <ul className="m-0 p-0 pl-4 list-disc space-y-1">
                   <li>Unused stubs behave as an open-circuited transmission line.</li>
                   <li>Resonance nulls create deep "dips" in S21 insertion loss.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViaResonanceCalculator;
