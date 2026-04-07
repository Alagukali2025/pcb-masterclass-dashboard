import { useState } from 'react';
import { Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ChevronRight } from 'lucide-react';
import RoadMap from './RoadMap';

export default function Dashboard() {
  const [activePhase, setActivePhase] = useState('Library');

  // Mapping flow phase to module IDs
  const phaseToModules = {
    'Library': ['footprint'],
    'Stackup': ['stackup'],
    'Routing': ['diff_pair', 'high_speed', 'ddr', 'si_pi'],
    'DFM': ['dfm_dft', 'emi_emc'],
    'Output': [] // No specific modules yet for Output output
  };

  // Filter modules based on active phase (if null, show all)
  const filteredModules = activePhase 
    ? modulesData.filter(mod => phaseToModules[activePhase]?.includes(mod.id))
    : modulesData;

  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>PCB Design Hub</h1>
        <p>Footprints • Stackup • Layout • Standards</p>
      </div>

      <RoadMap activePhase={activePhase} onPhaseClick={setActivePhase} />

      <div className="modules-grid">
        {filteredModules.length > 0 ? (
          filteredModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <Link to={`/module/${mod.id}`} key={mod.id} className="module-card slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="card-top">
                  <div className="icon-wrapper">
                    <Icon size={24} />
                  </div>
                  <div className="arrow-wrapper">
                    <ChevronRight size={20} />
                  </div>
                </div>
                <div className="card-content">
                  <h3>{mod.title}</h3>
                  <p>{mod.desc}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No modules available for this phase currently.</p>
          </div>
        )}
      </div>
    </div>
  );
}
