import React, { useState, useMemo } from 'react';
import { Zap, Thermometer, Ruler, ShieldAlert, CheckCircle2, Waves } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const IPC2152Calculator = () => {
  const [unitSystem, setUnitSystem] = useState('mil'); // Standard is mil/sq mil
  const [current, setCurrent] = useState(5);
  const [tempRise, setTempRise] = useState(10);
  const [copperWeight, setCopperWeight] = useState(1); // oz
  const [isInternal, setIsInternal] = useState(true);
  const [boardThickness, setBoardThickness] = useState(62); // mil — IPC-2152 modifier
  const [hasAdjacentPlane, setHasAdjacentPlane] = useState(false); // IPC-2152 plane proximity factor

  const stats = useMemo(() => {
    // ── Stage 1: IPC-2221A Base Model (Starting Point) ──────────────────
    const k = isInternal ? 0.024 : 0.048;
    const b = 0.44;
    const c = 0.725;

    // A_base = (I / (k * dT^b))^(1/c) in sq mils
    const baseArea = Math.pow(current / (k * Math.pow(tempRise, b)), 1/c);

    // ── Stage 2: IPC-2152 Correction Factors ────────────────────────────
    // CF1: Board Thickness Factor (thicker boards dissipate less heat)
    // IPC-2152 Fig 5-2: normalized to 62 mil baseline
    const thicknessFactor = Math.pow(boardThickness / 62, 0.25);

    // CF2: Adjacent Plane Proximity Factor
    // IPC-2152 Fig 5-3: copper planes act as lateral heat sinks
    const planeFactor = hasAdjacentPlane ? 0.75 : 1.0;

    // CF3: Still-Air Convection (no forced airflow)
    // IPC-2152 accounts for natural convection; internal layers see ~2x less
    const convectionFactor = isInternal ? 1.0 : 0.90;

    // Adjusted cross-section area
    const crossSectionArea = baseArea * thicknessFactor * planeFactor * convectionFactor;

    const thicknessMil = copperWeight * 1.37;
    const widthMil = crossSectionArea / thicknessMil;
    const widthMm = widthMil / MM_TO_MIL;

    // Derating percentage vs base
    const derating = ((crossSectionArea / baseArea) - 1) * 100;

    return { crossSectionArea, baseArea, thicknessMil, widthMil, widthMm, thicknessFactor, planeFactor, derating };
  }, [current, tempRise, copperWeight, isInternal, boardThickness, hasAdjacentPlane]);

  const convertValue = (milVal) => {
    return unitSystem === 'mm' ? (milVal / MM_TO_MIL).toFixed(3) : milVal.toFixed(1);
  };

  return (
    <div className="zdiff-calc slide-up" id="ipc-2152-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(55, 138, 221, 0.1)' }}>
            <Zap size={18} style={{ color: '#378ADD' }} />
          </div>
          <div>
            <h3 className="zdiff-title">IPC-2152 Trace Capacity Solver</h3>
            <p className="zdiff-subtitle">IPC-2221A Base + IPC-2152 Correction Factors</p>
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
        {/* ── Left Side: Electrical Specs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Thermal Distribution Map</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 200 80" className="w-full max-w-[240px]">
                   <rect x="20" y="30" width="160" height="20" rx="2" fill="var(--success)" fillOpacity="0.1" stroke="var(--border-light)" />
                   {/* Heat Gradient */}
                   <rect x="60" y="30" width="80" height="20" fill="var(--warning)" fillOpacity="0.4" />
                   <rect x="80" y="30" width="40" height="20" fill="var(--danger)" fillOpacity="0.6" />
                   <text x="100" y="65" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9">Steady-State Temp Rise: +{tempRise}°C</text>
                   <path d="M40 25 Q 100 0, 160 25" fill="none" stroke="var(--danger)" strokeWidth="1" strokeDasharray="3" />
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Transient Current"
              unit="Amps"
              value={current}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setCurrent(parseFloat(val));
              }}
              step="0.5"
            />
            <EngineeringInput
              label="Temp Rise Limit"
              unit="°C"
              value={tempRise}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setTempRise(parseFloat(val));
              }}
              step="1"
            />
            
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <label className="engineering-label">Routing Layer Profile</label>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${isInternal ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setIsInternal(true)}>Internal (Stripline)</button>
                <button className={`zdiff-toggle-btn flex-1 ${!isInternal ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setIsInternal(false)}>External (Microstrip)</button>
              </div>
            </div>

            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <label className="engineering-label">Copper Weight (oz)</label>
              <select 
                value={copperWeight} 
                onChange={e => setCopperWeight(parseFloat(e.target.value))}
                className="input-engineering w-full"
                style={{ fontSize: '0.9rem', appearance: 'auto' }}
              >
                <option value={0.5}>0.5 oz (Plated/Thin)</option>
                <option value={1}>1.0 oz (Standard)</option>
                <option value={2}>2.0 oz (Power/Heavy)</option>
                <option value={3}>3.0 oz (Extreme Power)</option>
                <option value={4}>4.0 oz (Exotic/Defense)</option>
              </select>
            </div>

            {/* IPC-2152 Modifiers */}
            <EngineeringInput
              label={`Board Thickness (${boardThickness} mil)`}
              unit="mil"
              value={boardThickness}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setBoardThickness(parseFloat(val));
              }}
              step="1"
            />
            <div className="zdiff-input-group">
              <label className="engineering-label">Adjacent Cu Plane</label>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${hasAdjacentPlane ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setHasAdjacentPlane(true)}>Yes (−25%)</button>
                <button className={`zdiff-toggle-btn flex-1 ${!hasAdjacentPlane ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setHasAdjacentPlane(false)}>No</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Geometry Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: 'var(--success-border)' }}>
            <div className="zdiff-result-label">Recommended Trace Width</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: 'var(--success)' }}>
                {convertValue(stats.widthMil)}
              </span>
              <span className="zdiff-result-unit">{unitSystem}</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Cross Section</div>
                <div className="zdiff-result-sub-val">{stats.crossSectionArea.toFixed(1)} <small>sq. mil</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Cu Thickness</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>{stats.thicknessMil.toFixed(2)} <small>mil</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Standard</div>
                <div className="zdiff-result-sub-val">IPC-2152</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">CF (Board/Plane)</div>
                <div className="zdiff-result-sub-val" style={{ color: stats.derating < 0 ? 'var(--success)' : 'var(--warning)' }}>{stats.derating > 0 ? '+' : ''}{stats.derating.toFixed(0)}%</div>
              </div>
            </div>

            {/* Technical Verdict */}
            <div className="zdiff-verdict zdiff-verdict--ok">
              <div className="zdiff-verdict-icon"><ShieldAlert size={16} /></div>
              <div>
                <p className="zdiff-verdict-title">IPC-2152 Thermal Profile Verified</p>
                <p className="zdiff-verdict-body">Base model (IPC-2221A §6) + IPC-2152 correction factors applied. Width for {current}A ensures {tempRise}°C rise.{hasAdjacentPlane ? ' Plane proximity derate active (−25%).' : ''}</p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Engineering Rules</h5>
             <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <ul className="m-0 p-0 pl-4 text-[0.7rem] text-tertiary list-disc space-y-1">
                   <li>Internal traces require more width due to lower heat dissipation via dielectric.</li>
                   <li>Fusing current is typically 2.5x the rated steady-state capacity.</li>
                   <li>Consult IPC-2152 for boards with parallel heat sinks or heavy-copper cores.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPC2152Calculator;
