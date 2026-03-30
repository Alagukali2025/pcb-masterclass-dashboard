import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, Check, AlertTriangle, Info, List, Clock, Zap } from 'lucide-react';

export default function ContentViewer() {
  const { id } = useParams();
  const moduleData = modulesData.find(m => m.id === id);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  const sectionRefs = useRef([]);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      // Find the scrollable container. Since we have a flex layout, 
      // the scroll container is likely the .page-content div or window if we changed it.
      // Let's attach this to the closest scrolling parent or window.
      const scrollContainer = document.querySelector('.page-content');
      if (!scrollContainer) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const totalScroll = scrollHeight - clientHeight;
      const currentProgress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
    };

    const container = document.querySelector('.page-content');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => container && container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Intersection Observer for TOC
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let activeIndex = -1;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Extract index from dataset
          activeIndex = Number(entry.target.dataset.index);
        }
      });
      if (activeIndex !== -1) {
        setActiveSection(activeIndex);
      }
    }, {
      root: document.querySelector('.page-content'),
      rootMargin: '-20% 0px -80% 0px', // Trigger when section is near top
      threshold: 0
    });

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [id]); // Re-run when module changes

  // Reset checklist and scroll when module changes
  useEffect(() => {
    setCheckedItems({});
    setScrollProgress(0);
    const container = document.querySelector('.page-content');
    if (container) {
      container.scrollTop = 0;
    }
  }, [id]);

  if (!moduleData) {
    return (
      <div className="content-not-found fade-in">
        <h2>Module not found</h2>
        <Link to="/" className="back-link mt-4"><ArrowLeft size={16} /> Return to Dashboard</Link>
      </div>
    );
  }

  const { content } = moduleData;
  const HeroIcon = moduleData.icon || Zap;
  const estimatedReadTime = Math.max(3, Math.ceil(JSON.stringify(content).length / 1500));

  const toggleChecklist = (index) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scrollToSection = (index) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderAlert = (alert, idx) => {
    const isWarning = alert.type === 'warning';
    const isDanger = alert.type === 'danger';
    
    return (
      <div key={idx} className={`alert alert-${alert.type}`}>
        <div className="alert-icon">
          {isWarning || isDanger ? <AlertTriangle size={24} /> : <Info size={24} />}
        </div>
        <div className="alert-content">
          <p>{alert.text}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Sticky Progress Bar */}
      <div className="reading-progress-container">
        <div className="reading-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="content-layout fade-in">
        <div className="back-link-wrapper">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
        
        {/* Left Column - Main Content */}
        <div className="reading-column">
          <header className="content-hero">
            <HeroIcon className="hero-icon-layer" />
            <div className="content-hero-badge">
              <Clock size={14} /> {estimatedReadTime} min read
            </div>
            <h1 className="content-title">{moduleData.title}</h1>
            <p className="content-intro">{content.intro}</p>
          </header>
          
          <div className="content-sections">
            {content.sections && content.sections.map((sec, i) => (
              <section 
                key={i} 
                className="content-section" 
                id={`section-${i}`}
                data-index={i}
                ref={el => sectionRefs.current[i] = el}
              >
                <h2 className="section-heading">
                  <span className="section-number">{i + 1}</span> 
                  {sec.heading}
                </h2>
                
                {sec.content && <p className="section-text">{sec.content}</p>}
                
                {sec.cards && (
                  <div className="section-cards-grid">
                    {sec.cards.map((card, j) => (
                      <div key={j} className="info-card">
                        <h4>{card.title}</h4>
                        <p>{card.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {sec.alerts && (
                  <div className="section-alerts">
                    {sec.alerts.map((alert, idx) => renderAlert(alert, idx))}
                  </div>
                )}
              </section>
            ))}
          </div>
          
          {content.checklist && (
            <div className="task-board slide-up">
              <div className="task-board-header">
                <div className="task-board-title">
                  <Check size={28} className="text-success" /> 
                  Milestone Checklist
                </div>
                <div className="task-progress-badge">
                  {Object.values(checkedItems).filter(Boolean).length} / {content.checklist.length} Completed
                </div>
              </div>
              
              <div className="task-items">
                {content.checklist.map((item, i) => {
                  const isChecked = checkedItems[i] || false;
                  return (
                    <div 
                      key={i} 
                      className={`task-item ${isChecked ? 'completed' : ''}`}
                      onClick={() => toggleChecklist(i)}
                    >
                      <div className="task-checkbox">
                        {isChecked && <Check size={16} />}
                      </div>
                      <span className="task-label">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Table of Contents */}
        {content.sections && content.sections.length > 0 && (
          <aside className="toc-container">
            <div className="toc-header">
              <List size={16} /> On This Page
            </div>
            <ul className="toc-list">
              {content.sections.map((sec, i) => (
                <li key={i} className={`toc-item ${activeSection === i ? 'active' : ''}`}>
                  <button 
                    className="toc-link" 
                    onClick={() => scrollToSection(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                  >
                    {sec.heading}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </>
  );
}
