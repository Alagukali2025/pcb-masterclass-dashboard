import React from 'react';
import { Component, Layers, Activity, ShieldAlert, FileOutput } from 'lucide-react';
import './RoadMap.css';

const flowSteps = [
  {
    id: 'Library',
    title: 'Library',
    subtitle: 'Footprint creation',
    description: '(The Foundation)',
    icon: Component,
    skills: ["IPC-7351 Math", "3D Modeling", "Density Levels"]
  },
  {
    id: 'Stackup',
    title: 'Stackup',
    subtitle: 'Thickness & layers',
    description: '(The Skeleton)',
    icon: Layers,
    skills: ["Material Selection", "Impedance Math", "Layer Balancing"]
  },
  {
    id: 'Routing',
    title: 'Routing',
    subtitle: 'Signal & Power',
    description: '(The Nervous System)',
    icon: Activity,
    skills: ["Length Matching", "Phase Skew", "Return Paths"]
  },
  {
    id: 'DFM',
    title: 'DFM',
    subtitle: 'Manufacturing checks',
    description: '(The Reality Check)',
    icon: ShieldAlert,
    skills: ["Aspect Ratios", "Acid Traps", "Solder Mask"]
  },
  {
    id: 'Output',
    title: 'Output',
    subtitle: 'Gerbers & BOM',
    description: '(The Hand-off)',
    icon: FileOutput,
    skills: ["Gerber RS-274X", "IPC-2581", "BOM Generation"]
  }
];

export default function RoadMap({ activePhase, onPhaseClick }) {
  return (
    <div className="roadmap-container slide-up" style={{ animationDelay: '50ms' }}>
      <h2 className="roadmap-title">The Engineering Flow</h2>
      <div className="roadmap-flow">
        <div className="roadmap-line"></div>
        {flowSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activePhase === step.id;
          return (
            <div 
              key={step.id} 
              className={`roadmap-step ${isActive ? 'active' : ''}`}
              onClick={() => onPhaseClick(isActive ? null : step.id)}
            >
              <div className="roadmap-tooltip">
                <ul>
                  {step.skills.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="roadmap-icon-wrapper">
                <Icon size={24} />
              </div>
              <div className="roadmap-info">
                <h4>{step.title}</h4>
                <span className="roadmap-subtitle">{step.subtitle}</span>
                <span className="roadmap-desc">{step.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
