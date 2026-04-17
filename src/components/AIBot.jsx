import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, Cpu, RotateCcw, ChevronDown, Layers, Zap,
  AlertCircle, CheckCircle2, BookOpen
} from 'lucide-react';

// ── PCB Knowledge Base (smart mock engine) ───────────────────────────────────
// Each entry: { keywords: [], response: string }
const PCB_KB = [
  {
    keywords: ['trace width', 'current', 'ampere', 'amp', 'ipc-2152', '2152'],
    response: `**Trace Width & Current Capacity (IPC-2152)**\n
For external copper traces at 1 oz/ft² (35µm):\n
• **1A** → ~0.3mm (12 mil)\n• **2A** → ~0.5mm (20 mil)\n• **3A** → ~0.8mm (31 mil)\n• **5A** → ~1.5mm (59 mil)\n
📐 *Use the IPC Trace Width Calculator in the app for precision values.*\n\nKey factors: copper weight, temperature rise (ΔT), and ambient temperature.`
  },
  {
    keywords: ['impedance', 'ohm', 'controlled impedance', '50 ohm', '100 ohm', 'differential'],
    response: `**Controlled Impedance — Key Rules**\n
• **Single-ended:** Target 50Ω (RF/high-speed digital)\n• **Differential pair:** Target 100Ω (USB, HDMI, PCIe)\n• **Microstrip formula (approx):** Z₀ ≈ 87/√(εr+1.41) × ln(5.98H / (0.8W + T))\n
📐 *Use the Zdiff Calculator tool to get exact values for your stackup.*\n\n🔑 Inform your PCB fabricator of target impedance — most control to ±10%.`
  },
  {
    keywords: ['via', 'through hole', 'blind via', 'buried via', 'via stub', 'annular ring'],
    response: `**Via Design Guidelines (IPC-2221)**\n
• **Drill diameter:** Min 0.15mm (6 mil) for standard fab\n• **Annular ring:** Min 0.125mm (5 mil) around pad\n• **Aspect ratio:** Max 10:1 (drill dia : board thickness)\n• **Via stubs** cause resonance — use back-drilling or blind vias for >3 GHz\n
📐 *Use the Via Calculator in the app for current capacity and resistance.*`
  },
  {
    keywords: ['dfm', 'design for manufacturing', 'manufacture', 'fab', 'fabrication'],
    response: `**DFM Checklist — Top 10 Rules**\n
1. Min trace/space: 0.1mm/0.1mm (standard), 0.075mm (advanced)\n2. Drill-to-copper: ≥0.125mm\n3. Board edge clearance: ≥0.3mm for traces\n4. Solder mask expansion: 0.05mm per side\n5. Silkscreen: Do not overlap solder pads\n6. Fiducials: Min 3 on each assembly side\n7. Aspect ratio: ≤10:1 for vias\n8. BGA pitch: ≥0.4mm for standard SMT\n9. Annular ring: ≥0.125mm for inner layers\n10. Copper balance: Keep pour coverage symmetric\n\n📐 *Run the DFM Rule Checker tool in the app for automated checks.*`
  },
  {
    keywords: ['stackup', 'stack-up', 'layer', '4 layer', '6 layer', '8 layer', 'prepreg', 'core'],
    response: `**Standard Layer Stackups**\n
**4-Layer (Standard):**\n
L1 Signal | Prepreg | L2 Ground | Core | L3 Power | Prepreg | L4 Signal\n
• Total: 1.6mm | Impedance reference: L1/L4 to L2/L3\n
**6-Layer (High-Speed):**\n
L1 Sig | GND | L3 Sig | L4 Sig | PWR | L6 Sig\n
• Better EMI shielding, tighter impedance control\n
📐 *Use the Stackup Calculator for Dk/Df-based impedance calculation.*`
  },
  {
    keywords: ['emi', 'emc', 'emission', 'noise', 'decoupling', 'bypass capacitor'],
    response: `**EMI/EMC Best Practices**\n
• Place decoupling caps as close to IC VCC pins as possible (<2mm)\n• Use 100nF ceramic + 10µF bulk cap in parallel\n• Route high-speed signals over continuous ground planes\n• Avoid slotted planes — they break return current path\n• 3W rule: trace spacing ≥ 3× trace width to reduce crosstalk\n• Place crystal oscillator close to IC, guard with ground stitching vias\n\n📐 *Run the EMI Checklist tool in the app.*`
  },
  {
    keywords: ['bga', 'ball grid array', 'escape routing', 'via-in-pad'],
    response: `**BGA Routing & Escape Strategies**\n
• **0.8mm pitch BGA:** Use 0.3mm drill, 0.45mm pad, dog-bone routing\n• **0.5mm pitch BGA:** Via-in-pad (VIP) required — use filled & covered vias\n• **0.4mm pitch BGA:** Stacked micro-vias in HDI technology\n• Channel routing: use shortest escape path, maintain impedance\n• Ground and power balls: connect with short, wide traces to planes\n\n🔑 Always confirm min pad size with your assembly house.`
  },
  {
    keywords: ['copper weight', 'copper thickness', '1oz', '2oz', 'oz/ft'],
    response: `**Copper Weight Reference**\n
| Copper Weight | Thickness | Best For |\n|---|---|---|\n| 0.5 oz/ft² | 17.5µm | Fine pitch HDI |\n| 1 oz/ft² | 35µm | Standard digital |\n| 2 oz/ft² | 70µm | Power boards |\n| 3 oz/ft² | 105µm | High-current designs |\n\nHeavier copper = wider min spacing requirements. Check with your fab.`
  },
  {
    keywords: ['ddr', 'ddr4', 'ddr5', 'memory', 'skew', 'fly-by', 'topology'],
    response: `**DDR Memory Routing Rules**\n
• **Topology:** Fly-by daisy chain (DDR3+), point-to-point for < 2 slots\n• **Trace length matching:** ±25 mil within byte lane, ±100 mil between byte lanes\n• **Clock-to-data skew:** Max 25 mil at board level\n• **Impedance:** 40Ω single-ended, 80Ω differential (adjust for your stackup)\n• **Termination:** On-die termination (ODT) for DDR3/4 — check JEDEC spec\n\n📐 *Use the DDR Timing Calculator in the app.*`
  },
  {
    keywords: ['thermal', 'heat', 'temperature', 'thermal via', 'thermal relief', 'heatsink', 'pad'],
    response: `**Thermal Management Guidelines**\n
• **Thermal vias:** Array of 0.2–0.3mm drilled vias under thermal pads, filled preferred\n• **Copper pours:** Solid pour on inner layers dissipates heat better than hatched\n• **Thermal relief:** Use for hand-soldered joints; omit for reflow/thermal pad components\n• **Copper spreading:** 2–4x IC footprint area for adequate spreading\n• **θJA rule of thumb:** Each 1oz inner copper layer ≈ 1°C/W reduction\n\n📐 *Use the Thermal Analysis tool in the app.*`
  },
  {
    keywords: ['clearance', 'creepage', 'high voltage', 'isolation', 'ipc-2221'],
    response: `**High-Voltage Clearance & Creepage (IPC-2221)**\n
At 250V AC, Pollution Degree 2:\n
• **Clearance** (through air): Min 1.5mm\n• **Creepage** (along surface): Min 3.2mm\n\nAt 1000V AC:\n• Clearance: 3mm | Creepage: 8mm\n\n🔑 Always add safety margin (1.5-2×) for certified products.\n📌 Standards: IEC 60950-1 (IT equipment), IEC 60601 (medical).`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start', 'how are you'],
    response: `**Hello, Engineer! 👋**\n
I'm your **PCB AI Assistant**. I can help you with:\n
• Trace width & current calculations\n• Controlled impedance design\n• Layer stackup selection\n• Via design guidelines\n• DFM/DFT rules\n• EMI/EMC best practices\n• BGA routing strategies\n• DDR memory routing\n• Thermal management\n• High-voltage clearance\n\nJust type your question and I'll get you the specs!`
  },
];

