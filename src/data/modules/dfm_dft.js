export const content = {
  intro: "Design for Manufacturing (DFM) and Design for Testing (DFT) are the twin pillars of professional PCB engineering. DFM ensures your board can be built reliably and repeatably at target cost, while DFT ensures every critical net is verifiable. Grounded in IPC-A-610, IPC-2221B, and J-STD-020, this module serves as the authoritative Single Source of Truth (SSOT) for industrial-grade production.",
  sections: [
    {
      heading: "1. The Business Case: Yield and Rework",
      content: "In volume production, every 1% drop in yield significantly increases total product cost. First Pass Yield (FPY) is the primary metric of design quality.",
      table: {
        headers: ["Metric", "Standard Layout", "Professional Engineering (SSOT)"],
        rows: [
          ["First-Pass Yield", "≤ 85%", "> 99.5%"],
          ["Rework Cost", "High (Manual)", "Minimal (Optimized Process)"],
          ["Field Reliability", "Variable/Unknown", "Verifiable & Guaranteed"]
        ]
      },
      alerts: [
        { type: 'info', text: "A board with 5,000 solder joints at a 100 PPM defect rate has a 50% chance of failing FPY. DFM reduces joint-level defects; DFT catches the rest." }
      ]
    },
    {
      heading: "2. Fabrication Physics: Beyond the Basics",
      content: "PCB fabrication is a subtractive chemical process. Layout geometry determines etching consistency and plating integrity.",
      mistakeList: [
        { mistake: "Acid Traps (Acute Angles)", fix: "Use 45° or rounded corners. Acute angles (<90°) trap etchant, leading to over-etching and open circuits." },
        { mistake: "Copper Slivers", fix: "Maintain min 8 mil spacing between features to prevent thin copper flakes that can cause intermittent shorts." },
        { mistake: "Aspect Ratio Violation", fix: "Keep board-thickness-to-drill-diameter ratio ≤ 12:1 to ensure reliable copper plating inside the barrel." }
      ],
      table: {
        headers: ["Parameter", "Class 2 (Standard)", "Class 3 (High Rel)"],
        rows: [
          ["Min Annular Ring (PTH)", "0.125mm (5 mil)", "0.050mm (2 mil)"],
          ["Trace / Space", "0.100mm (4 mil)", "0.075mm (3 mil)"],
          ["Plating Thickness", "20µm", "25µm (min wall)"]
        ]
      }
    },
    {
      heading: "3. Assembly & Thermal Profiles (J-STD-020)",
      content: "Your design must survive the heat. Assembly processes like Reflow and Wave Soldering subject the board to temperatures between 235°C and 260°C.",
      table: {
        headers: ["Process Stage", "Temperature Range", "Duration (Time Above Liquidus)"],
        rows: [
          ["Reflow (SMT)", "235–260°C (SAC305)", "30–90 sec (217°C)"],
          { type: 'highlight', data: ["Wave (PTH)", "260°C ±5°C", "2–4 sec Contact"] },
          ["Preheat", "100–130°C", "60–120 sec"]
        ]
      },
      ruleCards: [
        {
          number: "01",
          title: "4-Spoke Thermal Relief",
          severity: "warning",
          body: "Add 4 spokes to all PTH pads in copper pours. Solid connections act as heatsinks, causing 'cold solder joints' that fail inspection."
        },
        {
          number: "02",
          title: "Tombstoning Prevention",
          severity: "danger",
          body: "Ensure symmetric pad sizes and copper balance for MLCC passives. Unbalanced wetting forces will pull the component upright during reflow."
        }
      ]
    },
    {
      heading: "4. Thermal Relief Engineering",
      content: "Direct copper plane connections act as heatsinks during soldering, causing 'cold solder joints' or tombstoning. Thermal relief isolates the pad while providing a path for current.",
      type: "thermal-tool"
    },
    {
      heading: "5. DFT Architecture: ICT vs. JTAG",
      content: "DFT ensures the board is testable after assembly. A combination of In-Circuit Testing (ICT) and Boundary Scan (JTAG) provides 100% fault coverage.",
      filletGrid: [
        {
          title: "ICT (Bed-of-Nails)",
          color: "blue",
          list: [
            { label: "Requirement", text: "Min 1mm (40mil) test points on 100% of nets." },
            { label: "Spacing", text: "Maintain 100mil (2.54mm) grid for standard probe fixtures." },
            { label: "Side", text: "Place 100% of TPs on bottom side to allow single-stage testing." }
          ]
        },
        {
          title: "Boundary Scan (JTAG)",
          color: "cyan",
          list: [
            { label: "Standard", text: "IEEE 1149.1 TAP interface (TMS, TCK, TDI, TDO)." },
            { label: "Advantage", text: "Probes nets under BGAs where physical access is impossible." },
            { label: "Chain", text: "Connect TDO of IC1 to TDI of IC2 for unified chain access." }
          ]
        }
      ]
    },
    {
      heading: "6. Zero-Orientation & Centroid Data",
      content: "Standardizing the zero-degree orientation (Pin 1) is mandatory for automated assembly. Follow the EIA-481 tape-and-reel standard to prevent components from being placed backward."
    },
    {
      heading: "7. Panelization & Fiducial Strategy",
      content: "Individual boards are arrayed in panels for assembly. Depaneling introduces mechanical stress that must be mitigated.",
      table: {
        headers: ["Method", "Component Clearance", "Depanel Stress", "Board Shape"],
        rows: [
          ["V-Score", "0.5mm (20 mil)", "Moderate (Shear)", "Rectangular Only"],
          { type: 'highlight', data: ["Tab-Routing", "2.0-5.0mm (Tab)", "Low (if routed)", "Irregular Shapes"] },
          ["Laser Depanel", "0.2mm", "Near Zero", "Any Shape / High Precision"]
        ]
      },
      alerts: [
        { type: 'danger', text: "Place 3 global fiducials (non-colinear) on the panel rails. Camera alignment fails if fiducials are in a single line." }
      ]
    },
    {
      heading: "8. Surface Finish Decision Matrix",
      content: "Surface finish selection determines shelf life, solderability, and flatness. Modern lead-free processes demand finishes that survive multiple reflow cycles without excessive oxidation.",
      table: {
        headers: ["Finish", "Shelf Life", "Flatness", "Cost", "Best For..."],
        rows: [
          ["ENIG (Gold)", "12+ Months", "Excellent", "High", "Fine-pitch BGA, Lead-free"],
          ["HASL (Leaded)", "12 Months", "Poor", "Lowest", "Simple THT, Hand soldering"],
          ["Lead-Free HASL", "6 Months", "Fair", "Low", "General purpose RoHS"],
          { type: 'highlight', data: ["OSP (Organic)", "3-6 Months", "Excellent", "Low-Mid", "Consumer electronics"] },
          ["Immersion Silver", "6 Months", "Excellent", "Medium", "High-speed links (>10 GHz)"],
          ["ENEPIG", "12+ Months", "Excellent", "Highest", "Gold wire bonding, High-Rel"]
        ]
      },
      alerts: [
        { type: 'info', text: "Skin Effect Warning: At frequencies above 10 GHz, Immersion Silver or OSP are preferred over ENIG due to the magnetic properties of the Nickel layer, which increases insertion loss." }
      ]
    },
    {
      heading: "9. Interactive: Real-Time DFM Rule Checker",
      content: "Validate your design parameters against the IPC-2221B and IPC-6012 industrial limits. This engine provides instant feedback on aspect ratio, annular rings, and solder mask dams.",
      type: 'dfm-checker'
    }
  ],
  checklists: [
    {
      category: "Fabrication Sign-Off",
      items: [
        "Laminate selection (Tg/Td) verified for Lead-Free reflow.",
        "All PTH pads in copper pours have 4-spoke thermal relief.",
        "Min Annular Ring (Class 2/3) verified across all via layers.",
        "Aspect Ratio (Board Thickness / Smallest Drill) ≤ 12:1.",
        "No acute acid traps (<90°) present in signal routing."
      ]
    },
    {
      category: "Assembly & SMT Readiness",
      items: [
        "Global fiducials (3) placed non-colinearly on panel rails.",
        "Components ≥ 5-10mm from V-score edges to prevent cracking.",
        "Solder mask dams ≥ 4 mil (0.1mm) verified for all fine-pitch ICs.",
        "Via-in-Pad locations specified as IPC-4761 Type VII (Filled/Capped).",
        "Polarized components (Diodes, ICs) clearly silkscreened."
      ]
    },
    {
      category: "DFT & Test Readiness",
      items: [
        "Test points assigned to 100% of PWR, GND, and Reset nets.",
        "Test point grid ≥ 2.54mm (100mil) for standard ICT fixture.",
        "IEEE 1149.1 (JTAG) chain logic verified (TDO -> TDI chain).",
        "Test points accessible on all primary communication buses.",
        "Zero solder mask or silkscreen coverage on test point pads."
      ]
    }
  ]
};
