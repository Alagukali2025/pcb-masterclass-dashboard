import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Search, Moon, Sun, Menu } from 'lucide-react';

export default function BottomNav({ theme, toggleTheme, toggleSidebar, isModulesMenuOpen, setModulesMenuOpen }) {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`bottom-nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        <Home size={22} />
        <span>Home</span>
      </Link>

      <button 
        className={`bottom-nav-link ${isModulesMenuOpen ? 'active' : ''}`}
        onClick={() => setModulesMenuOpen(!isModulesMenuOpen)}
      >
        <Menu size={22} />
        <span>Modules</span>
      </button>

      <button className="bottom-nav-link" onClick={toggleTheme}>
        {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <div className="bottom-nav-indicator"></div>
    </nav>
  );
}
