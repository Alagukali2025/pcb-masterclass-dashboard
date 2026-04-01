import React, { useState } from 'react';
import { Layers, Cpu, Zap, Circle } from 'lucide-react';

// ─── Layer configuration per board type ───────────────────────────────────────
const STACKUP_CONFIGS = {
  4: {
    title: '4-Layer Standard',
    thickness: '1.6 mm',
    description: 'Ideal for general-purpose commercial designs. Signal / Ground / Power / Signal.',
    layers: [
      { type: 'mask',      label: 'Top Solder Mask',       sub: 'LPI Coating',              id: '',   weight: '',      h: 28 },
      { type: 'copper',    label: 'L1: Signal (Microstrip)',sub: 'Top Signal + Components',  id: 'L1', weight: '1 oz', h: 36 },
      { type: 'prepreg',   label: 'Prepreg DI-1',           sub: '1080 / 2116 Glass Style',  id: '',   weight: '',      h: 72 },
      { type: 'copper',    label: 'L2: Ground Plane',       sub: 'Primary Reference Plane',  id: 'L2', weight: '1 oz', h: 36 },
      { type: 'core',      label: 'Core Dielectric',        sub: 'Cured FR4 Base Material',  id: '',   weight: '',      h: 140, isMid: true },
      { type: 'copper',    label: 'L3: Power Plane',        sub: 'Internal Power Distribution', id: 'L3', weight: '1 oz', h: 36 },
      { type: 'prepreg',   label: 'Prepreg DI-2',           sub: '1080 / 2116 Glass Style',  id: '',   weight: '',      h: 72 },
      { type: 'copper',    label: 'L4: Signal (Microstrip)',sub: 'Bottom Signal Layer',       id: 'L4', weight: '1 oz', h: 36 },
      { type: 'mask',      label: 'Bottom Solder Mask',     sub: 'LPI Coating',              id: '',   weight: '',      h: 28 },
    ]
  },
  6: {
    title: '6-Layer High Speed',
    thickness: '1.6 mm',
    description: 'Adds internal stripline layers for EMI-shielded signal routing (USB 3.x, MIPI, DDR3).',
    layers: [
      { type: 'mask',    label: 'Top Solder Mask',          sub: 'LPI Coating',              id: '',   weight: '',       h: 28 },
      { type: 'copper',  label: 'L1: Signal (Microstrip)',  sub: 'Top Signal Layer',         id: 'L1', weight: '0.5 oz', h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-1',             sub: '1080 Glass Style',         id: '',   weight: '',       h: 64 },
      { type: 'copper',  label: 'L2: Ground Plane',         sub: 'Primary Reference Plane',  id: 'L2', weight: '1 oz',   h: 36 },
      { type: 'core',    label: 'Core Dielectric DI-2',     sub: 'Cured Base Material',      id: '',   weight: '',       h: 100 },
      { type: 'copper',  label: 'L3: Signal (Stripline)',   sub: 'Internal — EMI Shielded',  id: 'L3', weight: '1 oz',   h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-3',             sub: '2116 Glass Style',         id: '',   weight: '',       h: 64, isMid: true },
      { type: 'copper',  label: 'L4: Signal (Stripline)',   sub: 'Internal — EMI Shielded',  id: 'L4', weight: '1 oz',   h: 36 },
      { type: 'core',    label: 'Core Dielectric DI-4',     sub: 'Cured Base Material',      id: '',   weight: '',       h: 100 },
      { type: 'copper',  label: 'L5: Power Plane',          sub: 'Internal Power Distribution', id: 'L5', weight: '1 oz', h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-5',             sub: '1080 Glass Style',         id: '',   weight: '',       h: 64 },
      { type: 'copper',  label: 'L6: Signal (Microstrip)',  sub: 'Bottom Signal Layer',      id: 'L6', weight: '0.5 oz', h: 36 },
      { type: 'mask',    label: 'Bottom Solder Mask',       sub: 'LPI Coating',              id: '',   weight: '',       h: 28 },
    ]
  },
  8: {
    title: '8-Layer Standard',
    thickness: '1.6 mm',
    description: 'Industry standard for DDR4/5, PCIe Gen 4/5. Dedicated reference planes on every signal layer.',
    layers: [
      { type: 'mask',    label: 'Top Solder Mask',          sub: 'LPI Coating',              id: '',   weight: '',       h: 28 },
      { type: 'copper',  label: 'L1: Signal (Microstrip)',  sub: 'Top Signal Layer',         id: 'L1', weight: '0.5 oz', h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-1',             sub: '1080 / 2116 Glass Style',  id: '',   weight: '',       h: 60 },
      { type: 'copper',  label: 'L2: Ground Plane',         sub: 'Primary Reference Plane',  id: 'L2', weight: '1 oz',   h: 36 },
      { type: 'core',    label: 'Core Dielectric DI-2',     sub: 'Cured Base Material',      id: '',   weight: '',       h: 88 },
      { type: 'copper',  label: 'L3: Signal (Stripline)',   sub: 'Internal Signal Layer',    id: 'L3', weight: '1 oz',   h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-3',             sub: '1080 / 2116 Glass Style',  id: '',   weight: '',       h: 60 },
      { type: 'copper',  label: 'L4: Power Plane',          sub: 'Internal Power Distribution', id: 'L4', weight: '1 oz', h: 36 },
      { type: 'core',    label: 'Core Dielectric DI-4',     sub: 'Mid-Plane Isolation',      id: '',   weight: '',       h: 88, isMid: true },
      { type: 'copper',  label: 'L5: Ground Plane',         sub: 'Internal Reference Plane', id: 'L5', weight: '1 oz',   h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-5',             sub: '1080 / 2116 Glass Style',  id: '',   weight: '',       h: 60 },
      { type: 'copper',  label: 'L6: Signal (Stripline)',   sub: 'Internal Signal Layer',    id: 'L6', weight: '1 oz',   h: 36 },
      { type: 'core',    label: 'Core Dielectric DI-6',     sub: 'Cured Base Material',      id: '',   weight: '',       h: 88 },
      { type: 'copper',  label: 'L7: Ground Plane',         sub: 'Primary Reference Plane',  id: 'L7', weight: '1 oz',   h: 36 },
      { type: 'prepreg', label: 'Prepreg DI-7',             sub: '1080 / 2116 Glass Style',  id: '',   weight: '',       h: 60 },
      { type: 'copper',  label: 'L8: Signal (Microstrip)',  sub: 'Bottom Signal Layer',      id: 'L8', weight: '0.5 oz', h: 36 },
      { type: 'mask',    label: 'Bottom Solder Mask',       sub: 'LPI Coating',              id: '',   weight: '',       h: 28 },
    ]
  },
  12: {
    title: '12-Layer HDI',
    thickness: '2.4 mm',
    description: 'HDI / Server-grade PCBs. Multiple ground-signal-ground sandwiches for maximum isolation (PCIe Gen5, HBM2E).',
    layers: [
      { type: 'mask',    label: 'Top Solder Mask',          sub: 'LPI Coating',              id: '',    weight: '',       h: 28 },
      { type: 'copper',  label: 'L1: Signal (Microstrip)',  sub: 'Top Signal Layer',         id: 'L1',  weight: '0.5 oz', h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-1',             sub: '1078 Glass Style (Low-Loss)',id: '',  weight: '',       h: 48 },
      { type: 'copper',  label: 'L2: Ground Plane',         sub: 'Reference Plane',          id: 'L2',  weight: '1 oz',   h: 32 },
      { type: 'core',    label: 'Core Dielectric DI-2',     sub: 'Cured Low-Loss Material',  id: '',    weight: '',       h: 64 },
      { type: 'copper',  label: 'L3: Signal (Stripline)',   sub: 'Internal Signal',          id: 'L3',  weight: '1 oz',   h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-3',             sub: '1067 Glass Style (VLP)',   id: '',    weight: '',       h: 48 },
      { type: 'copper',  label: 'L4: Ground Plane',         sub: 'Reference Plane',          id: 'L4',  weight: '1 oz',   h: 32 },
      { type: 'core',    label: 'Core Dielectric DI-4',     sub: 'Cured Low-Loss Material',  id: '',    weight: '',       h: 64 },
      { type: 'copper',  label: 'L5: Signal (Stripline)',   sub: 'Internal Signal',          id: 'L5',  weight: '1 oz',   h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-5',             sub: '1067 Glass Style (VLP)',   id: '',    weight: '',       h: 48, isMid: true },
      { type: 'copper',  label: 'L6: Power / Signal',       sub: 'Internal Power Distribution', id: 'L6', weight: '1 oz', h: 32 },
      { type: 'core',    label: 'Core Dielectric DI-6',     sub: 'Mid-Stack Isolation',      id: '',    weight: '',       h: 64 },
      { type: 'copper',  label: 'L7: Ground Plane',         sub: 'Reference Plane',          id: 'L7',  weight: '1 oz',   h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-7',             sub: '1067 Glass Style (VLP)',   id: '',    weight: '',       h: 48 },
      { type: 'copper',  label: 'L8: Signal (Stripline)',   sub: 'Internal Signal',          id: 'L8',  weight: '1 oz',   h: 32 },
      { type: 'core',    label: 'Core Dielectric DI-8',     sub: 'Cured Low-Loss Material',  id: '',    weight: '',       h: 64 },
      { type: 'copper',  label: 'L9: Ground Plane',         sub: 'Reference Plane',          id: 'L9',  weight: '1 oz',   h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-9',             sub: '1078 Glass Style',         id: '',    weight: '',       h: 48 },
      { type: 'copper',  label: 'L10: Signal (Stripline)',  sub: 'Internal Signal',          id: 'L10', weight: '1 oz',   h: 32 },
      { type: 'core',    label: 'Core Dielectric DI-10',    sub: 'Cured Low-Loss Material',  id: '',    weight: '',       h: 64 },
      { type: 'copper',  label: 'L11: Ground Plane',        sub: 'Reference Plane',          id: 'L11', weight: '1 oz',   h: 32 },
      { type: 'prepreg', label: 'Prepreg DI-11',            sub: '1078 Glass Style',         id: '',    weight: '',       h: 48 },
      { type: 'copper',  label: 'L12: Signal (Microstrip)', sub: 'Bottom Signal Layer',      id: 'L12', weight: '0.5 oz', h: 32 },
      { type: 'mask',    label: 'Bottom Solder Mask',       sub: 'LPI Coating',              id: '',    weight: '',       h: 28 },
    ]
  }
};

const MASK_COLORS = {
  green: { label: 'Green (Standard)',  bg: '#166534', border: '#16a34a', glow: 'rgba(22,163,74,0.5)' },
  black: { label: 'Black (Premium)',   bg: '#18181b', border: '#52525b', glow: 'rgba(82,82,91,0.5)' },
  blue:  { label: 'Blue (Aerospace)',  bg: '#1e3a5f', border: '#3b82f6', glow: 'rgba(59,130,246,0.5)' },
};

const DRILL_TYPES = [
  { id: 'thru',   label: 'Through-hole',    color: '#f97316', desc: 'Spans all layers (L1–L[n]). Standard fabrication.' },
  { id: 'blind',  label: 'Blind Via',        color: '#06b6d4', desc: 'Connects outer layer to inner layer only.' },
  { id: 'buried', label: 'Buried Via',       color: '#a855f7', desc: 'Internal layers only. Invisible from surface.' },
];

export default function StackupLayerToggle() {
  const [layerCount, setLayerCount] = useState(8);
  const [maskColor, setMaskColor]   = useState('green');
  const [drillType, setDrillType]   = useState('thru');

  const config = STACKUP_CONFIGS[layerCount];
  const mask   = MASK_COLORS[maskColor];
  const drill  = DRILL_TYPES.find(d => d.id === drillType);

  const getLayerColor = (type) => {
    if (type === 'mask')    return mask.bg;
    if (type === 'copper')  return '#b45309';
    if (type === 'prepreg') return '#334155';
    if (type === 'core')    return '#1e293b';
    return '#0f172a';
  };

  const getDrillSpanStyle = (layers, idx, drillType) => {
    const isTop    = layers[idx].type === 'mask' && idx === 0;
    const isBottom = layers[idx].type === 'mask' && idx === layers.length - 1;
    const isFirst  = idx === 1; // first copper
    const isLast   = idx === layers.length - 2; // last copper
    const isMid    = idx > 1 && idx < layers.length - 2;

    if (drillType === 'thru') return 'layer-drill-thru';
    if (drillType === 'blind') {
      return (isFirst || isTop || (idx >= 1 && idx <= 3)) ? 'layer-drill-active' : 'layer-drill-none';
    }
    if (drillType === 'buried') {
      const midIdx = Math.floor(layers.length / 2);
      return (idx >= midIdx - 2 && idx <= midIdx + 2 && layers[idx].type !== 'mask') ? 'layer-drill-active' : 'layer-drill-none';
    }
    return 'layer-drill-none';
  };

  return (
    <div className="slt-card slide-up">

      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="slt-header">
        <div className="slt-header-title">
          <div className="slt-icon-wrap">
            <Layers size={22} className="slt-icon" />
          </div>
          <div>
            <h4 className="slt-title">Interactive Stackup Generator</h4>
            <p className="slt-subtitle">IPC-2221B Symmetric Construction · SSOT Visual Reference</p>
          </div>
        </div>

        {/* Layer count toggles */}
        <div className="slt-toggle-group">
          {[4, 6, 8, 12].map(n => (
            <button
              key={n}
              className={`slt-toggle-btn ${layerCount === n ? 'slt-toggle-active' : ''}`}
              onClick={() => setLayerCount(n)}
            >
              {n}L
            </button>
          ))}
        </div>
      </div>

      {/* ─── Config description ──────────────────────────────────── */}
      <div className="slt-config-banner">
        <div className="slt-config-name">{config.title}</div>
        <div className="slt-config-desc">{config.description}</div>
        <div className="slt-config-thickness">Total: {config.thickness}</div>
      </div>

      {/* ─── Controls Row ────────────────────────────────────────── */}
      <div className="slt-controls">
        {/* Mask colour */}
        <div className="slt-control-group">
          <span className="slt-control-label">Solder Mask Colour</span>
          <div className="slt-mask-picker">
            {Object.entries(MASK_COLORS).map(([key, val]) => (
              <button
                key={key}
                className={`slt-mask-btn ${maskColor === key ? 'slt-mask-active' : ''}`}
                style={{ '--mask-color': val.bg, '--mask-border': val.border }}
                onClick={() => setMaskColor(key)}
                title={val.label}
              >
                <span className="slt-mask-swatch" style={{ background: val.bg, borderColor: val.border }} />
                {val.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Drill type */}
        <div className="slt-control-group">
          <span className="slt-control-label">Drill Span Overlay</span>
          <div className="slt-drill-picker">
            {DRILL_TYPES.map(d => (
              <button
                key={d.id}
                className={`slt-drill-btn ${drillType === d.id ? 'slt-drill-active' : ''}`}
                style={{ '--drill-color': d.color }}
                onClick={() => setDrillType(d.id)}
              >
                <Circle size={8} style={{ color: d.color, fill: d.color }} />
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Cross-section Visualizer ─────────────────────────────── */}
      <div className="slt-cross-section">
        {config.layers.map((layer, idx) => (
          <div
            key={`${layerCount}-${idx}`}
            className={`slt-layer-row ${layer.isMid ? 'slt-layer-mid' : ''}`}
            style={{ '--anim-delay': `${idx * 40}ms` }}
          >
            {/* ID label */}
            <div className="slt-layer-id">
              {layer.id && <span className="slt-id-badge">{layer.id}</span>}
            </div>

            {/* Visual bar */}
            <div
              className={`slt-layer-bar slt-layer-${layer.type}`}
              style={{
                height: `${layer.h}px`,
                backgroundColor: getLayerColor(layer.type),
                borderColor: layer.type === 'mask' ? mask.border : undefined,
                boxShadow: layer.type === 'mask' ? `0 0 12px ${mask.glow}` : undefined,
              }}
            >
              {/* Prepreg diagonal hatch */}
              {layer.type === 'prepreg' && <div className="slt-hatch slt-hatch-prepreg" />}
              {/* Core cross-hatch */}
              {layer.type === 'core' && <div className="slt-hatch slt-hatch-core" />}
              {/* Copper sheen */}
              {layer.type === 'copper' && <div className="slt-copper-sheen" />}
              {/* Mask sheen */}
              {layer.type === 'mask' && <div className="slt-mask-sheen" />}

              {/* Mid-plane axis */}
              {layer.isMid && (
                <div className="slt-mid-axis">
                  <span className="slt-mid-label">Symmetry Axis · Mid-Plane</span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="slt-layer-legend">
              <div className="slt-legend-top">
                <span className="slt-legend-label">{layer.label}</span>
                {layer.weight && (
                  <span className="slt-weight-badge">{layer.weight}</span>
                )}
              </div>
              <span className="slt-legend-sub">{layer.sub}</span>
            </div>

            {/* Drill span indicator */}
            <div className="slt-drill-col">
              <div
                className={`slt-drill-indicator ${getDrillSpanStyle(config.layers, idx, drillType)}`}
                style={{ '--drill-accent': drill.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ─── Drill legend ─────────────────────────────────────────── */}
      <div className="slt-drill-legend">
        {DRILL_TYPES.map(d => (
          <div key={d.id} className={`slt-drill-legend-item ${drillType === d.id ? 'slt-drill-legend-active' : ''}`}>
            <span className="slt-drill-dot" style={{ background: d.color }} />
            <div>
              <span className="slt-drill-legend-name">{d.label}</span>
              <span className="slt-drill-legend-desc">{d.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Footer stats ─────────────────────────────────────────── */}
      <div className="slt-stats">
        <div className="slt-stat">
          <Cpu size={14} className="slt-stat-icon" />
          <span className="slt-stat-value">{layerCount}</span>
          <span className="slt-stat-label">Signal Layers</span>
        </div>
        <div className="slt-stat">
          <Zap size={14} className="slt-stat-icon" />
          <span className="slt-stat-value">{config.thickness}</span>
          <span className="slt-stat-label">Board Thickness</span>
        </div>
        <div className="slt-stat">
          <Layers size={14} className="slt-stat-icon" />
          <span className="slt-stat-value">{config.layers.filter(l => l.type === 'prepreg').length} Pre / {config.layers.filter(l => l.type === 'core').length} Core</span>
          <span className="slt-stat-label">Laminate Layers</span>
        </div>
      </div>
    </div>
  );
}
