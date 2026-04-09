import { Cpu, Layers, Merge, Zap, MemoryStick, ShieldAlert, Factory, Activity, Terminal, ShieldCheck, FileSpreadsheet, Thermometer } from 'lucide-react';

export const modulesData = [
  { 
    id: "footprint",  
    icon: Cpu,      
    title: "Footprint Creation",        
    desc: "Master IPC-7351 standards and land patterns.",
    content: {
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
          heading: "Interactive IPC-7351B Calculator",
          content: "Use this real-time tool to calculate pad dimensions (Z, G, X) based on datasheet lead/body specifications and target density level.",
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
          codeBlock: "FOOTPRINT_NAME:    [PACKAGE]_[STANDARD]_[DENSITY]\nCREATION_DATE:     YYYY-MM-DD\nDATASHEET_REF:     Manufacturer_PN_Datasheet_RevX.pdf\nIPC_STANDARD:      IPC-7351B, Density Level B\nFOOTPRINT_VERSION: 1.0.0\nREVIEW_STATUS:     APPROVED / PENDING\nREVIEWER_ID:       Rev_002"
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
            "Add → Line on Package_Geometry/Assembly_Top for assembly.",
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
    }
  },
  { 
    id: "stackup",    
    icon: Layers,     
    title: "Stackup Design",            
    desc: "Understand materials, prepreg, and cores.",
    content: {
      intro: "A PCB stackup is the foundation of high-speed digital design, acting as the 'floors' in a high-performance building. Following the Single Source of Truth (SSOT) methodology ensures parity between simulation, layout, and fabrication, preventing costly impedance mismatches and fabrication failures through centralized material definitions.",
      sections: [
        {
          heading: "SSOT Stackup Workflow",
          content: "In a professional engineering environment, a single master stackup definition (the SSOT) drives every downstream process to prevent errors and unauthorized material substitutions at the fabrication house.",
          flow: [
            { step: "01", title: "Define", desc: "Master SSOT definition (Materials, Dk, Df, Cu Weight, Thickness)" },
            { step: "02", title: "Import", desc: "EDA tool loads SSOT — trace/via rules are auto-applied" },
            { step: "03", title: "Simulate", desc: "SI/PI tools load SSOT Dk/Df — simulation finally matches reality" },
            { step: "04", title: "Fabricate", desc: "Fabrication house quotes from SSOT — no interpretation, no substitutions" }
          ]
        },
        {
          heading: "Material Science: The Laminate",
          content: "Your material selection locks in the dielectric constant (Dk) and dissipation factor (Df). High-speed designs require ultra-low loss (low Df) materials to maintain signal integrity at frequencies >3 GHz.",
          filletGrid: [
            {
              title: "Dk (Dielectric Constant)",
              color: "blue",
              list: [
                { label: "Definition", text: "Relative permittivity; slows EM waves compared to vacuum." },
                { label: "Formula", text: "v = c / √Dk. (Dk=4 ≈ 50% speed of light)." },
                { label: "Glass Weave", text: "Glass density (1080 vs 7628) directly alters local Dk values." }
              ]
            },
            {
              title: "Df (Dissipation Factor)",
              color: "orange",
              list: [
                { label: "Definition", text: "Loss tangent; energy absorbed by the board as heat." },
                { label: "FR4 vs Megtron 6", text: "FR4 (0.02) vs Megtron 6 (0.004) — 5x loss difference." },
                { label: "Impact", text: "Critical for long traces and high-speed SerDes >10Gbps." }
              ]
            },
            {
              title: "Tg (Glass Transition)",
              color: "green",
              list: [
                { label: "Definition", text: "The temperature where the board softens into a 'rubber' state." },
                { label: "Requirement", text: "Lead-free reflow (260°C) requires High-Tg (>170°C) FR4." },
                { label: "Standard", text: "High-Tg materials prevent via barrel cracking during reflow." }
              ]
            }
          ]
        },
        {
          heading: "Laminate Benchmarks (Thermal & Dielectric)",
          content: "Laminate selection must account for both electrical performance (Dk/Df) and thermal survivability (Tg/Td/CTE). High-speed materials often sacrifice mechanical robustness for lower loss tangent.",
          table: {
            headers: ["Material Class", "Example Product", "Dk (@10GHz)", "Df (@10GHz)", "Tg (°C)", "Td (°C)", "CTE-Z (ppm)"],
            rows: [
              ["Standard FR4", "Isola 370HR", "4.17", "0.0160", "180", "340", "45"],
              { type: 'highlight', data: ["Low-Loss (Speed)", "Panasonic Megtron 6", "3.10", "0.0020", "185", "410", "45"] },
              ["Ultra-Low Loss (RF)", "Rogers RO4350B", "3.66", "0.0031", ">280", "390", "32"],
              ["High-Speed/High-Tg", "TUC TU-883", "3.80", "0.0080", "200", "400", "35"]
            ]
          },
          alerts: [
            { type: 'info', text: "Tg (Glass Transition) is where the board softens. Td (Decomposition) is the 'point of no return' where it loses 5% mass. CTE-Z determines via reliability." }
          ]
        },
        {
          heading: "Advanced Material Science — Laminate Database",
          content: "Searchable, IPC-4101C referenced material database covering critical high-frequency parameters. Click column headers to sort by Df, Tg, Z-CTE, or Thermal Conductivity. Hover acronym headers for plain-English definitions.",
          type: 'laminate-table'
        },
        {
          heading: "Interactive Layer Stackup Generator",
          content: "Toggle between 4, 6, 8, and 12-layer configurations to explore symmetric construction strategies. Visualizes solder mask, copper layers, prepreg vs. core, and drill span overlays in a real cross-section format.",
          type: 'visualizer'
        },
        {
          heading: "Standard 8-Layer PCB Construction",
          content: "A standard 1.6mm (62 mil) 8-layer board requires precise material thickness control to achieve target impedances while maintaining mechanical symmetry. Below is a representative 1.6mm build-up using alternating Core and Prepreg construction.",
          table: {
            headers: ["Layer", "Function", "Material Type", "Thickness (mil)", "Thickness (mm)", "Copper (oz)"],
            rows: [
              ["L1", "Signal (Microstrip)", "Top Solder Mask + Foil", "1.4 mil", "0.035 mm", "0.5 oz (p)"],
              ["DI-1", "Prepreg", "1080 / 2116 Glass Style", "4.0 mil", "0.100 mm", "-"],
              ["L2", "Ground Plane", "Core (Reference)", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-2", "Core", "Dielectric isolation", "8.0 mil", "0.200 mm", "-"],
              ["L3", "Signal (Stripline)", "Internal Signal", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-3", "Prepreg", "1080 / 2116 Glass Style", "4.0 mil", "0.100 mm", "-"],
              ["L4", "Power Plane", "Core (Distribution)", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-4", "Core", "Mid-Plane Isolation", "8.0 mil", "0.200 mm", "-"],
              ["L5", "Ground Plane", "Core (Reference)", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-5", "Prepreg", "1080 / 2116 Glass Style", "4.0 mil", "0.100 mm", "-"],
              ["L6", "Signal (Stripline)", "Internal Signal", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-6", "Core", "Dielectric isolation", "8.0 mil", "0.200 mm", "-"],
              ["L7", "Ground Plane", "Core (Reference)", "1.4 mil", "0.035 mm", "1.0 oz"],
              ["DI-7", "Prepreg", "1080 / 2116 Glass Style", "4.0 mil", "0.100 mm", "-"],
              ["L8", "Signal (Microstrip)", "Bottom Solder Mask + Foil", "1.4 mil", "0.035 mm", "0.5 oz (p)"]
            ]
          },
          alerts: [
            { type: 'info', text: "The above buildup yields exactly 62.8 mil (1.59 mm), falling within the standard ±10% fabrication tolerance. Copper weights on L1/L8 include plating (p)." }
          ]
        },
        {
          heading: "Routing Topologies & Impedance Control",
          content: "The propagation speed and characteristic impedance (Z₀) of a signal change depending on if it is on the surface (Microstrip) or embedded between planes (Stripline).",
          twoColumnGrid: [
            {
              badge: "Microstrip",
              badgeClass: "tool-badge-altium",
              title: "Surface Layers",
              items: [
                "Trace sits on outer surface; field partly in air",
                "εr,eff < εr (Faster propagation speed)",
                "Easier to debug but prone to EMI emissions",
                "Differential Microstrip requires spacing (S) control"
              ]
            },
            {
              badge: "Stripline",
              badgeClass: "tool-badge-cadence",
              title: "Inner Layers",
              items: [
                "Trace embedded between two ground planes",
                "εr,eff = εr (Full material Dk speed path)",
                "Best EMI shielding and return path isolation",
                "Symmetric Stripline uses balanced heights (H1=H2)"
              ]
            }
          ]
        },
        {
          heading: "Universal Impedance Solver",
          content: "Calculate characteristic impedance (Z₀) for Single-Ended and Differential configurations across Microstrip and Stripline topologies using professional IPC-2141A models.",
          type: 'calculator'
        },
        {
          heading: "Core vs. Foil Construction",
          content: "Choosing between Foil Build (industry standard) or Core Build determines the lamination sequence and final board rigidity.",
          table: {
            headers: ["Construction Type", "Process", "Primary Benefit", "Standard Application"],
            rows: [
              ["Foil Build", "Copper foil + Prepreg on outer cores", "Cheaper; thinner dielectric control", "Standard 4-10 layer commercial"],
              ["Core Build", "Laminating double-sided cores together", "Increased rigidity; symmetric stability", "Backplanes, high-reliability aerospace"]
            ]
          }
        },
        {
          heading: "Return Currents: High-Frequency Physics",
          content: "Every signal needs a return path. At high frequencies (>1 MHz), current follows the path of least Inductance, not least Resistance.",
          list: [
            { label: "High-Frequency Physics", text: "Return current concentrates directly beneath the signal trace to minimize the loop area." },
            { label: "Inductance Rule", text: "Minimizing loop area between the signal and plane reduces EMI and crosstalk." },
            { label: "Discontinuity Risk", text: "Crossing a gap (split) in a reference plane forces a long return path, causing massive EMI radiation." }
          ],
          alerts: [
            { type: 'danger', text: "Never route a high-speed signal across a split in its reference plane. Use stitching capacitors if a cross-over is unavoidable." }
          ]
        },
        {
          heading: "Copper Balancing & Thieving (DFM)",
          content: "Resin starvation occurs during the lamination press cycle if one side of the board has significantly higher copper density than the other, leading to board warpage (bow and twist).",
          list: [
            { label: "The Resin Starvation Risk", text: "Prepreg resin flows toward empty copper areas. If one layer is 'starved,' the board becomes unstable." },
            { label: "Copper Thieving", text: "Adding 'dead' copper pads or pours in open board areas to equalize the copper density and resin flow." },
            { label: "Lamination Balance", text: "Maintain a symmetric copper density (±10%) about the board's vertical center plane." }
          ]
        },
        {
          heading: "Real-Time DFM Rule Checker",
          content: "Enter your board parameters to validate against IPC-2221B manufacturing limits. Three live rule engines check Aspect Ratio, Copper Weight vs. Trace Width, and Copper Density Balance simultaneously.",
          type: 'dfm-checker'
        },
        {
          heading: "Via Technologies: Aspect Ratio & DFM",
          content: "Vias transition signals between layers. Each type carries different parasitic inductance and fabrication costs. Always calculate your Aspect Ratio to ensure plating reliability.",
          type: 'aspect-ratio-calc'
        },
        {
          heading: "High-Speed Signal Integrity: Fiber Weave Skew",
          content: "Glass fiber bundles in PCB laminates have a higher dielectric constant (Dk ~6.0) than the surrounding resin (~3.2). This periodic Dk variation causes differential pair traces to travel at different speeds — a phenomenon called fiber weave skew.",
          type: 'fiber-weave'
        },
        {
          heading: "SSOT Intelligence & Export Formats",
          content: "Standard Gerber RS-274X is a 'dumb' format that only contains geometry. For professional stackup handovers, use intelligent formats that carry the SSOT definition.",
          table: {
            headers: ["Format", "Intelligence", "Content", "Preferred Usage"],
            rows: [
              ["IPC-2581", "Full SSOT", "Stackup, materials, Dk/Df, netlist, BOM", "Modern 1st Choice; Vendor Preferred"],
              ["ODB++", "High-Level", "Layer stackup, component footprints, netlist", "Industry Standard; Tool agnostic"],
              ["Gerber RS-274X", "Zero", "Only lines and polygons (Apertures)", "Legacy; Requires manual FAB drawing"]
            ]
          },
          alerts: [
            { type: 'info', text: "Exporting in IPC-2581 allows the fabricator to verify impedance targets against actual material Dk in their software automatically." }
          ]
        },
        {
          heading: "Stackup Export Simulation (SSOT Download)",
          content: "Simulate a professional stackup handover. Select your target format to see what data is included. Download a mock IPC-2581 or ODB++ JSON to understand the SSOT data structure expected by modern fabrication houses.",
          type: 'stackup-export'
        },
        {
          heading: "Current Carrying Capacity (IPC-2152)",
          content: "Calculate the required trace width for a target current and allowable temperature rise based on the modern IPC-2152 standards. Internal traces (stripline) and external traces (microstrip) require different widths due to thermal dissipation variables.",
          type: 'ipc2152-calc'
        },
        {
          heading: "Copper Weight Reference (IPC-4562A)",
          content: "Copper weight (oz/ft²) is the industry-standard unit defining copper foil thickness. This table provides the definitive SSOT mapping between weight designations, physical thickness, and nominal current capacity for standard trace geometries.",
          table: {
            headers: ["Copper Weight", "Thickness (µm)", "Thickness (mil)", "Approx. Capacity (10mil trace, +10°C)", "Typical Application"],
            rows: [
              ["0.25 oz (Quarter)", "8.75", "0.34", "~0.5 A", "RF shields, impedance tuning"],
              ["0.5 oz (Half)", "17.5", "0.69", "~1.0 A", "High-density signal layers, HDI"],
              { type: 'highlight', data: ["1.0 oz (Standard)", "35.0", "1.37", "~1.5 A", "Default signal and plane layers"] },
              ["2.0 oz (Heavy)", "70.0", "2.74", "~2.5 A", "Power distribution, bus bars"],
              ["3.0 oz (Extreme)", "105.0", "4.11", "~3.5 A", "High-current switching, EV power"],
              ["4.0 oz (Exotic)", "140.0", "5.51", "~4.5 A", "Defense, extreme power busbars"]
            ]
          },
          alerts: [
            { type: 'info', text: "Current capacity values are approximate for a 10 mil wide external trace with 10°C rise in still air. Use the IPC-2152 calculator above for precise results. Doubling copper weight increases capacity by ~1.6× (not 2×) due to non-linear thermal spreading." }
          ]
        },
        {
          heading: "IPC Standards Compliance",
          content: "Specify laminates by IPC slash-sheet designators in your SSOT — never by brand name alone — to prevent unauthorized substitutions.",
          table: {
            headers: ["Standard", "Title", "Masterclass Application"],
            rows: [
              ["IPC-2221B", "Generic PWB Design", "Electrical clearances, via aspect ratios"],
              ["IPC-2222", "Sectional Standard for Rigid", "Rigid organic board requirements"],
              ["IPC-4101C", "Rigid Base Materials", "/21 (Std FR4), /24 (High-Tg), /99 (Halogen-Free)"],
              ["IPC-4562A", "Metal Foil Standard", "ED, RA, and VLP copper foil specifications"],
              ["IPC-6012E", "Qualification & Perf.", "Acceptance criteria (Bow/Twist <0.75%)"],
              ["IPC-1601A", "Handling & Storage", "Mandatory bake-out (125°C) to prevent delamination"]
            ]
          }
        },
        {
          heading: "Electrical Clearance & Creepage (IPC-2221B)",
          content: "Minimum conductor spacing is determined by the working voltage difference between conductors and the operating environment. IPC-2221B Table 6-1 defines clearance (through air) while creepage (along surfaces) is governed by pollution degree per IEC 62368-1.",
          table: {
            headers: ["Voltage (DC/AC Peak)", "B1 — Internal (mil)", "B2 — Ext. Uncoated (mil)", "B3 — Coated (mil)", "B4 — >3050m Alt. (mil)"],
            rows: [
              ["0–15 V", "2.0", "4.0", "0.8", "4.0"],
              ["16–30 V", "2.0", "4.0", "0.8", "4.0"],
              ["31–50 V", "4.0", "8.0", "1.5", "8.0"],
              ["51–100 V", "4.0", "8.0", "2.0", "8.0"],
              { type: 'highlight', data: ["101–150 V", "8.0", "16.0", "4.0", "16.0"] },
              ["151–170 V", "8.0", "20.0", "4.0", "20.0"],
              ["171–250 V", "8.0", "30.0", "4.0", "30.0"],
              ["251–500 V", "16.0", "60.0", "8.0", "60.0"]
            ]
          },
          alerts: [
            { type: 'warning', text: "These values are for IPC-2221B. Safety-critical products (mains, medical, automotive) MUST also comply with IEC 62368-1/60950 requirements." },
            { type: 'info', text: "B1 = Internal. B2 = External (std). B3 = Coated. B4 = High-altitude derating (>3050m)." }
          ]
        },
        {
          heading: "Creepage vs. Clearance — Design Decision",
          content: "Clearance and creepage address different failure modes: Air breakdown vs. Surface tracking.",
          filletGrid: [
            {
              title: "Clearance (Air)",
              color: "blue",
              list: [
                { label: "Definition", text: "Shortest distance through air." },
                { label: "Failure", text: "Arc discharge / flashover." },
                { label: "Standard", text: "IPC-2221B Table 6-1." }
              ]
            },
            {
              title: "Creepage (Surface)",
              color: "orange",
              list: [
                { label: "Definition", text: "Shortest distance along surface." },
                { label: "Failure", text: "Surface tracking." },
                { label: "Standard", text: "IEC 62368-1." }
              ]
            }
          ]
        }
      ],
      checklists: [
        {
          category: "1. Material Selection",
          items: [
            "Laminate specified by IPC-4101 slash-sheet designer.",
            "Thermal properties (Tg/Td) meet assembly heat profile.",
            "VLP copper grade specified for high-speed differential pairs.",
            "CTE-Z value confirmed to prevent via fatigue.",
            "Dk/Df values verified at target operational frequency."
          ]
        },
        {
          category: "2. Mechanical Symmetry",
          items: [
            "Stackup has an EVEN number of layers (required for balance).",
            "Material types mirrored exactly about the board midplane.",
            "Copper density balanced on opposite layers (Copper Thieving).",
            "Overall thickness tolerance meets IPC-6012 Class 2/3 (<10%).",
            "Bow and Twist tolerance documented on fabrication drawing."
          ]
        },
        {
          category: "3. Electrical Design",
          items: [
            "Impedance targets calculated with Single-Ended and Diff models.",
            "Symmetric Stripline heights (H1=H2) maintained for consistency.",
            "Reference planes (GND/PWR) are adjacent to every signal layer.",
            "Return paths cleared: No signals routing over plane splits.",
            "Trace spacing (S) defined to hit differential Zdiff goals."
          ]
        },
        {
          category: "4. DFM & Fabrication Export",
          items: [
            "Aspect Ratio (Thickness/Drill) verified to be ≤ 10:1.",
            "Layer stackup table included in the SSOT Fab Drawing.",
            "Microvia stack/stagger rules follow IPC-2226.",
            "Export format selected: IPC-2581 or ODB++ for stackup parity.",
            "Fabricator confirmation for High-Tg lamination sequence."
          ]
        }
      ]
    }
  },
  { 
    id: "diff_pair",  
    icon: Merge,      
    title: "Differential Pair Routing", 
    desc: "Signal integrity engineering for high-speed interfaces.",
    content: {
      intro: "As clock rates moved into the multi-gigahertz regime, single-ended signaling hit fundamental physical limits: susceptibility to ground-referenced noise, radiated emissions, and impedance discontinuities. Differential signaling overcomes these constraints by encoding data as the voltage difference between two complementary conductors — making it the backbone of USB, PCIe, HDMI, DisplayPort, LVDS, and every modern high-speed interface standard.",
      sections: [
        {
          heading: "Why Differential Signaling Dominates High-Speed",
          content: "In a single-ended topology, one conductor carries a signal measured relative to a shared system ground — any noise on that conductor corrupts the signal directly. In a differential topology, data is encoded as Vdiff = V(D+) − V(D−). The receiver responds only to the difference, not to the absolute voltage of either conductor.",
          filletGrid: [
            {
              title: "Noise Immunity (CMRR)",
              color: "blue",
              list: [
                { label: "Mechanism", text: "Noise appearing identically on D+ and D− cancels at the receiver. This is Common-Mode Rejection." },
                { label: "CMRR Formula", text: "CMRR = 20·log(Adm/Acm). A well-matched pair achieves ≥40 dB, attenuating CM noise by 100× or more." },
                { label: "Key Benefit", text: "Immune to ground potential differences between transmitter and receiver on different boards." }
              ]
            },
            {
              title: "Reduced EMI Radiation",
              color: "cyan",
              list: [
                { label: "Mechanism", text: "EM fields from D+ and D− are equal and opposite — they partially cancel in the far field." },
                { label: "Result", text: "Lower radiated emissions compared to single-ended signaling at equivalent data rates." },
                { label: "Standard", text: "Critical for CISPR 25 (automotive) and FCC Part 15 (commercial) EMC compliance." }
              ]
            },
            {
              title: "Higher Data Rates",
              color: "green",
              list: [
                { label: "Mechanism", text: "Smaller voltage swings (e.g., 400 mV differential vs 3.3 V single-ended) reduce trace capacitance charge energy." },
                { label: "Result", text: "Faster edge rates, higher bandwidth, and better noise margins at comparable voltages." },
                { label: "Example", text: "PCIe Gen 5 operates at 32 GT/s per lane — only achievable with differential signaling." }
              ]
            }
          ]
        },
        {
          heading: "Geometry & Physics — Critical Trace Parameters",
          content: "The differential impedance, capacitance, and coupling coefficient are entirely determined by the physical geometry. There is no tuning after fabrication — the impedance is locked in by the stackup.",
          filletGrid: [
            {
              title: "W — Trace Width",
              color: "blue",
              list: [
                { label: "Unit", text: "mil or mm" },
                { label: "Effect", text: "Increasing W reduces characteristic impedance and increases current-carrying capacity." },
                { label: "Design rule", text: "Both D+ and D− must be identical width — any mismatch creates mode conversion." }
              ]
            },
            {
              title: "S — Intra-pair Spacing",
              color: "orange",
              list: [
                { label: "Unit", text: "mil or mm (edge-to-edge)" },
                { label: "Effect", text: "Reducing S tightens EM coupling, lowers Zdiff, and improves CMRR. Minimum S is limited by fabrication." },
                { label: "Risk", text: "Smaller S aggravates the fiber weave effect — both traces must see the same Dk." }
              ]
            },
            {
              title: "H — Dielectric Height",
              color: "cyan",
              list: [
                { label: "Unit", text: "mil or mm (trace to nearest reference plane)" },
                { label: "Effect", text: "Strongest influence on impedance. Halving H approximately halves the impedance." },
                { label: "Design rule", text: "Keep H consistent along the entire route. Never route over a plane void." }
              ]
            }
          ],
          formula: {
            title: "Differential Impedance Relationship",
            equations: [
              "Zdiff ≠ 2 × Z0   // Coupling reduces effective impedance",
              "Microstrip: Zdiff = 2·Z0·(1 − 0.48·exp(−0.96·S/H))",
              "Stripline:  Zdiff = 2·Z0·(1 − 0.347·exp(−2.9·S/B))  // B = 2H + T",
              "Z0 (Microstrip) = [60/√(0.475εr + 0.67)] · ln[5.98H / (0.8W + T)]",
              "Z0 (Stripline)  = [60/√εr] · ln[1.9B / (0.8W + T)]"
            ],
            variables: [
              { name: "Zdiff", desc: "Differential impedance (Ω)", tag: "OUTPUT" },
              { name: "Z0", desc: "Single-ended characteristic impedance (Ω)", tag: "CALC" },
              { name: "W", desc: "Trace width (mm)", tag: "INPUT" },
              { name: "S", desc: "Intra-pair edge-to-edge spacing (mm)", tag: "INPUT" },
              { name: "H", desc: "Dielectric height to reference plane (mm)", tag: "INPUT" },
              { name: "T", desc: "Copper thickness (mm)", tag: "INPUT" },
              { name: "εr", desc: "Dielectric constant (Dk) of laminate", tag: "INPUT" },
              { name: "B", desc: "Total dielectric thickness between reference planes (stripline)", tag: "CALC" }
            ]
          }
        },
        {
          heading: "Interactive Zdiff Calculator",
          content: "Calculate differential impedance for Microstrip and Stripline topologies using the IPC-2141A Wheeler/Hammerstad approximation — the same model used in professional EDA tools. Validate all results with a 2D field solver before tape-out.",
          type: "zdiff-calculator"
        },
        {
          heading: "Golden Routing Rules — 8 Non-Negotiable Constraints",
          content: "These rules are the non-negotiable constraints for any differential pair layout. Violations directly degrade signal integrity at the receiver and increase EMI. Treat these as Design Rule Checks (DRCs), not guidelines.",
          ruleCards: [
            {
              number: "01",
              title: "Length Matching — Intra-pair",
              severity: "danger",
              body: "D+ and D− must be length-matched within the tolerance specified by the interface standard. Use meandering within the pair, never global routing adjustment. Budgets: USB 2.0 <200 mil, USB 3.x / PCIe Gen 4 <5 mil, DDR4 <25 mil per byte lane."
            },
            {
              number: "02",
              title: "Phase Skew Control",
              severity: "danger",
              body: "Phase skew Δt = ΔL · tpd. Skew converts differential signal to common-mode, degrading CMRR. Meanders must be placed within the coupled region of the pair, using matched-length serpentine tuning — never at the end of the route."
            },
            {
              number: "03",
              title: "Maintain Constant Spacing (Coupling)",
              severity: "danger",
              body: "Route D+ and D− at the target intra-pair spacing S for the entire route length. Spacing changes alter Zdiff locally, creating impedance discontinuities that cause reflections. Never fan out the pair before a connector and then re-converge — this is an impedance discontinuity cascade."
            },
            {
              number: "04",
              title: "Return Path Continuity",
              severity: "danger",
              body: "The high-frequency return current follows directly beneath the signal trace on the nearest reference plane. Any gap, slot, or split forces the return current to detour, creating a loop antenna, extra inductance, and a localized impedance discontinuity. Never route a differential pair across a split plane or over a plane void."
            },
            {
              number: "05",
              title: "3W Rule — Inter-pair Isolation",
              severity: "warning",
              body: "Maintain edge-to-edge spacing of at least 3× the trace width (3W) between adjacent differential pairs. For high-speed interfaces above 5 Gbps, increase to 5W–7W. This keeps mutual coupling below −20 dB between pairs. The 3W applies to the outer edge of the pair, not each individual trace."
            },
            {
              number: "06",
              title: "20H Rule — Plane Edge Keepout",
              severity: "warning",
              body: "Keep signal traces at least 20× the dielectric height (20H) away from the edge of any reference plane. At the plane boundary, fringing fields cause impedance increases and radiated emissions. Critical for CISPR 25 and FCC Part 15 EMC compliance."
            },
            {
              number: "07",
              title: "Via Placement Symmetry",
              severity: "warning",
              body: "When a differential pair must change layers, use two vias — one for D+, one for D− — placed symmetrically, equidistant from the pair centerline. Asymmetric via placement introduces differential-to-common-mode conversion. Add GND stitching vias adjacent to maintain the return path."
            },
            {
              number: "08",
              title: "Minimize Layer Transitions",
              severity: "info",
              body: "Every layer transition (via) is an impedance discontinuity and a stub. Minimize layer changes for high-speed differential pairs. When unavoidable, place GND stitching vias within 2× the via diameter. For PCIe Gen 3+, back-drilling of via stubs is typically required."
            }
          ]
        },
        {
          heading: "Length Matching — Intra-pair vs. Inter-pair",
          content: "Two distinct length-matching requirements are frequently confused. Getting this wrong is the single most common cause of high-speed routing failures.",
          table: {
            headers: ["Matching Type", "Scope", "Tolerance (Typical)", "Consequence of Violation"],
            rows: [
              { type: "highlight", data: ["Intra-pair (D+ vs D−)", "Within one pair", "USB 3.x / PCIe Gen 4: <5 mil", "Direct degradation of CMRR and eye diagram"] },
              ["Inter-pair (Lane-to-Lane)", "Across multiple pairs (bus)", "PCIe: 20 ns de-skew budget (board: <50 mil typical)", "Lane-to-lane skew — recoverable by receiver CDR"],
              ["Example (FR-4)", "10 mil mismatch @ εeff=3.0", "≈ 1.47 ps skew", "At USB 3.2 Gen 2 (10 Gbps, UI=100 ps): exceeds 1% UI budget"]
            ]
          },
          alerts: [
            { type: "warning", text: "Intra-pair mismatch is always the tighter constraint. Do not confuse it with inter-pair (lane-to-lane) matching — they have completely different tolerance budgets." }
          ]
        },
        {
          heading: "Serpentine Meander Constraints",
          content: "When adding serpentine meanders for length matching within a pair, these constraints must be respected to avoid creating additional signal integrity problems:",
          list: [
            { label: "Meander amplitude ≤ 3H", text: "Keep meander peak-to-peak amplitude to less than 3× the dielectric height. Larger amplitudes allow meander return segments to couple to each other, creating local impedance perturbations." },
            { label: "Meander within coupled region", text: "Place meanders while keeping D+ and D− at their standard spacing S. Do not open up the pair spacing to make room for the meander." },
            { label: "Gap between meander segments ≥ 3W", text: "Apply the 3W rule to meander-to-meander spacing within the same trace to prevent intra-trace coupling and crosstalk." },
            { label: "Avoid meanders near components", text: "Do not place meanders within 50 mil of component pads or connector pins, as local impedance discontinuities compound." }
          ],
          alerts: [
            { type: "info", text: "Meanders placed at the end of a route — rather than at the source of the mismatch — do not correctly compensate for skew. Always meander nearest to the point of inequality (e.g., inside a tight-radius corner where the inner trace is shorter)." }
          ]
        },
        {
          heading: "Advanced High-Speed Topics",
          content: "At data rates above 5 Gbps, second-order effects become first-order problems. These topics require attention for PCIe Gen 3+ and any SerDes channel above 10 Gbps.",
          type: "fiber-weave",
          twoColumnGrid: [
            {
              badge: "Via Stubs & Backdrilling",
              badgeClass: "tool-badge-altium",
              title: "Stub Resonance Mitigation",
              items: [
                "Unused via barrel below the connection point = via stub",
                "Stub resonates at: f_res = c / (4 · L_stub · √εr)",
                "40 mil stub in FR-4 (εr=4.2) creates null at ~36 GHz — but harmonics affect PCIe Gen 3+ (4 GHz fundamental)",
                "Backdrilling: drill out stub from opposite side, leaving ≤5 mil residual stub",
                "Via-in-pad (VIP): eliminates stub entirely for BGA/QFN fanout — requires filled & planarized process"
              ]
            },
            {
              badge: "Fiber Weave Effect (FWE)",
              badgeClass: "tool-badge-cadence",
              title: "Deterministic Skew Mitigation",
              items: [
                "Glass fiber (εr≈6.0) vs epoxy resin (εr≈3.3) creates periodic Dk variation",
                "D+ over glass, D− over resin → different propagation velocities → systematic skew",
                "Can produce 5–20 ps/inch skew — significant at 10 Gbps (UI=100 ps)",
                "Mitigation: Route at 45° to the weave pattern (board X-axis alignment)",
                "Specify spread-weave/flat-weave laminates (Megtron 6, Isola Atera) for >10 Gbps"
              ]
            }
          ],
          alerts: [
            { type: "danger", text: "Never route a differential pair across a split plane or power island boundary. The return current cannot follow the trace — the resulting loop area radiates EMI directly proportional to loop area × frequency²." }
          ]
        },
        {
          heading: "Interface Impedance Reference Table",
          content: "Electrical and layout specifications for the most widely used high-speed differential pair interfaces. All impedance values are as seen at the PCB trace. Consult the referenced specification documents for authoritative requirements.",
          type: "diff-reference-table"
        },
        {
          heading: "Glossary of Key Terms",
          content: "Engineering-accurate definitions for signal integrity terminology used throughout this module.",
          table: {
            headers: ["Term", "Definition", "Unit / Typical Value"],
            rows: [
              ["Zdiff", "Differential impedance — voltage difference between D+ and D− divided by the differential mode current", "Ω (typically 85–100 Ω)"],
              ["Z0", "Single-ended characteristic impedance of one conductor relative to the reference plane", "Ω (typically 40–55 Ω)"],
              ["CMRR", "Common-Mode Rejection Ratio — ratio of differential gain to common-mode gain: 20·log(Adm/Acm)", "dB (≥40 dB for well-matched pairs)"],
              ["εr (Dk)", "Relative permittivity (dielectric constant) of the PCB laminate — frequency-dependent", "Dimensionless (FR-4: 3.8–4.5 at 1 GHz)"],
              ["Df (tan δ)", "Dissipation factor / loss tangent — energy absorbed as heat per cycle in the dielectric", "Dimensionless (FR-4: ~0.02, Megtron 6: ~0.002)"],
              ["tpd", "Propagation delay — time per unit length for the signal to travel the trace", "ps/in (FR-4 microstrip: ~140 ps/in)"],
              ["Intra-pair skew", "Time delay difference between D+ and D− within the same differential pair", "ps (budget: <5 mil mismatch for USB 3.x/PCIe Gen 4)"],
              ["Inter-pair skew", "Time delay difference between multiple pairs in a bus: clock-to-data or lane-to-lane", "ps (looser budget than intra-pair)"],
              ["Fiber Weave Effect", "Systematic skew caused by periodic Dk variation between glass fiber bundles and epoxy resin in the laminate", "ps/inch (5–20 ps/in on standard FR-4)"],
              ["Via stub", "Unused portion of a via barrel below the signal connection point — acts as a shorted transmission line stub creating a resonant null", "Resonance: f = c/(4·L·√εr)"],
              ["Back-drilling", "Mechanical process to remove via stubs by drilling from the opposite board side, leaving ≤5 mil residual stub", "Required for PCIe Gen 3+ on thick boards"]
            ]
          }
        }
      ],
      checklists: [
        {
          category: "1. Geometry Setup",
          items: [
            "Zdiff target confirmed for the interface standard (USB: 90Ω, PCIe/Ethernet: 100Ω, LVDS: 100Ω, HDMI: 100Ω).",
            "Trace width (W) and spacing (S) calculated via IPC-2141A formula or field solver.",
            "Dielectric height (H) locked in SSOT stackup — not modified per-signal.",
            "Intra-pair spacing (S) maintained as a fixed DRC rule in the EDA tool.",
            "Copper thickness (T) confirmed for impedance calculation (typically 0.5 oz = 0.017 mm or 1 oz = 0.035 mm)."
          ]
        },
        {
          category: "2. Routing Execution",
          items: [
            "D+ and D− routed as a coupled pair — no section where they are un-coupled.",
            "Intra-pair length mismatch verified to be within the interface budget (e.g., <5 mil for PCIe Gen 4).",
            "Serpentine meanders placed at the source of mismatch (inside corners), not at route endpoints.",
            "Meander amplitude ≤ 3H; meander-to-meander gap ≥ 3W.",
            "3W edge-to-edge spacing maintained between the pair and adjacent pairs or signals.",
            "20H keepout from reference plane edges observed."
          ]
        },
        {
          category: "3. Layer Transitions & Return Paths",
          items: [
            "No differential pair crosses a gap, slot, or split in the reference plane.",
            "Each via transition uses two symmetric vias (D+ and D−) equidistant from the pair centerline.",
            "GND stitching vias placed within 2× drill diameter of each signal via.",
            "Via stubs assessed: backdrilling specified for pairs with fres approaching the Nyquist frequency (PCIe Gen 3+).",
            "Number of layer transitions minimized — each transition documented with justification."
          ]
        },
        {
          category: "4. DFM & Sign-Off",
          items: [
            "Fiber weave effect risk assessed — routing angle specified (45° recommended for >5 Gbps).",
            "Low-skew laminate specified in SSOT if operating above 10 Gbps.",
            "Guard traces evaluated for frequencies <2 GHz if isolation is required.",
            "All DRCs (spacing, length match, impedance) passed in EDA tool — zero violations.",
            "Impedance result validated with 2D field solver (Polar Si9000 or equivalent) before release."
          ]
        }
      ]
    }
  },
  { 
    id: "high_speed", 
    icon: Zap,            
    title: "High-Speed Routing",        
    desc: "Complete technical guide to SI, impedance, and routing.",
    content: {
      intro: "A signal is considered high-speed not because of its clock frequency, but because its electrical wavelength — or its rise/fall time — is short enough relative to the trace length that the trace must be treated as a transmission line. This guide provides a standards-driven single-source-of-truth for high-speed digital design.",
      sections: [
        {
          heading: "What is High-Speed PCB Design?",
          content: "The standard industry threshold for high-speed design is when trace length exceeds 1/6 of the signal wavelength. Below this, lumped-circuit analysis is valid. Above it, distributed transmission line effects dominate.",
          formula: {
            title: "The Critical Length Rule",
            equations: [
              "λ = vp / f // wavelength in the medium",
              "vp = c / √εr // propagation velocity (c ≈ 3×10⁸ m/s)",
              "Lcritical = λ / 6 // minimum trace length requiring TL treatment",
              "Lcritical = (tr × vp) / 6 // rise-time-based critical length"
            ],
            variables: [
              { name: "vp", desc: "Propagation velocity", tag: "CALC" },
              { name: "f", desc: "Signal frequency", tag: "INPUT" },
              { name: "tr", desc: "Rise time", tag: "INPUT" },
              { name: "Lcritical", desc: "Critical length", tag: "OUTPUT" }
            ]
          },
          twoColumnGrid: [
            {
              badge: "DDR4 / LPDDR4",
              badgeClass: "tool-badge-altium",
              title: "High Speed",
              items: ["<200 ps rise time", "Critical length ≈ 7 mm", "Every trace is a transmission line"]
            },
            {
              badge: "Slow logic",
              badgeClass: "tool-badge-cadence",
              title: "Lumped",
              items: [">10 ns rise time", "Critical length >40 mm", "Most traces safe without TL treatment"]
            }
          ]
        },
        {
          heading: "Transmission Line Theory",
          content: "A PCB trace over a reference plane forms a distributed network of inductance (L), capacitance (C), resistance (R), and conductance (G). Matching characteristic impedance (Z₀) throughout the signal path is the single most important objective.",
          formula: {
            title: "Characteristic Impedance Z₀",
            equations: [
              "Z₀ = √(L/C) // lossless approximation",
              "Γ = (ZL − Z₀) / (ZL + Z₀) // reflection coefficient"
            ],
            variables: [
              { name: "Z₀", desc: "Characteristic impedance", tag: "PROP" },
              { name: "Γ", desc: "Reflection coefficient", tag: "CALC" },
              { name: "ZL", desc: "Load impedance", tag: "INPUT" }
            ]
          },
          alerts: [
            { type: 'info', text: "Reflections travel back to the source, causing ringing, overshoot, and setup/hold time violations. Matched load (ZL = Z₀) results in Γ = 0 (no reflection)." }
          ]
        },
        {
          heading: "Impedance Control",
          content: "Controlled impedance is the practice of designing trace geometry to achieve a target Z₀ within a specified tolerance (typically ±10%). This require tight coordination with the fabricator.",
          formula: {
            title: "Geometry Models",
            equations: [
              "Z₀(Microstrip) ≈ (87/√(εr + 1.41)) × ln(5.98H/(0.8W + T))",
              "Z₀(Stripline) ≈ (60/\\√εr) × ln(4B/(0.67π(0.8W + T)))"
            ],
            variables: [
              { name: "W", desc: "Trace width", tag: "GEOM" },
              { name: "H", desc: "Dielectric height", tag: "GEOM" },
              { name: "T", desc: "Trace thickness", tag: "GEOM" },
              { name: "B", desc: "Total dielectric thickness (stripline)", tag: "GEOM" }
            ]
          },
          table: {
            headers: ["Interface", "Z₀ Single-Ended", "Z₀ Differential", "Tolerance"],
            rows: [
              ["USB 2.0 / 3.x", "—", "90Ω", "±10%"],
              ["PCIe Gen 1–5", "—", "100Ω", "±10%"],
              ["HDMI / DP", "—", "100Ω", "±10%"],
              ["DDR4 Data", "40Ω", "—", "±10%"],
              ["RF (50Ω sys)", "50Ω", "—", "±5%"]
            ]
          },
          alerts: [
            { type: 'info', text: "Field Solvers (e.g., Polar SI9000) are required for actual production. Simple formulas do not account for trapezoidal etching or copper surface roughness." }
          ]
        },
        {
          heading: "Material Physics & Loss",
          content: "At frequencies >1 GHz, the choice of substrate material becomes a primary design decision. FR-4, while economical, exhibits excessive dielectric loss (tangent delta) and inconsistent Dk across high-speed bands.",
          table: {
            headers: ["Material Family", "Dk (@10GHz)", "Df (@10GHz)", "Best For"],
            rows: [
              ["Standard FR-4", "4.2–4.5", "0.020–0.025", "General purpose <1 Gbps"],
              ["Mid-Loss (Megtron 4)", "3.8", "0.005–0.010", "1–10 Gbps designs"],
              ["Low-Loss (Megtron 6)", "3.7", "0.002", "10–25 Gbps, PCIe Gen 4/5"],
              ["Ultra-Low Loss (Rogers)", "3.4", "0.001", "25+ Gbps, RF & 5G"]
            ]
          },
          formula: {
            title: "Skin Depth (δ)",
            equations: [
              "δ = 1 / √(π × f × μ × σ) // eddy current penetration",
              "α_skin ∝ √f // loss increases with frequency"
            ],
            variables: [
              { name: "f", desc: "Frequency", tag: "INPUT" },
              { name: "σ", desc: "Conductivity", tag: "CONST" }
            ]
          },
          alerts: [
            { type: 'warning', text: "Skin effect causes signal current to travel on the rough surface of the copper. For frequencies >5GHz, specify VLP (Very Low Profile) copper to reduce resistive loss." }
          ]
        },
        {
          heading: "Layer Stack-Up Design",
          content: "Stack-up design determines the physical environment of every trace. It must be defined before routing begins to control impedance and minimize crosstalk.",
          list: [
            { label: "Proximity", text: "Every signal layer must have an adjacent reference plane within 5-8 mils." },
            { label: "Shielding", text: "High-speed signal layers should be internal (stripline) for better shielding." },
            { label: "Symmetry", text: "Symmetric stack-up prevents bow and twist during fabrication." }
          ],
          stackVisual: [
            { layer: "L1 — Signal (Top)", spec: "Microstrip · 50Ω", color: "#D4963A", note: "Components, non-critical" },
            { layer: "L2 — Ground (GND)", spec: "Solid Copper", color: "#888780", note: "Reference for L1 & L3" },
            { layer: "L3 — Signal (HS)", spec: "Stripline · 50Ω", color: "#D4963A", note: "Critical: DDR, PCIe" },
            { layer: "L4 — Ground (GND)", spec: "Solid Copper", color: "#888780", note: "Reference for L3" },
            { layer: "L5 — Power (PWR)", spec: "Power Islands", color: "#378ADD", note: "1.8V, 3.3V, 5V planes" },
            { layer: "L6 — Ground (GND)", spec: "Solid Copper", color: "#888780", note: "Reference for L5 & L7" },
            { layer: "L7 — Signal (HS)", spec: "Stripline · 50Ω", color: "#D4963A", note: "HS perpendicular to L3" },
            { layer: "L8 — Signal (Bottom)", spec: "Microstrip · 50Ω", color: "#D4963A", note: "General routing" }
          ],
          alerts: [
            { type: 'info', text: "Route adjacent signal layers perpendicular to each other to minimize broadside coupled crosstalk." }
          ]
        },
        {
          heading: "The Fiber Weave Effect",
          content: "PCB cores are made of woven glass bundles. Because glass (Dk ≈ 6.0) and resin (Dk ≈ 3.0) have different dielectric constants, a signal's speed depends on where it sits relative to the weave, causing intra-pair skew.",
          mistakeList: [
            { mistake: "Routing parallel to the orthogonal weave pattern.", fix: "Route at a 10° angle relative to the panel edge." },
            { mistake: "Assuming uniform dielectric constant (Dk).", fix: "Use spread-glass (e.g., 1080/1067) rather than open-weave (7628)." }
          ],
          alerts: [
            { type: 'info', text: "For differential pairs >10 Gbps, zig-zag routing or rotating the entire design by 10 degrees is mandatory to ensure both D+ and D- see the same 'average' Dk." }
          ]
        },
        {
          heading: "Return Paths & Ground Planes",
          content: "At high frequencies, return current takes the path of least inductance, mirroring its path directly beneath the signal trace.",
          alerts: [
            { type: 'danger', text: "Never route a high-speed signal across a split in the reference plane. The return current loop area increases dramatically, causing EM failures." }
          ],
          twoColumnGrid: [
            {
              badge: "Correct Practice",
              badgeClass: "tool-badge-cadence",
              title: "Continuity",
              items: [
                "Signal via + adjacent GND via at transitions",
                "100nF bypass cap within 100 mils of power transitions",
                "Solid copper pours with no unnecessary cutouts",
                "Connect all GND islands with stitching vias"
              ]
            },
            {
              badge: "Common Errors",
              badgeClass: "tool-badge-altium",
              title: "Discontinuities",
              items: [
                "Routing over anti-pads that break copper",
                "Crossing split-plane boundaries",
                "Isolated GND pours without stitching",
                "Bypass caps placed far from power pins"
              ]
            }
          ]
        },
        {
          heading: "Power Integrity (PI) Fundamentals",
          content: "Power Delivery Networks (PDN) serve as the return path for all signals. If the PDN impedance is too high at a given frequency, the voltage rails will collapse during high-speed switching (SSN).",
          type: "pdn-analyzer"
        },
        {
          heading: "Routing Techniques & Geometry",
          content: "Trace width directly sets Z₀. Use a validated field solver for production designs. Length matching is critical for timing budgets in parallel buses.",
          formula: {
            title: "3W Spacing Rule",
            equations: [
              "S_center_to_center ≥ 3 × W // reduces NEXT to <10%",
              "Gap_edge_to_edge = 2W"
            ],
            variables: [
              { name: "W", desc: "Trace width", tag: "GEOM" },
              { name: "S", desc: "Spacing", tag: "RULE" }
            ]
          },
          ruleCards: [
            {
              number: "01",
              title: "Length Matching",
              severity: "warning",
              body: "DDR4 Data: ±25 mil within byte lane. PCIe (Intra-pair): ±5 mil. Match to setup/hold window."
            },
            {
              number: "02",
              title: "Serpentine Tuning",
              severity: "info",
              body: "Gap between legs ≥ 3W. Amplitude should be small. Never serpentine inside a differential pair region."
            },
            {
              number: "03",
              title: "Routing Corners (DFM Priority)",
              severity: "info",
              body: "Use 45° corners or arcs. Contrary to myths, 90° corners are primarily a DFM risk (acid traps/etch undercut) rather than an SI risk until well above 20 GHz."
            }
          ]
        },
        {
          heading: "Differential Pair Routing",
          content: "Differential signaling provides inherent immunity to common-mode noise. Used in PCIe, USB, HDMI, and LVDS.",
          list: [
            { label: "Coupling", text: "Route as a coupled pair with constant separation throughout." },
            { label: "Symmetry", text: "Maintain identical geometry, same layer, and same dielectric." },
            { label: "Intra-pair Skew", text: "Match D+ and D- length within ±5 mil for high data rates." }
          ],
          formula: {
            title: "Differential Impedance Zdiff",
            equations: [
              "Zdiff = 2 × Z₀ × (1 − 0.347 × e^(−2.9 × S/H))"
            ],
            variables: [
              { name: "Zdiff", desc: "Differential impedance", tag: "OUTPUT" },
              { name: "S", desc: "Intra-pair spacing", tag: "INPUT" },
              { name: "H", desc: "Dielectric height", tag: "INPUT" }
            ]
          },
          filletGrid: [
            {
              title: "Tight vs Loose Coupling",
              color: "cyan",
              list: [
                { label: "Tight", text: "Better noise rejection but extremely sensitive to width tolerances." },
                { label: "Loose", text: "Provides higher impedance stability across layers and lower crosstalk." }
              ]
            }
          ]
        },
        {
          heading: "Crosstalk Mitigation",
          content: "Crosstalk is the unwanted coupling of energy from an aggressor net onto a victim net through parasitic capacitance and mutual inductance.",
          table: {
            headers: ["Type", "Location", "Polarity", "Magnitude"],
            rows: [
              ["NEXT", "Same end as driver", "Same as aggressor", "Higher (accumulates)"],
              ["FEXT", "Far end of line", "Opposite (stripline)", "Lower in microstrip"]
            ]
          },
          list: [
            { label: "Spacing", text: "Increase spacing (1/S² drop-off). 3W rule reduces NEXT to <10%." },
            { label: "Orthogonality", text: "Route adjacent layers perpendicular to eliminate broadside coupling." },
            { label: "Stripline", text: "FEXT in balanced stripline cancels, making it superior to microstrip." }
          ]
        },
        {
          heading: "Termination Techniques",
          content: "Termination absorbs signal energy at the end of a transmission line to prevent reflections. Strategy depends on topology, drive strength, and power.",
          terminationGrid: [
            {
              name: "Series (Source) Termination",
              tag: "Low Power",
              tagColor: "green",
              pros: "Prevents reflection at source. Rs = Z₀ − Zdriver.",
              cons: "Ideal for point-to-point only."
            },
            {
              name: "Parallel (End) Termination",
              tag: "High Freq",
              tagColor: "amber",
              pros: "Instantaneous match. Best for multi-drop and clocks.",
              cons: "High DC power consumption."
            },
            {
              name: "Differential Termination",
              tag: "Serial Links",
              tagColor: "blue",
              pros: "100Ω across D+/D-. Specified by serial standards.",
              cons: "Internal ODT preferred over external components."
            },
            {
              name: "On-Die Termination (ODT)",
              tag: "Modern DDR",
              tagColor: "green",
              pros: "Eliminates board stubs and parasitic inductance.",
              cons: "Requires software configuration."
            }
          ]
        },
        {
          heading: "Via Parasitics (Advanced Modeling)",
          content: "Vias introduce parasitic inductance and capacitance. Optimization is non-negotiable above 5 Gbps.",
          type: "via-advanced-calc"
        },
        {
          heading: "Via Stub Resonance",
          content: "Calculate the quarter-wave resonant frequency of via stubs to identify potential signal absorption nulls.",
          type: "via-resonance-calc"
        },
        {
          heading: "EMI / EMC Compliance",
          content: "PCB layout is the primary determinant of EMI performance. Loop area is the single largest contributor to radiated emissions.",
          list: [
            { label: "Loop Area", text: "Radiation ∝ Loop Area × Freq² × dI/dt. Keep return path directly beneath signal." },
            { label: "Decoupling", text: "100nF bulk HF, 10nF mid-freq as close as possible to IC power pins." },
            { label: "Board Edge", text: "20H keepout: no routing within 20× dielectric height of board edge." }
          ]
        },
        {
          heading: "Common Mistakes & Fixes",
          content: "Avoid these common high-speed pitfalls to ensure your design passes first-spin simulation and testing.",
          mistakeList: [
            { mistake: "Crossing plane splits with HS traces.", fix: "Route over continuous reference planes." },
            { mistake: "Using online calculators for production.", fix: "Use field solvers (Polar SI9000)." },
            { mistake: "Ignoring via stubs (>5 Gbps).", fix: "Specify back-drilling to remove resonance." },
            { mistake: "Serpentining inside a diff-pair.", fix: "Length-tune outside the coupled region." }
          ]
        },
        {
          heading: "Simulation & Verification",
          content: "Simulation is not optional for designs >1 Gbps. It is cheaper than one failed prototype spin.",
          phaseList: [
            { num: "1", title: "Pre-layout", desc: "IBIS-based SPICE to verify termination and topology." },
            { num: "2", title: "Field Solver", desc: "Extract exact RLGC coefficients for the layer stack-up." },
            { num: "3", title: "Post-layout", desc: "3D via extraction and full channel eye diagram simulation." }
          ],
          table: {
            headers: ["Metric", "Description", "Pass Criterion"],
            rows: [
              ["Eye Height", "Voltage margin at sample point", ">200 mV (DDR4)"],
              ["Insertion Loss (S21)", "Channel attenuation at Nyquist", "<-20 dB (PCIe Gen 4)"],
              ["Jitter (TJ)", "Total timing jitter at BER", "<0.1 UI"]
            ]
          }
        },
        {
          heading: "Design Checklist",
          content: "Final pre-route and post-route verification for high-speed systems."
        }
      ],
      checklists: [
        {
          category: "Pre-Route Validation",
          items: [
            "Stack-up field-solver validated.",
            "Impedance-controlled layers identified.",
            "Trace widths calculated for target net classes.",
            "3W spacing rules applied to all HS nets."
          ]
        },
        {
          category: "Post-Route Verification",
          items: [
            "Return path analysis: no splits under nets.",
            "Via stub analysis: back-drilling specified.",
            "Eye diagram simulation pass for all links.",
            "Intra-pair skew within standard limits."
          ]
        },
        {
          category: "Veteran DFM Review",
          items: [
            "Surface finish: OSP or I-Ag specified for HF loss reduction.",
            "Copper thieving added to balance density and prevent plating variation.",
            "Teardrops added on all HS pads to reduce impedance discontinuities.",
            "10° design rotation requested if using standard weave cores."
          ]
        }
      ]
    }
  },
  { 
    id: "ddr",        
    icon: MemoryStick,          
    title: "DDR Routing",               
    desc: "JEDEC-compliant Fly-by topology and byte lane engineering.",
    content: {
      intro: "DDR (Double Data Rate) SDRAM is the performance bottleneck of modern computing. Routing it requires more than just connecting dots — it requires managing nanosecond timing windows, controlled-impedance transmission lines, and complex power delivery networks. This guide serves as the Single Source of Truth for DDR3, DDR4, and DDR5 layout engineering.",
      sections: [
        {
          heading: "DDR Generations Comparison",
          content: "The transition from DDR3 to DDR5 involves significant changes in voltage, signaling, and power management. Layout rules for one generation are NOT interchangeable with another.",
          table: {
            headers: ["Parameter", "DDR3", "DDR4", "DDR5", "PCB Impact"],
            rows: [
              ["Standard", "JESD79-3F", "JESD79-4B", "JESD79-5B", "Constraint Basis"],
              ["Data Rate", "up to 2133 MT/s", "up to 3200 MT/s", "up to 6400+ MT/s", "Tighter matching"],
              ["Voltage", "1.5 V", "1.2 V", "1.1 V", "Reduced noise margin"],
              ["Topology", "Fly-by (Optional)", "Fly-by (Mandatory)", "Fly-by (Mandatory)", "Write leveling req."],
              ["Vref", "External pin", "Internal", "Internal", "Less Vref routing"],
              ["tCK min", "~0.94 ns", "~0.625 ns", "~0.3 ns", "Lower skew budget"]
            ]
          }
        },
        {
          heading: "Key Signal Groups & Definitions",
          content: "DDR signals are logically grouped to maintain timing synchronicity. Violating the grouping rules is the most common cause of memory training failures.",
          filletGrid: [
            {
              title: "Data Group (DQ/DQS)",
              color: "blue",
              list: [
                { label: "DQ[0:n]", text: "Data bits. Matched to their specific DQS strobe." },
                { label: "DQS / DQS#", text: "Differential strobe. THE most critical timing reference." },
                { label: "DM / DBI#", text: "Data Mask / Bus Inversion. Reduces switching noise." }
              ]
            },
            {
              title: "Address/Command (ADDR/CMD)",
              color: "orange",
              list: [
                { label: "A[0:n]", text: "Row/Column address lines. Sampled on CK rising edge." },
                { label: "BA / BG", text: "Bank Address/Group. BG is critical for DDR4/5." },
                { label: "CS# / CKE", text: "Chip Select and Clock Enable. Low-speed control." }
              ]
            },
            {
              title: "Clock Group (CK / CK#)",
              color: "cyan",
              list: [
                { label: "CK / CK#", text: "Differential system clock. Master reference for ADDR/CMD." },
                { label: "Reset#", text: "Asynchronous reset. Matched to ADDR/CMD group." },
                { label: "Alert#", text: "Error flag (DDR4/5). High-speed error reporting." }
              ]
            }
          ]
        },
        {
          heading: "Controlled Impedance Specifications",
          content: "All DDR traces must be treated as transmission lines. Impedance tolerance of ±10% is the JEDEC standard, though ±7% is preferred for high-reliability designs.",
          table: {
            headers: ["Signal Group", "Topology", "DDR3 Target", "DDR4/5 Target", "Tolerance"],
            rows: [
              ["DQ / DM / DBI", "Single-ended", "50Ω", "50Ω", "±10%"],
              ["DQS / DQS#", "Differential", "100Ω", "100Ω", "±10%"],
              ["CK / CK#", "Differential", "100Ω", "100Ω", "±10%"],
              ["ADDR / CMD", "Single-ended", "50–60Ω", "50Ω", "±10%"],
              ["VTT Stub (DDR3)", "Fly-by stub", "50Ω", "N/A (ODT)", "±10%"]
            ]
          },
          alerts: [
            { type: "danger", text: "Never route DDR signals over a split plane boundary. The resulting return path detour creates an inductive loop that destroys signal integrity and causes massive EMI." }
          ]
        },
        {
          heading: "Timing Budgets & Length Matching",
          content: "Every byte lane is an independent timing domain. While inter-lane matching is flexible, INTRA-lane matching (DQ to DQS) has zero margin for error.",
          table: {
            headers: ["Rule", "DDR3", "DDR4", "DDR5", "Impact of Violation"],
            rows: [
              ["DQ to DQS (intra-byte)", "±25 mil", "±25 mil", "±15 mil", "Setup/Hold Violations"],
              ["DQS+/- Intra-pair Skew", "±5 mil", "±5 mil", "±5 mil", "Common-Mode Noise"],
              ["ADDR/CMD Intra-group", "±50 mil", "±25 mil", "±25 mil", "Command Phase Error"],
              ["Max DQ Trace Length", "2500 mil", "2000 mil", "1500 mil", "Excessive Channel Loss"]
            ]
          },
          formula: {
            title: "Propagation Delay (FR4 Stripline)",
            equations: [
              "Vp ≈ c / √εr_eff  ≈ 5.7 mil/ps",
              "Delay (ps) = Length (mil) / Vp",
              "15 mil mismatch (DDR5) ≈ 2.6 ps timing loss"
            ],
            variables: [
              { name: "Vp", desc: "Propagation velocity in dielectric", tag: "PROP" },
              { name: "UI", desc: "Unit Interval (bit time)", tag: "MATH" }
            ]
          }
        },
        {
          heading: "Routing Topology: Fly-By Design",
          content: "Fly-by topology (mandatory for DDR4/5) chains signals through each DRAM in sequence. This introduces intentional skew that is corrected by the memory controller's 'Write Leveling' training.",
          ruleCards: [
            {
              number: "01",
              title: "Monotonic Delay",
              severity: "info",
              body: "Signals must pass each DRAM sequentially. The controller uses training to calculate the exact arrival time at each chip."
            },
            {
              number: "02",
              title: "Stub Length Control",
              severity: "danger",
              body: "Max fly-by stub length: <150 mil (DDR4) / <100 mil (DDR5). Long stubs create resonant notches that close the eye diagram."
            },
            {
              number: "03",
              title: "VTT Termination",
              severity: "warning",
              body: "For DDR3, place VTT parallel termination resistors at the very end of the fly-by chain, within 100 mil of the last DRAM."
            }
          ],
          alerts: [
            { type: "info", text: "T-branch (Y-topology) is legacy. At DDR4/5 speeds, the impedance mismatch at the branch point creates multi-reflection noise that prevents high-speed boot." }
          ]
        },
        {
          heading: "Power Integrity & Decoupling Hierarchy",
          content: "VDDQ noise tolerance is ±22 mV for DDR5. A poorly designed PDN (Power Delivery Network) will cause intermittent memory errors that are impossible to find with standard DRCs.",
          twoColumnGrid: [
            {
              badge: "Placement",
              badgeClass: "tool-badge-altium",
              title: "Under-BGA Decoupling",
              items: [
                "Place caps on BOTTOM side directly under DRAM pins.",
                "Use VIP (Via-in-Pad) for lowest loop inductance.",
                "100nF + 10nF + 1nF hierarchy per DRAM.",
                "2 vias per capacitor pad to halve parasitic ESL."
              ]
            },
            {
              badge: "PDN Design",
              badgeClass: "tool-badge-cadence",
              title: "VDDQ Rail Engineering",
              items: [
                "Target Impedance Ztarget < 24 mΩ (DDR4).",
                "Maintain Ztarget up to the 5th harmonic.",
                "Keep PWR and GND planes adjacent (2–4 mil gap).",
                "Verify no anti-pad overlap in power layers."
              ]
            }
          ]
        },
        {
          heading: "Common Routing Mistakes",
          content: "Avoid these common DDR pitfalls to ensure your design passes first-spin JEDEC compliance testing.",
          mistakeList: [
            { mistake: "DQS pair split across layers.", fix: "Always route + and - on the identical layer and proximity." },
            { mistake: "Routing DDR over a split power plane.", fix: "Ensure a continuous GND reference plane for every single DDR layer." },
            { mistake: "Tight serpentine meanders (gap < 3W).", fix: "Follow the 3W rule internally for meanders to prevent self-coupling." },
            { mistake: "Missing GND return vias at layer changes.", fix: "Place stitching GND vias within 20 mil of every signal layer transition." }
          ]
        },
        {
          heading: "Advanced BGA Fanout & Via Control",
          content: "As data rates exceed 3200 MT/s, the via fanout becomes a major impedance discontinuity. Selecting the right breakout strategy is critical for signal integrity and manufacturability.",
          twoColumnGrid: [
            {
              badge: "Dogbone Fanout",
              badgeClass: "tool-badge-altium",
              title: "Standard Density",
              items: [
                "Lower cost (no via-filling required).",
                "Higher parasitic inductance due to 'bone' trace.",
                "Suitable for DDR3 and low-speed DDR4.",
                "Limited space for decoupling caps on bottom."
              ]
            },
            {
              badge: "Via-In-Pad (VIP)",
              badgeClass: "tool-badge-cadence",
              title: "High-Speed Standard",
              items: [
                "Mandatory for DDR5 and small pitch BGA.",
                "Minimum loop inductance to decoupling.",
                "Allows routing on the same layer as the pad.",
                "Requires epoxy-filled and plated-over process."
              ]
            }
          ]
        },
        {
          heading: "DDR5 Power & Sideband Engineering",
          content: "DDR5 introduces the PMIC (Power Management IC) directly on the DIMM/PCB. This requires a dedicated focus on thermal management and I3C sideband signal integrity.",
          filletGrid: [
            {
              title: "PMIC Thermal Management",
              color: "orange",
              list: [
                { label: "Thermal Pad", text: "Must use a 4x4 or 5x5 array of thermal vias to L2 GND." },
                { label: "Input Power", text: "VIN_BULK (5V) needs high-current wide copper pours." },
                { label: "Stability", text: "Keep inductor-switching nodes compact to minimize EMI." }
              ]
            },
            {
              title: "SPD Hub & I3C Sideband",
              color: "blue",
              list: [
                { label: "Protocol", text: "Uses I3C (up to 12.5 MHz) for module identification." },
                { label: "Isolation", text: "Separate I3C signals from high-speed DQ lanes by >50 mil." },
                { label: "Reference", text: "Always reference sideband signals to a continuous GND plane." }
              ]
            }
          ]
        },
        {
          heading: "Fiber Weave Effect Mitigation",
          content: "For DDR4-3200 and DDR5-6400, the periodic variation in dielectric constant (Dk) caused by the glass weave can introduce deterministic skew that ruins timing margins.",
          type: "fiber-weave",
          alerts: [
            { type: "warning", text: "If using standard FR4 (e.g., 7628 weave), you must rotate the entire DDR layout by 10° or use zig-zag routing to ensure both signals in a pair 'see' the same average Dk." }
          ]
        },
        {
          heading: "Interactive: DDR Timing Margin Calculator",
          content: "Quantify how much of your total timing window (UI) is consumed by physical PCB layout choices. Enter your design parameters below to see the impact.",
          type: "ddr-timing-calculator"
        }
      ],
      checklists: [
        {
          category: "1. Pre-Routing Layout Setup",
          items: [
            "Stackup defined with 50Ω SE and 100Ω Diff targets (SSOT).",
            "DRAMs placed in a clean line for Fly-by topology.",
            "Decoupling caps allocated on layer 8 directly under DRAM BGAs.",
            "Constraint Manager groups (DQ, ADDR, CK) verified by engineering.",
            "No power islands or plane splits under the DDR routing zone."
          ]
        },
        {
          category: "2. Routing Execution (Critical Sign-Off)",
          items: [
            "CK/CK# routed first as master reference; 5W spacing to all nets.",
            "Intra-byte lane matching DQ-to-DQS verified within ±2 mil (Safety margin).",
            "DQS+/- phase skew < 5 mil verified; no split-layer routing.",
            "Fly-by stub lengths < 100 mil (DDR5) verified via DRC report.",
            "Serpentine amplitude < 3W; meander gap > 3W observed."
          ]
        },
        {
          category: "3. Manufacturing & SI/PI Verification",
          items: [
            "Back-drilling specified for all stubs > 100 mil (DDR5).",
            "Controlled impedance coupons included on board panel (±10%).",
            "Solder mask defined (SMD) pads verified for high-density BGA.",
            "Full IBIS-AMI simulation pass (Eye Height > 200 mV).",
            "JEDEC compliance report generated and archived for hardware validation."
          ]
        }
      ]
    }
  },
  { 
    id: "emi_emc",    
    icon: ShieldAlert,      
    title: "EMI / EMC Compliance", 
    desc: "Master regulatory standards and suppression techniques.",
    content: {
      intro: "A professional-grade engineering guide to electromagnetic compatibility. Success in the EMC lab begins with physics-driven PCB layout, focusing on loop area containment, spectrum management, and strategic grounding based on IPC-2141A, CISPR 32, and FCC Part 15 standards.",
      sections: [
        {
          heading: "1. The Regulatory Landscape: Class A vs. Class B",
          level: "beginner",
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
          heading: "2. Antenna Theory for Traces (The λ/20 Rule)",
          level: "intermediate",
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
          heading: "3. Power Supplies: The Hot Loop Physics",
          level: "intermediate",
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
          heading: "4. The Ghost of Return Current: Image Planes",
          level: "expert",
          content: "In high-speed design, current follows the path of least **inductance**, not resistance. Above 100 kHz, the return current crowds directly beneath the signal trace to minimize loop area. Any split in this image plane creates a massive antenna.",
          alerts: [
            { type: 'danger', text: "Never route signal traces over slots or splits in ground planes. The return current detour creates a 'Slot Antenna' that can fail FCC/CISPR limits by 20dB or more." }
          ]
        },
        {
          heading: "5. The Pigtail Trap: Shield Integrity",
          level: "expert",
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
          heading: "6. Regulatory Tiers: FCC / CISPR / IEC Standards",
          level: "expert",
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
          category: "Tier 1: Foundations (Beginner)",
          items: [
            "Maintain a solid, unified ground plane across the entire board.",
            "Partition noisy power circuits from sensitive analog zones.",
            "Filter all incoming power with proper bypass capacitors.",
            "Keep clock signals as short as possible with dedicated return paths."
          ]
        },
        {
          category: "Tier 2: Applied Engineering (Intermediate)",
          items: [
            "Maintain minimal Hot Loop area for all SMPS stages (<1 cm²).",
            "Slow down edge rates (Rise Time) on non-critical control lines.",
            "Choose ferrite beads based on resistive peak at problem frequency.",
            "Ensure λ/20 trace length limits are respected for harmonics."
          ]
        },
        {
          category: "Tier 3: Advanced Physics (Expert)",
          items: [
            "Verify all layer transitions have adjacent ground stitching vias.",
            "Shielded connectors use 360° circular metal backshells (No pigtails).",
            "Zero trace-to-slot crossings on reference planes verified via CAM.",
            "Return current loop area minimized via thin dielectric (<5 mil)."
          ]
        }
      ]
    }
  },



  { 
    id: "dfm_dft",    
    icon: Factory,        
    title: "DFM / DFT Mastery",                 
    desc: "Achieve industrial-grade yields and 100% test coverage.",
    content: {
      intro: "Design for Manufacturing (DFM) and Design for Testing (DFT) are the twin pillars of professional PCB engineering. DFM ensures your board can be built reliably and repeatably at target cost, while DFT ensures every critical net is verifiable. Grounded in IPC-A-610, IPC-2221B, and J-STD-020, this module serves as the authoritative Single Source of Truth (SSOT) for industrial-grade production.",
      sections: [
        {
          heading: "1. The Business Case: Yield and Rework",
          level: "beginner",
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
          level: "intermediate",
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
          level: "intermediate",
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
          heading: "4. DFT Architecture: ICT vs. JTAG",
          level: "expert",
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
          heading: "5. Panelization & Fiducial Strategy",
          level: "expert",
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
          heading: "6. Surface Finish Decision Matrix",
          level: "intermediate",
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
          heading: "Thermal Management & Copper Relief",
          content: "Analyze the thermal resistance of vias and the efficiency of copper pour thermal relief. Solid connections provide better thermal dissipation but create soldering risks; relief spokes balance these requirements.",
          type: "thermal-tool"
        },
        {
          heading: "Interactive: Real-Time DFM Rule Checker",
          level: "expert",
          content: "Validate your design parameters against the IPC-2221B and IPC-6012 industrial limits. This engine provides instant feedback on aspect ratio, annular rings, and solder mask dams.",
          type: 'dfm-checker'
        }
      ],
      checklists: [
        {
          category: "1. Fabrication Sign-Off",
          items: [
            "Laminate selection (Tg/Td) verified for Lead-Free reflow.",
            "All PTH pads in copper pours have 4-spoke thermal relief.",
            "Min Annular Ring (Class 2/3) verified across all via layers.",
            "Aspect Ratio (Board Thickness / Smallest Drill) ≤ 12:1.",
            "No acute acid traps (<90°) present in signal routing."
          ]
        },
        {
          category: "2. Assembly & SMT Readiness",
          items: [
            "Global fiducials (3) placed non-colinearly on panel rails.",
            "Components ≥ 5-10mm from V-score edges to prevent cracking.",
            "Solder mask dams ≥ 4 mil (0.1mm) verified for all fine-pitch ICs.",
            "Via-in-Pad locations specified as IPC-4761 Type VII (Filled/Capped).",
            "Polarized components (Diodes, ICs) clearly silkscreened."
          ]
        },
        {
          category: "3. DFT & Test Readiness",
          items: [
            "Test points assigned to 100% of PWR, GND, and Reset nets.",
            "Test point grid ≥ 2.54mm (100mil) for standard ICT fixture.",
            "IEEE 1149.1 (JTAG) chain logic verified (TDO -> TDI chain).",
            "Test points accessible on all primary communication buses.",
            "Zero solder mask or silkscreen coverage on test point pads."
          ]
        }
      ]
    }
  },
  { 
    id: "si_pi",      
    icon: Activity,     
    title: "Advanced Signal & Power Integrity (SI/PI)",         
    desc: "Industrial-grade engineering for high-speed channel compliance and PDN stability.",
    content: {
      intro: "Signal Integrity (SI) ensures that signals arriving at receivers are clean enough to be interpreted correctly. Power Integrity (PI) ensures that components receive stable, low-noise power under dynamic load conditions. This module serves as the authoritative SI/PI Knowledge System, anchored in IPC-2141A, JEDEC, and PCI-SIG standards.",
      sections: [
        {
          heading: "SI Core: Transmission Line Standards",
          content: "Characteristic impedance (Z₀) selection is determined by the interface standard. Modern high-speed designs require tighter tolerances (±10% to ±15%) and validated field-solver results.",
          table: {
            headers: ["Interface", "Z₀ Target", "Tolerance", "Standard Reference"],
            rows: [
              ["Single-ended (General)", "50 Ω", "±10%", "IPC-2141A"],
              ["DDR4/5 Data (DQ)", "40–50 Ω SE", "±10%", "JEDEC JESD79-5B"],
              ["DDR4/5 CLK / DQS", "100 Ω Diff", "±10%", "JEDEC JESD79-5B"],
              ["PCIe Gen 1–5", "100 Ω Diff", "±15%", "PCI-SIG CEM Spec (85Ω at connector)"],
              ["USB 3.x / 4", "90 Ω Diff", "±15%", "USB 3.2 §6.7"],
              ["1000BASE-T (GbE)", "100 Ω Diff", "±15%", "IEEE 802.3"]
            ]
          },
          formula: {
            title: "The Velocity of Propagation (Vp)",
            equations: [
              "Vp ≈ c / √εr_eff",
              "Delay (ps/in) = 1012 × √εr_eff / c ≈ 169 ps/in (FR4)"
            ],
            variables: [
              { name: "εr_eff", desc: "Effective dielectric constant", tag: "INPUT" },
              { name: "c", desc: "Speed of light (1.18e10 in/s)", tag: "CONST" }
            ]
          }
        },
        {
          heading: "Differential Pair Routing Mastery",
          content: "Differential signaling provides inherent common-mode noise rejection. Maintaining geometry symmetry is the primary task of the layout engineer.",
          list: [
            { label: "Intra-pair Spacing (S)", text: "Set to 2× Trace Width (W) to maintain target odd-mode impedance." },
            { label: "Intra-pair Skew", text: "Must be ≤ 5 mils for DDR4/5; ≤ 10ps max for multi-Gbps serial links." },
            { label: "Inter-pair Spacing", text: "Maintain ≥ 3× W (5× preferred) to reduce crosstalk below -40 dB." },
            { label: "Reference Continuity", text: "Place a GND stitching via within 50 mils of any signal via changing layers." }
          ],
          alerts: [
            { type: 'danger', text: "Never route high-speed signals across plane splits. The resulting return path detour causes massive EMI radiation and crosstalk failures." }
          ]
        },
        {
          heading: "BGA Escape & Fanout Design (IPC-7095C)",
          level: "expert",
          content: "Breaking out signals from fine-pitch BGAs (0.8mm to 0.4mm) is the most geometry-constrained task in layout. Strategy selection impacts layer count, via technology, and fabrication cost.",
          table: {
            headers: ["Feature Pitch", "Escape Strategy", "Via Technology", "Layer Impact"],
            rows: [
              ["1.0mm - 0.8mm", "Dog-bone fanout", "Standard Thru-hole / Blind", "Low to Medium"],
              ["0.65mm - 0.5mm", "Via-In-Pad (VIPPO)", "Microvia / Plated Shut", "High (HDI required)"],
              ["< 0.4mm", "Any-Layer HDI", "Stacked Microvias", "Maximum (ELIC)"]
            ]
          },
          list: [
            { label: "VIPPO", text: "Via-In-Pad Plated Over. Mandatory for <0.5mm pitch to save routing real estate. Requires flat surface for assembly (IPC-4761 Table 1, Type VII)." },
            { label: "Differential Pair Breakout", text: "Maintain symmetry immediately after leaving the BGA ball. Avoid asymmetric via placements that introduce skew within the first 100 mils." },
            { label: "Void Management", text: "Ensure stitching vias do not create 'Swiss-cheese' patterns in ground planes, which would choke return currents." }
          ],
          alerts: [
            { type: 'warning', text: "Always confirm with your fabricator before using Via-In-Pad. Non-conductive epoxy fill and capping add 15-25% to board cost." }
          ]
        },
        {
          heading: "PI Core: Target Impedance & PDN",
          content: "The Power Distribution Network (PDN) must maintain an impedance (Ztarget) below the threshold from DC to the bandwidth of the switching current.",
          type: 'pdn-analyzer'
        },
        {
          heading: "PDN Target Impedance Solver",
          content: "Calculate the maximum allowable impedance for a power rail based on voltage, ripple budget, and transient current.",
          type: 'pi-target-calc'
        },
        {
          heading: "Decoupling Hierarchy & Via Physics",
          content: "Capacitors are inductive above their Self-Resonant Frequency (SRF). A multi-tier strategy is required to cover the frequency spectrum.",
          filletGrid: [
            {
              title: "Bulk / VRM (DC–100kHz)",
              color: "blue",
              list: [
                { label: "Value", text: "100µF – 1mF Tantalum or Polymer." },
                { label: "Role", text: "Supplies current during slow load transients." }
              ]
            },
            {
              title: "Mid-Freq (1MHz–100MHz)",
              color: "orange",
              list: [
                { label: "Value", text: "100nF – 1µF MLCC (0402/0603)." },
                { label: "Role", text: "Bridges the gap between VRM and local decoupling." }
              ]
            },
            {
              title: "High-Freq (100MHz–1GHz+)",
              color: "cyan",
              list: [
                { label: "Value", text: "10nF – 100nF (0201/01005)." },
                { label: "Role", text: "Critical for suppressing switching noise near IC pins." }
              ]
            }
          ],
          alerts: [
            { type: 'info', text: "Via placement is critical. Vias must be immediately adjacent to capacitor pads to keep loop inductance < 100 pH." }
          ]
        },
        {
          heading: "Lossy Line Physics (Expert Insight)",
          content: "At frequencies >10 GHz, material physics dominates. The ideal 'lossless' model becomes invalid as Skin Effect and Dielectric Loss (Tan δ) attenuate signals.",
          cards: [
            {
              title: "Dielectric Loss (Tan δ)",
              text: "Absorption of energy by the resin/glass. Specify Low-Loss materials (Megtron 6/7) for PCIe Gen 5+."
            },
            {
              title: "Skin Effect & Roughness",
              text: "Current crowds to the copper surface. Rough copper (STD) increases resistance by 30% over VLP copper."
            }
          ]
        },
        {
          heading: "Recommended 6-Layer Stackup",
          content: "For high-performance designs, the 6-layer stackup provides a balanced approach to SI, PI, and cost.",
          stackVisual: [
            { layer: "L1 — Signal (Top)", spec: "High-Speed Microstrip", color: "#D4963A", note: "Referenced to L2 GND" },
            { layer: "L2 — Ground (GND)", spec: "Solid Copper Plane", color: "#888780", note: "Primary Reference" },
            { layer: "L3 — Signal / PWR", spec: "Stripline / Islands", color: "#378ADD", note: "Keep <4 mil from L4" },
            { layer: "L4 — Ground (GND)", spec: "Solid Copper Plane", color: "#888780", note: "Primary Reference" },
            { layer: "L5 — Power (VCC)", spec: "Copper Pour", color: "#378ADD", note: "Main distribution layer" },
            { layer: "L6 — Signal (Bot)", spec: "Microstrip", color: "#D4963A", note: "Referenced to L5" }
          ],
          alerts: [
            { type: 'warning', text: "Maintain thin dielectric (≤ 4 mils) between Power and GND plane pairs to maximize distributed capacitance for HF decoupling." }
          ]
        },
        {
          heading: "Simulation & Validation Pipeline",
          content: "Simulation tools and lab equipment required for professional-level SI/PI sign-off.",
          twoColumnGrid: [
            {
              badge: "Software Suite",
              badgeClass: "tool-badge-cadence",
              title: "Industry Standard Tools",
              items: [
                "Ansys (SIwave / HFSS / Icepak)",
                "Cadence Sigrity (PowerDC / SystemSI)",
                "Siemens HyperLynx (LineSim / PI)",
                "Keysight ADS / PathWave"
              ]
            },
            {
              badge: "Hardware Lab",
              badgeClass: "tool-badge-altium",
              title: "Measurement Equipment",
              items: [
                "Oscilloscope (≥ 4× signal bandwidth)",
                "TDR (Time Domain Reflectometry)",
                "VNA (Vector Network Analyzer)",
                "Near-field Probes (EMI debugging)"
              ]
            }
          ]
        }
      ],
      checklists: [
        {
          category: "1. Pre-Layout SI/PI Foundations",
          items: [
            "Stackup defined and impedance targets (Z₀/Zdiff) calculated with fab.",
            "IC datasheets reviewed for all signal breakout/routing requirements.",
            "Target impedance Ztarget calculated for all critical power domains.",
            "Decoupling cap BOM derived from simulation or IC vendor data.",
            "IBIS / S-Parameter models obtained for all active/passive components.",
            "Dielectric material (Dk/Df) specified at frequencies > 5 GHz.",
            "Differential pair skew budgets (ps/mil) imported into constraint manager.",
            "Return path plan approved: no routing over splits identified."
          ]
        },
        {
          category: "2. Post-Layout Engineering Verification",
          items: [
            "All differential pairs meet Zdiff target ±10% via post-layout extraction.",
            "Intra-pair skew verified within spec for DDR/PCIe/USB links.",
            "Inter-pair length matching verified for all synchronous buses.",
            "Return path stitching vias placed at every reference layer change.",
            "Via stub lengths checked; back-drilling specified where needed (> 3 GHz).",
            "Crosstalk (NEXT/FEXT) analysis completed; < -30 dB margin verified.",
            "Decoupling caps placed within 5mm of IC power pins (Low Inductance).",
            "Eye diagram statistical simulation passed per interface mask.",
            "PDN post-layout simulation shows no peaks above Ztarget.",
            "IR Drop simulation shows VDD within ±3% spec at all IC pins."
          ]
        },
        {
          category: "3. Manufacturing & Quality Sign-Off",
          items: [
            "Impedance test coupon included on board panelization drawing.",
            "Back-drill requirements explicitly specified in fabrication notes.",
            "Via-in-pad with copper fill specified for BGA escape (IPC-4761).",
            "Controlled-depth blind/buried vias specified on drill table.",
            "Surface finish (ENIG/OSP) specified to minimize skin effect loss.",
            "Dk / Df values at 10 GHz specified in fab notes (Not just 'FR4').",
            "Copper weight specified per layer (1.5 oz for Planes preferred).",
            "DFM review completed with fab to ensure trace/space manufacturability.",
            "TDR signature measurement requested as part of the cert package.",
            "Final Gerber / ODB++ review completed using CAM350 or equivalent."
          ]
        }
      ]
    }
  },
  {
    id: "pcb_output_system",
    icon: Factory,
    title: "Manufacturing Release System",
    desc: "The definitive engineering guide for Fabrication, Assembly, and Test release packages.",
    content: {
      intro: "A professional PCB design is only as good as its release package. This system provides a Single Source of Truth for manufacturing outputs, bridging the gap between CAD design intent and physical production reality. From legacy Gerber RS-274X to modern IPC-2581 digital twins, this module ensures zero-defect handoffs to fab and assembly houses.",
      sections: [
        {
          heading: "1. Fabrication Output Files (The Photoplot)",
          level: "beginner",
          content: "Fabrication files define the copper, mask, and drill coordinates. While Gerbers are the standard, the version and metadata you choose can determine the speed and accuracy of your CAM setup.",
          table: {
            headers: ["Layer Type", "Standard Ext.", "Critical Expert Note", "Risk Level"],
            rows: [
              ["Top Copper", ".GTL", "Verify min annular ring ≥ 5 mil for high yield.", "High"],
              ["Bottom Copper", ".GBL", "Ensure no isolated copper 'islands' (antennas).", "High"],
              ["Solder Mask", ".GTS / .GBS", "Check mask dams for fine-pitch parts (min 4 mil).", "Critical"],
              ["Silkscreen", ".GTO / .GBO", "Clip silk from pads to prevent solderability failure.", "Med"],
              ["Board Outline", ".GKO / .GM1", "Must be a continuous, closed 0-width polygon.", "High"]
            ]
          },
          alerts: [
            { type: "info", text: "Expert Tip: Use Gerber X2 or X3. They embed layer function and polarity metadata in the header, eliminating the 'Negative Plane' inversion errors common in legacy RS-274D/X flows." }
          ]
        },
        {
          heading: "2. NC Drill Precision (CNC Instructions)",
          level: "intermediate",
          content: "The Excellon drill file is a set of CNC coordinates. A single mismatch in units or zero suppression can ruin an entire production batch.",
          cards: [
            {
              title: "Zero Suppression",
              text: "Always specify 'None' or 'Trailing'. Suppressing leading zeros in a file using '2:4' format can shift your drills by 10x if the CAM tool defaults to '2:3'."
            },
            {
              title: "PTH vs. NPTH",
              text: "Separate Plated-Through Holes from Non-Plated Holes into two files. This prevents the fab from accidentally plating mechanical mounting holes, affecting tolerances."
            }
          ],
          codeBlock: "M48\nMETRIC,TZ\nT01C0.300\nT02C1.000\n%\nG05\nT01\nX025400Y018300\nX026500Y019200\nMODIFIED EXCELLON HEADER EXAMPLE"
        },
        {
          heading: "3. Assembly & Placement Engineering",
          level: "intermediate",
          content: "Beyond the BOM, the Pick-and-Place (Centroid) and Solder Paste (Stencil) files determine the quality of your SMT process.",
          list: [
            "<strong>PnP Rotation:</strong> Ensure 0° orientation matches the tape-and-reel standard (EIA-481). Centroids must be center-of-gravity, not Pin 1.",
            "<strong>Stencil Area Ratio:</strong> For small pads (0201 or BGA), ensure Area Ratio = [Area of Aperture] / [Area of Walls] > 0.66 to ensure solder release.",
            "<strong>Fiducials:</strong> Include 3 global fiducials (1.0mm pad, 2.0mm mask opening) in a non-collinear arrangement for robotic alignment."
          ]
        },
        {
          heading: "4. Advanced Formats: ODB++ & IPC-2581",
          level: "expert",
          content: "Intelligent data formats eliminate the mess of dozens of loose files by packaging everything—stackup, netlist, and components—into a single database.",
          table: {
            headers: ["Format", "Owner", "Advantage", "Expert Verdict"],
            rows: [
              ["Gerber RS-274X", "Open", "Universal compatibility", "Legacy/High Risk"],
              ["Gerber X2", "Ucamco", "Embedded layer metadata", "Modern Standard"],
              ["ODB++", "Mentor (Siemens)", "Comprehensive DB; widely used", "Proprietary but solid"],
              ["IPC-2581", "IPC (Consortium)", "Open standard; netlist intelligence", "THE FUTURE - Multi-vendor"]
            ]
          }
        },
        {
          heading: "Intelligent Handover: The IPC-2581 'Digital Twin'",
          level: "expert",
          content: "IPC-2581 (DPMX) is more than a file format; it is a standardized XML data model that represents the board's 'Digital Twin'. It bridges the gap between design CAD and factory CAM systems.",
          filletGrid: [
            {
              title: "What's Inside IPC-2581?",
              color: "blue",
              list: [
                { label: "Layer Stackup", text: "Material names, Dk/Df, and copper weights are explicitly defined." },
                { label: "Netlist", text: "Full intelligent netlist for automated optical and electrical testing." },
                { label: "BOM & PnP", text: "Component part numbers and XY coordinates for placement." }
              ]
            },
            {
              title: "Why it Beats Gerbers",
              color: "green",
              list: [
                { label: "Ambiguity", text: "Zero. Gerbers are 'dumb' images; IPC-2581 is 'smart' data." },
                { label: "Speed", text: "Reduces CAM intake time from hours to minutes." },
                { label: "Yield", text: "Eliminates human error in layer ordering and polarity assignment." }
              ]
            }
          ],
          alerts: [
            { type: 'info', text: "IPC-2581 Revision C is the current gold standard. It includes bidirectional support for fabrication and assembly, enabling true 'Industry 4.0' automation." }
          ]
        },
        {
          heading: "5. CAD-Specific Export Workflows",
          level: "beginner",
          content: "Follow these tool-specific steps to ensure a compliant release package.",
          twoColumnGrid: [
            {
              badge: "Altium Designer",
              badgeClass: "tool-badge-altium",
              title: "OutJob File Method",
              items: [
                "Use an .OutJob file for synchronized, repeatable exports.",
                "Export → Fabrication Outputs → Gerber X2.",
                "Export → Assembly Outputs → Generates Pick and Place.",
                "Verify 'Advanced' tab: 2:4 or 2:5 resolution for high precision."
              ]
            },
            {
              badge: "Cadence Allegro",
              badgeClass: "tool-badge-cadence",
              title: "Artwork Control Flow",
              items: [
                "Run 'DB Doctor' before export to fix database errors.",
                "Manufacture → Artwork: Define Film Records.",
                "Manufacture → NC → NC Drill: Set Header & Units.",
                "Ensure 'Undefined Line Width' is NOT zero (set to 2-4 mil)."
              ]
            }
          ]
        },
        {
          heading: "6. Common Manufacturing Risks",
          level: "expert",
          content: "Seasoned engineers design to avoid these common 'gotchas' that cause yield drops.",
          mistakeList: [
            { mistake: "Acid Traps (Acute Angles)", fix: "Ensure all trace-to-trace entry angles are 90° or greater. Acute angles trap etchant and cause over-etching." },
            { mistake: "Copper Slivers", fix: "Perform a 'Sliver Check' in CAM. Slivers < 3 mil can peel off during fab and short nearby nets." },
            { mistake: "Missing Netlist (IPC-D-356)", fix: "Always include the netlist! Without it, the fab cannot perform electrical test (ET) against your design intent." },
            { mistake: "Stencil Thermal Bridging", fix: "Apply 40-60% 'Windowpane' reduction to large thermal pads on QFNs/Power ICs to prevent wicking and bridging." }
          ]
        },
        {
          heading: "7. Standard Release Package (Directory Structure)",
          level: "intermediate",
          content: "A professional release should be structured to allow automated CAM scripts to parse the data without manual intervention.",
          codeBlock: "PROJECT_REL_v1.0/\n├── Fabrication/          ; Gerbers, Drill, Fab Drawing\n├── Assembly/             ; PnP, BOM, Asm Drawing, Stencil\n├── Test/                 ; IPC-D-356, TP Report, BSDL\n└── Documentation/        ; Schematics, Stackup, DRC Reports",
          list: [
            "<strong>Naming:</strong> PROJECT_LAYER_v1.0_YYYYMMDD. Use underscores; avoid spaces which break CAM scripts.",
            "<strong>Integrity:</strong> Include an MD5 or SHA-256 checksum for the ZIP archive to verify transmission integrity."
          ]
        },
        {
          heading: "8. Technical Appendix: Test & PnP Metadata",
          level: "expert",
          content: "For engineers integrating with automated factories (Lights-out manufacturing).",
          table: {
            headers: ["Metadata Type", "Format/Record", "Precision Requirement"],
            rows: [
              ["Netlist Record 317", "IPC-D-356A", "Through-hole XY coordinates & access side"],
              ["Netlist Record 327", "IPC-D-356A", "SMT pad center & access side (Top/Bot)"],
              ["Centroid (PnP)", "CSV/Text", "X, Y, Rotation (Degrees), Side (T/B)"],
              ["BSDL", "IEEE 1149.1", "JTAG chain description (Provided by IC Mfgr)"]
            ]
          }
        },
        {
          heading: "Interactive: Manufacturing Release Simulator",
          level: "intermediate",
          content: "Execute a virtual production release flow that performs professional-grade DFM and metadata checks on your export package.",
          type: "output-simulator"
        }
      ],
      checklists: [
        {
          category: "Tier 1: Junior Sign-Off (The Basics)",
          items: [
            "All copper, mask, and silk layers are present.",
            "NC Drill file uses metric units and TZ suppression.",
            "Board outline (profile) is included and sized correctly.",
            "BOM exported with MPNs and Correct Quantities."
          ]
        },
        {
          category: "Tier 2: Senior Engineer Audit (The Physics)",
          items: [
            "Gerber X2/X3 used; metadata verified in a CAM viewer.",
            "IPC-D-356 Netlist matches the Gerber artwork 100%.",
            "PnP rotation verified against Pin 1 tape-and-reel standards.",
            "Mask dams verified for fine-pitch BGAs (≥ 4 mil)."
          ]
        },
        {
          category: "Tier 3: Veteran Sign-Off (The Yield)",
          items: [
            "Acute angle acid traps eliminated via teardrops/chamfers.",
            "Sliver check performed; min copper feature > 4 mil.",
            "Differential pair length matching verified in output report.",
            "Thermal pad stencil reduction (40-60%) applied to all QFNs.",
            "Fab Drawing specifies impedance tolerances (±10%) and surface finish (ENIG/OSP)."
          ]
        }
      ]
    }
  },
  {
    id: "thermal",
    icon: Thermometer,
    title: "Thermal Management",
    desc: "Calculate trace current capacity per IPC-2152 standards.",
    content: {
      intro: "Thermal management is the most overlooked phase of high-power PCB design. Modern traces must be sized not just for resistance, but for steady-state temperature rise (ΔT) limits to ensure dielectric reliability and prevent catastrophic delamination. IPC-2152 provides the industrial-standard mathematical models for current-carrying capacity.",
      sections: [
        {
          heading: "IPC-2152 Standard Fundamentals",
          content: "IPC-2152 replaces the legacy IPC-2221 charts with a physics-based approach to thermal profiles. It accounts for material conductivity, board thickness, and copper plane proximity.",
          type: "calculator"
        },
        {
          heading: "Design Rules for Power Rails",
          content: "When designing high-current planes and traces (e.g. 10A+), standard layout rules are superseded by thermal constraints:",
          list: [
            { label: "Internal vs External", text: "Internal traces (Stripline) require ~2x the width of external traces for the same current due to poor heat dissipation through FR4." },
            { label: "Copper Weight impact", text: "Moving from 1oz to 2oz copper does NOT double the current capacity—it increases it by ~1.6x due to non-linear thermal spreading." },
            { label: "Plane Proximity", text: "Traces adjacent to large copper planes can carry significantly more current as the plane acts as a lateral heat sink." }
          ]
        }
      ],
      checklists: [
        {
          category: "Thermal Verification",
          items: [
            "Current requirements gathered for all power rails.",
            "Maximum allowable temperature rise established (default +10°C).",
            "Trace widths calculated using IPC-2152 (not legacy 2221).",
            "Thermal relief pads used on power planes for solderability.",
            "Heat dissipation paths (vias to planes) verified in layout."
          ]
        }
      ]
    }
  }
];
