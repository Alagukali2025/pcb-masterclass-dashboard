import React, { useState, useMemo } from 'react';
import { Zap, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

// ─── Interface Target Presets ─────────────────────────────────────────────────
const INTERFACE_PRESETS = [
  { name: 'USB 2.0',         zdiff: 90,  w: 0.18, s: 0.18, h: 0.17, t: 0.035, dk: 4.2,  tol: 15 },
  { name: 'USB 3.x',         zdiff: 90,  w: 0.18, s: 0.18, h: 0.17, t: 0.035, dk: 4.2,  tol: 10 },
  { name: 'PCIe Gen 1–2',    zdiff: 100, w: 0.20, s: 0.20, h: 0.20, t: 0.035, dk: 4.17, tol: 15 },
  { name: 'PCIe Gen 3–5',    zdiff: 100, w: 0.18, s: 0.16, h: 0.17, t: 0.035, dk: 3.1,  tol: 10 },
  { name: 'HDMI 2.x / DP',  zdiff: 100, w: 0.20, s: 0.20, h: 0.20, t: 0.035, dk: 4.17, tol: 15 },
  { name: 'LVDS',            zdiff: 100, w: 0.20, s: 0.20, h: 0.20, t: 0.035, dk: 4.17, tol: 20 },
  { name: '1G/10G Ethernet', zdiff: 100, w: 0.20, s: 0.20, h: 0.20, t: 0.035, dk: 4.17, tol: 15 },
];

// ─── IPC-2141A Formulas ───────────────────────────────────────────────────────
function calcResults(inputs, topology) {
  const h  = parseFloat(inputs.height)   || 0;
  const w  = parseFloat(inputs.width)    || 0;
  const t  = parseFloat(inputs.thickness)|| 0;
  const s  = parseFloat(inputs.spacing)  || 0;
  const er = parseFloat(inputs.dk)       || 0;

  if (h <= 0 || w <= 0 || er <= 0 || s <= 0) {
    return { z0: 0, zdiff: 0, effDk: 0, delay: 0, coupling: 0 };
  }

  let z0 = 0;
  let effDk = 0;
  let delay = 0;
  let zdiff = 0;

  if (topology === 'microstrip') {
    effDk = 0.475 * er + 0.67;
    z0    = (60 / Math.sqrt(effDk)) * Math.log((5.98 * h) / (0.8 * w + t));
    zdiff = 2 * z0 * (1 - 0.48 * Math.exp(-0.96 * (s / h)));
    delay = 84.75 * Math.sqrt(effDk);
  } else {
    // Symmetric Stripline: B = 2H + T
    const b = 2 * h + t;
    effDk = er;
    z0    = (60 / Math.sqrt(er)) * Math.log((1.9 * b) / (0.8 * w + t));
    zdiff = 2 * z0 * (1 - 0.347 * Math.exp(-2.9 * (s / b)));
    delay = 84.75 * Math.sqrt(er);
  }

  // Coupling coefficient k: from Zdiff = 2·Z0·(1 - k)
  const coupling = 1 - zdiff / (2 * z0);

  return {
    z0:      isFinite(z0)      ? z0      : 0,
    zdiff:   isFinite(zdiff)   ? zdiff   : 0,
    effDk:   isFinite(effDk)   ? effDk   : 0,
    delay:   isFinite(delay)   ? delay   : 0,
    coupling: isFinite(coupling) ? coupling : 0,
  };
}

// ─── SVG Cross-Section Diagram ────────────────────────────────────────────────
function CrossSection({ topology, inputs }) {
  const isStrip = topology === 'stripline';
  
  // Normalized dimensions for visual scaling (Base values)
  const hVal = parseFloat(inputs.height) || 0.2;
  const wVal = parseFloat(inputs.width)  || 0.18;
  const sVal = parseFloat(inputs.spacing)|| 0.2;

  // Scale factors (Clamped for visual stability)
  const hScale = Math.min(Math.max(hVal / 0.2, 0.5), 2.5);
  const wScale = Math.min(Math.max(wVal / 0.18, 0.3), 1.8);
  const sScale = Math.min(Math.max(sVal / 0.2, 0.2), 3.0);

  // SVG Geometric calculations
  const groundY = 107;
  const traceHeight = 8;
  const dielectricH = isStrip ? (42 * hScale * 2 + traceHeight) : 42 * hScale;
  
  // Vertical positioning
  const dielectricY = groundY - dielectricH;
  const topGroundY = dielectricY; 
  const traceY = isStrip 
    ? groundY - (dielectricH / 2) - (traceHeight / 2) 
    : groundY - dielectricH - traceHeight;
  
  // Horizontal positioning (Dynamic spacing and width)
  const traceW = 42 * wScale;
  const traceS = 26 * sScale;
  const centerSplit = 160;
  const traceP_X = centerSplit - traceS / 2 - traceW;
  const traceN_X = centerSplit + traceS / 2;

  return (
    <svg viewBox="0 0 320 130" className="zdiff-svg" aria-label="Differential pair cross-section diagram">
      {/* Top Ground Plane (stripline only) */}
      {isStrip && (
        <rect x="20" y={topGroundY} width="280" height="5" fill="var(--accent-primary)" rx="2" fillOpacity="0.75" />
      )}
      {/* Bottom Ground Plane */}
      <rect x="20" y={groundY} width="280" height="5" fill="var(--accent-primary)" rx="2" fillOpacity="0.75" />

      {/* Ground labels */}
      <text x="10" y={groundY + 5} fill="var(--accent-primary)" fontSize="7" fontWeight="700" fillOpacity="0.7">GND</text>
      {isStrip && (
        <text x="10" y={topGroundY + 5} fill="var(--accent-primary)" fontSize="7" fontWeight="700" fillOpacity="0.7">GND</text>
      )}

      {/* Dielectric fill */}
      <rect
        x="20" y={dielectricY}
        width="280"
        height={dielectricH}
        fill="var(--accent-primary)"
        fillOpacity="0.04"
        rx="2"
        style={{ transition: 'all 0.4s ease-in-out' }}
      />

      {/* D+ Trace */}
      <rect x={traceP_X} y={traceY} width={traceW} height={traceHeight} fill="var(--warning)" rx="2" style={{ transition: 'all 0.4s ease-in-out' }} />
      {/* D− Trace */}
      <rect x={traceN_X} y={traceY} width={traceW} height={traceHeight} fill="var(--warning)" rx="2" style={{ transition: 'all 0.4s ease-in-out' }} />

      {/* Trace labels */}
      <text x={traceP_X + traceW / 2} y={traceY - 5} fill="var(--warning)" fontSize="8" fontWeight="700" textAnchor="middle" style={{ transition: 'all 0.4s ease-in-out' }}>D+</text>
      <text x={traceN_X + traceW / 2} y={traceY - 5} fill="var(--warning)" fontSize="8" fontWeight="700" textAnchor="middle" style={{ transition: 'all 0.4s ease-in-out' }}>D−</text>

      {/* W dimension arrows */}
      <g style={{ transition: 'all 0.4s ease-in-out' }}>
        <line x1={traceP_X} y1={traceY + 16} x2={traceP_X + traceW} y2={traceY + 16} stroke="var(--warning)" strokeWidth="0.8" markerEnd="url(#arr)" markerStart="url(#arrL)" strokeOpacity="0.6" />
        <text x={traceP_X + traceW / 2} y={traceY + 25} fill="var(--warning)" fontSize="7" textAnchor="middle" fillOpacity="0.8">W</text>
      </g>

      {/* S dimension arrows */}
      <g style={{ transition: 'all 0.4s ease-in-out' }}>
        <line x1={traceP_X + traceW} y1={traceY + traceHeight / 2} x2={traceN_X} y2={traceY + traceHeight / 2} stroke="var(--text-tertiary)" strokeWidth="0.8" strokeDasharray="2,2" strokeOpacity="0.7" />
        <text x={centerSplit} y={traceY - 5} fill="var(--text-tertiary)" fontSize="7" textAnchor="middle" fillOpacity="0.8">S</text>
      </g>

      {/* H dimension */}
      <g style={{ transition: 'all 0.4s ease-in-out' }}>
        <line x1="310" y1={traceY + traceHeight / 2} x2="310" y2="107" stroke="var(--text-tertiary)" strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.5" />
        <text x={306} y={(traceY + traceHeight / 2 + 107) / 2} fill="var(--text-tertiary)" fontSize="7" fillOpacity="0.8" textAnchor="end">H</text>
      </g>

      {/* Topology label */}
      <text x="160" y="124" fill="var(--text-tertiary)" fontSize="7" textAnchor="middle" fillOpacity="0.6" fontStyle="italic">
        {isStrip ? 'Symmetric Stripline — embedded between two GND planes' : 'Edge-Coupled Microstrip — surface layer above GND plane'}
      </text>

      <defs>
        <marker id="arr"  markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4" fill="var(--warning)" fillOpacity="0.6" /></marker>
        <marker id="arrL" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto-start-reverse"><path d="M0,0 L4,2 L0,4" fill="var(--warning)" fillOpacity="0.6" /></marker>
      </defs>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ZdiffCalculator() {
  const [topology, setTopology]   = useState('microstrip');
  const [showInfo, setShowInfo]   = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [inputs, setInputs] = useState({
    height:    0.2,
    width:     0.18,
    thickness: 0.035,
    spacing:   0.2,
    dk:        4.17,
  });

  // Target zdiff from selected preset (default 100Ω)
  const targetZdiff = activePreset !== null ? INTERFACE_PRESETS[activePreset].zdiff : 100;
  const targetTol   = activePreset !== null ? INTERFACE_PRESETS[activePreset].tol   : 15;

  const results = useMemo(() => calcResults(inputs, topology), [inputs, topology]);

  const handleChange = (key, val) => {
    setActivePreset(null);
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  // ─── Data Synergy: Listen for external preset loads ─────────────────────────
  React.useEffect(() => {
    const handleRemoteLoad = (e) => {
      if (e && e.detail) {
        // Ensure values are numbers for state consistency
        const newInputs = {
          height:    parseFloat(e.detail.height)    || 0.2,
          width:     parseFloat(e.detail.width)     || 0.18,
          thickness: parseFloat(e.detail.thickness) || 0.035,
          spacing:   parseFloat(e.detail.spacing)   || 0.2,
          dk:        parseFloat(e.detail.dk)        || 4.17
        };
        setInputs(newInputs);
        setActivePreset(null);
        
        // Smarter scroll: Only scroll if calc is not mostly in view
        const el = document.getElementById('zdiff-calculator');
        if (el) {
          const rect = el.getBoundingClientRect();
          const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
          if (!isInView) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };
    window.addEventListener('zdiff:set-inputs', handleRemoteLoad);
    return () => window.removeEventListener('zdiff:set-inputs', handleRemoteLoad);
  }, []);

  const applyPreset = (idx) => {
    const p = INTERFACE_PRESETS[idx];
    setActivePreset(idx);
    setInputs({ height: p.h, width: p.w, thickness: p.t, spacing: p.s, dk: p.dk });
  };

  const delta   = parseFloat(results.zdiff) - targetZdiff;
  const absDelta = Math.abs(delta);
  const withinTol = absDelta <= targetTol;
  const isCritical = absDelta > targetTol * 2;

  const verdictColor = withinTol
    ? 'zdiff-verdict--ok'
    : isCritical ? 'zdiff-verdict--danger' : 'zdiff-verdict--warn';

  const VerdictIcon = withinTol
    ? <CheckCircle2 size={16} />
    : isCritical ? <AlertTriangle size={16} /> : <Info size={16} />;

  const verdictText = withinTol
    ? `✓ Within ±${targetTol} Ω target for ${activePreset !== null ? INTERFACE_PRESETS[activePreset].name : 'selected interface'}.`
    : delta < 0
      ? `Impedance ${absDelta.toFixed(1)} Ω too low. Increase H or reduce W/S.`
      : `Impedance ${absDelta.toFixed(1)} Ω too high. Decrease H or increase W.`;

  return (
    <div className="zdiff-calc slide-up" id="zdiff-calculator">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="zdiff-title">Zdiff Calculator</h3>
            <p className="zdiff-subtitle">Differential impedance per IPC-2141A — Microstrip & Stripline</p>
          </div>
        </div>
        {/* Topology Toggle */}
        <div className="zdiff-toggle-group">
          <button
            id="zdiff-toggle-microstrip"
            className={`zdiff-toggle-btn ${topology === 'microstrip' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setTopology('microstrip')}
          >
            Microstrip
          </button>
          <button
            id="zdiff-toggle-stripline"
            className={`zdiff-toggle-btn ${topology === 'stripline' ? 'zdiff-toggle-btn--active-orange' : ''}`}
            onClick={() => setTopology('stripline')}
          >
            Stripline
          </button>
        </div>
      </div>

      {/* ── Body: 2-col grid ── */}
      <div className="zdiff-body">

        {/* ── Left: Diagram + Inputs ── */}
        <div className="zdiff-left">
          {/* Cross-section diagram */}
          <div className="zdiff-diagram-box">
            <span className="zdiff-diagram-label">Interactive Cross-Section</span>
            <CrossSection topology={topology} inputs={inputs} />
          </div>

          {/* Input grid */}
          <div className="zdiff-input-grid">
            <div className="zdiff-input-group">
              <label htmlFor="zdiff-h" className="zdiff-label">H — Dielectric Height (mm)</label>
              <input
                id="zdiff-h"
                type="number" step="0.001" min="0.01" value={inputs.height}
                onChange={e => handleChange('height', e.target.value)}
                className="zdiff-input"
              />
            </div>
            <div className="zdiff-input-group">
              <label htmlFor="zdiff-w" className="zdiff-label">W — Trace Width (mm)</label>
              <input
                id="zdiff-w"
                type="number" step="0.001" min="0.01" value={inputs.width}
                onChange={e => handleChange('width', e.target.value)}
                className="zdiff-input"
              />
            </div>
            <div className="zdiff-input-group">
              <label htmlFor="zdiff-s" className="zdiff-label zdiff-label--orange">S — Intra-pair Spacing (mm)</label>
              <input
                id="zdiff-s"
                type="number" step="0.001" min="0.01" value={inputs.spacing}
                onChange={e => handleChange('spacing', e.target.value)}
                className="zdiff-input zdiff-input--orange"
              />
            </div>
            <div className="zdiff-input-group">
              <label htmlFor="zdiff-t" className="zdiff-label">T — Copper Thickness (mm)</label>
              <input
                id="zdiff-t"
                type="number" step="0.001" min="0.001" value={inputs.thickness}
                onChange={e => handleChange('thickness', e.target.value)}
                className="zdiff-input"
              />
            </div>
            <div className="zdiff-input-group">
              <label htmlFor="zdiff-dk" className="zdiff-label">εr — Dielectric Constant (Dk)</label>
              <input
                id="zdiff-dk"
                type="number" step="0.01" min="1" value={inputs.dk}
                onChange={e => handleChange('dk', e.target.value)}
                className="zdiff-input"
              />
            </div>
            <div className="zdiff-input-group zdiff-input-group--action">
              <button
                className="zdiff-info-btn"
                onClick={() => setShowInfo(true)}
                title="View IPC-2141A formula details"
              >
                <Info size={13} /> Standards Info
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: Results + Presets ── */}
        <div className="zdiff-right">
          {/* Main Result Card */}
          <div className="zdiff-result-card">
            <div className="zdiff-result-label">Zdiff — Differential Impedance</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num">{results.zdiff.toFixed(2)}</span>
              <span className="zdiff-result-unit">Ω</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Z₀ Single-Ended</div>
                <div className="zdiff-result-sub-val">{results.z0.toFixed(2)} <small>Ω</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Coupling (k)</div>
                <div className="zdiff-result-sub-val">{results.coupling.toFixed(4)}</div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Prop. Delay</div>
                <div className="zdiff-result-sub-val">{results.delay.toFixed(1)} <small>ps/in</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Eff. Dk (εr,eff)</div>
                <div className="zdiff-result-sub-val">{results.effDk.toFixed(2)}</div>
              </div>
            </div>

            {/* Design Verdict */}
            <div className={`zdiff-verdict ${verdictColor}`}>
              <div className="zdiff-verdict-icon">{VerdictIcon}</div>
              <div>
                <p className="zdiff-verdict-title">Design Verdict</p>
                <p className="zdiff-verdict-body">{verdictText}</p>
              </div>
            </div>
          </div>

          {/* Interface Presets */}
          <div className="zdiff-presets-box">
            <h5 className="zdiff-presets-title">Interface Quick-Presets</h5>
            <div className="zdiff-presets-grid">
              {INTERFACE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  id={`zdiff-preset-${idx}`}
                  className={`zdiff-preset-btn ${activePreset === idx ? 'zdiff-preset-btn--active' : ''}`}
                  onClick={() => applyPreset(idx)}
                >
                  <span className="zdiff-preset-name">{p.name}</span>
                  <span className="zdiff-preset-ohm">{p.zdiff} Ω</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Modal ── */}
      {showInfo && (
        <div className="zdiff-modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="zdiff-modal" onClick={e => e.stopPropagation()}>
            <button className="zdiff-modal-close" onClick={() => setShowInfo(false)} aria-label="Close">
              <X size={20} />
            </button>
            <h4 className="zdiff-modal-title">IPC-2141A Formulas</h4>
            <p className="zdiff-modal-body">
              Calculations use the Wheeler/Hammerstad approximation for microstrip and the standard symmetric
              stripline formula as defined in IPC-2141A Appendix A. These match the models used in Polar Si9000,
              Altium, and Cadence Constraint Manager.
            </p>

            <div className="zdiff-modal-code">
              <div className="zdiff-modal-code-label">Microstrip Z₀</div>
              <code>Z0 = [60 / √(0.475·εr + 0.67)] · ln[5.98H / (0.8W + T)]</code>
            </div>

            <div className="zdiff-modal-code">
              <div className="zdiff-modal-code-label">Stripline Z₀ (Symmetric, B = 2H + T)</div>
              <code>Z0 = [60 / √er] · ln[1.9B / (0.8W + T)]</code>
            </div>

            <div className="zdiff-modal-code">
              <div className="zdiff-modal-code-label">Differential Coupling — Microstrip</div>
              <code>Zdiff = 2·Z0 · (1 − 0.48·exp(−0.96·S/H))</code>
            </div>

            <div className="zdiff-modal-code">
              <div className="zdiff-modal-code-label">Differential Coupling — Stripline</div>
              <code>Zdiff = 2·Z0 · (1 − 0.347·exp(−2.9·S/B))</code>
            </div>

            <div className="zdiff-modal-disclaimer">
              ⚠ Validate all results with a 2D field solver (Polar Si9000, Ansys SIwave) before PCB tape-out. 
              Approximation error is typically ±5 Ω depending on geometry.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
