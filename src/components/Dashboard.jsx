import { Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ChevronRight } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Learning Dashboard</h1>
        <p>Select a topic below to begin your engineering journey.</p>
      </div>

      <div className="modules-grid">
        {modulesData.map((mod, i) => {
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
        })}
      </div>
    </div>
  );
}
