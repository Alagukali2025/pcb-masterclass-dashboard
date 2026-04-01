import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Star, Info } from 'lucide-react';

// ─── Laminate Dataset ──────────────────────────────────────────────────────────
const LAMINATES = [
  {
    class: 'Standard FR4',
    product: 'Isola 370HR',
    dk: 4.17,
    df: 0.0160,
    tg: 180,
    td: 340,
    ctez: 45,
    thermalK: 0.30,
    ipcSlash: '/24',
    highlight: false,
    tag: 'High-Tg'
  },
  {
    class: 'Standard FR4',
    product: 'IT-180A',
    dk: 4.20,
    df: 0.0190,
    tg: 170,
    td: 335,
    ctez: 48,
    thermalK: 0.28,
    ipcSlash: '/21',
    highlight: false,
    tag: 'Standard'
  },
  {
    class: 'Low-Loss (High Speed)',
    product: 'Panasonic Megtron 6',
    dk: 3.10,
    df: 0.0020,
    tg: 185,
    td: 410,
    ctez: 45,
    thermalK: 0.36,
    ipcSlash: '/99',
    highlight: true,
    tag: '≤25Gbps'
  },
  {
    class: 'Ultra-Low Loss (RF/mmWave)',
    product: 'Rogers RO4350B',
    dk: 3.66,
    df: 0.0031,
    tg: null,
    td: 390,
    ctez: 32,
    thermalK: 0.62,
    ipcSlash: 'N/A (PTFE-blend)',
    highlight: false,
    tag: 'RF/mmWave'
  },
  {
    class: 'High-Speed / High-Tg',
    product: 'TUC TU-883',
    dk: 3.80,
    df: 0.0080,
    tg: 200,
    td: 400,
    ctez: 35,
    thermalK: 0.34,
    ipcSlash: '/99',
    highlight: false,
    tag: '≤10Gbps'
  },
  {
    class: 'Ultra-Low Loss (Server)',
    product: 'Isola I-Tera MT40',
    dk: 3.45,
    df: 0.0040,
    tg: 200,
    td: 430,
    ctez: 40,
    thermalK: 0.38,
    ipcSlash: '/99',
    highlight: false,
    tag: '≤56Gbps'
  },
  {
    class: 'Halogen-Free',
    product: 'Ventec VT-901',
    dk: 3.80,
    df: 0.0100,
    tg: 175,
    td: 370,
    ctez: 40,
    thermalK: 0.32,
    ipcSlash: '/129',
    highlight: false,
    tag: 'Green'
  },
  {
    class: 'Ultra-Low Loss (PTFE)',
    product: 'Taconic TLX-8',
    dk: 2.55,
    df: 0.0019,
    tg: null,
    td: null,
    ctez: 25,
    thermalK: 0.24,
    ipcSlash: 'N/A (PTFE)',
    highlight: false,
    tag: 'RF/Radar'
  },
  {
    class: 'Low-Loss (Network)',
    product: 'Nelco N4000-13',
    dk: 3.70,
    df: 0.0090,
    tg: 210,
    td: 415,
    ctez: 38,
    thermalK: 0.33,
    ipcSlash: '/99',
    highlight: false,
    tag: 'High-Tg'
  },
];

// ─── Acronym Tooltips ──────────────────────────────────────────────────────────
const ACRONYMS = {
  'Dk': 'Dielectric Constant (Relative Permittivity). Controls signal propagation speed. Lower = faster signals. Measured at operating frequency.',
  'Df': 'Dissipation Factor (Loss Tangent). Energy lost as heat in the dielectric. Critical for signal integrity at >5 GHz. Lower = less signal attenuation.',
  'Tg': 'Glass Transition Temperature (°C). Temperature at which the board softens from rigid (glassy) to rubber state. Lead-free reflow (260°C) requires Tg >170°C.',
  'Td': 'Decomposition Temperature (°C). Temperature where the material loses 5% of its mass. The "point of no return" — board cannot recover above Td.',
  'Z-CTE': 'Z-Axis Coefficient of Thermal Expansion (ppm/°C). Vertical expansion rate during reflow. High Z-CTE cracks via barrels after repeated thermal cycles.',
  'Th. Cond.': 'Thermal Conductivity (W/mK). Rate of heat transfer through the dielectric. Critical for power electronics — higher value means better heat dissipation.',
};

function AcronymTooltip({ term, children }) {
  const [visible, setVisible] = useState(false);
  const desc = ACRONYMS[term];
  return (
    <span
      className="lam-tooltip-host"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <Info size={11} className="lam-tooltip-icon" />
      {visible && desc && (
        <span className="lam-tooltip-bubble">
          <strong>{term}</strong> — {desc}
        </span>
      )}
    </span>
  );
}

