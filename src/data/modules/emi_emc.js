export const content = {
  intro: "A professional-grade engineering guide to electromagnetic compatibility. Success in the EMC lab begins with physics-driven PCB layout, focusing on loop area containment, spectrum management, and strategic grounding based on IPC-2141A, CISPR 32, and FCC Part 15 standards.",
  sections: [
    {
      heading: "The Regulatory Landscape: Class A vs. Class B",
      content: "Regulatory bodies like the FCC (USA) and CISPR (International) define strict limits based on the product's environment. Failing these tests bars your product from the market.",
      table: {
        headers: ["Standard", "Class", "Environment", "Emission Limit (Radiated)"],
        rows: [
          ["CISPR 32 / FCC Part 15", "Class A", "Industrial / Commercial", "40 dBμV/m (at 10m, 30-230MHz)"],
          { type: 'highlight', data: ["CISPR 32 / FCC Part 15", "Class B", "Residential / Consumer", "30 dBμV/m (at 10m, 30-230MHz) — 10dB Stricter"] },
          ["CISPR 25", "Class 5", "Automotive (Internal)", "18 dBμV/m (Extreme Sensitivity)"]
        ]
      },
      alerts: [
        { type: 'info', text: "Class B is 10dB stricter than Class A. If your product enters a home, it MUST meet Class B. A 10dB difference is a 3.16x reduction in voltage field strength." }
      ]
    },
    {
      heading: "Antenna Theory for Traces (The λ/20 Rule)",
      content: "Every trace is a potential antenna. A trace becomes an efficient radiator when its length exceeds 1/20th of the wavelength (λ) of the signal harmonics. The edge rate (Rise Time) is more dangerous than the fundamental frequency.",
      formula: {
        title: "Maximum Harmonic Frequencies",
        equations: [
          "Fmax ≈ 0.35 / Tr (Rise Time)",
          "λ (Wavelength) = c / (Fmax × √εr)",
          "Critical Length = λ / 20"
        ],
        variables: [
          { name: "Tr", desc: "10-90% Rise Time (ns)", tag: "INPUT" },
          { name: "√εr", desc: "Dielectric Constant (e.g., 4.4 for FR4)", tag: "CONST" }
        ]
      }
    },
    {
      heading: "Power Supplies: The Hot Loop Physics",
      content: "Switching Power Supplies (SMPS) are the primary source of conducted and radiated noise. The 'Hot Loop' (high di/dt path) must be minimized to contain the magnetic field.",
      cards: [
        {
          title: "Current Loop Area",
          text: "Radiated Field (B) ∝ I × Area / r³. Keep the area between the input capacitor and the switching transistor < 1 cm²."
        },
        {
          title: "Common-Mode Chokes",
          text: "Essential for conducted emissions (150kHz - 30MHz). Chokes provide high impedance to common-mode currents while passing differential-mode power."
        }
      ]
    },
    {
      heading: "The Ghost of Return Current: Image Planes",
      content: "In high-speed design, current follows the path of least **inductance**, not resistance. Above 100 kHz, the return current crowds directly beneath the signal trace to minimize loop area. Any split in this image plane creates a massive antenna.",
      alerts: [
        { type: 'danger', text: "Never route signal traces over slots or splits in ground planes. The return current detour creates a 'Slot Antenna' that can fail FCC/CISPR limits by 20dB or more." }
      ]
    },
    {
      heading: "The Pigtail Trap: Shield Integrity",
      content: "A cable shield is only as good as its termination. Connecting a shield via a wire 'pigtail' introduces enough inductance to ruin shielding above 100 MHz.",
      cards: [
        {
          title: "360° Termination",
          text: "Use metal backshells for continuous circular connection between shield and chassis. Zero 'leakage' apertures are the goal."
        },
        {
          title: "The Pigtail Impedance",
          text: "A 1-inch pigtail (20nH) at 500MHz presents a 63Ω impedance—effectively an open circuit to EMI."
        }
      ]
    },
    {
      heading: "Regulatory Tiers: FCC / CISPR / IEC Standards",
      content: "Professional engineers design for global compliance simultaneously. CISPR 32 is the industry baseline for multimedia equipment.",
      table: {
        headers: ["Test Type", "Standard", "Typical Requirement", "Pass Criteria"],
        rows: [
          ["Conducted Emissions", "CISPR 32 / FCC P15", "150kHz - 30MHz (LISN)", "< 56 dBuV (QP)"],
          ["Radiated Emissions", "CISPR 32 / FCC P15", "30MHz - 6GHz (Anechoic)", "< 40 dBuV/m (Class A)"],
          ["ESD Immunity", "IEC 61000-4-2", "±8kV Air / ±4kV Contact", "Criterion B (No reset)"],
          ["Surge / EFT", "IEC 61000-4-4/5", "±1kV - ±2kV Transients", "Criterion B (No reset)"]
        ]
      }
    },
    {
      heading: "EMI Bandwidth & Critical Length Solver",
      content: "Determine the significant frequency bandwidth and critical edge-rate propagation limits for your design.",
      type: "emi-calculator"
    },
    {
      heading: "EMI Design Compliance Checklist",
      content: "A systematic, engineering-accurate checklist for ensuring electromagnetic compatibility. Based on industrial shielding, grounding, and filtering best practices.",
      type: "emi-checklist-tool"
    }
  ],
  checklists: [
    {
      category: "1. Baseline Design Foundations",
      items: [
        "Maintain a solid, unified ground plane across the entire board.",
        "Partition noisy power circuits from sensitive analog zones.",
        "Filter all incoming power with proper bypass capacitors.",
        "Keep clock signals as short as possible with dedicated return paths."
      ]
    },
    {
      category: "2. Engineering Implementation",
      items: [
        "Maintain minimal Hot Loop area for all SMPS stages (<1 cm²).",
        "Slow down edge rates (Rise Time) on non-critical control lines.",
        "Choose ferrite beads based on resistive peak at problem frequency.",
        "Ensure λ/20 trace length limits are respected for harmonics."
      ]
    },
    {
      category: "3. Advanced Regulatory Analysis",
      items: [
        "Verify all layer transitions have adjacent ground stitching vias.",
        "Shielded connectors use 360° circular metal backshells (No pigtails).",
        "Zero trace-to-slot crossings on reference planes verified via CAM.",
        "Return current loop area minimized via thin dielectric (<5 mil)."
      ]
    }
  ]
};
