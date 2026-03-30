import { Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header fade-in">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search rules, standards..." className="search-input" />
      </div>
      
      <div className="header-actions">
        <div className="user-avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
