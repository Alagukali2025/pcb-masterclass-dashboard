import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Zap, BookOpen } from 'lucide-react';

// Glass style data
const GLASS_STYLES = [
  { style: '1067', warp: '1067/1067', threads: '68×68', resinPct: 85, skewRisk: 'Very Low', rating: 5, rec: true,
    desc: 'Tightest weave. Maximum resin content. Best for high-speed differential pairs (>25Gbps).' },
  { style: '1078', warp: '1078/1078', threads: '54×54', resinPct: 75, skewRisk: 'Low', rating: 4, rec: true,
    desc: 'Excellent skew performance. Common choice for PCIe Gen5 and 100GbE.' },
  { style: '1080', warp: '1080/1080', threads: '60×47', resinPct: 72, skewRisk: 'Low', rating: 4, rec: false,
    desc: 'Good skew control. Widely available. Suitable for DDR4/5 and USB 3.x.' },
  { style: '2116', warp: '2116/2116', threads: '60×58', resinPct: 52, skewRisk: 'Medium', rating: 2, rec: false,
    desc: 'Standard prepreg. Higher glass content creates Dk variation. Avoid for >10Gbps differential pairs.' },
  { style: '7628', warp: '7628/7628', threads: '44×32', resinPct: 44, skewRisk: 'High', rating: 1, rec: false,
    desc: 'Heaviest weave. Lowest resin. Significant periodic Dk variation. Not suitable for high-speed signals.' },
];

const ratingStars = (n) => Array.from({ length: 5 }, (_, i) => i < n ? '★' : '☆').join('');

