export const content = {
  intro: "When a DDR5 memory interface fails at validation, the root cause is almost never the chip — it is the PCB. Signal Integrity (SI) and Power Integrity (PI) are the two disciplines that determine whether electrons arrive at the right place, at the right time, with the right voltage. This module is the authoritative SI/PI engineering reference, anchored in IPC-2141A, JEDEC JESD79-5B, PCI-SIG CEM Spec, and IEEE 802.3. Master these principles to design boards that pass compliance testing on the first spin.",
  sections: [
    {
      heading: "SI Core: Transmission Line Standards",
      content: "Every PCB trace behaves as a transmission line when the signal's rise time is faster than twice the propagation delay of that trace. At that point, characteristic impedance (Z₀) is no longer optional — it is mandatory. Interface standards define exact Z₀ targets with tight tolerances.",
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
      content: "Differential signaling provides inherent common-mode noise rejection. Maintaining geometry symmetry along the entire route is the primary task of the layout engineer — any break in symmetry becomes a source of mode conversion and EMI.",
      list: [
        { label: "Intra-pair Spacing (S)", text: "Set to 2× Trace Width (W) to maintain target odd-mode impedance. Keep S constant for the entire routed length." },
        { label: "Intra-pair Skew", text: "Must be ≤ 5 mils for DDR4/5; ≤ 10ps max for multi-Gbps serial links. Use meanders within the coupled region, never at the end of the route." },
        { label: "Inter-pair Spacing", text: "Maintain ≥ 3× W (5× W preferred) to reduce crosstalk coupling below -40 dB. Violating this forces re-simulation." },
        { label: "Reference Continuity", text: "Place a GND stitching via within 50 mils of any signal via that changes reference layers. Discontinuous return paths are the #1 source of EMI failures." }
      ],
      alerts: [
        { type: 'danger', text: "Never route high-speed signals across plane splits. The resulting return path detour causes massive EMI radiation and crosstalk failures." }
      ]
    },
    {
      heading: "BGA Escape & Fanout Design (IPC-7095C)",
      content: "Breaking out signals from fine-pitch BGAs (0.8mm to 0.4mm) is the most geometry-constrained task in layout. Strategy selection directly impacts layer count, via technology, and fabrication cost — this decision must be made before placement is finalized.",
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
      heading: "Decoupling Capacitor Engineering",
      content: "Every capacitor has a Self-Resonant Frequency (SRF) — below SRF it behaves capacitively (desired), above SRF it becomes inductive (harmful). The goal of decoupling is not filtering but charge delivery: pre-charging a local reservoir so the IC demand is met within the required response time.",
      filletGrid: [
        {
          title: "ESR — Series Resistance",
          color: "orange",
          list: [
            { label: "Definition", text: "Equivalent Series Resistance — the resistive loss in the capacitor." },
            { label: "Impact", text: "Sets the impedance floor at SRF. Lower ESR = lower impedance at resonance." },
            { label: "Best Practice", text: "X7R/X5R MLCCs have ESR ~10–30 mΩ. Tantalum ESR is 100–500 mΩ." }
          ]
        },
        {
          title: "ESL — Series Inductance",
          color: "cyan",
          list: [
            { label: "Definition", text: "Equivalent Series Inductance — parasitic inductance of the capacitor body and leads." },
            { label: "Impact", text: "Determines the SRF. ESL of a 0402 MLCC ≈ 0.5–1.5 nH. Smaller packages (0201, 01005) have lower ESL." },
            { label: "Best Practice", text: "Two vias per capacitor pad cuts the loop inductance in half. Hot vias (close to pad) are critical." }
          ]
        },
        {
          title: "SRF — Self-Resonant Frequency",
          color: "green",
          list: [
            { label: "Definition", text: "The frequency where C and ESL resonate — the capacitor is purely resistive at this point." },
            { label: "Impact", text: "Above SRF, the capacitor behaves like an inductor and provides no decoupling." },
            { label: "Best Practice", text: "Target SRF at or above the highest harmonic of the switching frequency to ensure coverage." }
          ]
        }
      ],
      formula: {
        title: "Self-Resonant Frequency Calculation",
        equations: [
          "SRF = 1 / (2π × √(L_ESL × C))",
          "Example: C = 100nF, ESL = 1nH → SRF ≈ 15.9 MHz"
        ],
        variables: [
          { name: "SRF", desc: "Self-Resonant Frequency (Hz)", tag: "OUTPUT" },
          { name: "L_ESL", desc: "Equivalent Series Inductance (H) (0.5–1.5 nH)", tag: "INPUT" },
          { name: "C", desc: "Capacitance (F)", tag: "INPUT" }
        ]
      },
      table: {
        headers: ["Decoupling Tier", "Cap Value", "Package", "Approx. SRF", "Frequency Coverage"],
        rows: [
          ["Bulk / VRM", "100µF – 1mF", "TH / SMD 1210", "< 1 MHz", "DC to 100 kHz — slow load transients"],
          { type: 'highlight', data: ["Mid-Frequency", "100nF – 1µF", "0402 / 0603", "10–100 MHz", "1 MHz – 100 MHz — mid-range switching noise"] },
          ["High-Frequency", "10nF – 100nF", "0201 / 0402", "100 MHz – 500 MHz", "100 MHz – 500 MHz — fast transients near IC pins"],
          ["Ultra-High-Freq", "1nF – 10nF", "01005 / 0201", "500 MHz – 2 GHz", "> 500 MHz — under-BGA, die-level demand"]
        ]
      },
      alerts: [
        { type: 'info', text: "A capacitor is anti-resonant with adjacent capacitors of different values — the parallel combination creates impedance peaks. SPICE simulation is required to verify the composite impedance curve when mixing multiple cap values." },
        { type: 'warning', text: "Never place decoupling caps more than 5mm from the IC power pin. Every mm of trace adds ~0.7 nH of inductance — directly raising the PDN impedance at high frequencies." }
      ]
    },
    {
      heading: "PDN Target Impedance — Theory & Formula",
      content: "The Power Distribution Network (PDN) must maintain its impedance below a critical threshold — the Target Impedance (Ztarget) — from DC up to the maximum frequency of switching current events. This is the governing design constraint for all PI work.",
      formula: {
        title: "Target Impedance Derivation (JEDEC / Intel PDN Methodology)",
        equations: [
          "Ztarget = (Vdd × Ripple%) / ΔI_transient",
          "Example: Vdd=1.1V, Ripple=5%, ΔI=10A → Ztarget = (1.1 × 0.05) / 10 = 5.5 mΩ"
        ],
        variables: [
          { name: "Ztarget", desc: "Maximum allowable PDN impedance (mΩ)", tag: "OUTPUT" },
          { name: "Vdd", desc: "Rail voltage (V)", tag: "INPUT" },
          { name: "Ripple%", desc: "Allowable voltage ripple percentage", tag: "INPUT" },
          { name: "ΔI_transient", desc: "Peak transient current step (A)", tag: "INPUT" }
        ]
      },
      table: {
        headers: ["Interface / Device", "Vdd (V)", "Ripple Budget", "Typical ΔI (A)", "Ztarget Estimate"],
        rows: [
          ["DDR4 DRAM (VDDQ)", "1.2 V", "±3% (36 mV)", "2–4 A", "9–18 mΩ"],
          { type: 'highlight', data: ["DDR5 DRAM (VDDQ)", "1.1 V", "±2% (22 mV)", "3–6 A", "3.7–7.3 mΩ"] },
          ["Modern FPGA Core", "0.9 V", "±5% (45 mV)", "15–40 A", "1.1–3 mΩ"],
          ["PCIe Gen 5 Host CPU", "0.8 V", "±5% (40 mV)", "30–80 A", "0.5–1.3 mΩ"],
          ["General ASIC / SoC", "1.0 V", "±5% (50 mV)", "5–20 A", "2.5–10 mΩ"]
        ]
      },
      alerts: [
        { type: 'danger', text: "A PDN impedance peak that exceeds Ztarget — even at a single frequency — causes voltage droop that corrupts data. Post-layout PDN simulation is mandatory for DDR5 and PCIe Gen 4+ designs." },
        { type: 'info', text: "The PDN loop consists of VRM output impedance + plane spreading impedance + decoupling cap network. Each stage dominates a different frequency decade and must be designed as a system, not independently." }
      ]
    },
    {
      heading: "PDN Target Impedance Solver (Interactive)",
      content: "Calculate the required Target Impedance for your PDN based on peak transient current (ΔI) and allowable ripple (ΔV). Use the result to specify your decoupling strategy and validate against simulation.",
      type: "pi-target-calc"
    },
    {
      heading: "Decoupling Hierarchy & Via Physics",
      content: "Capacitors are only effective below their Self-Resonant Frequency. A cascaded multi-tier strategy covers the full frequency spectrum from DC (VRM domain) to the GHz range (die-level demand). Each tier transitions seamlessly into the next.",
      filletGrid: [
        {
          title: "Bulk / VRM (DC–100kHz)",
          color: "blue",
          list: [
            { label: "Value", text: "100µF – 1mF Tantalum or Polymer." },
            { label: "Role", text: "Supplies slow load transients. Placed near VRM output." },
            { label: "ESR Note", text: "Higher ESR than MLCC — acceptable at these low frequencies." }
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
        { type: 'info', text: "Via placement is critical. Vias must be immediately adjacent to capacitor pads to keep loop inductance < 100 pH. A via placed 1mm away from the cap pad adds ~0.7 nH — raising impedance by 4.4 Ω at 1 GHz." }
      ]
    },
    {
      heading: "Via Stub Resonance & Back-Drilling",
      content: "Every through-hole via that does not connect to all layers creates a stub — an unterminated transmission line segment that resonates at a specific frequency. At PCIe Gen 4+ data rates (≥16 GT/s), via stubs are the single most common cause of channel compliance failures.",
      formula: {
        title: "Via Stub Resonant Frequency",
        equations: [
          "f_resonance = c / (4 × L_stub × √εr_eff)",
          "Example: L_stub = 40 mil (1mm), εr_eff = 4.0 → f_res ≈ 3.75 GHz"
        ],
        variables: [
          { name: "f_resonance", desc: "Resonant frequency of the via stub (GHz)", tag: "OUTPUT" },
          { name: "L_stub", desc: "Physical stub length (m) — unused via barrel below signal connection", tag: "INPUT" },
          { name: "εr_eff", desc: "Effective dielectric constant of via barrel region", tag: "INPUT" },
          { name: "c", desc: "Speed of light (3×10⁸ m/s)", tag: "CONST" }
        ]
      },
      list: [
        { label: "Back-Drilling (Controlled Depth Drilling)", text: "Manufacturing process that removes the via stub by drilling from the back of the board to within 5–8 mils of the last signal connection layer. Eliminates the resonance. Specify ±3 mil drill depth tolerance in fab notes." },
        { label: "Blind Vias", text: "Connects only from the top/bottom surface to a specific inner layer — no stub exists. HDI process, adds 15–30% fabrication cost per layer pair." },
        { label: "When to Back-Drill", text: "Required when via stub resonance falls within 2× the signal Nyquist frequency. For PCIe Gen 4 (8 GHz Nyquist), any stub > 20 mil must be back-drilled." }
      ],
      alerts: [
        { type: 'danger', text: "PCIe Gen 4 and Gen 5 channel compliance specifications (PCI-SIG) explicitly require via stub analysis. A board without back-drilling at these data rates will almost certainly fail the insertion loss mask (S21) at the stub resonant frequency." }
      ],
      type: 'via-resonance-calc'
    },
    {
      heading: "Crosstalk — NEXT & FEXT Fundamentals",
      content: "Crosstalk occurs when the electromagnetic field of one trace induces a voltage on an adjacent trace. It is the #1 root cause of marginal signal integrity on production boards. Two distinct mechanisms exist, determined by the relative position of the aggressor signal and the observation point.",
      formula: {
        title: "Crosstalk Coupling Coefficient (Kf / Kb)",
        equations: [
          "Kf (FEXT) = (T_d / 2) × (Cm/C0 - Lm/L0)  // Forward coupling",
          "Kb (NEXT) = (1/4) × (Cm/C0 + Lm/L0)       // Backward coupling",
          "NEXT (dB) = 20 × log10(Kb × V_aggressor / V_victim)"
        ],
        variables: [
          { name: "Cm", desc: "Mutual capacitance per unit length (F/m)", tag: "CALC" },
          { name: "Lm", desc: "Mutual inductance per unit length (H/m)", tag: "CALC" },
          { name: "C0, L0", desc: "Self capacitance/inductance per unit length", tag: "CALC" },
          { name: "T_d", desc: "Propagation delay of the coupled region", tag: "INPUT" }
        ]
      },
      table: {
        headers: ["Coupling Type", "Observed At", "Worst Case", "Primary Mitigation"],
        rows: [
          ["NEXT (Near-End)", "Aggressor source end", "Stronger — coupling adds over time", "Increase inter-pair spacing (≥ 3× W)"],
          { type: 'highlight', data: ["FEXT (Far-End)", "Aggressor receive end", "Weaker in microstrip; significant in stripline", "Tighter differential routing, orthogonal routing"] },
          ["Broadside Coupling", "Parallel stacked traces", "Very strong — 3–5× worse than edge coupling", "Avoid parallel routing on adjacent inner layers"]
        ]
      },
      ruleCards: [
        {
          number: "01",
          title: "Minimum Inter-Pair Spacing",
          severity: "danger",
          body: "Maintain ≥ 3× Trace Width (W) edge-to-edge between differential pairs. For 4 mil traces: min spacing = 12 mils. Preferred is 5× W (20 mils) for NEXT margin > 40 dB. This rule applies for the full parallel coupled length."
        },
        {
          number: "02",
          title: "Minimize Parallel Coupling Length",
          severity: "danger",
          body: "The crosstalk voltage scales linearly with the coupled length. Route aggressor and victim traces to minimize parallel runs. A 90° crossing has near-zero crosstalk. Use 45° angle of incidence at crossings to minimize coupling time."
        },
        {
          number: "03",
          title: "Avoid Broadside Routing on Adjacent Layers",
          severity: "warning",
          body: "Traces on adjacent inner layers that overlap in the XY plane create broadside coupling — 3–5× stronger than edge coupling. Route signals on adjacent signal layers orthogonally (H/V or ±45°) to break coupling geometry."
        },
        {
          number: "04",
          title: "Crosstalk Budget Verification",
          severity: "info",
          body: "NEXT + FEXT combined must remain < -30 dB at the receiver for robust margin. For DDR5 and PCIe Gen 5, field solver simulation (Ansys HFSS / Cadence Sigrity) is mandatory — analytical formulas are insufficient."
        }
      ]
    },
    {
      heading: "S-Parameters & Frequency-Domain Compliance",
      content: "All high-speed interface compliance standards (PCIe, USB, HDMI, CEI) are specified in the frequency domain using S-parameters (Scattering Parameters). Time-domain simulation cannot replace frequency-domain analysis for compliance sign-off. Understanding S-parameters is non-negotiable for PCIe Gen 4+ and DDR5 designs.",
      formula: {
        title: "Key S-Parameter Definitions",
        equations: [
          "S11 (dB) = Return Loss = 20·log10(V_reflected / V_incident)  // Input match",
          "S21 (dB) = Insertion Loss = 20·log10(V_transmitted / V_incident)  // Signal loss",
          "IL budget: IL_total = IL_trace + IL_via + IL_connector + IL_pkg < mask_limit"
        ],
        variables: [
          { name: "S11", desc: "Return loss — reflected power at port 1 (ideally < -10 dB)", tag: "OUTPUT" },
          { name: "S21", desc: "Insertion loss — transmitted power from port 1 to 2 (ideally > limit)", tag: "OUTPUT" },
          { name: "IL budget", desc: "Total insertion loss must stay within the compliance mask", tag: "SYSTEM" }
        ]
      },
      table: {
        headers: ["Interface", "Nyquist Freq.", "S21 Mask at Nyquist", "S11 Limit", "Test Standard"],
        rows: [
          ["PCIe Gen 3 (8 GT/s)", "4 GHz", "≥ -12 dB", "< -10 dB", "PCI-SIG CEM 3.0"],
          ["PCIe Gen 4 (16 GT/s)", "8 GHz", "≥ -20 dB", "< -8 dB", "PCI-SIG CEM 4.0"],
          { type: 'highlight', data: ["PCIe Gen 5 (32 GT/s)", "16 GHz", "≥ -36 dB", "< -6 dB", "PCI-SIG CEM 5.0"] },
          ["USB 3.2 Gen 2 (10 Gbps)", "5 GHz", "≥ -17 dB", "< -10 dB", "USB 3.2 §6.7"],
          ["DDR5 (6400 Mbps/pin)", "3.2 GHz", "Per JEDEC channel mask", "Per JEDEC", "JEDEC JESD79-5B"]
        ]
      },
      alerts: [
        { type: 'info', text: "S-parameters are measured using a Vector Network Analyzer (VNA) with calibrated SMA or PCIe connector fixturing. The TDR (Time Domain Reflectometry) is the complementary time-domain view — impedance discontinuities visible in TDR will show as S11 peaks in the frequency domain." },
        { type: 'warning', text: "PCIe Gen 5 at 16 GHz has an insertion loss budget of only ~36 dB — consumed primarily by the connector (~15 dB), leaving less than 21 dB for the PCB trace. Low-loss laminates (Dk 3.1, Df 0.002) and VLP copper are mandatory." }
      ]
    },
    {
      heading: "Eye Diagram, Jitter & Bathtub Curves",
      content: "The Eye Diagram is the universal pass/fail criterion for all high-speed serial interfaces. It is an oscilloscope persistence plot where thousands of bit transitions are overlaid. A wide-open eye = passing; a closed or noisy eye = failing. Every compliance specification defines a minimum eye mask that the measured waveform must not violate.",
      filletGrid: [
        {
          title: "Eye Height",
          color: "green",
          list: [
            { label: "Definition", text: "Vertical opening of the eye — voltage margin between '1' and '0' levels." },
            { label: "Degradation", text: "Reduced by ISI (Inter-Symbol Interference), reflections, and power supply noise." },
            { label: "Spec Example", text: "PCIe Gen 5: Eye Height ≥ 15 mV at the receiver input after equalization." }
          ]
        },
        {
          title: "Eye Width & Jitter",
          color: "cyan",
          list: [
            { label: "Definition", text: "Horizontal opening — time margin around the sampling point." },
            { label: "Jitter Types", text: "Total Jitter (TJ) = Deterministic Jitter (DJ) + Random Jitter (RJ×σ). DJ is bounded; RJ is unbounded (Gaussian)." },
            { label: "DDR5 Limit", text: "CK skew ≤ ±5 ps per byte lane. Violation causes setup/hold margin failure." }
          ]
        },
        {
          title: "Bathtub Curve",
          color: "orange",
          list: [
            { label: "Definition", text: "Statistical plot of bit error rate (BER) vs. sampling time position — shape looks like a bathtub cross-section." },
            { label: "Target BER", text: "System BER target is typically 10⁻¹² (one error per trillion bits)." },
            { label: "Usage", text: "Used to extrapolate eye opening at the target BER when direct measurement is impractical." }
          ]
        }
      ],
      table: {
        headers: ["Jitter Type", "Symbol", "Cause", "PCB Mitigation"],
        rows: [
          ["Deterministic Jitter", "DJ", "ISI, crosstalk, SSO, EMI coupling", "Controlled impedance, return paths, length matching"],
          { type: 'highlight', data: ["Random Jitter", "RJ", "Thermal noise, VCO phase noise in PLL", "Clean PDN (low ripple), reference clock filtering"] },
          ["Data-Dependent Jitter", "DDJ", "Bandwidth limiting causing pattern-dependent transitions", "Adequate channel bandwidth, pre-emphasis/equalization"],
          ["Periodic Jitter", "PJ", "Switching regulator noise coupling into clock rail", "Spatially separate VRM from clock routing, filtered VDDPLL"]
        ]
      },
      alerts: [
        { type: 'info', text: "Modern high-speed transceivers use equalization (Tx pre-emphasis, Rx CTLE/DFE) to partially compensate for channel loss. However, equalization cannot fix impedance discontinuities, via stubs, or connector resonances — these must be solved in the PCB layout." }
      ]
    },
    {
      heading: "Lossy Line Physics (Expert Insight)",
      content: "At frequencies > 10 GHz, the ideal 'lossless' transmission line model becomes invalid. Four distinct physical mechanisms attenuate signals — each must be modeled separately in a field solver. Understanding these effects determines material selection for high-speed designs.",
      cards: [
        {
          title: "Dielectric Loss (Tan δ)",
          text: "Absorption of energy by the resin/glass. Specify Low-Loss materials (Megtron 6/7) for PCIe Gen 5+."
        },
        {
          title: "Skin Effect & Roughness",
          text: "Current crowds to the copper surface. Rough copper (STD) increases resistance by 30% over VLP copper."
        },
        {
          title: "Fiber Weave Effect",
          text: "Differential pairs crossing glass bundles experience skew due to varying Dk. Use 'spread glass' or rotate routing 10°."
        },
        {
          title: "Surface Finish Impact",
          text: "Nickel in ENIG is magnetic and increases insertion loss at high frequencies. Prefer Immersion Silver or OSP."
        }
      ]
    },
    {
      heading: "Recommended 6-Layer Stackup for SI/PI",
      content: "For high-performance designs requiring both excellent SI (controlled impedance) and PI (distributed decoupling), the 6-layer stackup provides a balanced approach. Layer assignment is driven by reference plane adjacency requirements.",
      stackVisual: [
        { layer: "L1 — Signal (Top)", spec: "High-Speed Microstrip", color: "#D4963A", note: "Referenced to L2 GND" },
        { layer: "L2 — Ground (GND)", spec: "Solid Copper Plane", color: "#888780", note: "Primary Reference" },
        { layer: "L3 — Signal (Stripline)", spec: "Internal Signals Only", color: "#378ADD", note: "Referenced to L2+L4. Do NOT mix power islands here." },
        { layer: "L4 — Ground (GND)", spec: "Solid Copper Plane", color: "#888780", note: "Primary Reference" },
        { layer: "L5 — Power (VCC)", spec: "Copper Pour", color: "#378ADD", note: "Main distribution layer" },
        { layer: "L6 — Signal (Bot)", spec: "Microstrip", color: "#D4963A", note: "Referenced to L5" }
      ],
      alerts: [
        { type: 'warning', text: "L3 shown as a dedicated signal layer. Mixing power distribution on L3 is an anti-pattern that degrades both SI (reference plane discontinuity) and PI (poor PDN return path). Keep L3 as signal-only for performance-critical designs." },
        { type: 'info', text: "Maintain thin dielectric (≤ 4 mils) between L4 GND and L5 PWR to maximize distributed plane capacitance for high-frequency decoupling. This plane-pair is effectively a zero-ESL capacitor at 100 MHz–1 GHz." }
      ]
    },
    {
      heading: "Simulation & Validation Pipeline",
      content: "No PCB design above 3 Gbps should proceed to fabrication without simulation sign-off. The industry pipeline moves from pre-layout topology simulation through post-layout extraction to physical measurement — each stage gates the next.",
      twoColumnGrid: [
        {
          badge: "Software Suite",
          badgeClass: "tool-badge-cadence",
          title: "Industry Standard Tools",
          items: [
            "Ansys SIwave — Full-wave PDN analysis, EMI, via modeling",
            "Ansys HFSS — 3D field solver for connectors, packages, transitions",
            "Cadence Sigrity PowerDC — DC IR-drop analysis",
            "Cadence SystemSI — IBIS-based channel simulation",
            "Siemens HyperLynx — LineSim (pre-layout) + BoardSim (post-layout)",
            "Keysight ADS / PathWave — S-parameter / eye diagram simulation"
          ]
        },
        {
          badge: "Hardware Lab",
          badgeClass: "tool-badge-altium",
          title: "Measurement Equipment",
          items: [
            "High-bandwidth Oscilloscope (≥ 4× signal bandwidth, e.g., 50 GHz for Gen 5)",
            "TDR — Time Domain Reflectometry for impedance profiling",
            "VNA — Vector Network Analyzer for S-parameter measurement",
            "Spectrum Analyzer + Near-field probes for EMI source identification",
            "BERT — Bit Error Rate Tester for statistical BER / bathtub measurement",
            "PDN probe / power supply noise analyzer for Ztarget verification"
          ]
        }
      ]
    }
  ],
  checklists: [
    {
      category: "Pre-Layout SI/PI Foundations",
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
      category: "Post-Layout Engineering Verification",
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
      category: "Fabrication & Validation Sign-Off",
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
};
