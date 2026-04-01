import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, Check, AlertTriangle, Info, List, Clock, Zap, Calculator } from 'lucide-react';
import IPCCalculator from './IPCCalculator';

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

                {sec.list && (
                  <ul className="body-list slide-up">
                    {sec.list.map((item, li) => (
                      <li key={li} className="list-item">
                        {typeof item === 'string' ? item : (
                          <>
                            <strong className="list-label">{item.label}:</strong> {item.text}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.table && (
                  <div className="table-wrapper slide-up">
                    <div className="table-hint">Swipe to see more →</div>
                    <table className="content-table">
                      <thead>
                        <tr>
                          {sec.table.headers.map((h, hi) => <th key={hi}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, ri) => {
                          const isSpecial = !!row.data;
                          const cells = isSpecial ? row.data : row;
                          const rowClass = row.type ? `${row.type}-row` : '';
                          
                          return (
                            <tr key={ri} className={rowClass}>
                              {cells.map((cell, ci) => (
                                <td key={ci}>
                                  {typeof cell === 'string' ? cell : (
                                    <span className={`tag-${cell.tag.toLowerCase()}`}>{cell.text}</span>
                                  )}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {sec.formula && (
                  <div className="formula-container slide-up">
                    <div className="formula-header">{sec.formula.title}</div>
                    <div className="formula-box">
                      {sec.formula.equations.map((eq, ei) => (
                        <div key={ei} className="formula-line">
                          <code>{eq}</code>
                        </div>
                      ))}
                    </div>
                    {sec.formula.variables && (
                      <div className="formula-variables">
                        {sec.formula.variables.map((v, vi) => (
                          <div key={vi} className="formula-var">
                            <span className="var-name">{v.name}</span>
                            <span className="var-desc">{v.desc}</span>
                            {v.tag && <span className={`var-tag tag-${v.tag.toLowerCase()}`}>{v.tag}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sec.flow && (
                  <div className="flow-container slide-up">
                    {sec.flow.map((f, fi) => (
                      <div key={fi} className="flow-step">
                        <div className="flow-num">{f.step}</div>
                        <div className="flow-title">{f.title}</div>
                        <div className="flow-desc">{f.desc}</div>
                        {fi < sec.flow.length - 1 && <div className="flow-arrow">→</div>}
                      </div>
                    ))}
                  </div>
                )}

                {sec.codeBlock && (
                  <div className="code-block-container slide-up">
                    <pre className="code-pre">
                      <code>{sec.codeBlock}</code>
                    </pre>
                  </div>
                )}

                {sec.twoColumnGrid && (
                  <div className="two-column-grid slide-up">
                    {sec.twoColumnGrid.map((col, ci) => (
                      <div key={ci} className="grid-column">
                        <div className="column-header">
                          <span className={`tool-badge ${col.badgeClass}`}>{col.badge}</span>
                        </div>
                        <div className="column-body">
                          <h4>{col.title}</h4>
                          <ul className="column-list">
                            {col.items.map((item, ii) => <li key={ii}>{item}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sec.type === 'calculator' && (
                  <IPCCalculator />
                )}

                {sec.filletGrid && (
                  <div className="fillet-grid slide-up">
                    {sec.filletGrid.map((fg, fgi) => (
                      <div key={fgi} className={`fillet-card border-${fg.color}`}>
                        <h4 className={`text-${fg.color}`}>{fg.title}</h4>
                        {fg.list ? (
                          <div className="fillet-details">
                            {fg.list.map((item, li) => (
                              <p key={li}><strong>{item.label}:</strong> {item.text}</p>
                            ))}
                          </div>
                        ) : <p>{fg.body}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {sec.steps && (
                  <div className="steps-container slide-up">
                    {sec.steps.map((step, si) => (
                      <div key={si} className="step-item">
                        <div className="step-number">{si + 1}</div>
                        <div className="step-content">
                          <h4>{step.title}</h4>
                          <p>{step.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {sec.tabs && (
                  <div className="tabs-container slide-up">
                    <div className="tabs-content">
                      {sec.tabs.map((tab, ti) => (
                        <div key={ti} className="tab-panel">
                          <div className="tab-header">
                            <span className="tool-tag">{tab.title}</span>
                          </div>
                          <ul className="tab-list">
                            {tab.content.map((item, ii) => <li key={ii}>{item}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

          {content.checklists ? (
            <div className="task-board slide-up">
              <div className="task-board-header">
                <div className="task-board-title">
                  <Check size={28} className="text-success" />
                  Release Readiness Checklist
                </div>
              </div>

              {content.checklists.map((cat, ci) => (
                <div key={ci} className="checklist-category">
                  <h3 className="category-title">{cat.category}</h3>
                  <div className="task-items">
                    {cat.items.map((item, i) => {
                      const itemKey = `${ci}-${i}`;
                      const isChecked = checkedItems[itemKey] || false;
                      return (
                        <div
                          key={i}
                          className={`task-item ${isChecked ? 'completed' : ''}`}
                          onClick={() => toggleChecklist(itemKey)}
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
              ))}
            </div>
          ) : content.checklist && (
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
