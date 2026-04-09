import { useState } from 'react';
import { Eye, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EMIVisualizer() {
  const [hasSlot, setHasSlot] = useState(false);

  return (
    <div className="emi-visualizer-container slide-up">
      <div className="vis-header">
        <div className="vis-title">
          <Eye size={18} />
          <span>Return Path & Loop Area Visualizer</span>
        </div>
        <div className="vis-toggle">
          <label className="vis-switch">
          <span>Ground Plane Slot:</span>
            <input 
              type="checkbox" 
              checked={hasSlot} 
              onChange={() => setHasSlot(!hasSlot)} 
            />
            <span className={`toggle-tab ${hasSlot ? 'active-red' : 'active-green'}`}>
              {hasSlot ? 'Slotted (Danger)' : 'Solid (Preferred)'}
            </span>
          </label>
        </div>
      </div>

      <div className="vis-stage">
        <svg viewBox="0 0 400 160" className="vis-svg">
          {/* Signal Trace Layer (Top) */}
          <rect x="50" y="40" width="300" height="6" fill="#f59e0b" rx="2" fillOpacity="0.9" />
          <text x="50" y="32" fill="#f59e0b" fontSize="8" fontWeight="700">SIGNAL TRACE (Layer 1)</text>

          {/* Current flow arrows (Signal) */}
          <path d="M60 43 L200 43" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow-si)" />
          <path d="M220 43 L340 43" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow-si)" />

          {/* Dielectric Middle */}
          <rect x="40" y="55" width="320" height="40" fill="var(--bg-tertiary)" fillOpacity="0.1" />

          {/* Ground Plane Layer (Bottom) */}
          <g className="gnd-plane">
            {!hasSlot ? (
              <rect x="50" y="100" width="300" height="40" fill="var(--accent-primary)" fillOpacity="0.2" rx="2" />
            ) : (
              <>
                <rect x="50" y="100" width="130" height="40" fill="var(--accent-primary)" fillOpacity="0.2" rx="2" />
                <rect x="220" y="100" width="130" height="40" fill="var(--accent-primary)" fillOpacity="0.2" rx="2" />
                <text x="175" y="125" fill="#ef4444" fontSize="10" transform="rotate(90, 195, 120)" fontWeight="800">SLOT</text>
              </>
            )}
            <text x="50" y="152" fill="var(--accent-primary)" fontSize="8" fontWeight="700">GROUND PLANE (Layer 2)</text>
          </g>

          {/* Return Current Path (THE IMAGE CURRENT) */}
          <g className="return-path">
            {!hasSlot ? (
              <>
                {/* Clean path directly beneath */}
                <path 
                  d="M340 110 L60 110" 
                  stroke="#ef4444" 
                  strokeWidth="2.5" 
                  strokeDasharray="4,4" 
                  className="animate-wave-reverse"
                />
                <circle cx="200" cy="110" r="1.5" fill="#ef4444" />
                <text x="200" y="125" fill="#ef4444" fontSize="7" textAnchor="middle" fontWeight="600">IDEAL RETURN (Minimal Loop)</text>
              </>
            ) : (
              <>
                {/* Deviated noisy path */}
                <path 
                  d="M340 110 Q200 160 60 110" 
                  stroke="#ef4444" 
                  strokeWidth="3.5" 
                  fill="none"
                  strokeOpacity="0.6"
                  className="pulse-red"
                />
                <path 
                   d="M200 46 L200 135"
                   stroke="#ef4444"
                   strokeWidth="1"
                   strokeDasharray="2,2"
                   strokeOpacity="0.3"
                />
                <text x="200" y="145" fill="#ef4444" fontSize="7" textAnchor="middle" fontWeight="800">RADIATION HAZARD: LOOP AREA EXPANDED</text>
              </>
            )}
          </g>

          <defs>
            <marker id="arrow-si" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="vis-legend">
        {hasSlot ? (
          <div className="alert alert-danger-mini">
            <AlertTriangle size={14} />
            <div>
              <strong>Maxwell's Violation:</strong> Splitting the plane forces the return current to detour around the slot. This increases loop inductance ($L \propto Area$) and transforms the trace into an efficient dipole antenna.
            </div>
          </div>
        ) : (
          <div className="alert alert-success-mini">
            <CheckCircle2 size={14} />
            <div>
              <strong>Image Plane Effect:</strong> Following <em>IPC-2141A</em>, high-frequency return current stays directly beneath the signal. This cancels external magnetic fields and prevents radiated emissions.
            </div>
          </div>
        )}
      </div>

      <div className="vis-pro-tip">
        <Shield size={16} />
        <p><strong>Engineering Tip:</strong> At high frequencies {'>'}100 kHz, current flows in the path of least <em>inductance</em>. Always provide a continuous, unified ground plane for all high-speed signals.</p>
      </div>
    </div>
  );
}
