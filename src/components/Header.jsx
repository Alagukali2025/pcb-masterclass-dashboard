import { useState, useEffect, useRef } from 'react';
import { Search, User, Sun, Moon, Menu, X, BookOpen, Hash, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { modulesData } from '../data/modules';

export default function Header({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const location = useLocation();

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsResultsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search/results on navigation
  useEffect(() => {
    setIsSearchExpanded(false);
    setIsResultsVisible(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsResultsVisible(false);
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    modulesData.forEach(module => {
      // Match Module Title
      if (module.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'module',
          id: module.id,
          title: module.title,
          desc: module.desc,
          icon: module.icon
        });
      }

      // Match Section Headings
      if (module.content && module.content.sections) {
        module.content.sections.forEach((section, index) => {
          if (section.heading.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'topic',
              id: module.id,
              moduleId: module.id,
              moduleTitle: module.title,
              title: section.heading,
              sectionIndex: index
            });
          }
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
    setIsResultsVisible(true);
  };

  const handleResultClick = (result) => {
    if (result.type === 'module') {
      navigate(`/module/${result.id}`);
    } else {
      navigate(`/module/${result.moduleId}`, { 
        state: { 
          scrollTo: result.sectionIndex
        } 
      });
    }
    setIsResultsVisible(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

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
        
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="PCB Design Hub Logo" className="logo-img" />
          <span className="logo-text">PCB Design Hub</span>
        </Link>
        
        <div className={`search-bar ${isSearchExpanded ? 'expanded' : ''}`} ref={searchRef}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search rules, standards..." 
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => searchQuery.length >= 2 && setIsResultsVisible(true)}
          />
          
          {isResultsVisible && (
            <div className="search-results-overlay glass-morphism slide-up">
              {searchResults.length > 0 ? (
                <div className="search-results-list">
                  {searchResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="search-result-item"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="result-icon">
                        {result.type === 'module' ? <BookOpen size={16} /> : <Hash size={16} />}
                      </div>
                      <div className="result-info">
                        <div className="result-title">{result.title}</div>
                        <div className="result-meta">
                          {result.type === 'module' ? 'Main Module' : `In ${result.moduleTitle}`}
                        </div>
                      </div>
                      <ArrowRight size={14} className="result-arrow" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  No matching topics found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

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
          className="icon-btn theme-toggle" 
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
