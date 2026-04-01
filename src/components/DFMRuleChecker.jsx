import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, AlertCircle, ShieldCheck, Zap, Ruler, Sliders } from 'lucide-react';

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
  // Rule 1 — Aspect Ratio
  const [thickness, setThickness] = useState(1.6);
  const [drill, setDrill]         = useState(0.25);

  // Rule 2 — Copper vs Trace
  const [copperOz, setCopperOz]   = useState(1);
  const [traceWidth, setTraceWidth] = useState(5); // mil

  // Rule 3 — Copper Balance
  const [topCopper, setTopCopper] = useState(60); // %
  const bottomCopper = 100 - topCopper;

  // ─── Rule 1 calculations ──────────────────────────────────────────
  const aspectRatio  = drill > 0 ? parseFloat((thickness / drill).toFixed(2)) : 0;
  const arStatus     = aspectRatio > 10 ? 'fail' : aspectRatio > 8 ? 'warn' : 'pass';
  const arMessage    = aspectRatio > 10
    ? 'High Risk for Plating Voids — Consult Fabricator. The drill hole cannot be reliably plated at this depth-to-diameter ratio.'
    : aspectRatio > 8
    ? 'Marginal zone (8–10:1). Achievable with controlled-depth drilling or Class 3 vendors, but confirm fab capability.'
    : 'Aspect ratio is within IPC-2221B standard limits. Suitable for Class 2 production at all Tier 1 fabricators.';

  // ─── Rule 2 calculations ──────────────────────────────────────────
  const minTrace = { 0.5: 3, 1: 4, 2: 6 };
  const minSafe  = minTrace[copperOz] || 4;
  const traceStatus = traceWidth < minSafe ? (copperOz >= 2 ? 'fail' : 'alert') : 'pass';
  const traceMessage = traceWidth < minSafe
    ? `Etch factor may reduce yield. At ${copperOz}oz copper, traces narrower than ${minSafe} mil tend to over-etch during chemical process, causing opens. Consider increasing trace width or reducing copper weight.`
    : `Trace width is safe for ${copperOz}oz copper. Minimum safe width of ${minSafe} mil satisfied.`;

  // ─── Rule 3 calculations ──────────────────────────────────────────
  const imbalance   = Math.abs(topCopper - bottomCopper);
  const balStatus   = imbalance > 30 ? 'fail' : imbalance > 15 ? 'warn' : 'pass';
  const balMessage  = imbalance > 30
    ? 'Severe copper imbalance. High risk of board bow/twist (>0.75%) during reflow. Add copper thieving to the sparse layer side immediately.'
    : imbalance > 15
    ? 'Moderate imbalance detected. Consider copper thieving fills on the sparser side to equalise resin flow during lamination press.'
    : 'Copper density is well-balanced. Board symmetry meets IPC-6012 bow & twist criteria (<0.75%).';

  return (
    <div className="dfm-card slide-up">
      {/* Header */}
      <div className="dfm-header">
        <div className="dfm-icon-wrap">
          <ShieldCheck size={20} className="dfm-header-icon" />
        </div>
        <div>
          <h4 className="dfm-title">Real-Time DFM Rule Checker</h4>
          <p className="dfm-subtitle">IPC-2221B · 3 Active Rule Engines · Live Validation</p>
        </div>
      </div>

      <div className="dfm-rules-grid">

        {/* ─── Rule 1: Aspect Ratio ──────────────────────────────── */}
        <RulePanel
          title="Rule 1 — Drill Aspect Ratio"
          icon={Ruler}
          accentClass="dfm-accent-blue"
          status={arStatus}
          result={`${aspectRatio}:1`}
        >
          <div className="dfm-inputs-row">
            <div className="dfm-input-group">
              <label className="dfm-input-label">Board Thickness (mm)</label>
              <div className="dfm-input-wrap">
                <input
                  type="number" min="0.4" max="6" step="0.1"
                  value={thickness}
                  onChange={e => setThickness(Number(e.target.value))}
                  className="dfm-input"
                />
                <span className="dfm-unit">mm</span>
              </div>
            </div>
            <div className="dfm-input-group">
              <label className="dfm-input-label">Smallest Drill Diameter (mm)</label>
              <div className="dfm-input-wrap">
                <input
                  type="number" min="0.05" max="3" step="0.05"
                  value={drill}
                  onChange={e => setDrill(Number(e.target.value))}
                  className="dfm-input"
                />
                <span className="dfm-unit">mm</span>
              </div>
            </div>
          </div>

          {/* Visual ratio bar */}
          <div className="dfm-bar-wrap">
            <div className="dfm-bar-track">
              <div
                className={`dfm-bar-fill dfm-bar-${arStatus}`}
                style={{ width: `${Math.min((aspectRatio / 14) * 100, 100)}%` }}
              />
              <div className="dfm-bar-marker" style={{ left: `${(8/14)*100}%` }} title="8:1 Marginal" />
              <div className="dfm-bar-marker dfm-bar-marker-red" style={{ left: `${(10/14)*100}%` }} title="10:1 Limit" />
            </div>
            <div className="dfm-bar-labels">
              <span>0:1</span><span>8:1 Marginal</span><span>10:1 Limit</span><span>14:1+</span>
            </div>
          </div>

          <p className="dfm-message">{arMessage}</p>
        </RulePanel>

        {/* ─── Rule 2: Copper vs Trace ────────────────────────────── */}
        <RulePanel
          title="Rule 2 — Copper Weight vs. Trace Width"
          icon={Zap}
          accentClass="dfm-accent-amber"
          status={traceStatus}
          result={`${traceWidth} mil / ${copperOz}oz Cu`}
        >
          <div className="dfm-inputs-row">
            <div className="dfm-input-group">
              <label className="dfm-input-label">Copper Weight</label>
              <div className="dfm-select-group">
                {[0.5, 1, 2].map(oz => (
                  <button
                    key={oz}
                    className={`dfm-oz-btn ${copperOz === oz ? 'dfm-oz-active' : ''}`}
                    onClick={() => setCopperOz(oz)}
                  >
                    {oz} oz
                  </button>
                ))}
              </div>
            </div>
            <div className="dfm-input-group">
              <label className="dfm-input-label">Minimum Trace Width (mil)</label>
              <div className="dfm-input-wrap">
                <input
                  type="number" min="1" max="50" step="0.5"
                  value={traceWidth}
                  onChange={e => setTraceWidth(Number(e.target.value))}
                  className="dfm-input"
                />
                <span className="dfm-unit">mil</span>
              </div>
            </div>
          </div>

          <div className="dfm-etch-guide">
            {[0.5, 1, 2].map(oz => (
              <div key={oz} className={`dfm-etch-item ${copperOz === oz ? 'dfm-etch-active' : ''}`}>
                <span className="dfm-etch-oz">{oz}oz Cu</span>
                <span className="dfm-etch-min">Min safe: {minTrace[oz]} mil</span>
              </div>
            ))}
          </div>

          <p className="dfm-message">{traceMessage}</p>
        </RulePanel>

        {/* ─── Rule 3: Copper Density Balance ─────────────────────── */}
        <RulePanel
          title="Rule 3 — Copper Density Balance (Bow/Twist)"
          icon={Sliders}
          accentClass="dfm-accent-cyan"
          status={balStatus}
          result={`${imbalance}% Δ`}
        >
          <div className="dfm-balance-group">
            <label className="dfm-input-label">
              Top Layer Copper Density: <strong>{topCopper}%</strong> &nbsp;|&nbsp; Bottom: <strong>{bottomCopper}%</strong>
            </label>
            <input
              type="range" min="10" max="90" value={topCopper}
              onChange={e => setTopCopper(Number(e.target.value))}
              className="dfm-slider"
            />
            <div className="dfm-balance-bar">
              <div
                className="dfm-balance-top"
                style={{ width: `${topCopper}%` }}
              />
            </div>
            <div className="dfm-balance-labels">
              <span>Top ({topCopper}%)</span>
              <span>Bottom ({bottomCopper}%)</span>
            </div>
          </div>

          <p className="dfm-message">{balMessage}</p>
          <p className="dfm-rule-ref">Ref: IPC-6012E — Bow &amp; Twist ≤ 0.75% for SMT population</p>
        </RulePanel>

      </div>

      {/* Summary bar */}
      <div className="dfm-summary">
        <span className="dfm-summary-label">Overall DFM Status:</span>
        {[arStatus, traceStatus, balStatus].some(s => s === 'fail')
          ? <StatusBadge level="fail" />
          : [arStatus, traceStatus, balStatus].some(s => s === 'warn' || s === 'alert')
          ? <StatusBadge level="warn" />
          : <StatusBadge level="pass" />
        }
        <span className="dfm-summary-note">All rules evaluated per IPC-2221B Class 2 standards.</span>
      </div>
    </div>
  );
}
