import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, X, Send, Cpu, RotateCcw, ChevronDown, Layers, Zap,
  AlertCircle, CheckCircle2, BookOpen, ArrowRight, Info
} from 'lucide-react';
import { useDesign } from '../context/DesignContext';

// ── NLP & Intent Engine Configuration ────────────────────────────────────────

const INTENTS = {
  GREETING: 'greeting',
  TECHNICAL: 'technical',
  ACTION: 'action',
  STATUS: 'status',
  NAV: 'navigation',
  UNKNOWN: 'unknown'
};

const PCB_KB = [
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['stackup', 'stack-up', 'layer', 'layers', 'buildup'],
    synonyms: ['construction', 'lamination', 'dielectric', 'prepreg', 'core'],
    response: `A PCB stackup defines the vertical arrangement of copper and dielectric layers. Maintaining **mechanical symmetry** and balanced copper distribution is critical to prevent board warpage.`,
    action: { label: 'Stackup Design Module', moduleId: 'stackup' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['emi', 'emc', 'interference', 'noise', 'shielding'],
    synonyms: ['electromagnetic', 'radiation', 'emission', 'coupling'],
    response: `EMI (Electromagnetic Interference) control requires maintaining short return paths, avoiding plane splits under high-speed traces, and effective placement of decoupling capacitors.`,
    action: { label: 'EMI / EMC Masterclass', moduleId: 'emi_emc' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['si', 'pi', 'signal integrity', 'power integrity', 'eye diagram'],
    synonyms: ['jitter', 'reflection', 'ringing', 'crosstalk'],
    response: `Signal Integrity (SI) ensures your pulses remain clean. Minimize reflections via termination (series/parallel) and control crosstalk by maintaining a spacing of **3W** between traces.`,
    action: { label: 'SI / PI Engineering', moduleId: 'si_pi' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['footprint', 'land pattern', 'pad', 'component', 'symbol'],
    synonyms: ['library', 'package', 'smd', 'tht', 'ipc-7351'],
    response: `Master footprint creation using **IPC-7351B standards**. Ensure toe, heel, and side fillets meet density levels (A/B/C) for your target assembly process.`,
    action: { label: 'Footprint Creation Tool', moduleId: 'footprint' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['thermal', 'heat', 'temperature', 'cooling', 'heatsink'],
    synonyms: ['thermal via', 'dissipation', 'conductivity', 'ipc-2152'],
    response: `Thermal management relies on copper spreading and thermal via arrays. Use **0.2-0.3mm vias** under thermal pads to conduct heat to internal ground planes.`,
    action: { label: 'Thermal Analysis Tool', moduleId: 'thermal' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['ddr', 'ddr4', 'ddr5', 'memory', 'timing'],
    synonyms: ['matching', 'skew', 'propagation', 'fly-by'],
    response: `DDR routing requires precise length matching (typically **±5-10 mil**) within byte lanes and tight impedance control (usually 40Ω single-ended).`,
    action: { label: 'DDR Architecture Module', moduleId: 'ddr' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['aspect ratio', 'aspect-ratio', 'drill aspect'],
    synonyms: ['drilling ratio', 'vias ratio', 'drill depth'],
    response: `Standard via aspect ratio should be kept within **8:1 to 10:1** for reliable manufacturing. Higher ratios (e.g., 12:1) require specialized drilling and plating processes.`,
    action: { label: 'Calculate Aspect Ratio', moduleId: 'stackup' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['trace width', 'current', 'ampere', 'amp', 'ipc-2152'],
    synonyms: ['track width', 'conductor size', 'carrying capacity', 'ampacity'],
    response: `For 1oz copper and 1A current, a width of **0.3mm (12 mil)** is typical for a 10°C temperature rise. Heavier current or internal layers require wider traces.`,
    action: { label: 'Trace Width & Current Tool', moduleId: 'thermal' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['impedance', 'ohm', 'controlled impedance', '50 ohm', '100 ohm'],
    synonyms: ['z0', 'zdiff', 'matching', 'signal integrity'],
    response: `Standard targets are **50Ω for single-ended** and **100Ω for differential pairs**. These are determined by your trace width, dielectric height, and material Dk.`,
    action: { label: 'Controlled Impedance Solver', moduleId: 'diff_pair' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['via', 'blind via', 'buried via', 'annular ring'],
    synonyms: ['hole', 'drill', 'ring size', 'pad size'],
    response: `Minimum annular ring should be **0.125mm (5 mil)** for IPC Class 2. Micro-vias and high-density boards may go down to 0.05mm with specialized FAB.`,
    action: { label: 'Via Design Standards', moduleId: 'stackup' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['dfm', 'design for manufacturing', 'clearance', 'creepage'],
    synonyms: ['drc', 'spacing', 'gap', 'manufacturability', 'high voltage'],
    response: `Minimum clearance is voltage-dependent; for low voltage digital, **0.1mm (4 mil)** is a common fab limit. High voltage requires increased creepage per IPC-2221.`,
    action: { label: 'Run DFM Rule Checker', moduleId: 'dfm_dft' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['copper balance', 'warpage', 'copper weight', 'resin starvation'],
    synonyms: ['thieving', 'pouring', 'balancing', 'oz/ft'],
    response: `Maintain copper density within **±10% across symmetric layer pairs** to prevent board warpage during lamination and reflow cycles.`,
    action: { label: 'View DFM Strategy', moduleId: 'dfm_dft' }
  },
  {
    intent: INTENTS.TECHNICAL,
    keywords: ['output', 'gerber', 'manufacturing data', 'release'],
    synonyms: ['ipc-2581', 'odb++', 'bom', 'pick and place'],
    response: `Final fabrication output must include copper, solder mask, silkscreen, and drill drawings. Use **IPC-2581** for the highest level of data integrity.`,
    action: { label: 'PCB Output System', moduleId: 'pcb_output_system' }
  },
  {
    intent: INTENTS.STATUS,
    keywords: ['my stackup', 'current dk', 'target', 'current setting'],
    synonyms: ['current design', 'what is my', 'settings'],
    response: `You are in the **{phase}** phase. Current Stackup: **{material}** (Dk: {dk}) with a **{target}Ω** target impedance.`,
    action: { label: 'Open Stackup Manager', moduleId: 'stackup' }
  },
  {
    intent: INTENTS.GREETING,
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    responses: [
      "Hello, Engineer! 👋 How can I assist your design today?",
      "Greetings! Need a quick spec on trace widths or impedance?",
      "AI Assistant online. Ask me about EMI, DFM, Stackups, or Thermal rules."
    ]
  }
];

// ── NLP Logic ────────────────────────────────────────────────────────────────

function processQuery(query, context) {
  const q = query.toLowerCase();
  
  // 1. Status Check
  const statusEntry = PCB_KB.find(e => e.intent === INTENTS.STATUS);
  if (statusEntry.keywords.some(kw => q.includes(kw)) || statusEntry.synonyms.some(s => q.includes(s))) {
    const response = statusEntry.response
      .replace('{phase}', context.activePhase || 'N/A')
      .replace('{material}', context.activeStackup?.material || 'N/A')
      .replace('{dk}', context.activeStackup?.dk || 'N/A')
      .replace('{target}', context.activeStackup?.targetImpedance || 'N/A');
    return { text: response, action: statusEntry.action };
  }

  // 2. Technical / Greeting Matching
  let bestMatch = null;
  let maxScore = 0;

  PCB_KB.forEach(entry => {
    let score = 0;
    entry.keywords.forEach(kw => { if (q.includes(kw)) score += 3; });
    entry.synonyms?.forEach(s => { if (q.includes(s)) score += 1; });
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  });

  if (bestMatch) {
    if (bestMatch.intent === INTENTS.GREETING) {
      const idx = Math.floor(Math.random() * bestMatch.responses.length);
      return { text: bestMatch.responses[idx] };
    }
    return { text: bestMatch.response, action: bestMatch.action };
  }

  // 3. Fallback
  return { 
    text: `I'm tracking your question on **"${query}"**. 
    
I can give direct answers on:
• **EMI / EMC** & **SI / PI**
• **Stackup Design & Layers**
• **Footprint Standards (IPC-7351B)**
• **Thermal Analysis & Power (IPC-2152)**
• **DDR Memory & High-Speed Routing**
• **DFM Spacing & Copper Balance**

Just drop a term or ask about a specific module!`,
    isFallback: true
  };
}

// ── Components ───────────────────────────────────────────────────────────────

function BotMessage({ msg, onAction }) {
  const lines = msg.text.split('\n');
  return (
    <div className="bot-msg-text">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((p, k) => {
          if (p.startsWith('**') && p.endsWith('**')) return <strong key={k}>{p.slice(2, -2)}</strong>;
          if (p.startsWith('_') && p.endsWith('_')) return <em key={k}>{p.slice(1, -1)}</em>;
          return p;
        });
        return <p key={i} className="bot-msg-line">{parts}</p>;
      })}
      
      {msg.action && (
        <button className="aibot-action-card" onClick={() => onAction(msg.action)}>
          <div className="action-card-info">
            <span className="action-card-label">Expert Recommendation</span>
            <span className="action-card-title">{msg.action.label}</span>
          </div>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
}

export default function AIBot() {
  const navigate = useNavigate();
  const { activePhase, activeStackup } = useDesign();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: `Expert PCB Assistant Online. ⚡\n\nI monitor your design context and provide direct technical specs. Ask about EMI, SI, Stackup, or any design standard.`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);



  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  const sendMessage = async (text) => {
    const query = text.trim();
    if (!query) return;
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: query }]);
    setInputVal('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const response = processQuery(query, { activePhase, activeStackup });
    setIsTyping(false);
    
    const botMsg = { id: Date.now() + 1, from: 'bot', ...response };
    setMessages(prev => [...prev, botMsg]);
    if (!isOpen) setHasNew(true);
  };

  const handleAction = (action) => {
    if (action.moduleId) {
      navigate(`/module/${action.moduleId}`);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); }
  };

  return (
    <>
      <button
        className={`aibot-fab ${isOpen ? 'open' : ''} ${hasNew ? 'pulse' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        title="PCB Expert AI"
      >
        {isOpen ? <ChevronDown size={22} /> : <Sparkles size={22} />}
        {hasNew && <span className="aibot-fab-badge" />}
      </button>

      {isOpen && (
        <div className="aibot-panel slide-up">
          <div className="aibot-header">
            <div className="aibot-header-info">
              <div className="aibot-avatar"><Cpu size={18} /></div>
              <div>
                <p className="aibot-title">PCB Technical Assistant</p>
                <p className="aibot-subtitle"><span className="aibot-dot" />Monitoring: {activePhase}</p>
              </div>
            </div>
            <div className="aibot-header-actions">
              <button className="aibot-icon-btn" onClick={() => setMessages([{ id: 1, from: 'bot', text: "Chat history reset. How can I help?" }])}><RotateCcw size={14} /></button>
              <button className="aibot-icon-btn" onClick={() => setIsOpen(false)}><X size={14} /></button>
            </div>
          </div>

          <div className="aibot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`aibot-msg-row ${msg.from}`}>
                {msg.from === 'bot' && <div className="aibot-msg-avatar"><Cpu size={12} /></div>}
                <div className={`aibot-bubble ${msg.from}`}>
                  {msg.from === 'bot' 
                    ? <BotMessage msg={msg} onAction={handleAction} /> 
                    : <span>{msg.text}</span>}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="aibot-msg-row bot">
                <div className="aibot-msg-avatar"><Cpu size={12} /></div>
                <div className="aibot-bubble bot aibot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="aibot-input-area">
            <div className="aibot-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="aibot-input"
                placeholder="Ask technical specs (EMI, SI, Stackup…)"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                className={`aibot-send-btn ${!inputVal.trim() ? 'disabled' : ''}`}
                onClick={() => sendMessage(inputVal)}
                disabled={!inputVal.trim() || isTyping}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