export default function FiberWeaveSkew() {
  const [activeStyle, setActiveStyle] = useState('1067');
  const selected = GLASS_STYLES.find(g => g.style === activeStyle);

  return (
    <div className="fws-card slide-up">
      {/* Header */}
      <div className="fws-header">
        <div className="fws-icon-wrap">
          <Zap size={20} className="fws-icon" />
        </div>
        <div>
          <h4 className="fws-title">Fiber Weave Skew — Signal Integrity Risk</h4>
          <p className="fws-subtitle">Glass Bundle vs. Resin-Rich Dk Variation · Differential Pair Routing</p>
        </div>
      </div>

      {/* Explanation */}
      <p className="fws-intro">
        PCB dielectrics are not homogeneous. Glass fibers have a higher Dk (~6.0) than the surrounding resin (~3.2).
        A trace routed over a glass bundle experiences a different propagation speed than its pair running over a resin-rich zone,
        causing <strong>intra-pair phase skew</strong> — destroying the eye diagram at high data rates.
      </p>

      {/* SVG Illustration */}
      <div className="fws-svg-container">
        <svg viewBox="0 0 700 260" className="fws-svg" aria-label="Fiber weave skew illustration">

          {/* Background zones */}
          {/* Resin-rich left zone */}
          <rect x="0" y="50" width="160" height="160" rx="0" fill="#1e293b" opacity="0.7" />
          <text x="80" y="40" textAnchor="middle" className="fws-svg-zone-label" fill="#94a3b8">Resin-Rich Zone</text>
          <text x="80" y="228" textAnchor="middle" className="fws-svg-zone-sub" fill="#64748b">Dk ≈ 3.2–3.5</text>

          {/* Glass bundle center zone */}
          <rect x="160" y="50" width="380" height="160" rx="0" fill="#0f2240" opacity="0.9" />
          <text x="350" y="40" textAnchor="middle" className="fws-svg-zone-label" fill="#38bdf8">Glass Bundle Zone</text>
          <text x="350" y="228" textAnchor="middle" className="fws-svg-zone-sub" fill="#0ea5e9">Dk ≈ 5.8–6.2</text>

          {/* Resin-rich right zone */}
          <rect x="540" y="50" width="160" height="160" rx="0" fill="#1e293b" opacity="0.7" />
          <text x="620" y="40" textAnchor="middle" className="fws-svg-zone-label" fill="#94a3b8">Resin-Rich Zone</text>
          <text x="620" y="228" textAnchor="middle" className="fws-svg-zone-sub" fill="#64748b">Dk ≈ 3.2–3.5</text>

          {/* Glass fiber grid pattern */}
          {[180,220,260,300,340,380,420,460,500].map(x => (
            <line key={`v${x}`} x1={x} y1="50" x2={x} y2="210" stroke="#1e40af" strokeWidth="12" strokeOpacity="0.6" />
          ))}
          {[65,90,115,140,165,190].map(y => (
            <line key={`h${y}`} x1="160" y1={y} x2="540" y2={y} stroke="#1e40af" strokeWidth="8" strokeOpacity="0.4" />
          ))}

          {/* Trace P (positive) — rides over glass */}
          <path
            d="M 0 110 L 700 110"
            stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
            fill="none"
          />
          <text x="15" y="103" className="fws-svg-trace-label" fill="#f59e0b" fontSize="10" fontWeight="700">P+</text>
          <text x="655" y="103" className="fws-svg-trace-label" fill="#f59e0b" fontSize="10" fontWeight="700">P+</text>

          {/* Trace N (negative) — rides over resin */}
          <path
            d="M 0 150 L 700 150"
            stroke="#06b6d4" strokeWidth="3" strokeLinecap="round"
            fill="none" strokeDasharray="none"
          />
          <text x="15" y="163" className="fws-svg-trace-label" fill="#06b6d4" fontSize="10" fontWeight="700">N-</text>
          <text x="655" y="163" className="fws-svg-trace-label" fill="#06b6d4" fontSize="10" fontWeight="700">N-</text>

          {/* Skew arrow annotation */}
          <line x1="350" y1="115" x2="350" y2="145" stroke="#f43f5e" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
          <text x="360" y="132" fill="#f43f5e" fontSize="9" fontWeight="700">ΔTpd Skew</text>

          {/* Arrow marker */}
          <defs>
            <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L0,8 L8,4 Z" fill="#f43f5e" />
            </marker>
          </defs>

          {/* Dk delta label */}
          <text x="350" y="80" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="800">ΔDk ≈ 2.7 (36% variation)</text>

          {/* Rotation hint */}
          <text x="350" y="195" textAnchor="middle" fill="#16a34a" fontSize="9" fontWeight="700">
            Mitigation: Rotate PCB 10° or use 1067/1078 glass style
          </text>
        </svg>
      </div>

      {/* Alerts */}
      <div className="fws-alert">
        <AlertTriangle size={14} className="fws-alert-icon" />
        <p>
          At 56 Gbps (PAM4), even 1–2ps of intra-pair skew degrades BER significantly. Fiber weave skew is the
          primary limiting factor for routing differential pairs over standard 2116/7628 glass styles.
        </p>
      </div>

      {/* Glass style selector */}
      <div className="fws-styles-section">
        <div className="fws-styles-header">
          <BookOpen size={14} className="fws-styles-icon" />
          <span>Glass Style Selector — Compare Weave Performance</span>
        </div>

        <div className="fws-style-tabs">
          {GLASS_STYLES.map(g => (
            <button
              key={g.style}
              className={`fws-style-tab ${activeStyle === g.style ? 'fws-style-active' : ''} ${g.rec ? 'fws-style-rec' : ''}`}
              onClick={() => setActiveStyle(g.style)}
            >
              {g.style}
              {g.rec && <span className="fws-rec-dot" />}
            </button>
          ))}
        </div>

        {selected && (
          <div className="fws-style-detail">
            <div className="fws-detail-grid">
              <div className="fws-detail-item">
                <span className="fws-detail-label">Warp × Fill</span>
                <span className="fws-detail-value">{selected.warp}</span>
              </div>
              <div className="fws-detail-item">
                <span className="fws-detail-label">Thread Count</span>
                <span className="fws-detail-value">{selected.threads} per inch</span>
              </div>
              <div className="fws-detail-item">
                <span className="fws-detail-label">Resin Content</span>
                <span className="fws-detail-value">{selected.resinPct}%</span>
              </div>
              <div className="fws-detail-item">
                <span className="fws-detail-label">Skew Risk</span>
                <span className={`fws-risk-badge fws-risk-${selected.skewRisk.toLowerCase().replace(' ', '-')}`}>
                  {selected.skewRisk}
                </span>
              </div>
              <div className="fws-detail-item fws-detail-full">
                <span className="fws-detail-label">HS Rating</span>
                <span className="fws-stars">{ratingStars(selected.rating)}</span>
              </div>
            </div>
            <p className="fws-detail-desc">{selected.desc}</p>
            {selected.rec
              ? <div className="fws-rec-tag"><CheckCircle2 size={12} /> Recommended for differential pairs at &gt;10Gbps</div>
              : <div className="fws-norec-tag"><AlertTriangle size={12} /> Not recommended for high-speed differential routing</div>
            }
          </div>
        )}
      </div>

      {/* Table */}
      <div className="fws-table-wrap">
        <table className="fws-table">
          <thead>
            <tr>
              <th>Glass Style</th>
              <th>Threads/in</th>
              <th>Resin %</th>
              <th>Skew Risk</th>
              <th>HS Rating</th>
              <th>Recommended For</th>
            </tr>
          </thead>
          <tbody>
            {GLASS_STYLES.map(g => (
              <tr key={g.style} className={`fws-tr ${g.rec ? 'fws-tr-rec' : ''}`}>
                <td className="fws-td-style">{g.style}{g.rec && <span className="fws-td-rec-dot" />}</td>
                <td>{g.threads}</td>
                <td>{g.resinPct}%</td>
                <td><span className={`fws-risk-badge fws-risk-${g.skewRisk.toLowerCase().replace(' ', '-')}`}>{g.skewRisk}</span></td>
                <td className="fws-stars-small">{ratingStars(g.rating)}</td>
                <td className="fws-td-desc">{g.desc.split('.')[0]}.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
