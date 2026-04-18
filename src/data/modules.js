import { 
  Search, 
  Layout, 
  Zap, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Factory, 
  Thermometer 
} from 'lucide-react';

export const modulesData = [
  { 
    id: "footprint", 
    icon: Search, 
    title: "Footprint Mastery", 
    desc: "Master IPC-7351B standards for land pattern generation.",
    prerequisites: [],
    sections: [
      "IPC-7351B Standard",
      "Component Producibility Levels",
      "Density Level Selection",
      "Footprint Geometries & Tolerances",
      "Solder Mask & Silk Screens",
      "Courtyard & Mechanical Keepouts",
      "Interactive: Zero-DPMO Footprint Calculator"
    ],
    loadContent: () => import('./modules/footprint.js')
  },
  { 
    id: "stackup",    
    icon: Layout,      
    title: "Stackup Design",      
    desc: "Layer stack-up planning for impedance and signal integrity.",
    prerequisites: ['footprint'],
    sections: [
      "Layer Count Selection (Logic & Economics)",
      "Prepreg vs. Core Materials",
      "Balanced Stackup Physics",
      "Advanced Dielectrics (High-Speed)",
      "Thermal Conductivity vs. Layer Spacing",
      "Copper Weight Engineering",
      "Recommended 4-Layer Stackup",
      "Recommended 6-Layer Stackup",
      "Interactive: Stackup Impedance Engine"
    ],
    loadContent: () => import('./modules/stackup.js')
  },
  {
    id: "thermal",
    icon: Thermometer,
    title: "Thermal Management",
    desc: "Calculate trace current capacity and design internal thermal paths.",
    prerequisites: [],
    sections: [
      "Three Pillars of Heat Transfer",
      "The Thermal Resistance Path (Rθ)",
      "IPC-2152 Current Capacity Solver",
      "Internal vs. External Traces",
      "Via Gardening & Thermal Stitching",
      "Copper Weight & Thermal Spreading",
      "Heatsink & TIM Strategy",
      "Expert DFM: The Soldering Paradox"
    ],
    loadContent: () => import('./modules/thermal.js')
  },
  { 
    id: "high_speed", 
    icon: Activity,    
    title: "High-Speed Routing",   
    desc: "Transmission line theory and reflection management.",
    prerequisites: ['stackup'],
    sections: [
      "The Transmission Line Threshold",
      "Characteristic Impedance (Z0)",
      "Signal Velocity & Propagation Delay",
      "Reflection Theory & SWR",
      "The Critical Path Length",
      "High-Speed Layer Transitions (Vias)",
      "Termination Physics",
      "Interactive: TDR Impedance & Reflection Solver"
    ],
    loadContent: () => import('./modules/high_speed.js')
  },
  { 
    id: "diff_pair",  
    icon: Zap,         
    title: "Differential Pair Routing", 
    desc: "Achieve the 8 golden rules of differential signaling.",
    prerequisites: ['high_speed'],
    sections: [
      "Differential Signaling Physics",
      "The Golden Rules of Diff Pairs",
      "Interface Impedance Targets",
      "Skew Matching & Meandering",
      "The Reference Plane Penalty",
      "Broadside vs. Edge Coupling",
      "Diff Pair Termination Strategies",
      "Interactive: Zdiff Differential Solver"
    ],
    loadContent: () => import('./modules/diff_pair.js')
  },
  { 
    id: "ddr",        
    icon: Cpu,         
    title: "DDR Routing",          
    desc: "Master DDR4/DDR5 layout topologies and timing matching.",
    prerequisites: ['high_speed'],
    sections: [
      "DDR Evolution (DDR3 vs. DDR4 vs. DDR5)",
      "Fly-By vs. T-Topology",
      "Fly-By Topology (DDR3/4/5)",
      "Length Matching & Skew Groups",
      "VTT & VREF Power Integrity",
      "Point-to-Point (P2P) Topologies",
      "Signal Inversion & Swap Rules",
      "Interactive: DDR Dynamic Skew Matcher"
    ],
    loadContent: () => import('./modules/ddr.js')
  },
  { 
    id: "si_pi",      
    icon: Activity,     
    title: "Advanced Signal & Power Integrity (SI/PI)",         
    desc: "Industrial-grade engineering for high-speed channel compliance and PDN stability.",
    prerequisites: ['high_speed', 'ddr', 'diff_pair'],
    sections: [
      "SI Core: Transmission Line Standards",
      "Differential Pair Routing Mastery",
      "BGA Escape & Fanout Design (IPC-7095C)",
      "Decoupling Capacitor Engineering",
      "PDN Target Impedance — Theory & Formula",
      "PDN Target Impedance Solver (Interactive)",
      "Decoupling Hierarchy & Via Physics",
      "Via Stub Resonance & Back-Drilling",
      "Crosstalk — NEXT & FEXT Fundamentals",
      "S-Parameters & Frequency-Domain Compliance",
      "Eye Diagram, Jitter & Bathtub Curves",
      "Lossy Line Physics (Expert Insight)",
      "Recommended 6-Layer Stackup for SI/PI",
      "Simulation & Validation Pipeline"
    ],
    loadContent: () => import('./modules/si_pi.js')
  },
  { 
    id: "emi_emc",    
    icon: ShieldAlert,      
    title: "EMI / EMC Compliance", 
    desc: "Master regulatory standards and suppression techniques.",
    prerequisites: ['stackup'],
    sections: [
      "The Regulatory Landscape: Class A vs. Class B",
      "Antenna Theory for Traces (The λ/20 Rule)",
      "Power Supplies: The Hot Loop Physics",
      "The Ghost of Return Current: Image Planes",
      "The Pigtail Trap: Shield Integrity",
      "Regulatory Tiers: FCC / CISPR / IEC Standards",
      "EMI Bandwidth & Critical Length Solver",
      "EMI Design Compliance Checklist"
    ],
    loadContent: () => import('./modules/emi_emc.js')
  },
  { 
    id: "dfm_dft",    
    icon: Factory,        
    title: "DFM / DFT Mastery",                 
    desc: "Achieve industrial-grade yields and 100% test coverage.",
    prerequisites: ['high_speed'],
    sections: [
      "The Business Case: Yield and Rework",
      "Fabrication Physics: Beyond the Basics",
      "Assembly & Thermal Profiles (J-STD-020)",
      "Thermal Relief Engineering",
      "DFT Architecture: ICT vs. JTAG",
      "Zero-Orientation & Centroid Data",
      "Panelization & Fiducial Strategy",
      "Surface Finish Decision Matrix",
      "Interactive: Real-Time DFM Rule Checker"
    ],
    loadContent: () => import('./modules/dfm_dft.js')
  },
  {
    id: "pcb_output_system",
    icon: Factory,
    title: "Manufacturing Release System",
    desc: "The definitive engineering guide for Fabrication, Assembly, and Test release packages.",
    prerequisites: ['dfm_dft'],
    sections: [
      "Fabrication Output Files (The Photoplot)",
      "NC Drill Precision (CNC Instructions)",
      "Assembly & Placement Engineering",
      "Advanced Formats: ODB++ & IPC-2581",
      "Intelligent Handover: The IPC-2581 'Digital Twin'",
      "CAD-Specific Export Workflows",
      "Common Manufacturing Risks",
      "Standard Release Package (Directory Structure)",
      "Technical Appendix: Test & PnP Metadata",
      "Interactive: Manufacturing Release Simulator"
    ],
    loadContent: () => import('./modules/pcb_output_system.js')
  }
];
