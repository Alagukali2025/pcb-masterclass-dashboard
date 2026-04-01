import { useState } from 'react';
import { Search, User, Sun, Moon, Menu, X } from 'lucide-react';

export default function Header({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="app-header fade-in">
      <div className={`header-left ${isSearchExpanded ? 'search-expanded' : ''}`}>
        <button 
          className="icon-btn menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className={`search-bar ${isSearchExpanded ? 'expanded' : ''}`}>
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search rules, standards..." className="search-input" />
          <button 
            className="icon-btn mobile-search-close" 
            onClick={() => setIsSearchExpanded(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button 
          className="icon-btn search-bar-toggle" 
          onClick={() => setIsSearchExpanded(true)}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>
      
      <div className="header-actions">
        <button 
          className="icon-btn" 
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="user-avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
