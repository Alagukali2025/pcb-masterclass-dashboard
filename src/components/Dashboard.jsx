import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ChevronRight, BookOpen } from 'lucide-react';
import RoadMap from './RoadMap';
import { useDesign } from '../context/DesignContext';

// Build a title lookup map for prerequisites display
const moduleTitleMap = modulesData.reduce((acc, m) => {
  acc[m.id] = m.title;
  return acc;
}, {});

export default function Dashboard() {
  const { activePhase, setActivePhase } = useDesign();
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    return !sessionStorage.getItem('dashboard_animated');
  });

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        sessionStorage.setItem('dashboard_animated', 'true');
        // We don't necessarily need to set shouldAnimate to false here
        // as the component will re-render or the user will navigate.
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  // Mapping flow phase to module IDs
  const phaseToModules = {
    'Library': ['footprint'],
    'Stackup': ['stackup', 'thermal'],
    'Routing': ['diff_pair', 'high_speed', 'ddr', 'si_pi'],
    'DFM': ['dfm_dft', 'emi_emc'],
    'Output': ['pcb_output_system']
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
            const prereqs = mod.prerequisites || [];
            return (
              <Link 
                to={`/module/${mod.id}`} 
                key={mod.id} 
                className={`module-card ${shouldAnimate ? 'slide-up' : ''}`} 
                style={shouldAnimate ? { animationDelay: `${i * 50}ms` } : {}}
              >
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
                  {prereqs.length > 0 && (
                    <div className="module-prereq">
                      <BookOpen size={10} className="prereq-label" />
                      <span className="prereq-label">Requires:</span>
                      {prereqs.map(pid => (
                        <span key={pid} className="prereq-tag">
                          {moduleTitleMap[pid] || pid}
                        </span>
                      ))}
                    </div>
                  )}
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
