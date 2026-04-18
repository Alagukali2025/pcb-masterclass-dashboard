export const content = {
  intro: "A standards-driven, evidence-based professional guide for PCB library engineers. All values and methodologies sourced strictly from component datasheets and IPC-7351 standards.",
  sections: [
    {
      heading: "IPC-7351 Land Pattern Methodology",
      content: "IPC-7351B/C defines a mathematical framework for calculating copper land patterns based on component body dimensions, lead dimensions, and assembly class. The standard introduces three density levels:",
      table: {
        headers: ["Density Level", "IPC Designation", "Environment", "Typical Application"],
        rows: [
          ["A — Most Material", "IPC-SM-782 Class A", "Low-density, large-board", "Prototype, hand assembly, rework-heavy"],
          { type: 'highlight', data: ["B — Nominal", "IPC-SM-782 Class B", "Medium-density", "General commercial — most common default"] },
          ["C — Least Material", "IPC-SM-782 Class C", "High-density (HDI)", "Mobile, wearable, space-constrained"]
        ]
      },
      alerts: [
        { type: 'info', text: "IPC-7351B Section 3.1 mandates that the nominal (B) environment be the default land pattern used unless explicitly specified." }
      ]
    },
    {
      heading: "Land Pattern Calculation — Core Equations",
      content: "IPC-7351B defines land dimensions through three dimensional extensions. All variables carry tolerance bands from the component datasheet.",
      formula: {
        title: "IPC-7351B Land Calculation Variables",
        equations: [
          "Z = Lmax + 2·Jt + √(CL² + CS² + CP²) // Outer courtyard span",
          "G = Tmin − 2·Jh − √(CL² + CS² + CP²) // Inner gap between pads",
          "X = Wmax + 2·Js + √(CL² + CS² + CP²) // Pad width"
        ],
        variables: [
          { name: "Lmax", desc: "Component lead length max", tag: "DATASHEET" },
          { name: "Tmin", desc: "Component overall length min", tag: "DATASHEET" },
          { name: "Wmax", desc: "Lead width max", tag: "DATASHEET" },
          { name: "Jt", desc: "Toe fillet goal", tag: "IPC-7351" },
          { name: "Jh", desc: "Heel fillet goal", tag: "IPC-7351" },
          { name: "Js", desc: "Side fillet goal", tag: "IPC-7351" },
          { name: "CL, CS, CP", desc: "Fabrication, placement, stencil tolerances", tag: "IPC-7351" }
        ]
      }
    },
    {
      heading: "Interactive Land Pattern Solver",
      content: "Calculate the precise land pattern dimensions for the Top, Side, and Heel fillets based on the IPC-7351C mathematical model. Select your target Density Level to see how pad size affects yield.",
      type: 'calculator'
    },
    {
      heading: "Solder Joint Reliability Principles",
      content: "Solder joint reliability is directly governed by three parameters derivable from footprint geometry:",
      list: [
        { label: "Pad-to-lead ratio", text: "The copper pad must extend sufficiently beyond the lead to form a well-defined meniscus. Insufficient extension reduces fillet height and increases cold joints." },
        { label: "Thermal mass balance", text: "Asymmetric pad sizes on two-pad passives cause tombstoning if one pad wets before the other. IPC-7351B mandates equal pad sizes for symmetric components." },
        { label: "Pad spacing", text: "The gap between pads must be designed so that bridging probability remains below acceptable limits per IPC-A-610." }
      ]
    },
    {
      heading: "DFM & DFA Considerations",
      content: "Manufacturability and assembly constraints are baked into every footprint through systematic rules:",
      table: {
        headers: ["Constraint", "Basis", "Footprint Impact"],
        rows: [
          ["Pad-to-pad clearance", "IPC-7351B / CM capability", "Prevents solder bridging on fine-pitch components"],
          ["Courtyard clearance", "IPC-7351B §4.1", "Ensures pick-and-place nozzle clearance (min 0.25mm (9.8 mil))"],
          ["Pin-1 marking", "IPC-7351B §3.5", "Mandatory on all polarized/IC components in silkscreen"],
          ["Via-in-pad restrictions", "IPC-7095C §8", "Requires plugging/capping — must be flagged in notes"],
          ["Stencil aperture ratio", "IPC-7525B", "Minimum pad size constrains stencil aperture design (≥ 0.66)"]
        ]
      }
    },
    {
      heading: "Solder Joint Terminology",
      content: "The three solder fillet locations — toe, heel, and side — represent the principal inspection points for quality.",
      filletGrid: [
        {
          title: "Toe Fillet",
          color: "cyan",
          list: [
            { label: "Location", text: "Outermost edge furthest from body." },
            { label: "Purpose", text: "Primary mechanical anchor; bears thermal cycle stress." },
            { label: "Class 3 Min", text: "50% lead width height." }
          ]
        },
        {
          title: "Heel Fillet",
          color: "orange",
          list: [
            { label: "Location", text: "Innermost edge closest to body." },
            { label: "Purpose", text: "Shear resistance; prevents lead liftoff under flex." },
            { label: "Class 3 Min", text: "25% lead thickness height." }
          ]
        },
        {
          title: "Side Fillet",
          color: "green",
          list: [
            { label: "Location", text: "Lateral edges of the lead width." },
            { label: "Purpose", text: "Lateral stability and current-carrying capacity." },
            { label: "Class 3 Min", text: "25% lead width." }
          ]
        }
      ]
    },
    {
      heading: "SSOT Architecture",
      content: "Full traceability from production back to the originating datasheet is maintained through a structured data flow:",
      flow: [
        { step: "01", title: "Source", desc: "Component datasheet (archived PDF)" },
        { step: "02", title: "Extract", desc: "Lead/body dims from mechanical" },
        { step: "03", title: "Calculate", desc: "Apply IPC-7351B formulas" },
        { step: "04", title: "Model", desc: "Create EDA footprint" },
        { step: "05", title: "Validate", desc: "DRC and peer review" },
        { step: "06", title: "Release", desc: "Publish to managed library" }
      ]
    },
    {
      heading: "Version Control & Metadata",
      content: "Every footprint must carry embedded metadata for audit readiness (IPC Class 3):",
      codeBlock: "FOOTPRINT_NAME:    [PACKAGE]_[STANDARD]_[DENSITY]\\nCREATION_DATE:     YYYY-MM-DD\\nDATASHEET_REF:     Manufacturer_PN_Datasheet_RevX.pdf\\nIPC_STANDARD:      IPC-7351B, Density Level B\\nFOOTPRINT_VERSION: 1.0.0\\nREVIEW_STATUS:     APPROVED / PENDING\\nREVIEWER_ID:       Rev_002"
    },
    {
      heading: "Critical Datasheet Sections",
      content: "The component datasheet is the primary authority. All calculations must derive from these specific sections:",
      table: {
        headers: ["Dimension", "Symbol", "Usage in Footprint", "Source"],
        rows: [
          ["Lead length", "L, b", "Toe extension basis", { text: "DATASHEET", tag: "DS" }],
          ["Body length/width", "D, E", "Heel/Side reference", { text: "DATASHEET", tag: "DS" }],
          ["Lead pitch", "e", "Pad center-to-center", { text: "DATASHEET", tag: "DS" }],
          ["Standoff height", "A1", "3D alignment & paste", { text: "DATASHEET", tag: "DS" }],
          ["Lead coplanarity", "δ", "Solder joint quality", { text: "DATASHEET", tag: "DS" }]
        ]
      }
    },
    {
      heading: "IPC Standards Application",
      content: "Where specific IPC standards govern footprint elements:",
      table: {
        headers: ["Element", "Governing Standard", "Application"],
        rows: [
          ["Fillet goals (Jt, Jh, Js)", "IPC-7351B Table 3-1", "Selected based on density"],
          ["Calculated tolerances", "IPC-7351B §3.1", "Statistical RSS combination"],
          ["Silkscreen clearance", "IPC-7351B §3.6", "Min 0.10mm (3.9 mil) from copper"],
          ["Via-in-pad rules", "IPC-7095C §8", "Mandatory plugging for VIP"],
          ["Thermal via array", "IPC-7093A §4.2", "Exposed pad design"]
        ]
      }
    },
    {
      heading: "Conflict Resolution",
      content: "When datasheet recommendations conflict with IPC calculations:",
      list: [
        { label: "Step 1", text: "Document both values explicitly with full traceability." },
        { label: "Step 2", text: "Back-calculate manufacturer density level to identify discrepancy." },
        { label: "Step 3", text: "Apply project-mandated density level (usually B)." },
        { label: "Step 4", text: "Flag deviations >15% for engineering review before release." }
      ]
    },
    {
      heading: "Manufacturability Constraints (DFM)",
      content: "Standard manufacturing limits for reliable production:",
      table: {
        headers: ["Constraint", "Min Value", "Standard", "Risk"],
        rows: [
          ["Min pad width", "0.20 mm (7.9 mil)", "CM Capability", "Trace definition failure"],
          ["Min pad-to-pad gap", "0.15 mm (5.9 mil)", "IPC-2221A", "Solder bridging"],
          ["Min annular ring", "0.05 mm (1.97 mil)", "IPC-2221A", "Breakout / Open circuit"],
          ["Min drill size", "0.20 mm (7.9 mil)", "IPC-2221A", "Drill breakage"]
        ]
      }
    },
    {
      heading: "Assembly Tolerances (RSS)",
      content: "Statistical stack-up of fabrication and placement errors:",
      table: {
        headers: ["Source", "Symbol", "Value (Density B)", "Description"],
        rows: [
          ["Fabrication", "CL", "±0.10 mm (3.9 mil)", "Copper dimensional accuracy"],
          ["Placement", "CS", "±0.05 mm (1.97 mil)", "Pick-and-place precision"],
          ["Stencil", "CP", "±0.025 mm (0.98 mil)", "Paste printing registration"]
        ]
      },
      formula: {
        title: "RSS Combined Tolerance",
        equations: ["RMS = √(CL² + CS² + CP²) ≈ 0.114 mm (4.49 mil)"],
        variables: []
      }
    },
    {
      heading: "Tool-Specific Best Practices",
      twoColumnGrid: [
        {
          badge: "Altium Designer",
          badgeClass: "tool-badge-altium",
          title: "Library Workflow",
          items: [
            "Use Integrated Library (.IntLib) for managed components",
            "IPC Wizard (Tools → Wizard) implements 7351B formulas",
            "Padstacks are defined inline per footprint pad",
            "3D models (STEP) imported directly into PcbLib"
          ]
        },
        {
          badge: "Cadence OrCAD / Allegro",
          badgeClass: "tool-badge-cadence",
          title: "Library Workflow",
          items: [
            "Standalone Padstack Editor creates reusable .pad files",
            "Symbols (.dra/.psm) managed via library path (.path)",
            "Constraint Manager handles hierarchical design rules",
            "STEP models mapped via Allegro 3D Viewer"
          ]
        }
      ]
    },
    {
      heading: "Step-by-Step: Altium Designer",
      content: "Standard workflow for creating an SMD footprint (e.g., SOT-23):",
      list: [
        "Create New Component in .PcbLib and enter metadata.",
        "Place SMD Pads at exact coordinates from IPC calculation.",
        "Draw Top Overlay (Silkscreen) with 0.10mm (3.9 mil) pad clearance.",
        "Draw Assembly Outline on Mechanical layer at body dimensions.",
        "Draw Courtyard at +0.25mm (9.8 mil) boundary (Density B).",
        "Set Origin to Component Centroid.",
        "Align manufacturer STEP model to assembly outline.",
        "Run Component Rule Check and release to library."
      ]
    },
    {
      heading: "Step-by-Step: Cadence Allegro",
      content: "Standard workflow for creating a managed footprint:",
      list: [
        "Create Padstack (.pad) in Padstack Editor first.",
        "File → New → Package Symbol (.dra) in Allegro.",
        "Layout → Pins to place pads using the created .pad files.",
        "Add → Line on Package_Geometry/Silkscreen_Top for body.",
        "Add → Line on Package_Geometry/Assembly_Top for body.",
        "Add → Rectangle on Place_Bound_Top for Courtyard.",
        "Setup → Change Drawing Origin to centroid.",
        "Check → Check Symbol to verify zero DRC violations."
      ]
    },
    {
      heading: "IPC-A-610 Solder Joint Inspection",
      content: "Acceptability of solder joints for surface mount components depends on the Class of the product (1, 2, or 3). Higher classes require greater wetting and fillet height.",
      table: {
        headers: ["Feature", "Class 1 (General)", "Class 2 (Dedicated)", "Class 3 (High Performance)"],
        rows: [
          ["Min Toe Fillet Height", "Lead thickness + wetting", "Lead thickness + wetting", "Lead thickness + 25% Lead Thickness"],
          ["Min Side Fillet Width", "Not specified", "50% Lead Width", "75% Lead Width"],
          ["Max Lead Overhang", "50% Lead Width", "50% Lead Width", "25% Lead Width (max 0.5mm)"],
          ["Wetting Angle", "≤ 90° (Target)", "≤ 90° (Required)", "≤ 90° (Critical)"]
        ]
      },
      alerts: [
         { type: 'info', text: "Class 3 is mandatory for aerospace, life support, and extreme environment electronics." }
      ]
    },
    {
      heading: "The Courtyard & Keepout (Symmetry)",
      content: "A professional footprint requires a defined Courtyard — the area encompassing the component body and pads, plus a safety buffer for assembly pick-and-place tolerances."
    },
    {
      heading: "Advanced Footprint Engineering (BGA/QFN)",
      content: "High-pin-count and exposed-pad components require specialized landing strategies. Inadequate thermal via design or stencil apertures can result in 100% rework rates."
    }
  ],
  checklists: [
    {
      category: "1. Datasheet Validation",
      items: [
        "Original manufacturer datasheet identified and archived (PDF).",
        "Package outline drawing reviewed and critical dimensions extracted.",
        "Min/Max values used for IPC calculation (not nominal).",
        "Manufacturer recommended land pattern reviewed and density identified.",
        "Correct part variant confirmed against package dimensions."
      ]
    },
    {
      category: "2. Pad Dimensions",
      items: [
        "IPC-7351B calculation worksheet completed for all variables.",
        "Pad length, width, and gap verified against IPC output (±0.01mm).",
        "Exposed pads (QFN/BTC) sized per datasheet; thermal vias per IPC-7093A.",
        "Solder mask opening verified (NSMD/SMD) per pitch requirements.",
        "Paste mask aperture ratio ≥ 0.66; aspect ratio ≥ 1.5 per IPC-7525B."
      ]
    },
    {
      category: "3. IPC Compliance",
      items: [
        "Density level (A/B/C) confirmed to match project assembly spec.",
        "Courtyard boundary drawn at correct clearance (0.25mm (9.8 mil) default).",
        "Pad-to-pad clearance meets IPC-2221A minimums for voltage class.",
        "Through-hole annular ring meets IPC-2221A Table 9-2 (Class 2/3).",
        "Any deviation from IPC-7351B documented with justification."
      ]
    },
    {
      category: "4. Layer Content Verification",
      items: [
        "Silkscreen: Body outline present; clearance ≥ 0.10mm (3.9 mil) from pads.",
        "Assembly: Exact component body outline at datasheet dimensions.",
        "Courtyard: Closed rectangle encompassing all pads and body.",
        "RefDes present on silkscreen; height ≥ 0.8mm (31.5 mil); inside courtyard.",
        "Verification: No geometry exists on incorrect layers."
      ]
    },
    {
      category: "5. Pin-1 and Polarity",
      items: [
        "Pin 1 identified on silkscreen (dot, chamfer, or triangle).",
        "Pin 1 marker position matches datasheet package orientation.",
        "Polarity markings present for diodes and electrolytic capacitors.",
        "Pin numbering in tool matches datasheet pin-by-pin."
      ]
    },
    {
      category: "6. 3D Model",
      items: [
        "3D model (STEP) sourced from manufacturer or IPC library.",
        "3D model body aligned to assembly outline exactly (no offset).",
        "3D model Pin 1 coincides with footprint Pin 1 pad.",
        "3D model overall height verified against datasheet max height."
      ]
    },
    {
      category: "7. DRC / ERC",
      items: [
        "Footprint-level DRC run in EDA tool; zero violations.",
        "Courtyard overlap check: footprint courtyard is non-intersecting.",
        "Silkscreen-to-pad clearance DRC passed.",
        "Pad numbering continuity verified (no gaps or duplicates)."
      ]
    },
    {
      category: "8. Naming and Documentation",
      items: [
        "Name follows convention: [PACKAGE]_[STANDARD]_[DENSITY].",
        "All metadata fields (datasheet, standard, version, etc.) populated.",
        "Footprint version incremented if modifying existing part.",
        "IPC calculation worksheet archived and linked to library record.",
        "Engineering sign-off recorded before library release."
      ]
    }
  ]
};
