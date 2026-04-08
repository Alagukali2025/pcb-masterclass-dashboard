import React, { useState, useMemo } from 'react';
import { Activity, Zap, ShieldAlert, Info, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import EngineeringInput from './EngineeringInput';

const MM_TO_MIL = 39.3701;

const DDRTimingCalculator = () => {
  const { activeStackup, updateStackup } = useDesign();
  const [unitSystem, setUnitSystem] = useState('mil'); // 'mm' | 'mil'
  const [generation, setGeneration] = useState('DDR4');
  const [mts, setMts] = useState(3200);
  const [skew, setSkew] = useState(25); // Internal in MILS

  const er = activeStackup.dk;

  const generations = {
    DDR3: { minMts: 800, maxMts: 2133, defaultMts: 1600, color: '#0ea5e9' },
    DDR4: { minMts: 1600, maxMts: 3200, defaultMts: 2400, color: '#f59e0b' },
    DDR5: { minMts: 3200, maxMts: 6400, defaultMts: 4800, color: '#ef4444' }
  };

  const stats = useMemo(() => {
    const ui = 1000000 / mts; // ps
    const vp = 11.8 / Math.sqrt(er); // mil/ps
    const skewPs = skew / vp;
    const closurePct = (skewPs / ui) * 100;
    
    let status = 'Safe';
    let statusColor = 'var(--success)';
    if (closurePct > 15) {
      status = 'Critical Failure';
      statusColor = 'var(--danger)';
    } else if (closurePct > 5) {
      status = 'Marginal Risk';
      statusColor = 'var(--warning)';
    }

    return { ui, skewPs, closurePct, status, statusColor, vp };
  }, [mts, skew, er]);

  const handleInputChange = (key, value) => {
    if (value === "" || isNaN(parseFloat(value))) return;
    const rawValue = parseFloat(value);
    
    if (key === 'dk') {
      updateStackup({ dk: rawValue });
      return;
    }

    const milValue = unitSystem === 'mm' ? rawValue * MM_TO_MIL : rawValue;
    setSkew(milValue);
  };

  const convertValue = (milVal) => {
    return unitSystem === 'mm' ? (milVal / MM_TO_MIL).toFixed(2) : milVal.toFixed(1);
  };

  const handleGenChange = (gen) => {
    setGeneration(gen);
    setMts(generations[gen].defaultMts);
  };

  return (
    <div className="zdiff-calc slide-up" id="ddr-timing-analyzer">
      {/* ── Header ── */}
      <div className="zdiff-header">
        <div className="zdiff-header-left">
          <div className="zdiff-header-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
            <Activity size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <h3 className="zdiff-title">DDR Timing Margin Analyzer</h3>
            <p className="zdiff-subtitle">Skew-to-UI Bit Time Decomposition — Eye Integrity Focus</p>
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
        {/* ── Left Side: Signal Specs ── */}
        <div className="zdiff-left">
          <div className="zdiff-diagram-box">
             <span className="zdiff-diagram-label">Data Eye Closure Visualization</span>
             <div className="flex flex-col items-center py-4">
                <div className="relative w-48 h-24 mb-2">
                   {/* Eye Diagram SVG */}
                   <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                      <path d="M0,25 Q25,0 50,0 T100,25" fill="none" stroke="var(--border-light)" strokeWidth="1" />
                      <path d="M0,25 Q25,50 50,50 T100,25" fill="none" stroke="var(--border-light)" strokeWidth="1" />
                      {/* Inner eye representing margin */}
                      <path 
                        d={`M${5+stats.closurePct/4},25 Q25,${10+stats.closurePct/4} ${50-stats.closurePct/8},${10+stats.closurePct/4} T${95-stats.closurePct/4},25`} 
                        fill="var(--success)" fillOpacity="0.1" stroke="var(--success)" strokeWidth="2" strokeOpacity="0.5"
                      />
                   </svg>
                </div>
                <div className="w-full px-8">
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, stats.closurePct)}%`, backgroundColor: stats.statusColor }} 
                      />
                   </div>
                   <div className="flex justify-between mt-1">
                      <span className="text-[8px] uppercase font-bold text-tertiary">Ideal (0%)</span>
                      <span className="text-[8px] uppercase font-bold text-tertiary">Limit (20%)</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="zdiff-input-grid">
            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <div className="zdiff-toggle-group w-full">
                {Object.keys(generations).map(gen => (
                  <button 
                    key={gen} 
                    className={`zdiff-toggle-btn flex-1 ${generation === gen ? 'zdiff-toggle-btn--active-green' : ''}`}
                    onClick={() => handleGenChange(gen)}
                    style={{ color: generation === gen ? 'white' : 'inherit' }}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            <div className="zdiff-input-group" style={{ gridColumn: 'span 2' }}>
              <label className="zdiff-label">Data Rate: <strong>{mts} MT/s</strong></label>
              <input 
                type="range" min={generations[generation].minMts} max={generations[generation].maxMts} step={200}
                value={mts} onChange={e => setMts(parseInt(e.target.value))}
                className="zdiff-input w-full p-0"
                style={{ accentColor: generations[generation].color }}
              />
            </div>

            <EngineeringInput
              label="Total PCB Row Skew"
              unit={unitSystem}
              value={convertValue(skew)}
              onChange={e => handleInputChange('skew', e.target.value)}
              step="0.1"
            />
            <EngineeringInput
              label="εr (Dielectric Constant)"
              unit="Dk"
              value={er}
              onChange={e => handleInputChange('dk', e.target.value)}
              step="0.1"
              min="1"
            />
          </div>
        </div>

        {/* ── Right Side: Analytical Results ── */}
        <div className="zdiff-right">
          <div className="zdiff-result-card" style={{ borderColor: stats.statusColor + '44' }}>
            <div className="zdiff-result-label">Window Compaction (UI%)</div>
            <div className="zdiff-result-value">
              <span className="zdiff-result-num" style={{ color: stats.statusColor }}>
                {stats.closurePct.toFixed(1)}
              </span>
              <span className="zdiff-result-unit">%</span>
            </div>

            <div className="zdiff-result-sub-grid">
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Bit Time (UI)</div>
                <div className="zdiff-result-sub-val">{stats.ui.toFixed(1)} <small>ps</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Skew Delay</div>
                <div className="zdiff-result-sub-val" style={{ color: 'var(--warning)' }}>{stats.skewPs.toFixed(1)} <small>ps</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Residual Eye</div>
                <div className="zdiff-result-sub-val">{(stats.ui - stats.skewPs).toFixed(1)} <small>ps</small></div>
              </div>
              <div className="zdiff-result-sub">
                <div className="zdiff-result-sub-label">Status</div>
                <div className="zdiff-result-sub-val" style={{ color: stats.statusColor }}>{stats.status}</div>
              </div>
            </div>

            {/* Verdict */}
            <div className={`zdiff-verdict ${stats.closurePct > 10 ? 'zdiff-verdict--warn' : 'zdiff-verdict--ok'}`}>
              <div className="zdiff-verdict-icon">{stats.closurePct > 10 ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}</div>
              <div>
                <p className="zdiff-verdict-title">Timing Analysis Verdict</p>
                <p className="zdiff-verdict-body">
                   {stats.closurePct > 10 
                     ? 'Skew exceeds 10% UI limit. This will likely cause setup/hold violations. Reduce track length mismatch.' 
                     : 'Electrical delay skew is well within industrial unit interval margins.'}
                </p>
              </div>
            </div>
          </div>

          <div className="zdiff-presets-box">
             <h5 className="zdiff-presets-title">Prop. Velocity Info</h5>
             <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[0.7rem] text-tertiary">
                Vp = <strong>{stats.vp.toFixed(2)} mil/ps</strong><br/>
                Signal travels 1 inch in <strong>{(1000/stats.vp).toFixed(1)} ps.</strong>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DDRTimingCalculator;
