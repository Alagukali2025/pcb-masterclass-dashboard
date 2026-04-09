import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, ShieldCheck, Zap, Ruler, Sliders, Activity } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import EngineeringInput from './EngineeringInput';

// ─── Status helpers ────────────────────────────────────────────────────────────
function StatusBadge({ level }) {
  const map = {
    pass:     { label: 'PASS',     cls: 'dfm-badge-pass',    Icon: CheckCircle2 },
    warn:     { label: 'MARGINAL', cls: 'dfm-badge-warn',    Icon: AlertCircle  },
    fail:     { label: 'FAIL',     cls: 'dfm-badge-fail',    Icon: AlertTriangle },
    alert:    { label: 'ALERT',    cls: 'dfm-badge-alert',   Icon: Zap           },
  };
  const { label, cls, Icon } = map[level] || map.pass;
  return (
    <span className={`dfm-status-badge ${cls}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}

function RulePanel({ title, icon: Icon, accentClass, status, result, children }) {
  const borderMap = { pass: 'dfm-panel-pass', warn: 'dfm-panel-warn', fail: 'dfm-panel-fail', alert: 'dfm-panel-alert' };
  return (
    <div className={`dfm-rule-panel ${borderMap[status] || ''}`}>
      <div className="dfm-rule-header">
        <div className="dfm-rule-title-row">
          <div className={`dfm-rule-icon-wrap ${accentClass}`}>
            <Icon size={16} />
          </div>
          <span className="dfm-rule-title">{title}</span>
        </div>
        <div className="dfm-rule-result-row">
          {result && <span className="dfm-rule-result-value">{result}</span>}
          <StatusBadge level={status} />
        </div>
      </div>
      <div className="dfm-rule-body">{children}</div>
    </div>
  );
}

export default function DFMRuleChecker() {
  const { activeStackup, updateStackup } = useDesign();

  // 1. Core Component States (Hooks ALWAYS at the top)
  const [thickness, setThickness] = useState(1.6);
  const [drill, setDrill]         = useState(0.2);
  const [copperOz, setCopperOz]   = useState(1);
  const [isManualOz, setIsManualOz] = useState(false);
  const [traceWidth, setTraceWidth] = useState(5); // mil
  const [topCopper, setTopCopper] = useState(60); // %
  const [padDia, setPadDia]       = useState(0.5); // mm
  const [isManualTrace, setIsManualTrace] = useState(false);

  // 2. SSOT Synchronizers
  useEffect(() => {
    if (activeStackup.height < 0.1) setThickness(0.8);
  }, [activeStackup.height]);

  useEffect(() => {
    if (!isManualTrace) {
      const widthMil = parseFloat((activeStackup.width * 39.37).toFixed(1));
      setTraceWidth(widthMil);
    }
    
    if (!isManualOz) {
      if (activeStackup.thickness >= 0.07) setCopperOz(2);
      else if (activeStackup.thickness >= 0.03) setCopperOz(1);
      else setCopperOz(0.5);
    }
  }, [activeStackup.width, activeStackup.thickness, isManualOz, isManualTrace]);

  // 3. Derived Engineering Variables
  const bottomCopper = 100 - topCopper;

  // ─── Rule 1: Aspect Ratio ────────────────────────────────
  const aspectRatio  = drill > 0 ? parseFloat((thickness / drill).toFixed(2)) : 0;
  const arLimits = activeStackup.ipcClass === 3 ? { fail: 8, warn: 6 } : activeStackup.ipcClass === 1 ? { fail: 12, warn: 10 } : { fail: 10, warn: 8 };
  const arStatus = aspectRatio > arLimits.fail ? 'fail' : aspectRatio > arLimits.warn ? 'warn' : 'pass';
  const arMessage = aspectRatio > arLimits.fail
    ? `CRITICAL ASPECT RATIO. IPC Class ${activeStackup.ipcClass} limit is ${arLimits.fail}:1. Plating voids likely.`
    : aspectRatio > arLimits.warn
    ? `Marginal Aspect Ratio (${arLimits.warn}-${arLimits.fail}:1). Confirm capabilities with fabricator.`
    : `Aspect ratio ${aspectRatio}:1 satisfies IPC Class ${activeStackup.ipcClass} standards.`;

  // ─── Rule 2: Trace vs Copper ─────────────────────────────
  const baseMinTrace = { 0.5: 3, 1: 4, 2: 6 };
  const classBuffer = activeStackup.ipcClass === 3 ? 2 : activeStackup.ipcClass === 1 ? -1 : 0;
  const minSafe = (baseMinTrace[copperOz] || 4) + classBuffer;
  const traceStatus = traceWidth < minSafe ? (copperOz >= 2 ? 'fail' : 'alert') : 'pass';
  const traceMessage = traceWidth < minSafe
    ? `Etch factor risk. For Class ${activeStackup.ipcClass}, min safe width is ${minSafe} mil.`
    : `Trace width safe for IPC Class ${activeStackup.ipcClass} reliability.`;

  // ─── Rule 3: Copper Balance ──────────────────────────────
  const imbalance = Math.abs(topCopper - bottomCopper);
  const balLimits = activeStackup.ipcClass === 3 ? { fail: 20, warn: 10 } : activeStackup.ipcClass === 1 ? { fail: 40, warn: 20 } : { fail: 30, warn: 15 };
  const balStatus = imbalance > balLimits.fail ? 'fail' : imbalance > balLimits.warn ? 'warn' : 'pass';
  const balMessage = imbalance > balLimits.fail
    ? `EXCESSIVE IMBALANCE. Bow/Twist likely to exceed 0.75% for Class ${activeStackup.ipcClass}.`
    : imbalance > balLimits.warn
    ? `Moderate imbalance. Consider thieving for Class ${activeStackup.ipcClass} flatness.`
    : `Copper balance satisfies IPC-6012E requirements.`;

  // ─── Rule 4: High-Speed Coupling ─────────────────────────
  const shRatio = activeStackup.height > 0 ? activeStackup.spacing / activeStackup.height : 0;
  const cpLimit = activeStackup.ipcClass === 3 ? 2.5 : 3.0;
  const cpStatus = shRatio > cpLimit ? 'alert' : shRatio < 1 ? 'pass' : 'warn';
  const cpMessage = shRatio > cpLimit
    ? `LOOSE COUPLING. Crosstalk risk for Class ${activeStackup.ipcClass} High-Speed protocols.`
    : shRatio < 1 ? `TIGHT COUPLING. Optimal SI and EMI suppression.` : `MODERATE COUPLING. Verify crosstalk margins.`;

  // ─── Rule 5: Annular Ring ───────────────────────────────
  const annularRing = (padDia - drill) / 2;
  // IPC-2221B Table 9-2: Min annular ring (external layers)
  // Class 1: 0.05mm (breakout allowed), Class 2: 0.05mm (limited breakout), Class 3: 0.05mm (NO breakout — zero tolerance)
  // IPC-6012E preferred: 0.10mm for Class 3 reliability
  const ringLimit = activeStackup.ipcClass === 3 ? 0.075 : 0.05; 
  const ringLimitMil = (ringLimit * 39.3701).toFixed(1);
  const annularRingMil = (annularRing * 39.3701).toFixed(2);
  const ringStatus = annularRing < ringLimit ? 'fail' : annularRing < ringLimit + 0.05 ? 'warn' : 'pass';
  const ringMessage = annularRing < ringLimit
    ? `CRITICAL ANNULAR RING. Breakout risk. IPC Class ${activeStackup.ipcClass} requires min ${ringLimit}mm (${ringLimitMil} mil).${activeStackup.ipcClass === 3 ? ' Zero breakout allowed for Class 3 — IPC-6012E recommends 0.10mm.' : ''}`
    : `Annular ring satisfies IPC Class ${activeStackup.ipcClass} minimums.${activeStackup.ipcClass === 3 ? ' Note: Class 3 permits zero breakout (IPC-6012E).' : ''}`;

  // ─── Rule 6: Solder Mask Dam ────────────────────────────
  const maskDam = activeStackup.spacing; 
  const damLimit = activeStackup.ipcClass === 3 ? 0.125 : activeStackup.ipcClass === 1 ? 0.075 : 0.1; 
  const damLimitMil = (damLimit * 39.3701).toFixed(1);
  const damStatus = maskDam < damLimit ? 'fail' : maskDam < damLimit + 0.05 ? 'warn' : 'pass';
  const damMessage = maskDam < damLimit
    ? `BRIDGE RISK. Solder mask dam < ${damLimit}mm (${damLimitMil} mil) fails Class ${activeStackup.ipcClass} standards.`
    : `Solder mask dam satisfies ${damLimit}mm (${damLimitMil} mil) reliability threshold.`;

  return (
    <div className="dfm-card slide-up">
      {/* Header */}
      <div className="dfm-header">
        <div className="dfm-icon-wrap">
          <ShieldCheck size={20} className="dfm-header-icon" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="dfm-title">Real-Time DFM Rule Checker</h4>
            <span className="px-2 py-0.5 rounded-full bg-blue-10 text-[8px] font-black text-blue-500 border border-blue-20 animate-pulse">SSOT SYNC ACTIVE</span>
          </div>
          <p className="dfm-subtitle">IPC-2221B & 6012E · 6 Active Rule Engines · Live Validation</p>
        </div>
        <div className="ml-auto">
          <div className="zdiff-toggle-group">
            {[1, 2, 3].map(cls => (
              <button
                key={cls}
                type="button"
                className={`zdiff-toggle-btn text-[10px] font-bold ${activeStackup.ipcClass === cls ? 'zdiff-toggle-btn--active-orange' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  updateStackup({ ipcClass: cls });
                }}
              >
                Class {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dfm-rules-grid">

        {/* Rule 1: Aspect Ratio */}
        <RulePanel title="Rule 1 — Drill Aspect Ratio" icon={Ruler} accentClass="dfm-accent-blue" status={arStatus} result={`${aspectRatio}:1`}>
          <div className="dfm-inputs-row">
            <EngineeringInput 
              label={`Board Thickness (${(thickness * 39.37).toFixed(0)} mil)`} unit="mm" value={thickness} 
              onChange={e => { const val = e.target.value; if (val === "" || isNaN(parseFloat(val))) return; setThickness(Number(val)); }}
              step="0.1" min="0.4" max="6" 
            />
            <EngineeringInput 
              label={`Smallest Drill (${(drill * 39.37).toFixed(1)} mil)`} unit="mm" value={drill} 
              onChange={e => { const val = e.target.value; if (val === "" || isNaN(parseFloat(val))) return; setDrill(Number(val)); }}
              step="0.05" min="0.05" max="3" 
            />
          </div>
          <div className="dfm-bar-wrap">
            <div className="dfm-bar-track">
              <div className={`dfm-bar-fill dfm-bar-${arStatus}`} style={{ width: `${Math.min((aspectRatio / 14) * 100, 100)}%` }} />
              <div className="dfm-bar-marker" style={{ left: `${(arLimits.warn/14)*100}%` }} title="Warning" />
              <div className="dfm-bar-marker dfm-bar-marker-red" style={{ left: `${(arLimits.fail/14)*100}%` }} title="Limit" />
            </div>
            <div className="dfm-bar-labels">
              <span>0:1</span><span>{arLimits.warn}:1 Warn</span><span>{arLimits.fail}:1 Fail</span><span>14:1+</span>
            </div>
          </div>
          <p className="dfm-message">{arMessage}</p>
        </RulePanel>

        {/* Rule 2: Copper vs Trace */}
        <RulePanel title="Rule 2 — Copper Weight vs. Trace Width" icon={Zap} accentClass="dfm-accent-amber" status={traceStatus} result={`${traceWidth} mil / ${copperOz}oz Cu`}>
          <div className="flex items-center justify-between mb-3">
             <p className={`text-[10px] font-bold italic flex items-center gap-1 ${isManualOz || isManualTrace ? 'text-orange-500' : 'text-blue-500'}`}>
              {isManualOz || isManualTrace ? (
                <>🚧 Manual "What-if" Mode active</>
              ) : (
                <>⚡ Auto-synced from Stackup Engine</>
              )}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => { setIsManualOz(!isManualOz); setIsManualTrace(!isManualTrace); }}
                className={`px-2 py-0.5 rounded-md text-[9px] font-black border transition-all ${isManualOz ? 'bg-orange-500 text-white border-orange-600' : 'bg-black-40 text-tertiary border-white-10'}`}
              >
                {isManualOz ? 'SYNC TO LIVE' : 'ENABLE MANUAL'}
              </button>
            </div>
          </div>
          
          <div className="dfm-inputs-row">
            <div className="dfm-input-group">
              <label className="dfm-input-label">Copper Weight</label>
              <div className="dfm-select-group">
                {[0.5, 1, 2].map(oz => (
                  <button 
                    key={oz} 
                    className={`dfm-oz-btn ${copperOz === oz ? 'dfm-oz-active' : ''}`} 
                    disabled={!isManualOz}
                    onClick={() => setCopperOz(oz)}
                  > 
                    {oz} oz 
                  </button>
                ))}
              </div>
            </div>
            <div className="dfm-input-group">
              <EngineeringInput 
                label="Trace Width" unit="mil" value={traceWidth} 
                onChange={e => { if (isManualTrace) setTraceWidth(Number(e.target.value)); }}
                step="0.5" min="1" max="50"
                disabled={!isManualTrace}
              />
            </div>
          </div>
          <div className="dfm-etch-guide">
            {[0.5, 1, 2].map(oz => (
              <div key={oz} className={`dfm-etch-item ${copperOz === oz ? 'dfm-etch-active' : 'opacity-40'}`}>
                <span className="dfm-etch-oz">{oz}oz Cu</span>
                <span className="dfm-etch-min">Safe Min: {(baseMinTrace[oz] || 4) + classBuffer} mil</span>
              </div>
            ))}
          </div>
          <p className="dfm-message">{traceMessage}</p>
        </RulePanel>

        {/* Rule 3: Copper Density Balance */}
        <RulePanel title="Rule 3 — Copper Balance (Bow/Twist)" icon={Sliders} accentClass="dfm-accent-cyan" status={balStatus} result={`${imbalance}% Δ`}>
          <div className="dfm-balance-group">
            <label className="dfm-input-label">Top: <strong>{topCopper}%</strong> | Bottom: <strong>{bottomCopper}%</strong></label>
            <input type="range" min="10" max="90" value={topCopper} onChange={e => setTopCopper(Number(e.target.value))} className="dfm-slider" />
            <div className="dfm-balance-bar"><div className="dfm-balance-top" style={{ width: `${topCopper}%` }} /></div>
          </div>
          <p className="dfm-message">{balMessage}</p>
        </RulePanel>

        {/* Rule 4: High-Speed Coupling */}
        <RulePanel title="Rule 4 — Signal Coupling (S/H Ratio)" icon={Activity} accentClass="dfm-accent-red" status={cpStatus} result={`${shRatio.toFixed(2)} S/H`}>
          <div className="p-4 bg-black-20 rounded-xl border border-white-05 mb-4">
            <div className="flex justify-between text-[10px] font-bold text-tertiary uppercase tracking-widest mb-2"><span>Tight</span><span>Loose</span></div>
            <div className="h-2 bg-black-40 rounded-full overflow-hidden relative border border-white-05">
              <div className={`h-full transition-all duration-500 ${shRatio > 3 ? 'bg-red-500' : shRatio < 1 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${Math.min((shRatio / 5) * 100, 100)}%` }} />
            </div>
          </div>
          <p className="dfm-message">{cpMessage}</p>
        </RulePanel>

        {/* Rule 5: Annular Ring */}
        <RulePanel title="Rule 5 — Annular Ring Support" icon={ShieldCheck} accentClass="dfm-accent-green" status={ringStatus} result={`${annularRing.toFixed(3)} mm (${(annularRing * 39.37).toFixed(1)} mil)`}>
          <p className="text-[10px] text-blue-500 font-bold mb-3 italic">⚡ Validating against IPC Class {activeStackup.ipcClass}</p>
          <div className="dfm-inputs-row">
            <EngineeringInput 
              label={`Pad Diameter (${(padDia * 39.37).toFixed(1)} mil)`} unit="mm" value={padDia} 
              onChange={e => { const val = e.target.value; if (val === "" || isNaN(parseFloat(val))) return; setPadDia(Number(val)); }}
              step="0.05" min="0.1" max="5" 
            />
            <div className="dfm-input-group">
                <label className="dfm-input-label">Min Threshold</label>
                <div className="dfm-input-wrap opacity-60"><div className="dfm-input bg-transparent">{ringLimit}mm ({(ringLimit * 39.37).toFixed(1)} mil)</div></div>
            </div>
          </div>
          <p className="dfm-message">{ringMessage}</p>
        </RulePanel>

        {/* Rule 6: Solder Mask Dam */}
        <RulePanel title="Rule 6 — Mask Bridge / Dam" icon={AlertTriangle} accentClass="dfm-accent-purple" status={damStatus} result={`${maskDam.toFixed(2)} mm (${(maskDam * 39.37).toFixed(1)} mil)`}>
          <div className="p-4 bg-black-20 rounded-xl border border-white-05 mb-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="h-1 bg-black-40 rounded-full overflow-hidden">
                    <div className={`h-full ${damStatus === 'fail' ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${Math.min((maskDam / 0.3) * 100, 100)}%` }} />
                </div>
              </div>
              <span className="text-[10px] font-mono text-tertiary">LVL: {(damStatus || '').toUpperCase()}</span>
          </div>
          <p className="dfm-message">{damMessage}</p>
        </RulePanel>

      </div>

      <div className="dfm-summary">
        <span className="dfm-summary-label">Aggregate DFM Health:</span>
        {[arStatus, traceStatus, balStatus, cpStatus, ringStatus, damStatus].some(s => s === 'fail' || s === 'alert')
          ? <StatusBadge level="fail" />
          : [arStatus, traceStatus, balStatus, cpStatus, ringStatus, damStatus].some(s => s === 'warn')
          ? <StatusBadge level="warn" />
          : <StatusBadge level="pass" />
        }
        <span className="dfm-summary-note">Verification active for Design ID: <strong>DFM-7351A-PRO</strong></span>
      </div>
    </div>
  );
}
