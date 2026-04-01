import React, { useState } from 'react';
import { Download, FileJson, FileText, Table2, CheckCircle2, AlertCircle, Zap, Database } from 'lucide-react';

// Mock stackup JSON export data
const generateExportData = (format) => {
  const stackup = {
    ssot_version: '2.1.0',
    format,
    export_date: new Date().toISOString(),
    board: {
      id: 'MASTERCLASS_STACKUP_DEMO',
      revision: 'REV_A',
      total_thickness_mm: 1.6,
      layer_count: 8,
      ipc_class: 2,
      bow_twist_max_pct: 0.75,
    },
    materials: {
      primary_laminate: {
        product: 'Panasonic Megtron 6',
        ipc_slash: 'IPC-4101/99',
        dk_at_10ghz: 3.10,
        df_at_10ghz: 0.0020,
        tg_celsius: 185,
        td_celsius: 410,
        cte_z_ppm: 45,
        thermal_conductivity_wpmk: 0.36,
      },
      copper_foil: {
        type: 'VLP (Very Low Profile)',
        standard: 'IPC-4562A',
        surface_roughness_rz_um: 2.0,
      },
    },
    layers: [
      { layer_id: 'SM-TOP', type: 'solder_mask', thickness_um: 25, color: 'green' },
      { layer_id: 'L1', type: 'copper_signal', role: 'microstrip', copper_oz: 0.5, thickness_um: 35 },
      { layer_id: 'DI-1', type: 'prepreg', glass_style: '1080+2116', thickness_um: 100, dk: 3.2 },
      { layer_id: 'L2', type: 'copper_plane', role: 'ground', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-2', type: 'core', thickness_um: 200, dk: 3.1 },
      { layer_id: 'L3', type: 'copper_signal', role: 'stripline', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-3', type: 'prepreg', glass_style: '1080', thickness_um: 100, dk: 3.2 },
      { layer_id: 'L4', type: 'copper_plane', role: 'power', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-4', type: 'core', thickness_um: 200, dk: 3.1, symmetry_axis: true },
      { layer_id: 'L5', type: 'copper_plane', role: 'ground', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-5', type: 'prepreg', glass_style: '1080', thickness_um: 100, dk: 3.2 },
      { layer_id: 'L6', type: 'copper_signal', role: 'stripline', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-6', type: 'core', thickness_um: 200, dk: 3.1 },
      { layer_id: 'L7', type: 'copper_plane', role: 'ground', copper_oz: 1.0, thickness_um: 35 },
      { layer_id: 'DI-7', type: 'prepreg', glass_style: '1080+2116', thickness_um: 100, dk: 3.2 },
      { layer_id: 'L8', type: 'copper_signal', role: 'microstrip', copper_oz: 0.5, thickness_um: 35 },
      { layer_id: 'SM-BOT', type: 'solder_mask', thickness_um: 25, color: 'green' },
    ],
    impedance_targets: [
      { net_class: 'single_ended_50ohm', topology: 'microstrip', z0_ohm: 50, tolerance_pct: 10 },
      { net_class: 'differential_100ohm', topology: 'differential_stripline', zdiff_ohm: 100, tolerance_pct: 10 },
    ],
    drill_table: [
      { type: 'through_hole', min_diameter_mm: 0.25, max_aspect_ratio: '10:1' },
    ],
  };
  return JSON.stringify(stackup, null, 2);
};

const FORMATS = [
  {
    id: 'ipc2581',
    label: 'IPC-2581',
    icon: Database,
    color: '#06b6d4',
    badge: 'Recommended',
    badgeClass: 'exp-badge-rec',
    intelligence: 'Full SSOT',
    content: 'Stackup, materials, Dk/Df, netlist, BOM, fab notes',
    benefit: 'Fabricator verifies impedance targets against actual material Dk automatically. Zero interpretation required.',
  },
  {
    id: 'odbpp',
    label: 'ODB++',
    icon: FileJson,
    color: '#a855f7',
    badge: 'Industry Standard',
    badgeClass: 'exp-badge-std',
    intelligence: 'High-Level',
    content: 'Layer stackup, component footprints, netlist',
    benefit: 'Tool-agnostic format accepted by all major EDA tools. No proprietary lock-in.',
  },
  {
    id: 'gerber',
    label: 'Gerber RS-274X',
    icon: FileText,
    color: '#64748b',
    badge: 'Legacy',
    badgeClass: 'exp-badge-legacy',
    intelligence: 'Zero (Dumb)',
    content: 'Lines and polygons only — no material or netlist data',
    benefit: null,
  },
];

export default function StackupExport() {
  const [selected, setSelected] = useState('ipc2581');
  const [copied, setCopied]   = useState(false);

  const selectedFmt = FORMATS.find(f => f.id === selected);
  const jsonOutput  = selected !== 'gerber' ? generateExportData(selected === 'ipc2581' ? 'IPC-2581' : 'ODB++') : null;

  const handleDownload = () => {
    const content = jsonOutput || '# Gerber RS-274X export requires your EDA tool — no SSOT data included.';
    const ext     = selected === 'gerber' ? 'txt' : 'json';
    const filename= `stackup_ssot_${selected}_export.${ext}`;
    const blob    = new Blob([content], { type: 'application/json' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (jsonOutput) {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="exp-card slide-up">
      {/* Header */}
      <div className="exp-header">
        <div className="exp-icon-wrap">
          <Download size={20} className="exp-icon" />
        </div>
        <div>
          <h4 className="exp-title">Stackup SSOT Export Simulation</h4>
          <p className="exp-subtitle">IPC-2581 · ODB++ · Gerber RS-274X — Format Intelligence Comparison</p>
        </div>
      </div>

      {/* Format cards */}
      <div className="exp-formats-grid">
        {FORMATS.map(fmt => {
          const Icon = fmt.icon;
          return (
            <button
              key={fmt.id}
              className={`exp-fmt-card ${selected === fmt.id ? 'exp-fmt-active' : ''}`}
              style={{ '--fmt-color': fmt.color }}
              onClick={() => setSelected(fmt.id)}
              aria-pressed={selected === fmt.id}
            >
              <div className="exp-fmt-top">
                <div className="exp-fmt-icon-wrap" style={{ color: fmt.color }}>
                  <Icon size={18} />
                </div>
                <span className={`exp-badge ${fmt.badgeClass}`}>{fmt.badge}</span>
              </div>
              <div className="exp-fmt-name">{fmt.label}</div>
              <div className="exp-fmt-intel">
                Intelligence: <strong>{fmt.intelligence}</strong>
              </div>
              <div className="exp-fmt-content">{fmt.content}</div>

              {fmt.id === selected && (
                <div className="exp-fmt-selected-indicator" />
              )}
            </button>
          );
        })}
      </div>

      {/* Why IPC-2581/ODB++ explanation */}
      {selected !== 'gerber' && (
        <div className="exp-benefit-banner">
          <CheckCircle2 size={14} className="exp-benefit-icon" />
          <p><strong>SSOT Advantage:</strong> {selectedFmt.benefit}</p>
        </div>
      )}
      {selected === 'gerber' && (
        <div className="exp-warn-banner">
          <AlertCircle size={14} className="exp-warn-icon" />
          <p>
            <strong>Gerber RS-274X carries zero material intelligence.</strong> The fabricator receives only geometry —
            no Dk, no Df, no layer assignments. This requires a manual FAB drawing, introduces interpretation errors,
            and breaks SSOT traceability. Use IPC-2581 or ODB++ for professional handovers.
          </p>
        </div>
      )}

      {/* Comparison table */}
      <div className="exp-comparison">
        <div className="exp-compare-header">Format Intelligence Comparison</div>
        <div className="exp-compare-table-wrap">
          <table className="exp-compare-table">
            <thead>
              <tr>
                <th>Data Field</th>
                <th style={{ color: '#06b6d4' }}>IPC-2581</th>
                <th style={{ color: '#a855f7' }}>ODB++</th>
                <th style={{ color: '#64748b' }}>Gerber RS-274X</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Layer Stackup Definition', '✓', '✓', '✗'],
                ['Material Dk / Df Values', '✓', '✗', '✗'],
                ['IPC-4101 Slash Sheet', '✓', '✗', '✗'],
                ['Copper Weight per Layer', '✓', '✓', '✗'],
                ['Impedance Targets', '✓', '✗', '✗'],
                ['Netlist / Connectivity', '✓', '✓', '✗'],
                ['BOM Integration', '✓', '✗', '✗'],
                ['Drills / Via Definition', '✓', '✓', 'Partial'],
                ['Fab Note Embedding', '✓', '✓', 'Manual PDF only'],
              ].map(([field, ipc, odb, ger], i) => (
                <tr key={i} className={selected === 'ipc2581' && ipc === '✓' ? 'exp-row-highlight-ipc' : selected === 'odbpp' && odb === '✓' ? 'exp-row-highlight-odb' : ''}>
                  <td className="exp-compare-field">{field}</td>
                  <td className={`exp-compare-val ${ipc === '✓' ? 'exp-val-yes' : 'exp-val-no'}`}>{ipc}</td>
                  <td className={`exp-compare-val ${odb === '✓' ? 'exp-val-yes' : odb === '✗' ? 'exp-val-no' : 'exp-val-partial'}`}>{odb}</td>
                  <td className={`exp-compare-val ${ger === '✓' ? 'exp-val-yes' : ger === '✗' ? 'exp-val-no' : 'exp-val-partial'}`}>{ger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON preview */}
      {jsonOutput && (
        <div className="exp-preview">
          <div className="exp-preview-header">
            <div className="exp-preview-title">
              <Zap size={13} className="exp-preview-icon" />
              Mock {selectedFmt.label} Export — Stackup SSOT Definition
            </div>
            <div className="exp-preview-actions">
              <button className="exp-copy-btn" onClick={handleCopy}>
                {copied ? <CheckCircle2 size={13} /> : null}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button className="exp-download-btn" onClick={handleDownload}>
                <Download size={13} />
                Download .json
              </button>
            </div>
          </div>
          <pre className="exp-json-block">
            <code>{jsonOutput}</code>
          </pre>
        </div>
      )}

      {selected === 'gerber' && (
        <div className="exp-gerber-placeholder">
          <FileText size={32} className="exp-gerber-icon" />
          <p>Gerber RS-274X files are generated by your EDA tool (Altium, Allegro, KiCad).</p>
          <p>No SSOT data is embedded. A separate FAB drawing (PDF) is mandatory.</p>
          <button className="exp-download-btn" onClick={handleDownload}>
            <Download size={13} />
            Download Note (.txt)
          </button>
        </div>
      )}
    </div>
  );
}
