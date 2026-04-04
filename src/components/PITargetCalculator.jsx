import React, { useState, useEffect } from 'react';
import { Calculator, Zap, AlertCircle, Info, CheckCircle2, TrendingDown, ShieldCheck, ShieldAlert, Radio } from 'lucide-react';

const PITargetCalculator = () => {
  const [vrail, setVrail] = useState(1.0);
  const [ripple, setRipple] = useState(5);
  const [itransient, setItransient] = useState(10);
  const [ztarget, setZtarget] = useState(0);

  useEffect(() => {
    // Formula: Ztarget = (Vrail * (ripple / 100)) / Itransient
    const result = (vrail * (ripple / 100)) / itransient;
    // Convert to milliohms
    setZtarget(result * 1000);
  }, [vrail, ripple, itransient]);

  const getStatus = () => {
    if (ztarget < 5) return {
      type: 'danger',
      icon: <ShieldAlert size={18} />,
      text: "Ultra-Low Target: 3D Field-Solver (Ansys HFSS/SIwave) and 10+ layers likely required.",
      colorClass: 'text-red-400',
      glowClass: 'glow-text-amber'
    };
    if (ztarget < 20) return {
      type: 'warning',
      icon: <Radio size={18} />,
      text: "Challenging Target: Requires high-density decoupling (0201/01005) and thin dielectric layers.",
      colorClass: 'text-amber-400',
      glowClass: 'glow-text-amber'
    };
    return {
      type: 'success',
      icon: <ShieldCheck size={18} />,
      text: "Standard Target: Achievable with high-quality MLCCs and solid power planes.",
      colorClass: 'text-emerald-400',
      glowClass: 'glow-text-blue'
    };
  };

  const status = getStatus();

  return (
    <div className="calculator-card glass-morphism-premium p-8 my-8 slide-up relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 shadow-glow">
          <Calculator size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">PI Target Impedance</h3>
          <p className="text-sm text-slate-400 font-medium">PDN design threshold for high-performance switching.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="input-group">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Rail Voltage (Vrail)</label>
          <div className="relative">
            <input 
              type="number" 
              value={vrail} 
              onChange={(e) => setVrail(parseFloat(e.target.value) || 0)}
              className="w-full input-engineering py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
              step="0.01"
            />
            <span className="absolute right-4 top-3 text-slate-500 font-mono text-sm">V</span>
          </div>
        </div>

        <div className="input-group">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Allowed Ripple (%)</label>
          <div className="relative">
            <input 
              type="number" 
              value={ripple} 
              onChange={(e) => setRipple(parseFloat(e.target.value) || 0)}
              className="w-full input-engineering py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="absolute right-4 top-3 text-slate-500 font-mono text-sm text-opacity-50">%</span>
          </div>
        </div>

        <div className="input-group">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3">Transient Current (ΔI)</label>
          <div className="relative">
            <input 
              type="number" 
              value={itransient} 
              onChange={(e) => setItransient(parseFloat(e.target.value) || 0)}
              className="w-full input-engineering py-3 px-4 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="absolute right-4 top-3 text-slate-500 font-mono text-sm">A</span>
          </div>
        </div>
      </div>

      <div className="result-card-premium rounded-2xl p-8 mb-8 flex flex-col items-center justify-center text-center shadow-lg border-opacity-40">
        <div className="text-blue-400/60 mb-3 opacity-80">
          <Zap size={40} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Maximum System Impedance</div>
        <div className={`text-6xl font-black text-white ${status.glowClass} flex items-baseline gap-2 transition-all duration-500`}>
          {ztarget.toFixed(2)} <span className="text-2xl font-medium opacity-40">mΩ</span>
        </div>
        
        <div className={`mt-6 px-4 py-2 rounded-full bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-xs font-bold ${status.colorClass}`}>
          {status.icon}
          {status.text}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="advice-card bg-slate-900/40 rounded-xl p-5 border border-slate-800 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-start gap-4">
            <TrendingDown className="text-emerald-400 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-white text-sm mb-2">Loop Inductance Target</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">To maintain stability at high frequencies (f &gt; 100 MHz), the loop inductance must be **&lt; 100 pH**.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 size={12} className="text-blue-400" /> Use **Via-in-Pad (VIP)** techniques.
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 size={12} className="text-blue-400" /> Place caps directly beneath BGA pins.
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <CheckCircle2 size={12} className="text-blue-400" /> Keep Plane Spacing **&lt; 4 mils**.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reference-card bg-slate-900/40 rounded-xl p-5 border border-slate-800">
          <div className="flex items-start gap-4">
            <Info className="text-blue-400 shrink-0" size={24} />
            <div className="w-full">
              <h4 className="font-bold text-white text-sm mb-3">Industry Benchmarks</h4>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-3 py-2 bg-slate-950/50 rounded-lg border border-slate-900">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Core FPGA / SoC</span>
                  <span className="text-emerald-400 font-black text-sm">~2.5 mΩ</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-950/50 rounded-lg border border-slate-900">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">DDR4 Memory Rail</span>
                  <span className="text-amber-400 font-black text-sm">~24 mΩ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-4">
        <AlertCircle size={22} className="text-amber-500/60 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed italic">
          **Engineering Note**: Z-target calculation is the first step. For multi-Gbps links, anti-resonance peak detection via **Vector Network Analyzer (VNA)** or **Post-Layout P-SIM** is mandatory to prevent intermittent boot failures.
        </p>
      </div>
    </div>
  );
};

export default PITargetCalculator;
