import { Link, useLocation } from 'react-router-dom';
import { Layers, Home } from 'lucide-react';
import { modulesData } from '../data/modules';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar slide-up">
      <Link to="/" className="sidebar-logo">
        <Layers className="logo-icon" />
        <h2>PCB Masterclass</h2>
      </Link>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <div className="nav-divider">Modules</div>
          {modulesData.map(mod => {
            const IconComponent = mod.icon;
            const isActive = location.pathname === `/module/${mod.id}`;
            return (
              <li key={mod.id}>
                <Link to={`/module/${mod.id}`} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <IconComponent size={20} />
                  <span>{mod.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
