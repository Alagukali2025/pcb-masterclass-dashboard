import React, { useState, useMemo } from 'react';
import { ShieldCheck, Zap, Info, TrendingDown, LayoutPanelLeft, Waves, CheckCircle2 } from 'lucide-react';
import EngineeringInput from './EngineeringInput';

const PDNAnalyzer = () => {
  const [voltage, setVoltage] = useState(1.1); 
  const [ripple, setRipple] = useState(5);   
  const [current, setCurrent] = useState(10); 

  const stats = useMemo(() => {
    const vRipple = voltage * (ripple / 100);
    const zTarget = (vRipple / current) * 1000; // in mΩ

    // Cap strategy derivation
    const totalC_uF = (1 / (2 * Math.PI * 1e7 * (zTarget / 1000))) * 1e6;

    let status = 'Standard';
    let statusColor = 'var(--success)';
    
    if (zTarget < 10) {
      status = 'Extreme Performance';
      statusColor = 'var(--danger)';
    } else if (zTarget < 30) {
      status = 'Advanced Power';
      statusColor = 'var(--warning)';
    }

    const recommendations = [
      { type: 'Bulk Stage', range: '100uF - 470uF', qty: zTarget < 15 ? 2 : 1, note: 'Low-ESR Tantalum/Polymer' },
      { type: 'High-Freq', range: '0.1uF / 0402', qty: Math.ceil(50 / (zTarget / 10)), note: 'Low-ESL Ceramic (X7R/X5R)' },
      { type: 'Ultra-High', range: '10nF / 0201', qty: Math.ceil(20 / (zTarget / 10)), note: 'Interposed/Under-BGA' },
    ];

    return { vRipple, zTarget, totalC_uF, recommendations, status, statusColor };
  }, [voltage, ripple, current]);

  return (
    <div className="zdiff-calc slide-up" id="pdn-target-analyzer">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <TrendingDown size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 className="zdiff-title">PDN Target Impedance Solver</h3>
            <p className="zdiff-subtitle">Power Integrity & Noise Strategy — Rail Stability Domain</p>
          </div>
        </div>
      </div>

      <div className="zdiff-body">
        {/* ── Left Side: Power Specs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">DC Rail Stability Visualization</span>
             <div className="flex justify-center py-6">
                <svg viewBox="0 0 200 80" className="w-full max-w-[240px]">
                   <path d="M20 40 L180 40" stroke="var(--border-light)" strokeWidth="1" strokeDasharray="4" />
                   <path d="M20 40 L40 30 L60 50 L80 35 L100 45 L120 38 L140 42 L180 40" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
                   <rect x="20" y="30" width="160" height="20" fill="var(--accent-primary)" fillOpacity="0.05" />
                   <text x="100" y="20" textAnchor="middle" fill="var(--text-tertiary)" fontSize="8">+/- {ripple}% Ripple Budget</text>
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
              label="Transient Current Load"
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
            <div className="zdiff-input-group zdiff-input-group--action" style={{ gridColumn: 'span 2' }}>
               <label className="engineering-label">Engineering Rule</label>
               <div className="p-3 bg-white/5 rounded-lg text-[0.7rem] text-tertiary">
                 "Z_target = (Voltage × Ripple%) / Current_Transient"
               </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Z_target — Impedance Boundary</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.zTarget.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">mΩ</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Ripple Budget</div>
                <div className="zdiff-result-sub-val">{stats.vRipple.toFixed(3)} <small>V</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Total Bulk C</div>
                <div className="zdiff-result-sub-val">{stats.totalC_uF.toFixed(0)} <small>µF</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Load Profile</div>
                <div className="zdiff-result-sub-val">{stats.status}</div>
              </div>
            </div>

            {/* Technical Verdict */}
            <div className={`zdiff-verdict ${stats.zTarget < 20 ? 'zdiff-verdict--warn' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">
                {stats.zTarget < 20 ? <Zap size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div>
                <p className="zdiff-verdict-title">Power Stability Verdict</p>
                <p className="zdiff-verdict-body">
                  Target is {stats.zTarget.toFixed(1)} mΩ. 
                  {stats.zTarget < 15 ? ' Use ultra-low ESR polymer caps and multiple stitching vias to minimize inductance.' : ' Standard decoupling density is sufficient for this rail.'}
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Decoupling Strategy Stack</h5>
             <div className="zdiff-presets-grid" style={{ gridTemplateColumns: '1fr' }}>
                {stats.recommendations.map((rec, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <div className="text-[0.65rem] uppercase font-bold text-tertiary">{rec.type}</div>
                      <div className="text-sm font-bold">{rec.range}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[0.6rem] bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded-full inline-block mb-1">QTY: {rec.qty}</div>
                      <div className="text-[0.65rem] text-tertiary">{rec.note}</div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDNAnalyzer;
