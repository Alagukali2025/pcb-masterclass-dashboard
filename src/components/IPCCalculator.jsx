import React, { useState, useMemo } from 'react';
import { Calculator, Ruler, MousePointer2, Info, CheckCircle2, X } from 'lucide-react';

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

const CalculatorDiagram = ({ type, activeField }) => {
  if (type === 'CHIP') {
    return (
      <svg className="calc-svg" viewBox="0 0 200 120">
        <rect x="50" y="30" width="100" height="60" rx="4" className="svg-body" />
        <rect x="50" y="30" width="20" height="60" rx="1" className="svg-terminal" />
        <rect x="130" y="30" width="20" height="60" rx="1" className="svg-terminal" />
        
        {/* L Max Label */}
        <line x1="50" y1="105" x2="150" y2="105" className={`svg-dim-line ${activeField === 'lMax' ? 'active' : ''}`} />
        <text x="100" y="115" textAnchor="middle" className={`svg-dim-text ${activeField === 'lMax' ? 'active' : ''}`}>L (Body Length)</text>
        
        {/* T Min (S) Label */}
        <line x1="70" y1="60" x2="130" y2="60" className={`svg-dim-line ${activeField === 'tMin' ? 'active' : ''}`} />
        <text x="100" y="55" textAnchor="middle" className={`svg-dim-text ${activeField === 'tMin' ? 'active' : ''}`}>S (Separation)</text>
        
        {/* W Max Label */}
        <line x1="170" y1="30" x2="170" y2="90" className={`svg-dim-line ${activeField === 'wMax' ? 'active' : ''}`} />
        <text x="175" y="60" transform="rotate(90, 175, 60)" className={`svg-dim-text ${activeField === 'wMax' ? 'active' : ''}`}>W (Width)</text>
      </svg>
    );
  }
  return (
    <svg className="calc-svg" viewBox="0 0 200 120">
      <rect x="60" y="35" width="80" height="50" rx="2" className="svg-body" />
      {/* IC Leads */}
      {[0, 1, 2].map(i => (
        <React.Fragment key={i}>
          <rect x="40" y={40 + i*15} width="20" height="10" rx="1" className="svg-lead" />
          <rect x="140" y={40 + i*15} width="20" height="10" rx="1" className="svg-lead" />
        </React.Fragment>
      ))}
      
      {/* L Max (Overall Span) */}
      <line x1="40" y1="105" x2="160" y2="105" className={`svg-dim-line ${activeField === 'lMax' ? 'active' : ''}`} />
      <text x="100" y="115" textAnchor="middle" className={`svg-dim-text ${activeField === 'lMax' ? 'active' : ''}`}>L (Overall Span)</text>
      
      {/* T Min (Heel Span) */}
      <line x1="60" y1="65" x2="140" y2="65" className={`svg-dim-line ${activeField === 'tMin' ? 'active' : ''}`} />
      <text x="100" y="60" textAnchor="middle" className={`svg-dim-text ${activeField === 'tMin' ? 'active' : ''}`}>T (Heel Span)</text>
    </svg>
  );
};

