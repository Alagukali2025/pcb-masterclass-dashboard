import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContentViewer from './components/ContentViewer';
import LoadingScreen from './components/LoadingScreen';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { DesignProvider } from './context/DesignContext';
import { useAuth } from './context/AuthContext';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    // Default open on desktop, closed on mobile
    return window.innerWidth > 1024;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { isLoggedIn, userData, loading: authLoading } = useAuth();


  useEffect(() => {
    // Simulate engine bootstrapping / loading models
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setIsLoading(false), 800); // Wait for fade out animation
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle window resize to auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <DesignProvider>
      {(isLoading || authLoading) && <LoadingScreen isFadingOut={isFadingOut} />}
      
      <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content">
          <Header 
            theme={theme} 
            toggleTheme={toggleTheme} 
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />

              <Route path="/module/:id" element={<ContentViewer />} />
            </Routes>
          </main>
        </div>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar}></div>
        )}
      </div>
    </DesignProvider>
  );
}


export default App;
