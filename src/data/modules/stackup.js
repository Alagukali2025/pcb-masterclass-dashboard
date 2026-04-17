export const content = {
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
      heading: "Copper Balancing for Lamination Quality",
      content: "Resin starvation occurs during the lamination press cycle if one side of the board has significantly higher copper density than the other, leading to board warpage (bow and twist).",
      list: [
        { label: "The Resin Starvation Risk", text: "Prepreg resin flows toward empty copper areas. If one layer is 'starved,' the board becomes unstable." },
        { label: "Copper Thieving", text: "Adding 'dead' copper pads or pours in open board areas to equalize the copper density and resin flow." },
        { label: "Lamination Balance", text: "Maintain a symmetric copper density (±10%) about the board's vertical center plane." }
      ],
      alerts: [
        { type: 'info', text: "Copper density balance (target ±10%) is one of the rules validated in the DFM Rule Checker. Run the full DFM verification in the DFM/DFT Mastery module after stackup is finalized." }
      ]
    },
    {
      heading: "DFM Validation — Key Stackup Rules",
      content: "Before finalizing your stackup, verify these three critical IPC-2221B manufacturing limits that are directly driven by stackup geometry decisions:",
      list: [
        { label: "Aspect Ratio (IPC-2221B)", text: "Board Thickness ÷ Smallest Drill Diameter must be ≤ 10:1 for standard fab, ≤ 12:1 maximum. A 1.6mm board with a 0.2mm drill = 8:1 — acceptable. With 0.1mm drill = 16:1 — will cause plating failures." },
        { label: "Copper-to-Drill Clearance", text: "Minimum 0.125mm (5 mil) from drill edge to nearest copper on adjacent layers. Verify after all via assignments are defined in the stackup." },
        { label: "Copper Density Balance", text: "Copper coverage on symmetric layer pairs (L1/L8, L2/L7, etc.) should be within ±10%. Use the Copper Thieving pattern from the section above to equalize." }
      ],
      type: 'cross-ref',
      refModuleId: 'dfm_dft',
      refLabel: 'Run Full Interactive DFM Rule Checker → DFM / DFT Mastery',
      refDesc: 'The interactive DFM Rule Checker validates all three rules above in real time against IPC-2221B and IPC-6012 limits. It is the canonical DFM verification tool, located in the DFM / DFT Mastery module.'
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
        headers: ["Standard", "Title", "Design Hub Application"],
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
};
