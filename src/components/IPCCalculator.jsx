import React, { useState, useMemo } from 'react';
import { Calculator, Ruler, Info, CheckCircle2, X, MousePointer2, Copy } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const IPC_CONSTANTS = {
  FILLET_GOALS: {
    GULL_WING: {
      A: { jt: 0.55, jh: 0.45, js: 0.05 },
      B: { jt: 0.35, jh: 0.35, js: 0.03 },
      C: { jt: 0.15, jh: 0.15, js: 0.01 }
    },
    CHIP: {
      A: { jt: 0.55, jh: 0.15, js: 0.15 },
      B: { jt: 0.35, jh: 0.05, js: 0.05 },
      C: { jt: 0.15, jh: 0.00, js: 0.01 }
    }
  },
  TOLERANCES: {
    CL: 0.10, // Fabrication
    CS: 0.05, // Placement
    CP: 0.025 // Stencil
  }
};

const IPCCalculator = () => {
  const [unitSystem, setUnitSystem] = useState('mm'); // 'mm' | 'mil'
  const [packageType, setPackageType] = useState('CHIP');
  const [densityLevel, setDensityLevel] = useState('B');
  const [copied, setCopied] = useState(false);

  // Inputs are stored in mm (Internal SI)
  const [inputs, setInputs] = useState({
    lMax: 1.6,
    wMax: 0.8,
    tMin: 0.4,
    height: 0.45,
    pitch: 0.50
  });

  const results = useMemo(() => {
    const { lMax, wMax, tMin } = inputs;
    const { jt, jh, js } = IPC_CONSTANTS.FILLET_GOALS[packageType][densityLevel];
    const { CL, CS, CP } = IPC_CONSTANTS.TOLERANCES;

    const rms = Math.sqrt(Math.pow(CL, 2) + Math.pow(CS, 2) + Math.pow(CP, 2));

    const l = parseFloat(lMax || 0);
    const t = parseFloat(tMin || 0);
    const w = parseFloat(wMax || 0);

    const Z = l + 2 * jt + rms;
    const G = t - 2 * jh - rms;
    const X = w + 2 * js + rms;

    const padLength = (Z - G) / 2;
    const centerToCenter = G + padLength;

    const formatDim = (d) => Math.round(parseFloat(d) * 100).toString().padStart(4, '0');
    const pType = packageType === 'CHIP' ? 'RESC' : 'SOP';
    const name = `${pType}${formatDim(lMax)}${formatDim(wMax)}X${formatDim(inputs.height)}${densityLevel}`;

    // Industrial Standard Mask Expansions (IPC-7351B)
    const solderMaskExpansion = 0.05; // 2 mil per side
    const pasteMaskExpansion = 0.00;  // 1:1 for standard components

    return {
      z: Z,
      g: G,
      x: X,
      ipcName: name,
      padLength: padLength,
      centerToCenter: centerToCenter,
      rms: rms,
      jt, jh, js,
      solderMaskX: X + (solderMaskExpansion * 2),
      solderMaskY: padLength + (solderMaskExpansion * 2),
      pasteMaskX: X + (pasteMaskExpansion * 2),
      pasteMaskY: padLength + (pasteMaskExpansion * 2)
    };
  }, [inputs, packageType, densityLevel]);

  const handleInputChange = (key, value) => {
    if (value === "" || isNaN(parseFloat(value))) return;
    const rawValue = parseFloat(value);
    const mmValue = unitSystem === 'mil' ? rawValue / MM_TO_MIL : rawValue;
    setInputs(prev => ({ ...prev, [key]: mmValue }));
  };

  const convertValue = (val) => {
    const num = parseFloat(val) || 0;
    return unitSystem === 'mil' ? (num * MM_TO_MIL).toFixed(2) : num.toFixed(2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.ipcName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="zdiff-calc slide-up" id="ipc-7351b-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'var(--success-bg)' }}>
            <Calculator size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <h3 className="zdiff-title">IPC-7351B Land Pattern Solver</h3>
            <p className="zdiff-subtitle">IPC-7251 Engineering Protocol — High-Precision Mode</p>
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
        {/* ── Left Side: Diagram & Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box" style={{ background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 100%)' }}>
             <span className="zdiff-diagram-label">X-SECTION MECHANICAL SCAN</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 200 120" className="zdiff-svg">
                   {packageType === 'CHIP' ? (
                     <>
                        <rect x="50" y="30" width="100" height="60" rx="4" fill="var(--success)" fillOpacity="0.05" stroke="var(--border-light)" />
                        <rect x="50" y="30" width="20" height="60" rx="1" fill="var(--warning)" fillOpacity="0.3" />
                        <rect x="130" y="30" width="20" height="60" rx="1" fill="var(--warning)" fillOpacity="0.3" />
                        <text x="100" y="115" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">L (Body Length)</text>
                        <line x1="50" y1="105" x2="150" y2="105" stroke="var(--warning)" strokeWidth="1" strokeDasharray="2" />
                     </>
                   ) : (
                     <>
                        <rect x="60" y="35" width="80" height="50" rx="2" fill="var(--success)" fillOpacity="0.05" stroke="var(--border-light)" />
                        {[0, 1, 2].map(i => (
                          <React.Fragment key={i}>
                            <rect x="40" y={40 + i * 15} width="20" height="10" rx="1" fill="var(--warning)" fillOpacity="0.3" />
                            <rect x="140" y={40 + i * 15} width="20" height="10" rx="1" fill="var(--warning)" fillOpacity="0.3" />
                          </React.Fragment>
                        ))}
                        <text x="100" y="115" textAnchor="middle" fill="var(--text-tertiary)" fontSize="10">Overall Span (L)</text>
                     </>
                   )}
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <div className="zdiff-input-group zdiff-input-group--full">
              <label className="engineering-label">Package Topology</label>
              <div className="zdiff-toggle-group w-full">
                <button className={`zdiff-toggle-btn flex-1 ${packageType === 'CHIP' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setPackageType('CHIP')}>Passive/Chip</button>
                <button className={`zdiff-toggle-btn flex-1 ${packageType === 'GULL_WING' ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setPackageType('GULL_WING')}>Leaded IC</button>
              </div>
            </div>

            <div className="zdiff-input-group zdiff-input-group--full">
              <label className="engineering-label">Assembly Density</label>
              <div className="zdiff-toggle-group w-full">
                {['A', 'B', 'C'].map(level => (
                  <button key={level} className={`zdiff-toggle-btn flex-1 ${densityLevel === level ? 'zdiff-toggle-btn--active-orange' : ''}`} onClick={() => setDensityLevel(level)}>Density {level}</button>
                ))}
              </div>
            </div>

            <EngineeringInput label="L — Max Length" unit={unitSystem} value={convertValue(inputs.lMax)} onChange={e => handleInputChange('lMax', e.target.value)} />
            <EngineeringInput label="W — Max Width" unit={unitSystem} value={convertValue(inputs.wMax)} onChange={e => handleInputChange('wMax', e.target.value)} />
            <EngineeringInput label="T — Min Term" unit={unitSystem} value={convertValue(inputs.tMin)} onChange={e => handleInputChange('tMin', e.target.value)} />
            <EngineeringInput label="H — Height" unit={unitSystem} value={convertValue(inputs.height)} onChange={e => handleInputChange('height', e.target.value)} />
          </div>
        </div>

        {/* ── Right Side: Standard Pad Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: 'var(--success-border)' }}>
            <div className="zdiff-result-main-grid">
              <div>
                <div className="zdiff-result-label">Pad Width (X)</div>
                <div className="zdiff-result-value">
                  <span className="zdiff-result-num" style={{ color: 'var(--success)' }}>{convertValue(results.x)}</span>
                  <span className="zdiff-result-unit">{unitSystem}</span>
                </div>
              </div>
              <div>
                <div className="zdiff-result-label">Pad Length (Y)</div>
                <div className="zdiff-result-value">
                  <span className="zdiff-result-num" style={{ color: 'var(--accent-secondary)' }}>{convertValue(results.padLength)}</span>
                  <span className="zdiff-result-unit">{unitSystem}</span>
                </div>
              </div>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub" title={`${(results.solderMaskX * (unitSystem === 'mm' ? MM_TO_MIL : 1/MM_TO_MIL)).toFixed(1)} x ${(results.solderMaskY * (unitSystem === 'mm' ? MM_TO_MIL : 1/MM_TO_MIL)).toFixed(1)} alternate units`}>
                <div className="zdiff-result-sub-label">Solder Mask (X/Y)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--success)' }}>{convertValue(results.solderMaskX)} × {convertValue(results.solderMaskY)} <small>{unitSystem}</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Paste Mask (X/Y)</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>{convertValue(results.pasteMaskX)} × {convertValue(results.pasteMaskY)} <small>{unitSystem}</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Clearance (Z)</div>
                <div className="zdiff-result-sub-val">{convertValue(results.z)} <small>{unitSystem}</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Inner Gap (G)</div>
                <div className="zdiff-result-sub-val">{convertValue(results.g)} <small>{unitSystem}</small></div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-black-20 rounded-xl border border-white-10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-tertiary uppercase font-bold mb-1 tracking-widest opacity-60">IPC-7251/7351 Identification</div>
                <code className="text-blue-400 font-mono text-sm font-bold">{results.ipcName}</code>
              </div>
              <button className={`p-2 rounded-lg transition-all ${copied ? 'bg-success text-white' : 'bg-white-05 text-white hover:bg-white-10 border border-white-10'}`} onClick={copyToClipboard} title="Copy Code">
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <div className="zdiff-verdict zdiff-verdict--ok mt-4">
              <div className="zdiff-verdict-icon"><CheckCircle2 size={16} /></div>
              <div>
                <p className="zdiff-verdict-title">Technical Verdict</p>
                <p className="zdiff-verdict-body">Standard matching logic for <strong>Density {densityLevel}</strong> assembly environments.</p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Solder Fillet Goals (mm / mil)</h5>
             <div className="zdiff-presets-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="zdiff-metric-badge">
                   <div className="zdiff-metric-label">Toe (Jt)</div>
                   <div className="zdiff-metric-value">{results.jt.toFixed(2)} <span className="text-[9px] opacity-40">/ {(results.jt * MM_TO_MIL).toFixed(1)}</span></div>
                </div>
                <div className="zdiff-metric-badge">
                   <div className="zdiff-metric-label">Heel (Jh)</div>
                   <div className="zdiff-metric-value">{results.jh.toFixed(2)} <span className="text-[9px] opacity-40">/ {(results.jh * MM_TO_MIL).toFixed(1)}</span></div>
                </div>
                <div className="zdiff-metric-badge">
                   <div className="zdiff-metric-label">Side (Js)</div>
                   <div className="zdiff-metric-value">{results.js.toFixed(2)} <span className="text-[9px] opacity-40">/ {(results.js * MM_TO_MIL).toFixed(1)}</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPCCalculator;