export default function LaminateTable() {
  const [query, setQuery]         = useState('');
  const [sortKey, setSortKey]     = useState('df');
  const [sortDir, setSortDir]     = useState('asc');

  const COLUMNS = [
    { key: 'class',    label: 'Material Class',        sortable: true,  acronym: null },
    { key: 'product',  label: 'Product',               sortable: true,  acronym: null },
    { key: 'dk',       label: 'Dk @10GHz',             sortable: true,  acronym: 'Dk' },
    { key: 'df',       label: 'Df @10GHz',             sortable: true,  acronym: 'Df' },
    { key: 'tg',       label: 'Tg (°C)',               sortable: true,  acronym: 'Tg' },
    { key: 'td',       label: 'Td (°C)',               sortable: true,  acronym: 'Td' },
    { key: 'ctez',     label: 'Z-CTE (ppm/°C)',        sortable: true,  acronym: 'Z-CTE' },
    { key: 'thermalK', label: 'Th. Cond. (W/mK)',      sortable: true,  acronym: 'Th. Cond.' },
    { key: 'ipcSlash', label: 'IPC-4101 Slash',        sortable: false, acronym: null },
    { key: 'tag',      label: 'Application',           sortable: false, acronym: null },
  ];

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return LAMINATES.filter(l =>
      l.product.toLowerCase().includes(q) ||
      l.class.toLowerCase().includes(q) ||
      l.tag.toLowerCase().includes(q)
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

  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    if (sortKey !== col.key) return <ArrowUpDown size={11} className="lam-sort-icon" />;
    return sortDir === 'asc'
      ? <ArrowUp size={11} className="lam-sort-icon lam-sort-active" />
      : <ArrowDown size={11} className="lam-sort-icon lam-sort-active" />;
  };

  const formatVal = (key, val) => {
    if (val === null || val === undefined) return <span className="lam-na">N/A</span>;
    if (key === 'df') return val.toFixed(4);
    if (key === 'dk' || key === 'thermalK') return val.toFixed(2);
    return val;
  };

  const getDfClass = (df) => {
    if (df <= 0.003) return 'lam-cell-excellent';
    if (df <= 0.008) return 'lam-cell-good';
    if (df <= 0.012) return 'lam-cell-ok';
    return 'lam-cell-warn';
  };

  return (
    <div className="lam-card slide-up">
      {/* Header */}
      <div className="lam-header">
        <div>
          <h4 className="lam-title">Advanced Laminate Material Database</h4>
          <p className="lam-subtitle">IPC-4101C Referenced · High-Frequency Performance Data · {LAMINATES.length} Materials</p>
        </div>
        <div className="lam-search-wrap">
          <Search size={14} className="lam-search-icon" />
          <input
            type="text"
            className="lam-search"
            placeholder="Search product or class…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="lam-legend">
        <span className="lam-legend-item"><span className="lam-dot lam-dot-excellent" />Df ≤ 0.003 — Ultra-Low Loss</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-good" />Df 0.003–0.008 — Low Loss</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-ok" />Df 0.008–0.012 — Medium Loss</span>
        <span className="lam-legend-item"><span className="lam-dot lam-dot-warn" />Df &gt; 0.012 — High Loss</span>
        <span className="lam-legend-item"><Star size={11} className="lam-star" />Recommended for &gt;10Gbps</span>
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
                  {col.acronym ? (
                    <AcronymTooltip term={col.acronym}>
                      {col.label}
                    </AcronymTooltip>
                  ) : col.label}
                  <SortIcon col={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="lam-empty">No materials match your search.</td>
              </tr>
            )}
            {sorted.map((row, i) => (
              <tr key={i} className={`lam-tr ${row.highlight ? 'lam-tr-highlight' : ''}`}>
                <td className="lam-td lam-td-class">{row.class}</td>
                <td className="lam-td lam-td-product">
                  {row.highlight && <Star size={12} className="lam-row-star" />}
                  {row.product}
                </td>
                <td className="lam-td lam-td-num">{formatVal('dk', row.dk)}</td>
                <td className={`lam-td lam-td-num lam-df-cell ${getDfClass(row.df)}`}>{formatVal('df', row.df)}</td>
                <td className="lam-td lam-td-num">{formatVal('tg', row.tg)}</td>
                <td className="lam-td lam-td-num">{formatVal('td', row.td)}</td>
                <td className="lam-td lam-td-num">{formatVal('ctez', row.ctez)}</td>
                <td className="lam-td lam-td-num">{formatVal('thermalK', row.thermalK)}</td>
                <td className="lam-td lam-td-slash">{row.ipcSlash}</td>
                <td className="lam-td">
                  <span className="lam-app-tag">{row.tag}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lam-footnote">
        * Dk and Df values measured at 10 GHz. Tg/Td per IEC 60249. Thermal conductivity per ASTM E1461.
        Highlight row (★) indicates recommended primary choice for high-speed DDR/SerDes designs above 10 Gbps.
      </p>
    </div>
  );
}
