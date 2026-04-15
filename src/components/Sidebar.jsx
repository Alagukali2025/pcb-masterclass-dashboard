import { Link, useLocation } from 'react-router-dom';
import { Layers, Home, X, ShieldCheck } from 'lucide-react';
import { modulesData } from '../data/modules';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen }) {
  const location = useLocation();
  const { userData } = useAuth();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Home size={20} />
              <span>Dashboard</span>
            </Link>
          </li>

          {userData?.isOwner && (
            <li>
              <Link to="/admin" className={`nav-link admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                <ShieldCheck size={20} />
                <span>Admin Panel</span>
              </Link>
            </li>
          )}

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
