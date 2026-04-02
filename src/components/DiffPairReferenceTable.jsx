import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Info, Calculator, Zap } from 'lucide-react';

// ─── Interface Dataset ────────────────────────────────────────────────────────
// Source: Official interface specifications — no assumptions.
const INTERFACES = [
  {
    interface:    'USB 2.0 HS',
    type:         'LS/FS/HS',
    zdiff:        90,
    tolerance:    15,
    maxSkewMil:   200,
    maxSkewPs:    null,
    dataRate:     '480 Mbps',
    standard:     'USB 2.0 Spec §7.1.5',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'Consumer',
    calcPreset: { height: 0.17, width: 0.18, thickness: 0.035, spacing: 0.18, dk: 4.2 }
  },
  {
    interface:    'USB 3.2 Gen 1',
    type:         'SuperSpeed (5G)',
    zdiff:        90,
    tolerance:    10,
    maxSkewMil:   5,
    maxSkewPs:    1.5,
    dataRate:     '5 Gbps',
    standard:     'USB 3.2 Spec §6.7',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'Consumer',
    calcPreset: { height: 0.15, width: 0.18, thickness: 0.035, spacing: 0.18, dk: 4.2 }
  },
  {
    interface:    'USB 3.2 Gen 2',
    type:         'SuperSpeed+ (10G)',
    zdiff:        90,
    tolerance:    10,
    maxSkewMil:   5,
    maxSkewPs:    1.0,
    dataRate:     '10 Gbps',
    standard:     'USB 3.2 Spec §6.7',
    topology:     'Stripline preferred',
    highlight:    false,
    tag:          'Consumer',
    calcPreset: { height: 0.12, width: 0.15, thickness: 0.035, spacing: 0.12, dk: 4.0 }
  },
  {
    interface:    'PCIe Gen 1 / 2',
    type:         '2.5 GT/s / 5 GT/s',
    zdiff:        100,
    tolerance:    15,
    maxSkewMil:   20,
    maxSkewPs:    5,
    dataRate:     '2.5 / 5 GT/s',
    standard:     'PCIe Base Spec Rev 2.0 §4.3.3',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'Server/Desktop',
    calcPreset: { height: 0.18, width: 0.20, thickness: 0.035, spacing: 0.20, dk: 4.2 }
  },
  {
    interface:    'PCIe Gen 3',
    type:         '8 GT/s',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   10,
    maxSkewPs:    2.0,
    dataRate:     '8 GT/s',
    standard:     'PCIe Base Spec Rev 3.0 §8.3',
    topology:     'Stripline — backdrilling required',
    highlight:    false,
    tag:          'Server/Desktop',
    calcPreset: { height: 0.15, width: 0.18, thickness: 0.035, spacing: 0.18, dk: 3.8 }
  },
  {
    interface:    'PCIe Gen 4',
    type:         '16 GT/s',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   5,
    maxSkewPs:    1.0,
    dataRate:     '16 GT/s',
    standard:     'PCIe Base Spec Rev 4.0 §8.5',
    topology:     'Stripline — backdrilling mandatory',
    highlight:    true,
    tag:          'SI-Critical',
    isSICritical: true,
    calcPreset: { height: 0.12, width: 0.16, thickness: 0.035, spacing: 0.18, dk: 3.1 }
  },
  {
    interface:    'PCIe Gen 5',
    type:         '32 GT/s',
    zdiff:        85,
    tolerance:    8,
    maxSkewMil:   5,
    maxSkewPs:    0.5,
    dataRate:     '32 GT/s',
    standard:     'PCIe Base Spec Rev 5.0 §8.5',
    topology:     'Stripline — low-loss laminate req.',
    highlight:    true,
    tag:          'SI-Critical',
    isSICritical: true,
    calcPreset: { height: 0.10, width: 0.15, thickness: 0.035, spacing: 0.18, dk: 2.8 }
  },
  {
    interface:    'HDMI 2.0',
    type:         'TMDS',
    zdiff:        100,
    tolerance:    15,
    maxSkewMil:   30,
    maxSkewPs:    null,
    dataRate:     '6 Gbps / channel',
    standard:     'HDMI Spec v2.0 §5',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'AV/Display',
  },
  {
    interface:    'HDMI 2.1',
    type:         'FRL',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   10,
    maxSkewPs:    2.0,
    dataRate:     '12 Gbps / lane',
    standard:     'HDMI Spec v2.1 §5.2',
    topology:     'Stripline preferred',
    highlight:    false,
    tag:          'AV/Display',
  },
  {
    interface:    'DisplayPort 2.0',
    type:         'UHBR',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   5,
    maxSkewPs:    1.0,
    dataRate:     '20 Gbps / lane',
    standard:     'DP Spec v2.0 §3.5',
    topology:     'Stripline — backdrilling recommended',
    highlight:    false,
    tag:          'AV/Display',
  },
  {
    interface:    'LVDS',
    type:         'TIA/EIA-644',
    zdiff:        100,
    tolerance:    20,
    maxSkewMil:   50,
    maxSkewPs:    null,
    dataRate:     'Up to 1.923 Gbps',
    standard:     'TIA/EIA-644-A',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'Industrial',
  },
  {
    interface:    '1000BASE-T / SGMII',
    type:         'Ethernet',
    zdiff:        100,
    tolerance:    15,
    maxSkewMil:   50,
    maxSkewPs:    null,
    dataRate:     '1 Gbps',
    standard:     'IEEE 802.3',
    topology:     'Microstrip or Stripline',
    highlight:    false,
    tag:          'Networking',
  },
  {
    interface:    '10GBASE-KR / XFI',
    type:         '10G Ethernet',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   10,
    maxSkewPs:    1.5,
    dataRate:     '10.3125 Gbps',
    standard:     'IEEE 802.3 Clause 72',
    topology:     'Stripline — backdrilling recommended',
    highlight:    false,
    tag:          'Networking',
  },
  {
    interface:    'DDR4 DQS / CK',
    type:         'SSTL / POD',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   25,
    maxSkewPs:    null,
    dataRate:     'Up to 3200 MT/s',
    standard:     'JEDEC JESD79-4 §8',
    topology:     'Microstrip — short trace fly-by',
    highlight:    false,
    tag:          'Memory',
  },
  {
    interface:    'DDR5 DQS / CK',
    type:         'POD',
    zdiff:        100,
    tolerance:    10,
    maxSkewMil:   10,
    maxSkewPs:    1.0,
    dataRate:     'Up to 6400 MT/s',
    standard:     'JEDEC JESD79-5 §8',
    topology:     'Microstrip — short trace fly-by',
    highlight:    false,
    tag:          'High-Performance',
    isSICritical: true,
    // Add calc presets to the data rows
    calcPreset: { height: 0.15, width: 0.16, thickness: 0.035, spacing: 0.18, dk: 3.1 } 
  },
];

