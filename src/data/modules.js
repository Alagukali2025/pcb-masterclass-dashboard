import { Cpu, Layers, Merge, Zap, MemoryStick, ShieldAlert, Factory, Activity } from 'lucide-react';

export const modulesData = [
  { 
    id: "footprint",  
    icon: Cpu,      
    title: "Footprint Creation",        
    desc: "Master IPC-7351 standards and land patterns.",
    content: {
      intro: "A footprint (or land pattern) is the physical arrangement of copper pads on a PCB. Designing it incorrectly leads to tombstoning, solder bridges, and manufacturing failures.",
      sections: [
        {
          heading: "The IPC-7351 Standard",
          content: "IPC-7351 is the global standard for surface mount design. It relies on mathematical models to calculate the exact pad size based on the component's leads and required solder fillets (Toe, Heel, and Side)."
        },
        {
          heading: "The 3 Density Levels",
          content: "Not all boards are the same. IPC defines three density levels to determine how much extra pad area you need:",
          cards: [
            { title: "Level A (Maximum)", text: "For low-density boards or extreme environments. Largest solder joints for maximum physical strength." },
            { title: "Level B (Nominal)",  text: "The standard for most desktop and consumer electronics. A perfect balance between size and reliability." },
            { title: "Level C (Least)",    text: "For high-density mobile devices. Minimal solder joints to save maximum board space." }
          ]
        },
        {
          heading: "Design Guidelines & Courtyard",
          content: "The Courtyard is the absolute minimum area required around a component. It includes the component body, the pads, and an extra 'excess' boundary to prevent pick-and-place machines from crashing components into each other."
        }
      ],
      checklist: [
        "Verify datasheet dimensions and tolerances.",
        "Calculate Toe, Heel, and Side fillets for Density Level B.",
        "Ensure Silkscreen clearance is at least 0.1mm from pads.",
        "Add Courtyard polygon on the correct mechanical layer.",
        "Verify 3D STEP model aligns perfectly with pads."
      ]
    }
  },
  { 
    id: "stackup",    
    icon: Layers,     
    title: "Stackup Design",            
    desc: "Understand materials, prepreg, and cores.",
    content: {
      intro: "A PCB stackup is the ordered arrangement of copper layers, prepreg (B-stage resin), and core (C-stage) materials that form the final laminated board. The stackup is not a post-design consideration — it is the foundation upon which signal integrity, power delivery, EMC compliance, and manufacturability are built.",
      sections: [
        {
          heading: "Key Materials Terminology",
          cards: [
            { title: "Core", text: "Fully cured (C-stage) dielectric with copper foil laminated on both sides. Provides dimensional stability." },
            { title: "Prepreg", text: "Partially cured (B-stage) glass/resin sheet. Flows and bonds during lamination. Controls dielectric height (h)." },
            { title: "Dk (Dielectric Constant)", text: "Relative permittivity of insulating material. Determines signal propagation speed. FR4 is typically 4.2." }
          ]
        },
        {
          heading: "Symmetric Design Principle",
          content: "Stackups MUST be mirror-symmetric about the center plane. L1 must match Ln, L2 must match Ln-1 in terms of copper weight, dielectric thickness, and material type. Asymmetric stackups will physically bow or warp during the high heat of reflow soldering due to Coefficient of Thermal Expansion (CTE) mismatch.",
          alerts: [
            { type: 'warning', text: "Never approve an asymmetric stackup from a manufacturer without a strict sign-off on warpage risks." }
          ]
        },
        {
          heading: "Routing and Reference Planes",
          content: "Every high-speed signal layer MUST have an adjacent solid reference plane (GND or PWR). This controls impedance and minimizes the return current loop area, drastically reducing EMI."
        }
      ],
      checklist: [
        "Verify mirror symmetry across the center of the board.",
        "Ensure all high-speed routing layers are directly adjacent to a solid reference plane.",
        "Avoid routing high-speed traces across splits in the reference plane.",
        "Confirm Dk and Df values with the specific laminate manufacturer datasheet."
      ]
    }
  },
  { 
    id: "diff_pair",  
    icon: Merge,      
    title: "Differential Pair Routing", 
    desc: "Learn phase matching and coupling.",
    content: {
      intro: "Differential signaling uses two complementary signals to transmit data (e.g., USB, PCIe, HDMI). It provides excellent common-mode noise rejection and lower EMI profile than single-ended routing.",
      sections: [
        {
          heading: "Impedance vs. Edge Coupling",
          content: "A differential pair is defined by its differential impedance (Zdiff), which is determined by the trace width, trace spacing, and dielectric height. Closer spacing increases coupling but lowers the overall impedance. Typical targets are 90Ω for USB and 100Ω for PCIe/Ethernet."
        },
        {
          heading: "Phase Matching (Length Matching)",
          content: "The two signals must arrive at the receiver at the exact same time. If they are out of phase, the signal creates common-mode noise (EMI) and degrades the eye diagram. Matching must occur at the point of mismatch (e.g., near the corner where the inner trace traveled a shorter distance).",
          cards: [
            { title: "Intra-pair Skew", text: "The length difference between the positive (P) and negative (N) traces within the same pair. Usually needs to be < 5 mils for high speeds." },
            { title: "Inter-pair Skew", text: "The length difference between multiple pairs within a bus (e.g., PCIe lanes). Less strict than intra-pair, but still critical." }
          ]
        }
      ],
      checklist: [
        "Maintain constant trace separation (avoid splitting pairs around vias).",
        "Add phase matching bumps near the source of the mismatch.",
        "Route pairs symmetrically into component pads to prevent phase skew.",
        "Do not route pairs over reference plane gaps."
      ]
    }
  },
  { 
    id: "high_speed", 
    icon: Zap,            
    title: "High-Speed Routing",        
    desc: "Impedance control and length matching.",
    content: {
      intro: "When the rise time of a signal is less than the time it takes for the signal to travel the length of the trace, the trace becomes a transmission line. At this point, classical circuit theory gives way to microwave theory.",
      sections: [
        {
          heading: "The 3W Rule for Crosstalk",
          content: "To minimize crosstalk between adjacent high-speed traces, maintain a distance of at least 3 times the trace width (3W) from center-to-center. For extreme isolation, use 5W or shield with vias (co-planar waveguide)."
        },
        {
          heading: "Vias and Return Paths",
          content: "Every time a high-speed signal transitions layers through a via, its return current must also transition. If no path is provided, the return current spreads out, causing EMI.",
          alerts: [
            { type: 'danger', text: "Always place a GND transfer via right next to a signal via when transitioning between different reference layers." }
          ]
        }
      ],
      checklist: [
        "Calculate exact trace width for 50Ω single-ended impedance.",
        "Apply 3W spacing rules to critical clock and data lines.",
        "Minimize via usage on high-speed traces.",
        "Ensure GND return vias are placed for layer transitions."
      ]
    }
  },
  { 
    id: "ddr",        
    icon: MemoryStick,          
    title: "DDR Routing",               
    desc: "Fly-by topology and byte lane routing.",
    content: {
      intro: "DDR (Double Data Rate) memory routing is one of the most complex tasks in PCB layout. It requires strict length matching, specific topologies, and absolute adherence to reference plane rules.",
      sections: [
        {
          heading: "Routing Topologies",
          content: "Different DDR generations require different routing methods to maintain signal integrity across multiple memory chips.",
          cards: [
            { title: "T-Branch (DDR2)", text: "Signals split symmetrically to reach memory chips at the exact same time. Extremely hard to route for >2 chips." },
            { title: "Fly-By (DDR3/4/5)", text: "Signals daisy-chain past each memory module with a termination resistor at the end. Requires 'Write Leveling' in the memory controller to account for intentional skew." }
          ]
        },
        {
          heading: "Byte Lane Matching",
          content: "DDR data is broken into byte lanes (8 data bits + DQS strobe + DQM mask). Traces within a specific byte lane only need to be matched to their respective DQS strobe, not to the other byte lanes! Address and Command/Control lines must be matched to the CLK signal."
        }
      ],
      checklist: [
        "Route using Fly-by topology for Address/Command/Control lines.",
        "Length match Data bits (DQ) to their respective Data Strobe (DQS) within ±10 mils.",
        "Ensure solid VTT plane for termination resistors.",
        "Keep Data and Address lines strictly separated to avoid crosstalk."
      ]
    }
  },
  { 
    id: "emi_emc",    
    icon: ShieldAlert,   
    title: "EMI / EMC Compliance",                 
    desc: "Mitigate radiation and ensure compliance.",
    content: {
      intro: "Electromagnetic Interference (EMI) and Electromagnetic Compatibility (EMC) are critical for regulatory certification (FCC, CE). A board that works perfectly on the bench can still fail emissions testing and be legally barred from sale.",
      sections: [
        {
          heading: "Loop Area is the Enemy",
          content: "The majority of radiated EMI problems come from uncontrolled return currents forming large loop areas. Radiation is proportional to Loop Area × Current × Frequency². Keep the dielectric height between signal and reference plane as thin as possible."
        },
        {
          heading: "Chassis Ground vs Digital Ground",
          content: "Connectors and metal enclosures should tie to a Chassis Ground, which couples to Digital Ground through high-voltage capacitors or specific tie points. This directs ESD strikes away from sensitive ICs and prevents the cable shield from becoming an antenna."
        }
      ],
      checklist: [
        "Filter all incoming power with proper bypass capacitors and ferrites.",
        "Never cross a disrupted reference plane with a high-speed signal.",
        "Slow down edge rates (rise/fall times) on non-critical signals using series resistors.",
        "Add ESD protection diodes to all external I/O ports."
      ]
    }
  },
  { 
    id: "dfm_dft",    
    icon: Factory,        
    title: "DFM / DFT",                 
    desc: "Design for manufacturing and testing.",
    content: {
      intro: "Design for Manufacturing (DFM) ensures your board can be built reliably. Design for Testing (DFT) ensures it can be tested in mass production without destroying yields.",
      sections: [
        {
          heading: "Acid Traps & Slivers",
          content: "Acute trace angles (less than 90 degrees) can trap etching acid during fabrication, causing the trace to over-etch and break. Always use 45-degree or rounded corners. Copper slivers (isolated copper less than 4 mils wide) can detach during soldering and short out pins."
        },
        {
          heading: "Test Points (DFT)",
          content: "Every critical node should have a test point for the 'Bed of Nails' ICT (In-Circuit Testing) machine. Test points should ideally all be on the bottom the board, spaced at least 50 mils apart.",
          alerts: [
            { type: 'warning', text: "Never place a test point directly on a high-speed trace like USB or PCIe, as the test pad creates a capacitive stub that ruins signal integrity." }
          ]
        }
      ],
      checklist: [
        "Ensure all vias are tented or plugged to prevent solder-wicking during assembly.",
        "Add fiducial marks on opposite corners of the board for pick-and-place cameras.",
        "Verify silkscreen text does not overlap any exposed copper pads.",
        "Provide test points for all voltage rails, ground, JTAG, and UART."
      ]
    }
  },
  { 
    id: "si_pi",      
    icon: Activity,     
    title: "SI / PI Calculation",         
    desc: "Signal and power integrity basics.",
    content: {
      intro: "Signal Integrity (SI) ensures that signals arriving at receivers are clean enough to be interpreted correctly. Power Integrity (PI) ensures that components receive stable, low-noise power under dynamic load conditions.",
      sections: [
        {
          heading: "Target Impedance (PI)",
          content: "A PDN (Power Delivery Network) must maintain an impedance below a certain target across a wide frequency band (DC to several GHz). This is accomplished through a hierarchy of capacitors: VRM -> Bulk Caps -> Decoupling Caps -> Package Caps -> On-die Caps."
        },
        {
          heading: "PDN Resonance",
          content: "Every capacitor has an ESL (Equivalent Series Inductance) which causes it to resonate at a specific frequency. Parallel combinations of different-sized capacitors can create anti-resonance peaks (impedance spikes). Simulating the PDN is required for high-current core voltages."
        }
      ],
      checklist: [
        "Place smallest value decoupling capacitors closest to the IC power pins.",
        "Use multi-via connections for power and ground to reduce ESL.",
        "Ensure VCC copper pours are wide enough to carry the DC current without voltage drop (IR Drop).",
        "Use a PDN simulation tool for any SoC requiring >5 Amps at <1.2V."
      ]
    }
  }
];