const QUICK_ACTIONS = [
  { label: 'Trace Width Formula', query: 'What is the trace width for 3A current?' },
  { label: '50Ω Impedance Rules', query: 'How do I achieve 50 ohm impedance?' },
  { label: '4-Layer Stackup', query: 'What is the standard 4 layer stackup?' },
  { label: 'DFM Checklist', query: 'Give me DFM best practices' },
  { label: 'Via Design Rules', query: 'What are via design guidelines?' },
  { label: 'EMI Best Practices', query: 'How to reduce EMI on my PCB?' },
];

function getBotResponse(query) {
  const q = query.toLowerCase();
  const hit = PCB_KB.find(entry => entry.keywords.some(kw => q.includes(kw)));
  if (hit) return hit.response;
  return `I understand you're asking about **"${query}"**.\n\nThis is the PCB AI Assistant for the **PCB Design Hub**. I currently specialize in:\n\n• Trace geometry & current capacity\n• Impedance & signal integrity\n• Layer stackups & materials\n• Via design & aspect ratios\n• DFM guidelines & EMI rules\n\nTry rephrasing your question using specific terms like *"trace width"*, *"impedance"*, *"via"*, or *"DFM"* — and I'll have detailed answers for you!`;
}

// Renders basic markdown: **bold** and bullet points
function BotMessage({ text }) {
  const lines = text.split('\n');
  return (
    <div className="bot-msg-text">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        // Bold + inline formatting
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) => {
          if (p.startsWith('**') && p.endsWith('**'))
            return <strong key={j}>{p.slice(2, -2)}</strong>;
          return p;
        });
        return <p key={i} className="bot-msg-line">{parts}</p>;
      })}
    </div>
  );
}