const IPCCalculator = () => {
  const [inputs, setInputs] = useState({
    lMax: 1.6,
    wMax: 0.8,
    tMin: 0.4,
    height: 0.45,
    pitch: 0.50
  });
  const [packageType, setPackageType] = useState('CHIP');
  const [densityLevel, setDensityLevel] = useState('B');
  const [activeField, setActiveField] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const results = useMemo(() => {
    const { lMax, wMax, tMin } = inputs;
    const { jt, jh, js } = IPC_CONSTANTS.FILLET_GOALS[packageType][densityLevel];
    const { CL, CS, CP } = IPC_CONSTANTS.TOLERANCES;
    
    const rms = Math.sqrt(Math.pow(CL, 2) + Math.pow(CS, 2) + Math.pow(CP, 2));
    
    // Safety check for empty inputs
    const l = parseFloat(lMax || 0);
    const t = parseFloat(tMin || 0);
    const w = parseFloat(wMax || 0);

    const Z = l + 2 * jt + rms;
    const G = t - 2 * jh - rms;
    const X = w + 2 * js + rms;
    
    const padLength = (Z - G) / 2;
    const centerToCenter = G + padLength;

    // IPC-7351B Naming Logic (Simplified for Chip components)
    // Format: [PTYP][LENGTH][WIDTH]X[HEIGHT][DENSITY]
    const formatDim = (d) => Math.round(parseFloat(d) * 100).toString().padStart(4, '0');
    const pType = packageType === 'CHIP' ? 'RESC' : 'SOP';
    const name = `${pType}${formatDim(lMax)}${formatDim(wMax)}X${formatDim(inputs.height)}${densityLevel}`;

    return {
      z: Z.toFixed(3),
      g: G.toFixed(3),
      x: X.toFixed(3),
      ipcName: name,
      padLength: padLength.toFixed(3),
      centerToCenter: centerToCenter.toFixed(3),
      rms: rms.toFixed(3),
      jt, jh, js
    };
  }, [inputs, packageType, densityLevel]);

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.ipcName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ipc-calculator slide-up">
      <div className="calc-header">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <Calculator className="text-accent-primary" size={20} />
            <h3 className="calc-title">IPC-7351B Real-Time Calculator</h3>
            <CheckCircle2 className="text-secondary-status" size={14} />
          </div>
          <div className="tooltip-container">
            <button 
              className="text-xs text-text-dim hover:text-accent-primary flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-md transition-colors"
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info size={14} />
              Technical Reference
            </button>
            
            {showTooltip && (
              <div className="calc-tooltip animate-fade-in">
                <div className="tooltip-arrow"></div>
                <div className="tooltip-header">
                  <span>IPC-7351B Formulas</span>
                  <button onClick={() => setShowTooltip(false)}><X size={12} /></button>
                </div>
                <div className="tooltip-body">
                  <div className="formula-line">Z = L<sub>max</sub> + 2J<sub>t</sub> + RMS</div>
                  <div className="formula-line">G = T<sub>min</sub> - 2J<sub>h</sub> - RMS</div>
                  <div className="formula-line">X = W<sub>max</sub> + 2J<sub>s</sub> + RMS</div>
                  <div className="tooltip-divider"></div>
                  <div className="tooltip-stats">
                    Active Goals (Density {densityLevel}):<br/>
                    Jt: {results.jt} | Jh: {results.jh} | Js: {results.js}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="calc-subtitle">Standards-verified pad dimension solver (Datasheet-to-IPC mapping seed).</p>
      </div>

      <div className="calc-grid">
        {/* INPUT PANEL */}
        <div className="calc-panel input-panel">
          <div className="panel-section">
            <h4 className="panel-title">1. Configuration</h4>
            <div className="toggle-group">
              <button 
                className={`toggle-btn ${packageType === 'GULL_WING' ? 'active' : ''}`}
                onClick={() => setPackageType('GULL_WING')}
              >
                Leaded IC (Gull-wing)
              </button>
              <button 
                className={`toggle-btn ${packageType === 'CHIP' ? 'active' : ''}`}
                onClick={() => setPackageType('CHIP')}
              >
                Passive (Chip/Res/Cap)
              </button>
            </div>
            <div className="toggle-group mt-3">
              {['A', 'B', 'C'].map(level => (
                <button 
                  key={level}
                  className={`toggle-btn ${densityLevel === level ? 'active' : ''}`}
                  onClick={() => setDensityLevel(level)}
                >
                  Density {level}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section diagram-wrapper no-select py-4">
             <CalculatorDiagram type={packageType} activeField={activeField} />
          </div>

          <div className="panel-section mt-2">
            <h4 className="panel-title">2. Engineering Inputs (mm)</h4>
            <div className="input-group-grid">
              <div className="input-item">
                <label>L (Length) / L<sub>max</sub> (mm)</label>
                <div className="input-with-desc">
                  <input 
                    type="number" 
                    step="0.01" 
                    value={inputs.lMax} 
                    onFocus={() => setActiveField('lMax')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => handleInputChange('lMax', e.target.value)}
                  />
                </div>
              </div>
              <div className="input-item">
                <label>W (Width) / W<sub>max</sub> (mm)</label>
                <div className="input-with-desc">
                  <input 
                    type="number" 
                    step="0.01" 
                    value={inputs.wMax} 
                    onFocus={() => setActiveField('wMax')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => handleInputChange('wMax', e.target.value)}
                  />
                </div>
              </div>
              <div className="input-item">
                <label>H (Height) / H<sub>max</sub> (mm)</label>
                <div className="input-with-desc">
                  <input 
                    type="number" 
                    step="0.01" 
                    value={inputs.height} 
                    onFocus={() => setActiveField('height')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                </div>
              </div>
              <div className="input-item">
                <label>S (Gap) / T<sub>min</sub> (mm)</label>
                <div className="input-with-desc">
                  <input 
                    type="number" 
                    step="0.01" 
                    value={inputs.tMin} 
                    onFocus={() => setActiveField('tMin')}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => handleInputChange('tMin', e.target.value)}
                  />
                </div>
              </div>
              {packageType === 'GULL_WING' && (
                <div className="input-item">
                  <label>e (Lead Pitch) (mm)</label>
                  <div className="input-with-desc">
                    <input 
                      type="number" 
                      step="0.01" 
                      value={inputs.pitch} 
                      onFocus={() => setActiveField('pitch')}
                      onBlur={() => setActiveField(null)}
                      onChange={(e) => handleInputChange('pitch', e.target.value)}
                    />
                    <small className="help-text">Center-to-center distance</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RESULT PANEL */}
        <div className="calc-panel result-panel">
          <div className="panel-section">
            <h4 className="panel-title text-accent">3. Calculated Pad Dimensions</h4>
            
            <div className="result-main">
              <div className="result-card glow-cyan">
                <span className="res-label">PAD LENGTH (Y)</span>
                <span className="res-value">{results.padLength} <small>mm</small></span>
              </div>
              <div className="result-card glow-green">
                <span className="res-label">PAD WIDTH (X)</span>
                <span className="res-value">{results.x} <small>mm</small></span>
              </div>
            </div>

            <div className="ipc-name-display mt-4 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
              <div>
                <span className="block text-[10px] text-text-dim uppercase tracking-wider mb-1">IPC-7351B Standard Name</span>
                <code className="text-accent-primary font-mono text-sm">{results.ipcName}</code>
              </div>
              <button 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${copied ? 'bg-secondary-status text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={copyToClipboard}
              >
                {copied ? <CheckCircle2 size={12} /> : null}
                {copied ? 'Copied!' : 'Copy Name'}
              </button>
            </div>

            <div className="result-details">
              <div className="detail-item">
                <div className="detail-row">
                  <Ruler size={12} className="text-muted" />
                  <span>Outer Boundary (Z)</span>
                  <span className="detail-val">{results.z} mm</span>
                </div>
                <div className="detail-row">
                  <MousePointer2 size={12} className="text-muted" />
                  <span>Inner Gap (G)</span>
                  <span className="detail-val">{results.g} mm</span>
                </div>
                <div className="detail-row">
                  <Info size={12} className="text-muted" />
                  <span>Center-to-Center (C)</span>
                  <span className="detail-val">{results.centerToCenter} mm</span>
                </div>
              </div>
            </div>

            <div className="calc-formula-mini">
              <span className="text-secondary">Z = L + 2·Jt + RMS</span>
              <span className="text-secondary ml-4">RMS = 0.115 mm</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="calc-footer">
        <Info size={14} className="mr-2 text-accent" />
        <span>Values calculated per IPC-7351B methodologies. Formulas include fabrication (CL), placement (CS), and stencil (CP) tolerances.</span>
      </div>
    </div>
  );
};

export default IPCCalculator;
