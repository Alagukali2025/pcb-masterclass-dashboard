import { Cpu, Layers, Merge, Zap, MemoryStick, ShieldAlert, Factory, Activity } from 'lucide-react';

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
              ["Courtyard clearance", "IPC-7351B §4.1", "Ensures pick-and-place nozzle clearance (min 0.25mm)"],
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
              ["Silkscreen clearance", "IPC-7351B §3.6", "Min 0.10mm from copper"],
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
              ["Min pad width", "0.20 mm", "CM Capability", "Trace definition failure"],
              ["Min pad-to-pad gap", "0.15 mm", "IPC-2221A", "Solder bridging"],
              ["Min annular ring", "0.05 mm", "IPC-2221A", "Breakout / Open circuit"],
              ["Min drill size", "0.20 mm", "IPC-2221A", "Drill breakage"]
            ]
          }
        },
        {
          heading: "Assembly Tolerances (RSS)",
          content: "Statistical stack-up of fabrication and placement errors:",
          table: {
            headers: ["Source", "Symbol", "Value (Density B)", "Description"],
            rows: [
              ["Fabrication", "CL", "±0.10 mm", "Copper dimensional accuracy"],
              ["Placement", "CS", "±0.05 mm", "Pick-and-place precision"],
              ["Stencil", "CP", "±0.025 mm", "Paste printing registration"]
            ]
          },
          formula: {
            title: "RSS Combined Tolerance",
            equations: ["RMS = √(CL² + CS² + CP²) ≈ 0.114 mm"],
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
            "1. Create New Component in .PcbLib and enter metadata.",
            "2. Place SMD Pads at exact coordinates from IPC calculation.",
            "3. Draw Top Overlay (Silkscreen) with 0.10mm pad clearance.",
            "4. Draw Assembly Outline on Mechanical layer at body dimensions.",
            "5. Draw Courtyard at +0.25mm boundary (Density B).",
            "6. Set Origin to Component Centroid.",
            "7. Align manufacturer STEP model to assembly outline.",
            "8. Run Component Rule Check and release to library."
          ]
        },
        {
          heading: "Step-by-Step: Cadence Allegro",
          content: "Standard workflow for creating a managed footprint:",
          list: [
            "1. Create Padstack (.pad) in Padstack Editor first.",
            "2. File → New → Package Symbol (.dra) in Allegro.",
            "3. Layout → Pins to place pads using the created .pad files.",
            "4. Add → Line on Package_Geometry/Silkscreen_Top for body.",
            "5. Add → Line on Package_Geometry/Assembly_Top for assembly.",
            "6. Add → Rectangle on Place_Bound_Top for Courtyard.",
            "7. Setup → Change Drawing Origin to centroid.",
            "8. Check → Check Symbol to verify zero DRC violations."
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
            "Courtyard boundary drawn at correct clearance (0.25mm default).",
            "Pad-to-pad clearance meets IPC-2221A minimums for voltage class.",
            "Through-hole annular ring meets IPC-2221A Table 9-2 (Class 2/3).",
            "Any deviation from IPC-7351B documented with justification."
          ]
        },
        {
          category: "4. Layer Content Verification",
          items: [
            "Silkscreen: Body outline present; clearance ≥ 0.10mm from pads.",
            "Assembly: Exact component body outline at datasheet dimensions.",
            "Courtyard: Closed rectangle encompassing all pads and body.",
            "RefDes present on silkscreen; height ≥ 0.8mm; inside courtyard.",
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
