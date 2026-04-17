export const content = {
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
};