// ─── Sort icon helper ─────────────────────────────────────────────────────────
function SortIcon({ colKey, sortKey, sortDir }) {
  if (sortKey !== colKey) return <ArrowUpDown size={11} className="lam-sort-icon" />;
  return sortDir === 'asc'
    ? <ArrowUp   size={11} className="lam-sort-icon lam-sort-active" />
    : <ArrowDown size={11} className="lam-sort-icon lam-sort-active" />;
}

// ─── Tooltip helper ───────────────────────────────────────────────────────────
function Tip({ text, children }) {
  const [vis, setVis] = useState(false);
  return (
    <span className="lam-tooltip-host"
      onMouseEnter={() => setVis(true)}
      onMouseLeave={() => setVis(false)}
    >
      {children}
      <Info size={11} className="lam-tooltip-icon" />
      {vis && <span className="lam-tooltip-bubble">{text}</span>}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DiffPairReferenceTable() {
  const [query,   setQuery]   = useState('');
  const [sortKey, setSortKey] = useState('zdiff');
  const [sortDir, setSortDir] = useState('asc');

  const COLUMNS = [
    { key: 'interface',   label: 'Interface',              sortable: true,  tip: null },
    { key: 'type',        label: 'Type / Generation',      sortable: false, tip: null },
    { key: 'dataRate',    label: 'Data Rate',              sortable: false, tip: null },
    { key: 'zdiff',       label: 'Zdiff Target (Ω)',       sortable: true,  tip: 'Differential impedance as seen at the PCB trace. Measured at the connector/IC pin.' },
    { key: 'tolerance',   label: '± Tol. (Ω)',             sortable: true,  tip: 'Allowable impedance deviation from target.' },
    { key: 'maxSkewMil',  label: 'Max Intra-pair Skew',    sortable: true,  tip: 'Maximum allowed length mismatch between D+ and D− of the same pair.' },
    { key: 'topology',    label: 'Recommended Topology',   sortable: false, tip: null },
    { key: 'standard',    label: 'Reference Standard',     sortable: false, tip: null },
    { key: 'tag',         label: 'Application',            sortable: true,  tip: null },
    { key: 'actions',     label: 'Actions',                sortable: false, tip: 'Load standard parameters into the Interactive Zdiff Calculator.' },
  ];

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return INTERFACES.filter(r =>
      r.interface.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.tag.toLowerCase().includes(q) ||
      r.standard.toLowerCase().includes(q)
    );
  }, [query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] ?? -Infinity;
      const vb = b[sortKey] ?? -Infinity;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [filtered, sortKey, sortDir]);

  const getSkewClass = (mil) => {
    if (mil === null) return '';
    if (mil <= 5)  return 'lam-cell-excellent';
    if (mil <= 20) return 'lam-cell-good';
    if (mil <= 50) return 'lam-cell-ok';
    return 'lam-cell-warn';
  };

  return (
    <div className="lam-card slide-up" id="diff-pair-ref-table">
      {/* Header */}
      <div className="lam-header">
        <div>
          <h4 className="lam-title">High-Speed Interface Impedance Reference</h4>
          <p className="lam-subtitle">
            PCB-level Zdiff targets · Intra-pair skew budgets · {INTERFACES.length} interface standards
          </p>
        </div>
        <div className="lam-search-wrap">
          <Search size={14} className="lam-search-icon" />
          <input
            type="text"
            className="lam-search"
            placeholder="Search interface or standard…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="lam-legend">
        <span className="lam-legend-item"><span className="lam-dot lam-dot-excellent" />Skew ≤5 mil — Ultra-tight (PCIe Gen 4+)</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-good" />Skew 6–20 mil — Tight (PCIe Gen 1–3)</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-ok" />Skew 21–50 mil — Relaxed (USB 2.0, LVDS)</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-warn" />Skew &gt;50 mil — General purpose</span>
      </div>

      {/* Table */}
      <div className="lam-table-wrap">
        <table className="lam-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`lam-th ${col.sortable ? 'lam-th-sortable' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.tip
                    ? <Tip text={col.tip}>{col.label}</Tip>
                    : col.label
                  }
                  {col.sortable && <SortIcon colKey={col.key} sortKey={sortKey} sortDir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr><td colSpan={COLUMNS.length} className="lam-empty">No interfaces match your search.</td></tr>
            )}
            {sorted.map((row, i) => (
              <tr key={i} className={`lam-tr ${row.isSICritical ? 'lam-tr-highlight' : ''}`}>
                <td className="lam-td lam-td-product">{row.interface}</td>
                <td className="lam-td">{row.type}</td>
                <td className="lam-td lam-td-num">{row.dataRate}</td>
                <td className="lam-td lam-td-num" style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {row.zdiff} Ω
                </td>
                <td className="lam-td lam-td-num">±{row.tolerance} Ω</td>
                <td className={`lam-td lam-td-num lam-df-cell ${getSkewClass(row.maxSkewMil)}`}>
                  {row.maxSkewMil !== null
                    ? `≤${row.maxSkewMil} mil${row.maxSkewPs ? ` (≤${row.maxSkewPs} ps)` : ''}`
                    : <span className="lam-na">See spec</span>
                  }
                </td>
                <td className="lam-td" style={{ fontSize: '0.72rem' }}>{row.topology}</td>
                <td className="lam-td" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{row.standard}</td>
                <td className="lam-td">
                  <div className="flex items-center gap-2">
                    <span className="lam-app-tag">{row.tag}</span>
                    {row.isSICritical && (
                      <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter animate-pulse">
                        SI-Critical
                      </span>
                    )}
                  </div>
                </td>
                <td className="lam-td">
                  <button 
                    className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-110 group flex items-center gap-2 text-[10px] font-bold"
                    onClick={() => {
                      const event = new CustomEvent('zdiff:set-inputs', { 
                        detail: row.calcPreset || { height: 0.2, width: 0.18, thickness: 0.035, spacing: 0.2, dk: 4.17 } 
                      });
                      window.dispatchEvent(event);
                    }}
                    title="Load standard parameters into calculator"
                  >
                    <Calculator size={14} />
                    <span className="hidden group-hover:inline transition-all">LOAD TO CALC</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lam-footnote">
        * Zdiff values are PCB-trace targets as specified in the listed interface standards. Connector and cable
        impedance requirements may differ. PCIe Gen 4+ Zdiff changed to 85 Ω in Rev 5.0.
        Always consult the normative specification document for the complete, authoritative requirements.
      </p>
    </div>
  );
}
