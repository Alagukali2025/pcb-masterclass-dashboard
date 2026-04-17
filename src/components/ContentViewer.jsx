import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { modulesData } from '../data/modules';
import { ArrowLeft, Check, AlertTriangle, Info, List, Clock, Zap, Calculator, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ToolLock from './ToolLock';
import IPCCalculator from './IPCCalculator';

import StackupCalculator from './StackupCalculator';
import StackupLayerToggle from './StackupLayerToggle';
import AspectRatioCalculator from './AspectRatioCalculator';
import LaminateTable from './LaminateTable';
import DFMRuleChecker from './DFMRuleChecker';
import FiberWeaveSkew from './FiberWeaveSkew';
import StackupExport from './StackupExport';
import ZdiffCalculator from './ZdiffCalculator';
import DiffPairReferenceTable from './DiffPairReferenceTable';
import DDRTimingCalculator from './DDRTimingCalculator';
import EMICalculator from './EMICalculator';
import EMIVisualizer from './EMIVisualizer';
import ViaResonanceCalculator from './ViaResonanceCalculator';
import ViaAdvancedCalculator from './ViaAdvancedCalculator';
import PDNAnalyzer from './PDNAnalyzer';
import ThermalAnalysisTool from './ThermalAnalysisTool';
import IPC2152Calculator from './IPC2152Calculator';
import ThermalResistanceVisualizer from './ThermalResistanceVisualizer';
import EMIChecklist from './EMIChecklist';
import PITargetCalculator from './PITargetCalculator';
import ReleaseSimulator from './OutputSystem/ReleaseSimulator';



export default function ContentViewer() {
  const { id } = useParams();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const moduleData = modulesData.find(m => m.id === id);

  const [activeSection, setActiveSection] = useState(0);

  // Handle auto-scroll from search
  useEffect(() => {
    if (location.state && location.state.scrollTo !== undefined && moduleData) {
      const sectionIndex = location.state.scrollTo;

      // Small delay to ensure refs are populated and DOM is ready
      const timer = setTimeout(() => {
        scrollToSection(sectionIndex);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [id, location.state, moduleData]);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const COMPONENTS = {
    'calculator': (id) => (
      id === 'footprint' ? <IPCCalculator /> : 
      id === 'thermal' ? <IPC2152Calculator /> : <StackupCalculator />
    ),
    'visualizer': () => <StackupLayerToggle />,
    'aspect-ratio-calc': () => <AspectRatioCalculator />,
    'laminate-table': () => <LaminateTable />,
    'dfm-checker': () => <DFMRuleChecker />,
    'fiber-weave': () => <FiberWeaveSkew />,
    'stackup-export': () => <StackupExport />,
    'zdiff-calculator': () => <ZdiffCalculator />,
    'diff-reference-table': () => <DiffPairReferenceTable />,
    'ddr-timing-calculator': () => <DDRTimingCalculator />,
    'emi-calculator': () => <EMICalculator />,
    'emi-visualizer': () => <EMIVisualizer />,
    'via-resonance-calc': () => <ViaResonanceCalculator />,
    'via-advanced-calc': () => <ViaAdvancedCalculator />,
    'pdn-analyzer': () => <PDNAnalyzer />,
    'pi-target-calc': () => <PITargetCalculator />,
    'thermal-tool': () => <ThermalAnalysisTool />,
    'thermal-resistance-visual': () => <ThermalResistanceVisualizer />,
    'ipc2152-calc': () => <IPC2152Calculator />,
    'emi-checklist-tool': () => <EMIChecklist />,
    'output-simulator': () => <ReleaseSimulator />
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
            {content.sections && content.sections.map((sec, i) => {
              return (
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

                  {sec.type && COMPONENTS[sec.type] && (
                    isLoggedIn ? COMPONENTS[sec.type](id) : <ToolLock toolName={sec.heading} />
                  )}

                  {/* Cross-Reference Card — replaces duplicate tool with a navigation link */}
                  {sec.type === 'cross-ref' && (() => {
                    const refMod = modulesData.find(m => m.id === sec.refModuleId);
                    const RefIcon = refMod?.icon;
                    return (
                      <div className="cross-ref-card slide-up">
                        <div className="cross-ref-icon-wrap">
                          {RefIcon && <RefIcon size={20} className="cross-ref-icon" />}
                        </div>
                        <div className="cross-ref-body">
                          <span className="cross-ref-badge">Related Module</span>
                          <p className="cross-ref-desc">{sec.refDesc}</p>
                          <Link to={`/module/${sec.refModuleId}`} className="cross-ref-btn">
                            {sec.refLabel} <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    );
                  })()}

                  {sec.ruleCards && (
                    <div className="rule-cards-grid slide-up">
                      {sec.ruleCards.map((rule, ri) => (
                        <div key={ri} className={`rule-card rule-card--${rule.severity}`}>
                          <div className="rule-card-header">
                            <span className="rule-badge">{rule.number}</span>
                            <div className="rule-card-title-wrap">
                              <h4 className="rule-card-title">{rule.title}</h4>
                              <span className={`rule-severity-tag rule-severity-tag--${rule.severity}`}>
                                {rule.severity === 'danger' ? <ShieldAlert size={10} /> : rule.severity === 'warning' ? <AlertTriangle size={10} /> : <Info size={10} />}
                                {rule.severity === 'danger' ? 'DRC Violation' : rule.severity === 'warning' ? 'Caution' : 'Best Practice'}
                              </span>
                            </div>
                          </div>
                          <p className="rule-card-body">{rule.body}</p>
                        </div>
                      ))}
                    </div>
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

                  {sec.mistakeList && (
                    <div className="mistake-list slide-up">
                      {sec.mistakeList.map((m, mi) => (
                        <div key={mi} className="mistake-item">
                          <span className="mis-label mis-bad">Mistake</span>
                          <span className="mistake-text">{m.mistake}</span>
                          <span className="mis-label mis-fix">Fix</span>
                          <span className="mistake-text">{m.fix}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.terminationGrid && (
                    <div className="termination-grid slide-up">
                      {sec.terminationGrid.map((t, ti) => (
                        <div key={ti} className="term-card">
                          <div className="term-name">{t.name}</div>
                          <span className={`term-tag ${t.tagColor}-tag`}>{t.tag}</span>
                          <div className="term-pros"><strong>Pros:</strong> {t.pros}</div>
                          <div className="term-cons"><strong>Cons:</strong> {t.cons}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.stackVisual && (
                    <div className="stack-visual slide-up">
                      {sec.stackVisual.map((row, ri) => (
                        <div key={ri} className="stack-row">
                          <div className="stack-swatch" style={{ background: row.color }}></div>
                          <div className="stack-layer">{row.layer}</div>
                          <div className="stack-spec">{row.spec}</div>
                          <div className="stack-note">{row.note}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.phaseList && (
                    <div className="phase-list slide-up">
                      {sec.phaseList.map((p, pi) => (
                        <div key={pi} className="phase-item">
                          <div className="phase-num">{p.num}</div>
                          <div className="phase-content">
                            <p className="phase-text"><strong style={{ color: 'var(--text-primary)' }}>{p.title}:</strong> {p.desc}</p>
                          </div>
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
              );
            })}
          </div>

          {content.checklists ? (
            <div className="task-board slide-up">
              <div className="task-board-header">
                <div className="task-board-title">
                  <Check size={28} className="text-success" />
                  Release Readiness Checklist
                </div>
              </div>

              {content.checklists.map((cat, ci) => {
                return (
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
                            <span className="task-label">
                              {typeof item === 'string' ? item : (
                                <>
                                  <strong className="list-label">{item.label}:</strong> {item.text}
                                </>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
                      <span className="task-label">
                        {typeof item === 'string' ? item : (
                          <>
                            <strong className="list-label">{item.label}:</strong> {item.text}
                          </>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {content.sections && content.sections.length > 0 && (
          <aside className="toc-container">
            <div className="toc-header">
              <List size={16} /> On This Page
            </div>
            <ul className="toc-list">
              {content.sections.map((sec, i) => {
                return (
                  <li key={i} className={`toc-item ${activeSection === i ? 'active' : ''}`}>
                    <button
                      className="toc-link"
                      onClick={() => scrollToSection(i)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                    >
                      {sec.heading}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        )}
      </div>
    </>
  );
}
