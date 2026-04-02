import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Ruler, Activity, Info, Drill } from 'lucide-react';

const AspectRatioCalculator = () => {
  const [mode, setMode] = useState('aspect'); // 'aspect' | 'stub'

  // Aspect Ratio State
  const [thickness, setThickness] = useState(1.6);
  const [drill, setDrill] = useState(0.2);

  const aspectRatio = parseFloat((thickness / drill).toFixed(2));
  const isHighRiskAspect = aspectRatio > 10;
  const isOptimalAspect = aspectRatio <= 8;

  // Via Stub State
  const [stubLength, setStubLength] = useState(0.5); // mm
  const [dk, setDk] = useState(4.2);

  // F_res (GHz) = 75 / (stub_Length_mm * sqrt(Dk))
  const resonantFreq = parseFloat((75 / (stubLength * Math.sqrt(dk))).toFixed(2));
  const isHighRiskStub = resonantFreq < 15; // < 15 GHz is risky for modern high-speed
  
  return (
    <div className="via-technology-card p-10 rounded-[2.5rem] bg-black-10 border border-white-05 shadow-2xl overflow-hidden relative group slide-up">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
        {mode === 'aspect' ? <Ruler className="w-48 h-48" /> : <Activity className="w-48 h-48" />}
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
            {mode === 'aspect' ? <Ruler className="text-blue-500" /> : <Activity className="text-orange-500" />}
          </div>
          <div>
            <h4 className="text-2xl font-black text-primary tracking-tighter uppercase leading-none mb-1">Via Technology Center</h4>
            <p className="text-[10px] text-tertiary font-bold italic uppercase tracking-[0.2em] opacity-60">High-Speed Signal Integrity Lab</p>
          </div>
        </div>
        
        <div className="vtc-tab-bar flex bg-black-40 p-1.5 rounded-2xl border border-white-05 shadow-inner w-full md:w-auto">
          <button 
            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'aspect' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-tertiary hover:text-primary hover:bg-white-05'}`}
            onClick={() => setMode('aspect')}
          >
            Aspect Ratio
          </button>
          <button 
            className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'stub' ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'text-tertiary hover:text-primary hover:bg-white-05'}`}
            onClick={() => setMode('stub')}
          >
            Stub Resonance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 relative z-10">
        
        {/* Input Columns */}
        <div className="space-y-8">
          {mode === 'aspect' ? (
            <div className="vtc-input-panel grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white-02 p-6 rounded-[1.5rem] border border-white-05">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block pl-2">Total Board Thickness (mm)</label>
                <div className="relative group/input">
                  <input 
                    type="number" step="0.1" value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="vtc-input w-full bg-black-40 border border-white-10 rounded-xl px-5 py-4 text-primary text-lg font-black focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-tertiary uppercase">mm</div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] block pl-2">Smallest Drill Diameter (mm)</label>
                <div className="relative group/input">
                  <input 
                    type="number" step="0.05" value={drill}
                    onChange={(e) => setDrill(Number(e.target.value))}
                    className="vtc-input w-full bg-black-40 border border-white-10 rounded-xl px-5 py-4 text-primary text-lg font-black focus:outline-none focus:border-blue-500 shadow-inner transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-tertiary uppercase">mm</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="vtc-input-panel grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white-02 p-6 rounded-[1.5rem] border border-white-05">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block pl-2">Unused Stub Length (mm)</label>
                <div className="relative group/input">
                  <input 
                    type="number" step="0.1" value={stubLength}
                    onChange={(e) => setStubLength(Math.max(0.01, Number(e.target.value)))}
                    className="vtc-input w-full bg-black-40 border border-white-10 rounded-xl px-5 py-4 text-primary text-lg font-black focus:outline-none focus:border-orange-500 shadow-inner transition-colors"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-tertiary uppercase">mm</div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block pl-2">Dielectric Constant (Dk)</label>
                <input 
                  type="number" step="0.1" value={dk}
                  onChange={(e) => setDk(Math.max(1, Number(e.target.value)))}
                  className="vtc-input w-full bg-black-40 border border-white-10 rounded-xl px-5 py-4 text-primary text-lg font-black focus:outline-none focus:border-orange-500 shadow-inner transition-colors"
                />
              </div>
            </div>
          )}

          {/* Alert Boxes */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {mode === 'aspect' ? (
              isHighRiskAspect ? (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-red-500 uppercase tracking-widest">DFM Warning: Fabrication Risk</span>
                      <span className="bg-red-500/20 text-red-400 text-[9px] px-2.5 py-0.5 rounded-full border border-red-500/40 font-black uppercase">IPC Class 2 Limit</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed italic font-bold">
                      Aspect ratio exceeds 10:1. This runs a high risk of "barrel plating voiding" where chemical copper cannot reliably circulate and deposit in the center of the via hole. Consult vendor for advanced laser/mechanical limits.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-green-500 uppercase tracking-widest">Safe for Standard Mfg</span>
                      <span className="bg-green-500/20 text-green-400 text-[9px] px-2.5 py-0.5 rounded-full border border-green-500/40 font-black uppercase">IPC Compliant</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed italic font-bold">
                      Ratio &le; 10:1 is well within industry standard mechanical drill limits. Excellent hole-wall plating capability and reliability expected across all Tier 2+ prototype vendors.
                    </p>
                  </div>
                </div>
              )
            ) : (
              isHighRiskStub ? (
                <div className="p-6 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                    <Activity className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-orange-500 uppercase tracking-widest">Signal Integrity Risk</span>
                      <span className="bg-orange-500/20 text-orange-400 text-[9px] px-2.5 py-0.5 rounded-full border border-orange-500/40 font-black uppercase">Back-Drill Required</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed italic font-bold mb-3">
                      Resonant frequency drops inside modern operating bandwidths (&lt; 15 GHz). The unused via stub will act as an antenna and notch filter, destroying the signal eye pattern (e.g. PCIe Gen4/5).
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black-40 rounded-lg border border-white-10 text-[10px] text-tertiary">
                      <Drill size={12} className="text-blue-500" />
                      <span className="uppercase font-black tracking-widest">Mitigation: Apply Back-Drilling (Controlled Depth Drilling) to remove stub.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-black text-blue-500 uppercase tracking-widest">Stub is Transparent</span>
                      <span className="bg-blue-500/20 text-blue-400 text-[9px] px-2.5 py-0.5 rounded-full border border-blue-500/40 font-black uppercase">GHz Safe</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed italic font-bold">
                      Resonant frequency is very high (&gt; 15 GHz). For standard digital signals, this stub is electrically short enough to look invisible to the receiver. No back-drilling is required unless operating at mmWave bandwidths.
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="w-full shrink-0">
          {mode === 'aspect' ? (
            <div className={`vtc-result-panel p-8 rounded-[2rem] border shadow-2xl transition-all duration-700 h-full flex flex-col justify-center items-center relative overflow-hidden ${
              isHighRiskAspect ? 'bg-red-500/5 border-red-500/20' : 
              isOptimalAspect ? 'bg-green-500/5 border-green-500/20' : 
              'bg-blue-500/5 border-blue-500/20'
            }`}>
              {/* Added subtle drill-like background decoration for aspect ratio */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                 <Ruler size={240} strokeWidth={0.5} />
              </div>
              <div className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-4 text-center">Calculated Ratio</div>
              <div className={`text-6xl md:text-7xl font-black tracking-tighter mb-2 ${
                isHighRiskAspect ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
                isOptimalAspect ? 'text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 
                'text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              }`}>
                {aspectRatio}<span className="text-3xl opacity-50 relative top-[-15px] ml-1">:1</span>
              </div>
              <div className="vtc-divider w-16 h-1 mt-6 rounded-full bg-white-10" />
            </div>
          ) : (
            <div className={`vtc-result-panel p-8 rounded-[2rem] border shadow-2xl transition-all duration-700 h-full flex flex-col justify-center items-center relative overflow-hidden ${
              isHighRiskStub ? 'bg-orange-500/5 border-orange-500/20' : 'bg-blue-500/5 border-blue-500/20'
            }`}>
              {/* Added Resonant Wave SVG Animation */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  <path d="M0,50 Q25,0 50,50 T100,50 T150,50 T200,50" 
                    fill="none" 
                    stroke={isHighRiskStub ? "#f97316" : "#3b82f6"} 
                    strokeWidth="1"
                    className="animate-wave"
                  />
                  <path d="M0,50 Q25,100 50,50 T100,50 T150,50 T200,50" 
                    fill="none" 
                    stroke={isHighRiskStub ? "#f97316" : "#3b82f6"} 
                    strokeWidth="0.5"
                    strokeOpacity="0.5"
                    className="animate-wave-reverse"
                  />
                </svg>
              </div>

              <div className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-4 text-center relative z-10">F_Res Frequency</div>
              <div className={`text-6xl md:text-7xl font-black tracking-tighter mb-2 flex items-baseline relative z-10 ${
                isHighRiskStub ? 'text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]' : 'text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              }`}>
                {resonantFreq}
              </div>
              <div className={`text-lg font-black uppercase tracking-widest relative z-10 ${isHighRiskStub ? 'text-orange-500/70' : 'text-blue-500/70'}`}>
                GHz
              </div>
              <div className="vtc-divider w-16 h-1 mt-6 rounded-full bg-white-10 relative z-10" />
              <button className="mt-6 flex items-center gap-2 text-[9px] uppercase font-black tracking-widest text-tertiary hover:text-white transition-colors group relative z-10">
                <Info size={14} className="group-hover:text-blue-500 transition-colors" />
                Eq = 75 / (L * √Dk)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AspectRatioCalculator;

