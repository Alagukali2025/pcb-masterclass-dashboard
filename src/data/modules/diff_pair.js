export const content = {
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
      heading: "Differential Signaling SI",
      content: "Differential pairs require tight skew control (intra-pair matching) to maintain common-mode rejection and reduce EMI radiation."
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
};
