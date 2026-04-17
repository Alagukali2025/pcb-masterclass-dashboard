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
      "1. IPC-7351B Standard",
      "2. Component Producibility Levels",
      "3. Density Level Selection",
      "4. Footprint Geometries & Tolerances",
      "5. Solder Mask & Silk Screens",
      "6. Courtyard & Mechanical Keepouts",
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
      "1. Layer Count Selection (Logic & Economics)",
      "2. Prepreg vs. Core Materials",
      "3. Balanced Stackup Physics",
      "4. Advanced Dielectrics (High-Speed)",
      "5. Thermal Conductivity vs. Layer Spacing",
      "6. Copper Weight Engineering",
      "7. Recommended 4-Layer Stackup",
      "8. Recommended 6-Layer Stackup",
      "Interactive: Stackup Impedance Engine"
    ],
    loadContent: () => import('./modules/stackup.js')
  },
  { 
    id: "diff_pair",  
    icon: Zap,         
    title: "Differential Pair Routing", 
    desc: "Achieve the 8 golden rules of differential signaling.",
    prerequisites: ['high_speed'],
    sections: [
      "1. Differential Signaling Physics",
      "2. The Golden Rules of Diff Pairs",
      "3. Interface Impedance Targets",
      "4. Skew Matching & Meandering",
      "5. The Reference Plane Penalty",
      "6. Broadside vs. Edge Coupling",
      "7. Diff Pair Termination Strategies",
      "Interactive: Zdiff Differential Solver"
    ],
    loadContent: () => import('./modules/diff_pair.js')
  },
  { 
    id: "high_speed", 
    icon: Activity,    
    title: "High-Speed Routing",   
    desc: "Transmission line theory and reflection management.",
    prerequisites: ['stackup'],
    sections: [
      "1. The Transmission Line Threshold",
      "2. Characteristic Impedance (Z0)",
      "3. Signal Velocity & Propagation Delay",
      "4. Reflection Theory & SWR",
      "5. The Critical Path Length",
      "6. High-Speed Layer Transitions (Vias)",
      "7. Termination Physics",
      "Interactive: TDR Impedance & Reflection Solver"
    ],
    loadContent: () => import('./modules/high_speed.js')
  },
  { 
    id: "ddr",        
    icon: Cpu,         
    title: "DDR Routing",          
    desc: "Master DDR4/DDR5 layout topologies and timing matching.",
    prerequisites: ['high_speed'],
    sections: [
      "1. DDR Evolution (DDR3 vs. DDR4 vs. DDR5)",
      "2. Fly-By vs. T-Topology",
      "3. Fly-By Topology (DDR3/4/5)",
      "4. Length Matching & Skew Groups",
      "5. VTT & VREF Power Integrity",
      "6. Point-to-Point (P2P) Topologies",
      "7. Signal Inversion & Swap Rules",
      "Interactive: DDR Dynamic Skew Matcher"
    ],
    loadContent: () => import('./modules/ddr.js')
  },
  { 
    id: "emi_emc",    
    icon: ShieldAlert,      
    title: "EMI / EMC Compliance", 
    desc: "Master regulatory standards and suppression techniques.",
    prerequisites: ['high_speed'],
    sections: [
      "1. The Regulatory Landscape: Class A vs. Class B",
      "2. Antenna Theory for Traces (The λ/20 Rule)",
      "3. Power Supplies: The Hot Loop Physics",
      "4. The Ghost of Return Current: Image Planes",
      "5. The Pigtail Trap: Shield Integrity",
      "6. Regulatory Tiers: FCC / CISPR / IEC Standards",
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
    prerequisites: ['stackup'],
    sections: [
      "1. The Business Case: Yield and Rework",
      "2. Fabrication Physics: Beyond the Basics",
      "3. Assembly & Thermal Profiles (J-STD-020)",
      "4. Thermal Relief Engineering",
      "5. DFT Architecture: ICT vs. JTAG",
      "6. Zero-Orientation & Centroid Data",
      "7. Panelization & Fiducial Strategy",
      "8. Surface Finish Decision Matrix",
      "9. Interactive: Real-Time DFM Rule Checker"
    ],
    loadContent: () => import('./modules/dfm_dft.js')
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
    id: "pcb_output_system",
    icon: Factory,
    title: "Manufacturing Release System",
    desc: "The definitive engineering guide for Fabrication, Assembly, and Test release packages.",
    prerequisites: ['dfm_dft'],
    sections: [
      "1. Fabrication Output Files (The Photoplot)",
      "2. NC Drill Precision (CNC Instructions)",
      "3. Assembly & Placement Engineering",
      "4. Advanced Formats: ODB++ & IPC-2581",
      "Intelligent Handover: The IPC-2581 'Digital Twin'",
      "5. CAD-Specific Export Workflows",
      "6. Common Manufacturing Risks",
      "7. Standard Release Package (Directory Structure)",
      "8. Technical Appendix: Test & PnP Metadata",
      "Interactive: Manufacturing Release Simulator"
    ],
    loadContent: () => import('./modules/pcb_output_system.js')
  },
  {
    id: "thermal",
    icon: Thermometer,
    title: "Thermal Management",
    desc: "Calculate trace current capacity and design internal thermal paths.",
    prerequisites: [],
    sections: [
      "1. Three Pillars of Heat Transfer",
      "2. The Thermal Resistance Path (Rθ)",
      "3. IPC-2152 Current Capacity Solver",
      "4. Internal vs. External Traces",
      "5. Via Gardening & Thermal Stitching",
      "6. Copper Weight & Thermal Spreading",
      "7. Heatsink & TIM Strategy",
      "8. Expert DFM: The Soldering Paradox"
    ],
    loadContent: () => import('./modules/thermal.js')
  }
];
