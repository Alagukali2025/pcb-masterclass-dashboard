export const content = {
  intro: "Thermal management is the most overlooked phase of high-power PCB design. Modern high-density boards must be sized not just for resistance, but for steady-state temperature rise (ΔT) limits to ensure dielectric reliability and prevent catastrophic delamination. This module provides a standards-driven single source of truth for thermal engineering, anchored in IPC-2152 and industrial heat transfer physics.",
  sections: [
    {
      heading: "Three Pillars of Heat Transfer",
      content: "In a PCB environment, heat moves through three fundamental physical mechanisms. Understanding these is mandatory for both beginners and experts to design efficient cooling paths.",
      filletGrid: [
        {
          title: "Conduction",
          color: "blue",
          list: [
            { label: "Mechanism", text: "Physical contact. Heat flows from warm to cool through copper and laminate." },
            { label: "PCB Rule", text: "Copper is ~1000x more conductive than FR4. Use copper pours as primary conduits." },
            { label: "Key Value", text: "Copper Conductivity ≈ 400 W/m·K." }
          ]
        },
        {
          title: "Convection",
          color: "cyan",
          list: [
            { label: "Mechanism", text: "Heat transfer to air. Can be Natural (passive) or Forced (fans)." },
            { label: "Critical Rule", text: "Air is an insulator. Still air restricts heat escape; moving air increases efficiency exponentially." },
            { label: "Standard", text: "Most IPC-2152 charts assume natural convection in still air." }
          ]
        },
        {
          title: "Radiation",
          color: "orange",
          list: [
            { label: "Mechanism", text: "Electromagnetic emission. Significant at higher temperatures (>80°C)." },
            { label: "Emissivity", text: "Matte black solder mask radiates heat better than clear or white finishes." },
            { label: "Impact", text: "Often contributes 10-20% of total board cooling in open-air environments." }
          ]
        }
      ]
    },
    {
      heading: "The Thermal Resistance Path (Rθ)",
      content: "Electrical engineers can think of heat flow like a series of resistors. Total thermal resistance (Rθja) determines the final junction temperature of your components.",
      type: "thermal-resistance-visual",
      formula: {
        title: "Junction Temperature Calculation",
        equations: [
          "Tj = Ta + (Pd × Rθja)",
          "Rθja = Rθjc + Rθcs + Rθsa"
        ],
        variables: [
          { name: "Tj", desc: "Junction Temperature (°C)", tag: "GOAL" },
          { name: "Ta", desc: "Ambient Temperature (°C)", tag: "INPUT" },
          { name: "Pd", desc: "Power Dissipated (Watts)", tag: "INPUT" },
          { name: "Rθja", desc: "Total Thermal Resistance (Junction to Ambient)", tag: "CALC" }
        ]
      },
      alerts: [
        { type: 'warning', text: "Exceeding Tj_max (typically 125°C or 150°C) results in immediate performance throttling or permanent silicon damage." }
      ]
    },
    {
      heading: "IPC-2152 Current Capacity Solver",
      content: "IPC-2152 is the modern, standards-driven methodology for sizing traces. Unlike the legacy IPC-2221, it accounts for material thermal conductivity and nearby copper planes.",
      type: "calculator"
    },
    {
      heading: "Internal vs. External Traces",
      content: "The environment of a trace dictates its current-carrying limits. Stripline traces (internal) are 'blanketed' by FR4, which traps heat.",
      table: {
        headers: ["Trace Type", "Thermal Density", "Cooling Efficiency", "Engineering Action"],
        rows: [
          ["External (Microstrip)", "High Exposure", "Efficient (Air + Copper)", "Preferred for high-current rails"],
          { type: 'highlight', data: ["Internal (Stripline)", "Insulated", "Poor (FR4 bottleneck)", "Design 2x width for same ΔT"] }
        ]
      },
      alerts: [
        { type: 'info', text: "Internal traces rely entirely on conduction to adjacent GND planes. Ensure a thin dielectric (<5 mil) to the nearest plane for better heat sinking." }
      ]
    },
    {
      heading: "Via Gardening & Thermal Stitching",
      content: "Vias are the 'heat pipes' of a PCB. Strategically placed arrays (gardening) can bridge heat from top-layer components to internal or bottom-layer ground planes.",
      type: "thermal-tool",
      list: [
        { label: "Via Size", text: "0.3mm (12 mil) drill is the 'sweet spot' for thermal vias — large enough to plate well, small enough for high density." },
        { label: "Placement", text: "Place directly under the component's exposed thermal pad (VIPPO) for maximum effect." },
        { label: "Pitch", text: "Maintain 1.0mm to 1.25mm pitch. Too tight causes 'Swiss-cheese' planes; too loose increases thermal resistance." }
      ]
    },
    {
      heading: "Copper Weight & Thermal Spreading",
      content: "Increasing copper weight (oz) increases the cross-sectional area for current and the surface area for thermal spreading.",
      table: {
        headers: ["Copper Weight", "Thickness (mil)", "Thermal Spreading", "Typical Usage"],
        rows: [
          ["0.5 oz (Half)", "0.7 mil", "Low", "Signal layers only"],
          ["1.0 oz (Standard)", "1.4 mil", "Moderate", "Standard power planes"],
          ["2.0 oz (Heavy)", "2.8 mil", "High", "High-power (>10A) rails"],
          { type: 'highlight', data: ["3.0 oz (Extreme)", "4.2 mil", "Maximum", "Automotive / EV Busbars"] }
        ]
      }
    },
    {
      heading: "Heatsink & TIM Strategy",
      content: "When copper plane dissipation is insufficient, external heatsinks are required. The interface between the component and the heatsink is the bottleneck.",
      cards: [
        {
          title: "Thermal Interface Material (TIM)",
          text: "Fills microscopic air gaps (Rθcs). Use high-performance paste or pads with K > 3.0 W/m·K."
        },
        {
          title: "Mechanical Pressure",
          text: "TIM performance depends on clamping force. Ensure mounting holes support consistent pressure without bowing the PCB."
        }
      ]
    },
    {
      heading: "Expert DFM: The Soldering Paradox",
      content: "High thermal conductivity is great for cooling, but terrible for manufacturing. Solid plane connections cause 'cold solder joints' during assembly.",
      mistakeList: [
        { mistake: "Solid connections to large planes on SMT pads.", fix: "Use 4-spoke thermal relief for all components < 1206 size." },
        { mistake: "Oversized thermal vias on QFN pads.", fix: "Limit via drill to 0.3mm and use 'Windowpane' stencil apertures to prevent solder wicking." }
      ]
    }
  ],
  checklists: [
    {
      category: "1. Baseline Thermal Integrity",
      items: [
        "Current requirements gathered for all power rails (Amps).",
        "Maximum allowable temperature rise established (default +10°C / +20°C).",
        "Continuous ground planes provided as primary heat spreaders.",
        "Components with exposed pads include via stitching to planes."
      ]
    },
    {
      category: "2. Expert Engineering Review",
      items: [
        "Junction temperature (Tj) calculated for all components > 1W.",
        "Heatsink-to-PCB mechanical keepouts verified.",
        "TIM conductivity and thickness specified in the mechanical BOM.",
        "Airflow path (CFM) verified for forced-convection systems.",
        "Thermal relief verified on all pads to prevent manufacturing defects."
      ]
    }
  ]
};
