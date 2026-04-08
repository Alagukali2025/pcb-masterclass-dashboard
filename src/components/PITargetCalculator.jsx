import React, { useState, useMemo } from 'react';
import { TrendingDown, Zap, ShieldAlert, Info, CheckCircle2, Waves } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const PITargetCalculator = () => {
  const [voltage, setVoltage] = useState(1.1);
  const [ripple, setRipple] = useState(5);
  const [current, setCurrent] = useState(10);

  const stats = useMemo(() => {
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // mΩ

    let status = 'Standard';
    let statusColor = 'var(--success)';
    if (zTarget < 10) {
      status = 'Extreme';
      statusColor = 'var(--danger)';
    } else if (zTarget < 30) {
      status = 'Challenging';
      statusColor = 'var(--warning)';
    }

    return { vRipple, zTarget, status, statusColor };
  }, [voltage, ripple, current]);

  return (
    <div className="zdiff-calc slide-up" id="pi-target-solver">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(55, 138, 221, 0.1)' }}>
            <TrendingDown size={18} style={{ color: '#378ADD' }} />
          </div>
          <div>
            <h3 className="zdiff-title">PDN Target Impedance Solver</h3>
            <p className="zdiff-subtitle">Power Integrity (PI) Limit Analysis — Transient Stability</p>
          </div>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Inputs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">DC Rail Ripple Budget</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 200 80" className="w-full max-w-[240px]">
                   <path d="M20 40 L180 40" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                   <path d="M20 40 L40 30 L60 50 L80 35 L100 45 L120 38 L140 42 L180 40" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
                   <rect x="20" y="30" width="160" height="20" fill="var(--accent-primary)" fillOpacity="0.05" />
                   <text x="100" y="20" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">+/- {ripple}% Ripple Limit</text>
                </svg>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <EngineeringInput
              label="Rail Voltage"
              unit="V"
              value={voltage}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setVoltage(parseFloat(val));
              }}
              step="0.1"
            />
            <EngineeringInput
              label="Max Ripple"
              unit="%"
              value={ripple}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setRipple(parseFloat(val));
              }}
              step="1"
            />
            <EngineeringInput
              label="Transient Current"
              unit="A"
              value={current}
              onChange={e => {
                const val = e.target.value;
                if (val === "" || isNaN(parseFloat(val))) return;
                setCurrent(parseFloat(val));
              }}
              step="1"
              className="zdiff-input-group--orange"
              style={{ gridColumn: 'span 2' }}
            />
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Target Impedance (Z_target)</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.zTarget.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">mΩ</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Ripple Budget</div>
                <div className="zdiff-result-sub-val">{(stats.vRipple * 1000).toFixed(0)} <small>mV</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Load Profile</div>
                <div className="zdiff-result-sub-val">{stats.status}</div>
              </div>
            </div>

            {/* Verdict */}
            <div className="zdiff-verdict zdiff-verdict--ok">
              <div className="zdiff-verdict-icon"><ShieldAlert size={16} /></div>
              <div>
                <p className="zdiff-verdict-title">PDN Integrity Verdict</p>
                <p className="zdiff-verdict-body">Ensure PDN loop impedance (Z_vrm + Z_pcb + Z_pkg) remains below {stats.zTarget.toFixed(1)} mΩ up to the F-max frequency of switching events.</p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Design Guidelines</h5>
             <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[0.7rem] text-tertiary">
                <ul className="m-0 p-0 pl-4 list-disc space-y-1">
                   <li>Z_target is the maximum allowable impedance to keep voltage within budget.</li>
                   <li>Transient steps at high-GHz require decoupling at the die-level.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PITargetCalculator;