export default function AIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, from: 'bot',
      text: `Hello, Engineer! 👋 I'm your **PCB AI Assistant**.\n\nAsk me anything about trace widths, impedance, stackups, DFM rules, via design, EMI, or any PCB engineering topic.\n\nOr pick a quick action below!`
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
    const userMsg = { id: Date.now(), from: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    const response = getBotResponse(query);
    setIsTyping(false);
    const botMsg = { id: Date.now() + 1, from: 'bot', text: response };
    setMessages(prev => [...prev, botMsg]);
    if (!isOpen) setHasNew(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputVal); }
  };

  const clearChat = () => {
    setMessages([{
      id: 1, from: 'bot',
      text: `Chat cleared! I'm ready when you are. Ask me about trace widths, impedance, stackups, DFM, or any PCB topic.`
    }]);
  };

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────── */}
      <button
        className={`aibot-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        title="PCB AI Assistant"
        aria-label="Open PCB AI Assistant"
      >
        {isOpen ? <ChevronDown size={22} /> : <Sparkles size={22} />}
        {hasNew && <span className="aibot-fab-badge" />}
      </button>

      {/* ── Chat Panel ────────────────────────────────────── */}
      {isOpen && (
        <div className="aibot-panel fade-in">
          {/* Header */}
          <div className="aibot-header">
            <div className="aibot-header-info">
              <div className="aibot-avatar">
                <Cpu size={18} />
              </div>
              <div>
                <p className="aibot-title">PCB AI Assistant</p>
                <p className="aibot-subtitle">
                  <span className="aibot-dot" />Online
                </p>
              </div>
            </div>
            <div className="aibot-header-actions">
              <button className="aibot-icon-btn" onClick={clearChat} title="Clear chat">
                <RotateCcw size={14} />
              </button>
              <button className="aibot-icon-btn" onClick={() => setIsOpen(false)} title="Close">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Capability pills */}
          <div className="aibot-caps">
            <span><Layers size={11} /> Stackups</span>
            <span><Zap size={11} /> SI/PI</span>
            <span><CheckCircle2 size={11} /> DFM</span>
            <span><BookOpen size={11} /> IPC Standards</span>
          </div>

          {/* Messages */}
          <div className="aibot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`aibot-msg-row ${msg.from}`}>
                {msg.from === 'bot' && (
                  <div className="aibot-msg-avatar"><Cpu size={12} /></div>
                )}
                <div className={`aibot-bubble ${msg.from}`}>
                  {msg.from === 'bot'
                    ? <BotMessage text={msg.text} />
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

          {/* Quick Actions */}
          <div className="aibot-quick-actions">
            <p className="aibot-quick-label">Quick Questions</p>
            <div className="aibot-quick-grid">
              {QUICK_ACTIONS.map((qa, i) => (
                <button key={i} className="aibot-quick-btn" onClick={() => sendMessage(qa.query)}>
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="aibot-input-area">
            <div className="aibot-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="aibot-input"
                placeholder="Ask about trace width, impedance, DFM…"
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
