export const content = {
  intro: "A professional PCB design is only as good as its release package. This system provides a Single Source of Truth for manufacturing outputs, bridging the gap between CAD design intent and physical production reality. From legacy Gerber RS-274X to modern IPC-2581 digital twins, this module ensures zero-defect handoffs to fab and assembly houses.",
  sections: [
    {
      heading: "1. Fabrication Output Files (The Photoplot)",
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
      content: "Beyond the BOM, the Pick-and-Place (Centroid) and Solder Paste (Stencil) files determine the quality of your SMT process.",
      list: [
        "<strong>PnP Rotation:</strong> Ensure 0° orientation matches the tape-and-reel standard (EIA-481). Centroids must be center-of-gravity, not Pin 1.",
        "<strong>Stencil Area Ratio:</strong> For small pads (0201 or BGA), ensure Area Ratio = [Area of Aperture] / [Area of Walls] > 0.66 to ensure solder release.",
        "<strong>Fiducials:</strong> Include 3 global fiducials (1.0mm pad, 2.0mm mask opening) in a non-collinear arrangement for robotic alignment."
      ]
    },
    {
      heading: "4. Advanced Formats: ODB++ & IPC-2581",
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
      content: "A professional release should be structured to allow automated CAM scripts to parse the data without manual intervention.",
      codeBlock: "PROJECT_REL_v1.0/\n├── Fabrication/          ; Gerbers, Drill, Fab Drawing\n├── Assembly/             ; PnP, BOM, Asm Drawing, Stencil\n├── Test/                 ; IPC-D-356, TP Report, BSDL\n└── Documentation/        ; Schematics, Stackup, DRC Reports",
      list: [
        "<strong>Naming:</strong> PROJECT_LAYER_v1.0_YYYYMMDD. Use underscores; avoid spaces which break CAM scripts.",
        "<strong>Integrity:</strong> Include an MD5 or SHA-256 checksum for the ZIP archive to verify transmission integrity."
      ]
    },
    {
      heading: "8. Technical Appendix: Test & PnP Metadata",
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
      content: "Execute a virtual production release flow that performs professional-grade DFM and metadata checks on your export package.",
      type: "output-simulator"
    }
  ],
  checklists: [
    {
      category: "1. Baseline Verification (Industrial Standards)",
      items: [
        "All copper, mask, and silk layers are present.",
        "NC Drill file uses metric units and TZ suppression.",
        "Board outline (profile) is included and sized correctly.",
        "BOM exported with MPNs and Correct Quantities."
      ]
    },
    {
      category: "2. Engineering Integrity (Physics & Simulation)",
      items: [
        "Gerber X2/X3 used; metadata verified in a CAM viewer.",
        "IPC-D-356 Netlist matches the Gerber artwork 100%.",
        "PnP rotation verified against Pin 1 tape-and-reel standards.",
        "Mask dams verified for fine-pitch BGAs (≥ 4 mil)."
      ]
    },
    {
      category: "3. High-Yield Manufacturing & Reliability",
      items: [
        "Acute angle acid traps eliminated via teardrops/chamfers.",
        "Sliver check performed; min copper feature > 4 mil.",
        "Differential pair length matching verified in output report.",
        "Thermal pad stencil reduction (40-60%) applied to all QFNs.",
        "Fab Drawing specifies impedance tolerances (±10%) and surface finish (ENIG/OSP)."
      ]
    }
  ]
};
