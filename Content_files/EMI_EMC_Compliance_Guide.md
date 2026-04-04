# EMI/EMC COMPLIANCE GUIDE FOR PCB DESIGN ENGINEERS

**A Comprehensive Reference from Beginner to Expert Level**

---

## DOCUMENT OVERVIEW

This guide provides industry-standard EMI/EMC compliance practices based on:
- International Standards (CISPR, IEC, FCC)
- Electromagnetic Theory (Maxwell's Equations fundamentals)
- Component Manufacturer Guidelines
- Real-world compliance testing experience

**Target Audience:** PCB Design Engineers, Hardware Engineers, Compliance Engineers

---

## 1. EMI/EMC BASICS (BEGINNER LEVEL)

### 1.1 What is EMI (Electromagnetic Interference)?

**Definition:** Electromagnetic Interference (EMI) is unwanted electromagnetic energy that disrupts the operation of electronic devices or systems.

**Source:** IEC 61000-1-1, Clause 3.1.6

**Physical Basis:** 
- Based on Maxwell's Equations: changing electric fields create magnetic fields and vice versa
- Any conductor carrying time-varying current generates electromagnetic fields
- These fields can couple into nearby circuits through radiation or conduction

**Real-World Examples:**
- Mobile phone causing speaker buzz
- Fluorescent light interfering with AM radio
- Computer monitor displaying noise lines when nearby equipment operates

---

### 1.2 What is EMC (Electromagnetic Compatibility)?

**Definition:** Electromagnetic Compatibility (EMC) is the ability of equipment to:
1. **Function satisfactorily** in its electromagnetic environment without introducing intolerable electromagnetic disturbances to anything in that environment
2. **Not generate** excessive electromagnetic energy
3. **Operate correctly** in the presence of electromagnetic energy from other sources

**Source:** IEC 61000-1-1, Clause 3.1.3

**Key Principle:** EMC = Emission Control + Immunity

---

### 1.3 Difference Between EMI and EMC

| Aspect | EMI | EMC |
|--------|-----|-----|
| **Definition** | The interference itself (the problem) | The compatibility (the solution/goal) |
| **Focus** | Unwanted electromagnetic energy | Coexistence of electronic equipment |
| **Perspective** | Disturbance source | System-level approach |
| **Measurement** | Emission levels (dBμV, dBm) | Pass/Fail compliance testing |
| **Standards Coverage** | Emission limits (CISPR 32) | Emission + Immunity (IEC 61000 series) |

**Analogy:** EMI is the "noise pollution," EMC is "noise ordinance compliance + ability to work despite ambient noise"

---

### 1.4 Types of EMI

#### 1.4.1 Radiated Emissions

**Definition:** Electromagnetic energy propagating through space (air) from a source

**Source:** CISPR 32:2015, Clause 3.1.26

**Frequency Range (Typical Regulatory):**
- 30 MHz to 1 GHz (CISPR 32, FCC Part 15)
- Extended to 6 GHz for some equipment classes

**Physical Mechanism:**
- Any conductor with time-varying current acts as an antenna
- Radiation efficiency increases with:
  - Frequency (λ = c/f, smaller wavelengths radiate more efficiently)
  - Physical dimensions approaching λ/10 or greater
  - Current magnitude

**Common Sources in PCBs:**
- Clock traces (fundamental + harmonics)
- Switching power supply traces
- I/O cables connected to PCB
- Poorly designed differential pairs

**Impact if Not Controlled:**
- Failed compliance testing (CISPR 32, FCC Part 15)
- Interference with wireless communications
- Product cannot be sold legally in regulated markets

---

#### 1.4.2 Conducted Emissions

**Definition:** Electromagnetic noise traveling along conductors (power lines, signal cables)

**Source:** CISPR 32:2015, Clause 3.1.8

**Frequency Range (Typical Regulatory):**
- 150 kHz to 30 MHz (CISPR 32, FCC Part 15)

**Physical Mechanism:**
- High-frequency currents flowing on power lines or cables
- Common-mode current (current flowing in same direction on both conductors)
- Differential-mode current (current flowing in opposite directions)

**Measurement Method:**
- Line Impedance Stabilization Network (LISN) per CISPR 16-1-2
- LISN provides:
  - 50Ω measurement impedance
  - Isolation from grid noise
  - Defined impedance for reproducible measurements

**Common Sources:**
- Switching power supplies (SMPS noise)
- Digital circuitry feeding back to power lines
- Poor input filtering

**Impact if Not Controlled:**
- Failed compliance testing
- Interference with other equipment on same power grid
- Potential damage to sensitive equipment

---

### 1.5 Types of Susceptibility (Immunity)

#### 1.5.1 Radiated Immunity

**Definition:** Ability of equipment to operate correctly when exposed to radiated electromagnetic fields

**Standard:** IEC 61000-4-3

**Test Levels (typical):**
- Level 1: 1 V/m
- Level 2: 3 V/m (common for residential/commercial)
- Level 3: 10 V/m (industrial)
- Level 4: 30 V/m (harsh industrial)

**Frequency Range:** 80 MHz to 6 GHz (extended based on equipment type)

**Why This Matters:**
- Nearby transmitters (walkie-talkies, cell phones, radio towers)
- Equipment must not malfunction, lose data, or shut down

**Impact if Failed:**
- System crashes near RF sources
- Data corruption
- User safety issues in critical applications

---

#### 1.5.2 Conducted Immunity

**Definition:** Ability to operate correctly when RF energy is coupled onto cables/conductors

**Standard:** IEC 61000-4-6

**Test Levels:**
- Level 1: 1 V
- Level 2: 3 V (common for residential/commercial)
- Level 3: 10 V (industrial)

**Frequency Range:** 150 kHz to 80 MHz

**Coupling Method:**
- Current injection via coupling/decoupling networks (CDN)
- EM clamp for cables

---

#### 1.5.3 ESD (Electrostatic Discharge)

**Definition:** Rapid transfer of electrostatic charge between bodies at different potentials

**Standard:** IEC 61000-4-2

**Test Levels:**
- Contact Discharge:
  - Level 1: ±2 kV
  - Level 2: ±4 kV (typical for consumer products)
  - Level 3: ±6 kV
  - Level 4: ±8 kV
- Air Discharge:
  - Level 1: ±2 kV
  - Level 2: ±4 kV
  - Level 3: ±8 kV
  - Level 4: ±15 kV

**Physical Model:**
- Human body model: 150 pF, 330Ω (IEC 61000-4-2)
- Peak current: up to 30A for 8 kV discharge
- Rise time: <1 ns (creates high-frequency content up to >1 GHz)

**Why Critical:**
- Human body charges to 2-10 kV in low humidity
- Direct contact with exposed pins/connectors
- Indirect discharge to chassis/enclosure

**Impact if Failed:**
- System lockup/reset
- Data corruption
- Component damage (gate oxide breakdown, latchup)

**Design Requirements:**
- ESD protection on all user-accessible pins
- Chassis grounding strategy
- TVS diodes, ESD suppression components

---

#### 1.5.4 EFT (Electrical Fast Transient)

**Definition:** Short-duration, high-repetition-rate transients (burst)

**Standard:** IEC 61000-4-4

**Test Levels (for power ports):**
- Level 1: ±0.5 kV
- Level 2: ±1 kV
- Level 3: ±2 kV (typical for industrial)
- Level 4: ±4 kV

**Waveform Characteristics:**
- Rise time: 5 ns
- Duration: 50 ns
- Repetition rate: 5 kHz or 100 kHz

**Source Origin:**
- Inductive load switching (relays, contactors, motors)
- Switch bounce
- Lightning (distant, induced effects)

**Why Critical:**
- Represents real-world industrial electrical noise
- Can couple into signal lines via capacitive/inductive coupling

**Impact if Failed:**
- False triggering of digital inputs
- Communication errors
- Temporary malfunction

---

#### 1.5.5 Surge

**Definition:** High-energy, low-frequency transient overvoltage

**Standard:** IEC 61000-4-5

**Test Levels (for power ports):**
- Level 1: ±0.5 kV (line-to-line), ±1 kV (line-to-ground)
- Level 2: ±1 kV (line-to-line), ±2 kV (line-to-ground)
- Level 3: ±2 kV (line-to-line), ±4 kV (line-to-ground)
- Level 4: ±4 kV (line-to-line), ±8 kV (line-to-ground)

**Waveform:** 1.2/50 μs (voltage), 8/20 μs (current)

**Source Origin:**
- Lightning strikes (nearby)
- Switching of heavy loads on power grid
- Power factor correction capacitor switching

**Why Critical:**
- Can destroy components (MOSFETs, ICs)
- Can cause fires if inadequate protection

**Impact if Failed:**
- Permanent component damage
- Fire hazard
- Safety certification failure

**Protection Required:**
- MOVs (Metal Oxide Varistors)
- TVS diodes
- Gas discharge tubes (GDTs)
- Fuses

---

## 2. REGULATORY STANDARDS & COMPLIANCE

### 2.1 Overview of Major Standards

#### 2.1.1 CISPR 32 (Multimedia Equipment Emissions)

**Full Title:** CISPR 32:2015 - Electromagnetic compatibility of multimedia equipment - Emission requirements

**Scope:**
- Multimedia equipment (computers, displays, audio/video equipment)
- Information Technology Equipment (ITE) when used in multimedia context
- Replaces CISPR 13 and CISPR 22

**Equipment Classes:**

| Class | Environment | Limit (stricter) | Typical Application |
|-------|-------------|------------------|---------------------|
| **Class A** | Industrial, commercial | Less strict | Industrial computers, test equipment |
| **Class B** | Residential | More strict (10 dB lower at some frequencies) | Consumer electronics, home computers |

**Source:** CISPR 32:2015, Clause 4

**Why Two Classes:**
- Residential areas have less ambient EMI tolerance
- Industrial areas have higher background noise
- Class B protects broadcast reception (AM/FM radio, TV)

**Frequency Bands and Limits (Radiated Emissions, Class B, 3m distance):**

| Frequency | Quasi-Peak Limit | Average Limit |
|-----------|------------------|---------------|
| 30-230 MHz | 30 dBμV/m | - |
| 230-1000 MHz | 37 dBμV/m | - |

**Note:** Actual limits vary by measurement distance, detector type, and frequency sub-bands

**Conducted Emissions Limits (Class B, Quasi-Peak):**

| Frequency | Limit (dBμV) |
|-----------|--------------|
| 150-500 kHz | 66-56 (decreasing) |
| 500 kHz-5 MHz | 56 |
| 5-30 MHz | 60 |

**Source:** CISPR 32:2015, Tables 3 and 5

---

#### 2.1.2 FCC Part 15 (USA)

**Full Title:** FCC Part 15 - Radio Frequency Devices

**Subparts:**
- **Subpart B:** Unintentional radiators (digital devices)
- **Subpart C:** Intentional radiators (transmitters)

**Equipment Classes (Subpart B):**

| Class | Description | Limit Level | Typical Use |
|-------|-------------|-------------|-------------|
| **Class A** | Commercial/industrial | Less strict | Industrial equipment |
| **Class B** | Residential | Strict | Consumer products |

**Source:** 47 CFR § 15.109

**Radiated Emissions Limits (Class B, measured at 3m):**

| Frequency | Limit (μV/m) | Limit (dBμV/m) |
|-----------|--------------|----------------|
| 30-88 MHz | 100 | 40 |
| 88-216 MHz | 150 | 43.5 |
| 216-960 MHz | 200 | 46 |
| Above 960 MHz | 500 | 54 |

**Source:** 47 CFR § 15.109(a)

**Conducted Emissions Limits (Class B):**

| Frequency | Quasi-Peak (dBμV) | Average (dBμV) |
|-----------|-------------------|----------------|
| 150-500 kHz | 66-56 (decreasing) | 56-46 (decreasing) |
| 500 kHz-5 MHz | 56 | 46 |
| 5-30 MHz | 60 | 50 |

**Source:** 47 CFR § 15.107(a)

**Key Requirement:** All digital devices must be authorized before marketing (Declaration of Conformity or Certification)

---

#### 2.1.3 IEC 61000 Series (International EMC Standard)

**Structure:** Multi-part standard covering all aspects of EMC

**Part Breakdown:**

| Part | Title | Content |
|------|-------|---------|
| **IEC 61000-1-x** | General | Fundamental definitions, application guides |
| **IEC 61000-2-x** | Environment | Description of EMC environment |
| **IEC 61000-3-x** | Limits | Emission limits for power system disturbances |
| **IEC 61000-4-x** | Testing & Measurement | Immunity test methods |
| **IEC 61000-5-x** | Installation & Mitigation | Guidelines for EMC protection |
| **IEC 61000-6-x** | Generic Standards | Emission and immunity for various environments |

**Most Relevant for PCB Design:**

- **IEC 61000-4-2:** ESD immunity testing
- **IEC 61000-4-3:** Radiated RF immunity
- **IEC 61000-4-4:** Electrical fast transient (EFT/burst)
- **IEC 61000-4-5:** Surge immunity
- **IEC 61000-4-6:** Conducted RF immunity
- **IEC 61000-4-8:** Power frequency magnetic field immunity
- **IEC 61000-6-3:** Emission standard for residential/commercial
- **IEC 61000-6-4:** Emission standard for industrial

---

#### 2.1.4 Automotive: ISO 11452, CISPR 25

**ISO 11452 Series:** Vehicle component immunity testing

**CISPR 25:** Vehicle component emissions

**Key Differences from Consumer Electronics:**
- Harsher environment (temperature, vibration, EMI)
- Lower voltage systems (12V/24V/48V), but moving to 400V+
- Proximity to high-power transmitters (vehicle radio)
- Safety-critical applications

**Frequency Ranges Extended:**
- CISPR 25: 150 kHz to 2.5 GHz (radiated emissions)

---

### 2.2 Certification Process

#### 2.2.1 Pre-Compliance Testing

**Purpose:**
- Identify EMI issues early in design phase
- Cost-effective compared to full compliance testing
- Iterative design improvement

**Methods:**
- Near-field probing (magnetic/electric field probes)
- Tabletop spectrum analyzer measurements
- Current probes on cables
- Simplified setups (not to standard, but indicative)

**Cost:** Approximately 5-10% of full compliance testing

**When to Perform:** After each major PCB revision

---

#### 2.2.2 Full Compliance Testing

**Process Flow:**

1. **Test Lab Selection**
   - Accredited lab (ISO/IEC 17025, A2LA, NVLAP)
   - Lab expertise in specific product category
   - Cost: $5,000 - $50,000+ depending on product complexity

2. **Test Setup**
   - Equipment Under Test (EUT) configured per end-use
   - All cables, peripherals representative of final product
   - Proper grounding per standard requirements

3. **Emissions Testing**
   - Conducted emissions (150 kHz - 30 MHz)
   - Radiated emissions (30 MHz - 1 GHz or higher)
   - Multiple configurations (ports loaded/unloaded, operational modes)

4. **Immunity Testing** (if required)
   - ESD, EFT, surge, radiated immunity, conducted immunity
   - Performance criteria: A (normal operation), B (temporary degradation, self-recoverable), C (temporary degradation, requires user intervention), D (permanent damage/loss of function)
   - Typical requirement: Criterion B minimum

5. **Report Generation**
   - Pass/Fail for each test
   - Margin to limits
   - Photos, setup descriptions

6. **Remediation** (if failed)
   - Identify failure modes
   - Design changes (filtering, shielding, layout)
   - Re-test (costly: $2,000 - $10,000+ per retest)

**Timeline:** 1-2 weeks for testing, additional time for fixes if needed

---

### 2.3 Test Environments

#### 2.3.1 Anechoic Chamber

**Definition:** Shielded room with RF-absorbing material on walls, preventing reflections

**Construction:**
- Outer shielded enclosure (copper, steel, aluminum)
- Inner lining: ferrite tiles or pyramidal foam absorbers
- Absorber material rated for specific frequency ranges (e.g., >1 GHz)

**Purpose:**
- Radiated emissions testing (simulates free-space conditions)
- Radiated immunity testing
- Antenna pattern measurements

**Standards:** CISPR 16-1-4 (test site characteristics)

**Typical Dimensions:** 3m, 10m, or 30m test distances

**Cost:** $500,000 - $5,000,000+ to construct

**Why Important:**
- Eliminates reflections that could skew measurements
- Reproducible results between labs
- Simulation of open-area conditions in controlled environment

---

#### 2.3.2 GTEM Cell (Gigahertz Transverse Electromagnetic Cell)

**Definition:** Asymmetric, tapered rectangular transmission line operating in TEM mode

**Advantages over Anechoic Chamber:**
- Smaller physical size
- Lower cost ($50,000 - $300,000)
- Faster testing (no turntable rotation needed)
- Good for pre-compliance

**Limitations:**
- Size limitations for EUT (Equipment Under Test)
- Not suitable for products with cables >1-2m
- Limited to certain frequencies (typically DC - 18 GHz)

**Standards:** IEC 61000-4-20

**Typical Use:**
- Pre-compliance emissions screening
- Immunity testing (can generate high field strengths efficiently)

---

#### 2.3.3 Open Area Test Site (OATS)

**Definition:** Outdoor test range with minimal reflective surfaces

**Construction:**
- Large flat ground plane (metal mesh or solid)
- Minimal nearby structures
- Clear line of sight

**Advantages:**
- True free-space conditions
- Low setup cost (if land available)

**Disadvantages:**
- Weather dependent
- Ambient RF noise (requires quiet site)
- Physical security concerns

**Standards:** CISPR 16-1-4

**Usage Trend:** Declining (chambers more practical)

---

## 3. EMI SOURCES IN PCB DESIGN (INTERMEDIATE LEVEL)

### 3.1 High-Speed Signals

#### 3.1.1 Clock Signals

**Why Clocks Are Major EMI Sources:**

1. **Periodic Waveform → Harmonics**
   - Fourier analysis: any periodic signal is sum of sinusoids
   - Square wave contains odd harmonics: f, 3f, 5f, 7f, ... ∞
   - Amplitude of nth harmonic: (4/nπ) × fundamental amplitude (for ideal square wave)

2. **Energy Distribution in Frequency Domain**
   - Example: 100 MHz clock (Tr = 1 ns):
     - Fundamental: 100 MHz
     - 3rd harmonic: 300 MHz
     - 5th harmonic: 500 MHz
     - Bandwidth extends to approximately 1/πTr ≈ 318 MHz (significant energy)

**Source:** Application notes from clock IC manufacturers (e.g., Silicon Labs AN256)

**Critical Parameter: Edge Rate (Rise Time)**

**Formula:** Maximum frequency content ≈ 0.35 / Tr (where Tr = 10%-90% rise time)

**Example:**
- Clock: 50 MHz, rise time 2 ns
- Significant harmonic content up to: 0.35 / 2ns = 175 MHz
- This overlaps with FM broadcast band (88-108 MHz) and other sensitive bands

**Impact:**
- Even "slow" clocks can radiate at high frequencies if edge rate is fast
- Trace acts as antenna (radiation increases when trace length > λ/20)

**Mitigation Strategies:**
1. Slow down edge rates (only as fast as needed)
   - Source termination resistors
   - Select clock drivers with controlled slew rates
2. Minimize trace length
3. Route over solid ground plane
4. Use differential clocks when possible (LVDS, LVPECL)

---

#### 3.1.2 DDR Memory Interfaces

**EMI Challenges:**

1. **Multiple High-Speed Signals:**
   - DDR4: up to 3200 MT/s (1600 MHz effective)
   - Data, address, command, clock signals (dozens of traces)

2. **Simultaneous Switching:**
   - All data bits can switch together
   - Creates large di/dt in power planes
   - Voltage droops and ground bounce

3. **Long Parallel Traces:**
   - Address/command buses often lengthy
   - Act as slot antennas
   - Common-mode radiation

**Source:** JEDEC standards (e.g., JESD79-4 for DDR4)

**Typical Frequency Content:**
- DDR4-3200: fundamental 1600 MHz, harmonics to >10 GHz

**Mitigation:**
- Follow JEDEC layout guidelines exactly
- Maintain matched lengths (address/command within ±25 mils typically)
- Use solid ground plane beneath all traces
- Proper termination (ODT - On-Die Termination, external resistors)
- Power integrity: adequate decoupling capacitors

---

#### 3.1.3 Switching Edges and Harmonics

**Fundamental Principle:**

**Fourier Transform of Trapezoidal Pulse:**

For a pulse with:
- Rise time: Tr
- Fall time: Tf
- Pulse width: W
- Period: T

Frequency spectrum shows:
- Envelope decreases at -20 dB/decade until f ≈ 1/πTr
- Then decreases at -40 dB/decade

**Practical Takeaway:**
- Faster edges → higher frequency content
- Even slow-frequency signals (e.g., 1 MHz PWM) can emit at 100+ MHz if edge rate is fast

**Design Rule:**
- Use slowest edge rate that meets signal integrity requirements
- Typical guideline: Tr ≥ 0.4 × Tperiod (but verify with SI simulation)

---

### 3.2 Power Supplies (SMPS Noise)

#### 3.2.1 Switching Power Supply Fundamentals

**Operating Principle:**
- Transistor switches ON/OFF at high frequency (50 kHz - 2 MHz typical)
- Creates square-wave current pulses
- LC filter smooths output

**EMI Generation Mechanisms:**

1. **Switching Node Radiation:**
   - Voltage transitions: 0V to Vin (can be 100V+ in boost converters)
   - Fast transitions (10-50 ns typical)
   - PCB trace to switching node = antenna
   - **Frequency content:** Fundamental (switching freq) + harmonics

2. **Input Current Ripple:**
   - High di/dt current pulses from input capacitor
   - Flows through input wiring (acts as loop antenna)
   - **Common-mode current** on input cables

3. **Output Current Ripple:**
   - Conducted to load
   - Can couple back to sensitive analog circuits

**Source:** Application notes from power IC manufacturers (e.g., Texas Instruments, Analog Devices)

**Typical Emission Spectrum:**
- Buck converter at 500 kHz switching:
  - Spikes at 500 kHz, 1 MHz, 1.5 MHz, 2 MHz, ... (harmonics)
  - Broadband noise floor from non-ideal switching

**Impact if Not Controlled:**
- Dominates conducted emissions (150 kHz - 30 MHz range)
- Can fail CISPR 32 / FCC Part 15 conducted limits
- Corrupts analog signals (ADC inputs, audio circuits)

---

#### 3.2.2 SMPS Layout Guidelines

**Critical Rules (Source: Power IC datasheets):**

1. **Minimize Hot Loop Area:**
   - Hot loop = path of high di/dt switching current
   - Example (Buck): Vin cap → high-side FET → low-side FET → Vin cap
   - **Rule:** Keep this loop < 1 cm² if possible
   - **Reason:** Loop area directly proportional to radiated magnetic field (B ∝ I × A / r³)

2. **Component Placement:**
   - Input capacitors immediately adjacent to power IC Vin pins
   - Output capacitors near switching node and ground
   - Inductor oriented to minimize flux coupling to other circuits

3. **Ground Plane Strategy:**
   - Solid ground pour under power stage
   - Star-point grounding for input/output returns
   - Isolate noisy power ground from sensitive analog ground

4. **Shielding (if needed):**
   - Metal shield can over inductor/switching node
   - Grounded to PCB ground plane
   - Can reduce radiated emissions by 10-20 dB

**Verification:**
- Measure switching node ringing with oscilloscope
- Should see clean transitions, minimal overshoot/undershoot
- Ringing indicates poor layout (parasitic inductance)

---

### 3.3 Long Traces Acting as Antennas

#### 3.3.1 Antenna Theory Basics

**Fundamental Relationships:**

1. **Radiation Resistance of Small Loop:**
   - Rrad ≈ 31,200 × (A / λ²)² Ω
   - Where A = loop area, λ = wavelength

2. **Radiation Efficiency:**
   - Increases as physical dimensions approach λ/10 to λ/2

**Practical Implications for PCBs:**

**Example Calculation:**

- Signal: 100 MHz (λ = 3 m)
- Trace length: 15 cm (= λ/20)
- Begins to radiate effectively

**Rule of Thumb:**
- **Trace becomes efficient antenna when length > λ/20**
- Below λ/20: predominantly reactive near-field
- Above λ/20: significant radiation

**Source:** Antenna theory (e.g., Balanis, "Antenna Theory")

---

#### 3.3.2 Cable Radiation

**Why Cables Are Dominant EMI Sources:**

1. **Electrical Length:**
   - Cables often 1-3 meters
   - Efficient antennas at relatively low frequencies
   - Example: 1m cable = λ/2 at 150 MHz (very efficient)

2. **Common-Mode Current:**
   - Current flowing in same direction on both conductors (e.g., + and - of power cable)
   - Does not cancel, radiates effectively
   - **Most PCB-related radiation occurs via common-mode cable currents**

**Source:** CISPR 16-1-2, EMC textbooks (e.g., Ott, "Electromagnetic Compatibility Engineering")

**Mechanism:**
- High-frequency noise on PCB couples to cable shield/conductors
- Cable acts as monopole or dipole antenna
- Radiation measured at 3m or 10m test distance

**Mitigation:**
1. **Reduce common-mode noise at PCB-cable interface:**
   - Common-mode chokes on I/O lines
   - Ferrite beads on cable
   - Proper connector grounding (360° shield termination)

2. **Cable Shielding:**
   - Braided shield (coverage >90%)
   - Shield grounded at both ends for high frequencies (>1 MHz)
   - Single-point grounding for low frequencies (debated, frequency-dependent)

3. **Filtering at Connectors:**
   - Pi-filters (C-L-C) on signal lines
   - TVS diodes for ESD

---

### 3.4 Poor Grounding

#### 3.4.1 Ground Plane Discontinuities

**Problem:**

1. **Slots in Ground Plane:**
   - Signal trace crosses slot
   - Return current must detour around slot
   - Creates large loop area
   - **Loop area → magnetic field → radiation**

**Formula:** Induced voltage: V = -dΦ/dt = -A × dB/dt (Faraday's Law)

**Practical Impact:**
- A 1 cm slot can increase radiated emissions by 10-20 dB at frequencies where trace length ≈ λ/4

**Source:** IPC-2221 (PCB design standard), EMC textbooks

**Design Rule:**
- **Never route high-speed signals over gaps in ground plane**
- If unavoidable, use ground stitching vias on both sides of trace (within λ/20 spacing)

---

#### 3.4.2 Ground Bounce

**Definition:** Voltage fluctuation on ground plane due to simultaneous switching of multiple outputs

**Physical Cause:**
- Multiple drivers switch simultaneously
- Current: I = N × Io (where N = number of switching outputs, Io = current per output)
- Flows through parasitic inductance of ground path: Lground
- Voltage drop: V = L × di/dt

**Example:**
- 16 outputs switch simultaneously
- Each sources 24 mA
- Total current step: 16 × 24 mA = 384 mA
- Edge rate: 1 ns
- Ground inductance: 5 nH (typical for short trace)
- Ground bounce: V = 5 nH × (384 mA / 1 ns) = 1.92 V

**Impact:**
- False triggering of logic gates
- Increased common-mode noise (radiates via cables)
- Crosstalk between circuits

**Mitigation:**
1. Reduce Lground:
   - Use ground planes (inductance ~1 nH/cm vs ~10 nH/cm for traces)
   - Multiple ground vias for IC power pins
2. Reduce di/dt:
   - Slower edge rates
   - Stagger switching times
3. Decouple power pins:
   - Bypass capacitors (0.1 μF, 0.01 μF, 1 μF multi-stage)

**Source:** Signal integrity textbooks (e.g., Johnson & Graham, "High-Speed Digital Design")

---

## 4. PCB DESIGN TECHNIQUES FOR EMI CONTROL

### 4.1 Layer Stackup Design

#### 4.1.1 Stackup Fundamentals

**Purpose of Stackup:**
- Control impedance
- Provide solid return paths
- Shield high-speed signals
- Distribute power efficiently

**Basic Principles (Source: IPC-2141, IPC-2221):**

1. **Signal layers adjacent to planes:**
   - Minimizes loop area
   - Provides low-inductance return path
   - Reduces crosstalk

2. **Power/ground plane pairs:**
   - Creates distributed decoupling capacitance: C = ε₀ × εr × A / d
   - Example: 10 cm × 10 cm planes, 4 mil separation, FR4 (εr=4.3)
     - C ≈ 3.8 nF (significant high-frequency decoupling)

---

#### 4.1.2 Recommended Stackups

**4-Layer Stackup (Most Common for Moderate Complexity):**

```
Layer 1: Top Signal (components)
Layer 2: Ground Plane (solid, continuous)
Layer 3: Power Plane (solid, can be split for multiple voltages)
Layer 4: Bottom Signal (components, routing)
```

**Advantages:**
- Signals on L1 reference L2 (ground)
- Signals on L4 reference L3 (power) — but preferably keep critical signals on L1
- Planes provide shielding
- Cost-effective

**Design Rules for 4-Layer:**
- Route high-speed signals on L1 only
- Keep L2 ground plane continuous (no splits if possible)
- Use L4 for low-speed signals, power routing

**Source:** IPC-2141

---

**6-Layer Stackup (Better EMI Performance):**

```
Layer 1: Top Signal
Layer 2: Ground Plane
Layer 3: Signal (inner, high-speed)
Layer 4: Signal (inner, high-speed)
Layer 5: Power Plane
Layer 6: Bottom Signal
```

**OR (Preferred for EMI):**

```
Layer 1: Top Signal
Layer 2: Ground Plane
Layer 3: High-Speed Signal
Layer 4: Ground Plane
Layer 5: Power Plane
Layer 6: Bottom Signal
```

**Advantages:**
- Inner layers shielded by adjacent ground planes
- Reduced crosstalk
- Better impedance control

**When to Use:**
- High-speed interfaces (DDR3/4, PCIe, USB 3.x, Gigabit Ethernet)
- Products requiring high EMI performance

---

#### 4.1.3 Ground Plane Importance

**Why Solid Ground Plane is Critical:**

1. **Return Current Path:**
   - High-frequency return current flows directly beneath signal trace (path of least impedance)
   - Ground plane provides low-inductance path
   - **Inductance:** ~0.5-2 nH per cm (plane) vs ~10-15 nH per cm (trace)

2. **Image Plane Effect:**
   - Signal current induces mirror image current in adjacent plane
   - Currents flow in opposite directions → fields cancel (reduced radiation)

3. **Shielding:**
   - Ground plane blocks electric fields
   - Provides common reference for all circuits

**Source:** IPC-2141, electromagnetic theory

**Design Rule:**
- **Maintain continuous ground plane under all high-speed signals**
- Minimum 80% copper coverage on ground layers (more is better)

**What Breaks Continuity:**
- Cutouts for mounting holes (minimize size)
- Intentional splits (avoid for high-speed)
- Thermal reliefs at vias (use solid connections for signal vias)

---

### 4.2 Return Path Control (VERY IMPORTANT)

#### 4.2.1 Fundamental Principle

**Key Concept:**
**Current always flows in a loop. The return path matters as much as the signal path.**

**High-Frequency Behavior:**
- At DC/low frequency: current takes path of least resistance
- At high frequency: current takes path of least **impedance**
- Impedance includes inductance: Z = R + jωL
- At high frequency, ωL >> R, so current minimizes inductance
- **Practical Result:** Return current flows directly beneath signal trace (minimal loop area)

**Source:** Maxwell's Equations, EM field theory

---

#### 4.2.2 Return Path Violations

**Common Mistakes:**

**1. Signal Layer Change Without Ground Stitching:**

```
Signal on Layer 1 → Via → Signal on Layer 4
Return current on Layer 2 (ground) must find path to Layer 3 (power/ground)
```

**Problem:**
- Return current must flow through inter-plane capacitance or distant via
- Creates large loop area at via transition
- **Loop area = radiated emissions**

**Solution:**
- Place ground stitching vias immediately adjacent to signal via (<5 mm spacing)
- Provides low-impedance path for return current

**Source:** IPC-2221, SI/EMI textbooks

---

**2. Trace Crossing Ground Plane Split:**

**Example:**
- Ground plane split between analog and digital sections
- Digital signal trace crosses split

**Problem:**
- Return current cannot flow beneath trace (gap in plane)
- Must detour around split (potentially many centimeters)
- Large loop area

**Solution:**
- **Never route high-speed signals over plane splits**
- If split is necessary (e.g., analog/digital isolation), bridge with low-value capacitor (e.g., 0.01 μF) at HF, or use single continuous plane

---

#### 4.2.3 Return Path Design Rules

**Rule Set (Must Follow):**

1. **Identify the return path for every high-speed signal**
   - Ask: "Where does the return current flow?"
   - Visualize the complete loop

2. **Minimize loop area**
   - Keep signal close to return path (thin dielectric)
   - Use adjacent plane as return (not distant trace)

3. **Ground stitching vias:**
   - Spacing: λ/20 maximum (for highest frequency of concern)
   - Example: 1 GHz → λ = 30 cm → via spacing < 15 mm
   - Practical: place stitching vias every 10-15 mm along board edges, plane boundaries

4. **Reference plane transitions:**
   - When signal changes layers, ensure return path continuity
   - Use stitching vias within 5 mm of signal via

**Verification:**
- Use 2D field solver or current density plots (available in advanced PCB tools)
- Inspect return current paths visually

---

### 4.3 Trace Routing

#### 4.3.1 Minimize Loop Area

**Why Loop Area Matters:**

**Magnetic Dipole Moment:** m = I × A (current × loop area)

**Radiated Magnetic Field:** B ∝ m / r³ (near-field, r < λ/2π)

**Radiated Power:** P ∝ (I × A × f²)² (far-field)

**Practical Implications:**
- Doubling loop area → doubles radiated field (6 dB increase)
- Doubling frequency → quadruples radiated power (12 dB increase)

**Source:** Antenna theory, Biot-Savart Law

**Design Rules:**

1. **Keep trace-to-plane spacing small:**
   - Use thin dielectrics (3-5 mils for high-speed layers)
   - Typical: 4-layer board, 8 mil core between L1-L2

2. **Route signals on layer adjacent to solid plane:**
   - L1 (signal) over L2 (ground): good
   - L1 (signal) over L2 (power plane with splits): poor

3. **Parallel traces (e.g., differential pairs):**
   - Keep spacing tight (minimizes differential mode loop area)
   - Keep both traces same distance from plane (maintains impedance balance)

---

#### 4.3.2 Avoid Right-Angle Bends

**Traditional Belief:** Right-angle bends cause reflections and radiate

**Reality (Based on Testing and Simulation):**

- **Effect is minimal at PCB trace frequencies (<10 GHz)**
- Reflections from right-angle bend: typically <0.1 dB
- Radiated emissions increase: negligible for single bend

**Source:** IPC-2221, high-speed design testing

**However:**
- Chamfered or curved bends are still preferred (aesthetic, slightly better)
- **Real concern:** sharp bends can trap acid during PCB etching (manufacturing issue, not EMI)

**Recommendation:**
- Use 45° bends or curved bends where convenient
- Don't obsess over it (focus on more impactful rules)

---

#### 4.3.3 Differential Pair Routing

**Advantages for EMI:**

1. **Magnetic Field Cancellation:**
   - Equal and opposite currents in two traces
   - Magnetic fields from each trace cancel (ideally 100%)
   - **Practical:** 20-30 dB reduction in radiated emissions vs. single-ended

2. **Common-Mode Rejection:**
   - External interference couples equally to both traces (common-mode)
   - Receiver subtracts signals → common-mode rejected
   - Improved immunity

**Source:** Differential signaling theory, LVDS standards (TIA/EIA-644)

**Routing Rules:**

1. **Maintain constant spacing:**
   - Spacing determines differential impedance: Zdiff = 2 × (Z0 - ΔZ)
   - Typical targets: 90Ω (USB), 100Ω (Ethernet, LVDS)
   - Variation < ±10% to maintain balance

2. **Match trace lengths:**
   - Intra-pair skew < 5-10 mils (typical)
   - Prevents common-mode conversion

3. **Minimize vias:**
   - Each via introduces impedance discontinuity
   - If vias necessary, use them on both traces simultaneously (maintain balance)

4. **Avoid stubs:**
   - Any length mismatch creates stub
   - Stubs reflect signal energy, create emissions

5. **Route over continuous ground plane:**
   - Ensures both traces have same return path
   - Maintains balance

**Source:** IPC-2141, USB 2.0/3.0 specifications, HDMI specifications

---

### 4.4 Via Stitching and Ground Stitching

#### 4.4.1 Purpose of Ground Stitching

**Functions:**

1. **Ties planes together:**
   - Multi-layer boards have ground planes on multiple layers
   - Ground stitching vias create low-impedance connections between planes

2. **Provides return current path:**
   - When signal changes layers, return current needs path between planes
   - Stitching vias provide this path

3. **Reduces plane resonances:**
   - Parallel planes can resonate (cavity modes)
   - Stitching vias dampen resonances

**Source:** IPC-2221, EMC design guides

---

#### 4.4.2 Via Placement Strategy

**Rules:**

1. **Around board perimeter:**
   - Spacing: λ/20 at highest frequency
   - Example: 1 GHz → λ = 30 cm → spacing < 15 mm
   - Forms "via fence" or "via wall"
   - Prevents edge radiation

2. **Adjacent to signal vias (layer transitions):**
   - Within 5 mm of signal via
   - One or more ground vias
   - Provides local return path

3. **Around cutouts and slots:**
   - Ground vias on both sides of cutout
   - Re-establishes current path

4. **Near connectors:**
   - Multiple ground vias at connector mounting
   - Ensures chassis/shield connection to PCB ground

**Typical Via Density:**
- General areas: every 20-30 mm
- High-speed areas: every 10-15 mm
- Critical areas (around signal vias): 3-5 mm

**Via Size:**
- Use smallest via that meets current rating and manufacturability
- Typical: 10-12 mil drill, 20-25 mil pad
- Smaller vias = lower inductance (L ∝ length)

---

## 5. GROUNDING & SHIELDING (CRITICAL SECTION)

### 5.1 Grounding Fundamentals

#### 5.1.1 Types of Grounding

**1. Single-Point Grounding**

**Definition:** All ground returns connect to one common point (star configuration)

**Frequency Range:** Effective for **low frequencies** (DC to ~1 MHz)

**Advantages:**
- No ground loops (eliminates circulating currents from external magnetic fields)
- Simple to analyze

**Disadvantages:**
- At high frequencies, long ground wires have significant impedance (L × jω)
- Not practical for complex PCBs

**When to Use:**
- Audio circuits (avoid hum from ground loops)
- Analog measurement systems
- Low-frequency power distribution (<100 kHz)

**Source:** Grounding textbooks (e.g., Morrison, "Grounding and Shielding")

---

**2. Multi-Point Grounding**

**Definition:** Multiple ground connections to ground plane/chassis at different locations

**Frequency Range:** Effective for **high frequencies** (>1 MHz)

**Advantages:**
- Low impedance paths (short connections)
- Minimizes ground bounce
- Practical for digital circuits

**Disadvantages:**
- Potential ground loops (but typically not issue at HF where shielding is more important)

**When to Use:**
- High-speed digital circuits
- RF circuits
- Most modern PCB designs

**Source:** IPC-2221, EMC textbooks

---

**3. Hybrid Grounding (Most Common in Practice)**

**Approach:**
- Single-point grounding for low-frequency analog
- Multi-point grounding for high-frequency digital
- Connected at one point (e.g., near power supply) or via RF choke/ferrite

**Example:**
- Analog ground plane and digital ground plane on same PCB
- Connected at power supply input with ferrite bead or 0Ω resistor
- High-frequency currents kept separate; DC/low-frequency currents share common point

**Design Consideration:**
- Avoid splitting ground plane unless absolutely necessary
- If split needed, bridge with capacitors (0.01 μF) for HF continuity

---

#### 5.1.2 Chassis vs. Signal Ground

**Signal Ground (Circuit Ground):**
- Ground reference for signals (0V rail)
- Typically copper plane on PCB

**Chassis Ground (Earth Ground, Protective Ground):**
- Metal enclosure/chassis
- Connected to earth ground via AC power cord (safety ground)
- Provides safety (fault protection)
- Provides shielding (EMI containment)

**Connection Strategy:**

**Option 1: Direct Connection (Single Point)**
- Signal ground connected to chassis ground at one location (usually near power input)
- Advantages: Simple, meets safety requirements
- Disadvantages: Potential for ground loops if chassis has multiple earth connections

**Option 2: Capacitive Coupling**
- Signal ground connected to chassis via high-frequency capacitor (e.g., 1-10 nF, rated for mains voltage)
- Resistor in parallel for ESD bleed (e.g., 1 MΩ)
- Advantages: Blocks low-frequency ground loops, passes high-frequency noise to chassis (better shielding)
- Disadvantages: More complex, must meet safety standards

**Option 3: Isolated (Transformer/Optical)**
- Signal ground completely isolated from chassis
- Used in medical equipment, isolated power supplies
- Requires special considerations for EMC (often worse without proper design)

**Source:** IEC 61010-1 (safety), UL standards, EMC textbooks

**Recommendation:**
- Start with single-point connection (power input)
- Add capacitive coupling if EMI testing shows chassis emissions issues
- Consult safety standards for your product category

---

### 5.2 Shielding Techniques

#### 5.2.1 Fundamental Shielding Theory

**Shielding Effectiveness (SE):**

SE (dB) = A + R + B

Where:
- **A = Absorption Loss** (material thickness, conductivity)
- **R = Reflection Loss** (impedance mismatch at boundary)
- **B = Multiple Reflection Correction** (usually negligible if A > 10 dB)

**Source:** Electromagnetic shielding theory (e.g., Ott, "Electromagnetic Compatibility Engineering")

---

**Absorption Loss:**

A (dB) = 3.338 × t × √(f × μr × σr)

Where:
- t = shield thickness (inches)
- f = frequency (Hz)
- μr = relative permeability
- σr = relative conductivity (copper = 1)

**Example:**
- Copper shield, 0.001" thick, 100 MHz
- A ≈ 3.338 × 0.001 × √(100×10⁶ × 1 × 1) ≈ 33 dB

**Key Insight:** Absorption increases with:
- Frequency
- Thickness
- Conductivity
- Permeability (use steel/mu-metal for low-freq magnetic shielding)

---

**Reflection Loss:**

R (dB) = 20 × log₁₀(|Zshield / Zwave|)

- Electric fields (high impedance): easily reflected by conductive shields
- Magnetic fields (low impedance): require high-permeability materials (mu-metal, ferrites)

**Practical:**
- Thin aluminum/copper excellent for electric field shielding (>100 dB)
- Magnetic field shielding at low frequency requires thick, high-μ materials

---

#### 5.2.2 Shielding Enclosures

**Design Requirements:**

1. **Continuous Conductive Surface:**
   - No gaps > λ/20
   - Example: 1 GHz → λ = 30 cm → gap must be < 15 mm
   - **Reality:** Even 1 mm gap can degrade shielding by 20+ dB at GHz frequencies

2. **Seams and Joints:**
   - Conductive gaskets (wire mesh, beryllium copper fingers, fabric-over-foam)
   - Multiple screws: spacing < λ/20
   - Contact resistance < 2.5 mΩ (per MIL-STD-188-125)

3. **Apertures (Unavoidable Openings):**
   - Ventilation holes: diameter < λ/20, distributed pattern
   - Cable entry: use EMI gaskets, filtered connectors
   - Display windows: conductive mesh/film (ITO coating on plastic)

**Source:** MIL-STD-285 (shielding effectiveness testing), MIL-HDBK-1857 (grounding/bonding)

**Material Selection:**

| Material | Conductivity | Cost | Permeability | Best Use |
|----------|--------------|------|--------------|----------|
| **Copper** | Excellent (σr=1) | Medium | Low (μr=1) | HF electric field shielding |
| **Aluminum** | Good (σr=0.6) | Low | Low (μr=1) | General purpose, lightweight |
| **Steel** | Fair (σr=0.1) | Low | High (μr=100-1000) | Low-freq magnetic field shielding |
| **Mu-metal** | Fair | Very High | Very High (μr=20,000-100,000) | Precision magnetic shielding |

---

#### 5.2.3 Shield Cans (On-PCB Shielding)

**Purpose:**
- Isolate sensitive circuits (e.g., RF, oscillators, analog)
- Contain EMI sources (e.g., clock generators, switching regulators)

**Construction:**
- Stamped metal can (tin-plated steel, copper-nickel alloy)
- Soldered to PCB pads connected to ground plane

**Design Rules:**

1. **Ground Connection:**
   - Shield must be soldered continuously around perimeter (no gaps)
   - Multiple vias under shield connecting to ground plane (every 5-10 mm)
   - Creates Faraday cage

2. **Feedthroughs:**
   - Signals entering/exiting shield through filtered pins or capacitors
   - Pi-filters (C-L-C) for signal integrity and isolation

3. **Height:**
   - Low-profile shields preferred (reduce cavity resonances)
   - But must provide clearance for components

**Effectiveness:**
- Well-designed: 40-60 dB isolation
- Poorly designed (gaps, inadequate grounding): <20 dB

**Source:** Component manufacturer datasheets (e.g., Laird, Leader Tech)

---

#### 5.2.4 Cable Shielding

**Purpose:**
- Contain emissions from PCB traveling on cables
- Protect cables from external interference

**Types:**

1. **Braided Shield:**
   - Woven wire mesh around cable
   - Coverage: 70-95% typical
   - Good flexibility
   - Effectiveness: 30-60 dB (depending on coverage)

2. **Foil Shield:**
   - Aluminum/mylar tape wrap
   - Coverage: 100%
   - Less flexible
   - Effectiveness: 80-100 dB (but only if properly terminated)

3. **Combination (Foil + Braid):**
   - Best performance
   - Foil for 100% coverage, braid for structural integrity and low DC resistance

**Source:** Cable manufacturer specifications

---

**Shield Termination (Critical):**

**Rule:** Shield effectiveness is only as good as the termination.

**Poor Termination (Pigtail Connection):**
```
Shield → Pigtail wire (2-5 cm) → PCB ground pad
```
**Problem:**
- Pigtail inductance: L ≈ 10-20 nH/cm
- At 100 MHz: Z = jωL ≈ j 60-120Ω (high impedance)
- Shield current cannot flow to ground effectively
- **Degrades shielding by 20-40 dB**

**Source:** IEC 61000-5-2, connector manufacturer data

---

**Proper Termination (360° Connection):**

**Method 1: Backshell Connector**
- Metal backshell surrounds cable shield
- Backshell connects to chassis/PCB ground via screws or spring fingers
- Shield current has low-impedance path around full circumference

**Method 2: EMI Gasket**
- Conductive gasket compressed between cable shield and PCB ground
- Full 360° contact

**Method 3: Shield Termination Clips**
- Metal clips clamp cable shield to PCB ground plane
- Available from EMI component suppliers

**Effectiveness Improvement:** 20-40 dB vs. pigtail

---

**Shield Grounding Strategy:**

**Both Ends Grounded (Preferred for >1 MHz):**
- Low-impedance path for high-frequency currents
- May create ground loop (current flows on shield due to potential difference between grounds)
- Ground loop effect minimal at HF (where shielding is needed)

**Single-End Grounded (For Low Frequency):**
- Prevents DC ground loops
- Shield acts as Faraday cage (capacitive shielding)
- Less effective at high frequencies (shield not path for return current)

**Hybrid:**
- Single-point ground for DC/LF
- Capacitively coupled at other end for HF (e.g., 0.01 μF capacitor)

**Recommendation:**
- For EMI control: ground both ends
- Monitor for ground loop issues (hum, noise injection); address if needed

---

## 6. FILTERING TECHNIQUES (ADVANCED LEVEL)

### 6.1 Decoupling Capacitors

#### 6.1.1 Purpose and Principles

**Functions:**

1. **Local Energy Reservoir:**
   - IC draws current in short bursts (switching)
   - Power supply too far to respond instantly
   - Capacitor provides charge locally

2. **Impedance Reduction:**
   - Lower impedance path for high-frequency currents
   - Reduces power rail voltage droops (noise)

3. **Return Current Path:**
   - High-frequency currents flow through capacitor (AC short)
   - Reduces loop area, limits radiation

**Source:** IC datasheets, power integrity textbooks (e.g., Istok, "Power Integrity")

---

#### 6.1.2 Decoupling Capacitor Behavior vs. Frequency

**Impedance of Capacitor:**

Z = √(R² + (XL - XC)²)

Where:
- XC = 1/(2πfC) (capacitive reactance)
- XL = 2πfL (inductive reactance, from ESL - Equivalent Series Inductance)
- R = ESR (Equivalent Series Resistance)

**Frequency Ranges:**

1. **Low Frequency (f < f_resonance):**
   - XC dominates
   - Z ≈ 1/(2πfC)
   - Impedance decreases as frequency increases (capacitive region)

2. **Resonance (f = f_resonance):**
   - XC = XL
   - Z = ESR (minimum impedance)
   - f_resonance = 1/(2π√(LC))

3. **High Frequency (f > f_resonance):**
   - XL dominates
   - Z ≈ 2πfL
   - Impedance increases as frequency increases (inductive region)
   - **Capacitor acts as inductor!**

**Source:** Capacitor datasheets, application notes

---

**Practical Implications:**

- **0.1 μF ceramic capacitor** (0603 size, typical ESL = 1 nH):
  - Self-resonant frequency (SRF): f = 1/(2π√(1nH × 0.1μF)) ≈ 16 MHz
  - Effective for noise < 16 MHz
  - Above 16 MHz, acts as inductor (useless for decoupling)

- **0.01 μF ceramic capacitor** (0402 size, ESL = 0.5 nH):
  - SRF ≈ 71 MHz
  - Effective up to ~70 MHz

- **1 μF ceramic capacitor** (0805 size, ESL = 2 nH):
  - SRF ≈ 3.5 MHz
  - Good for low-frequency bulk decoupling

**Key Takeaway:** **Need multiple capacitor values to cover wide frequency range**

---

#### 6.1.3 Multi-Capacitor Decoupling Strategy

**Standard Approach:**

For each IC:
1. **Bulk capacitance:** 10-100 μF (electrolytic or ceramic)
   - Handles low-frequency load changes
   - Located within 1-2 cm of IC

2. **Mid-frequency:** 1 μF, 0.1 μF (ceramic)
   - 1 μF: effective 100 kHz - 3 MHz
   - 0.1 μF: effective 1 MHz - 15 MHz
   - Located within 5 mm of IC power pins

3. **High-frequency:** 0.01 μF, 0.001 μF (ceramic, 0402 size)
   - 0.01 μF: effective 10 MHz - 70 MHz
   - 0.001 μF: effective 100 MHz - 500 MHz
   - Located immediately adjacent to IC power pins (<2 mm)

**Source:** IC power supply design guidelines (e.g., Xilinx FPGA user guides, microcontroller datasheets)

**Parallel Combination:**
- Multiple capacitors in parallel → lower net impedance
- SRFs staggered → wide bandwidth coverage

**Example Target Impedance:**
- Power rail: 10 mΩ - 50 mΩ (DC to 100 MHz)
- Achieved by parallel combination of bulk + decoupling caps

---

#### 6.1.4 Decoupling Capacitor Placement

**Critical Rules:**

1. **Distance to IC:**
   - **Rule:** As close as physically possible
   - **Target:** 0.1 μF caps within 5 mm, 0.01 μF within 2 mm
   - **Reason:** Trace inductance (~10-15 nH/cm) adds to ESL, degrades performance

2. **Via Placement:**
   - **Poor:** Cap pad → trace → via → power plane
   - **Better:** Cap pad → via → power plane (minimize trace length)
   - **Best:** Via-in-pad (via directly under capacitor pad, lowest inductance)

3. **Return Path:**
   - Ground via immediately adjacent to ground pad of capacitor
   - Minimizes loop area (cap-via-plane-via-cap)

4. **Sharing:**
   - Do NOT share one capacitor between multiple ICs
   - Each IC needs its own local decoupling

**Source:** IPC-7351 (component placement), IC manufacturer guidelines

---

### 6.2 Ferrite Beads

#### 6.2.1 Operating Principle

**Function:**
- Resistive impedance at high frequencies
- Minimal impedance at DC and low frequencies
- Suppresses high-frequency noise without affecting DC power

**Material:** Ferrite (iron oxide ceramic with nickel, zinc, manganese)

**Impedance vs. Frequency:**

| Frequency | Behavior |
|-----------|----------|
| DC - 10 kHz | Low resistance (< 1Ω, acts as wire) |
| 10 kHz - 1 MHz | Inductive (Z = jωL) |
| 1 MHz - 1 GHz | Resistive (Z ≈ R, dissipates energy as heat) |
| >1 GHz | Capacitive (parasitic capacitance dominates) |

**Source:** Ferrite bead datasheets (e.g., Murata, TDK, Würth)

---

#### 6.2.2 Selection Criteria

**Key Parameters:**

1. **DC Resistance (Rdc):**
   - Typical: 50 mΩ - 500 mΩ
   - Causes voltage drop: V_drop = I × Rdc
   - **Rule:** Keep V_drop < 1% of rail voltage

2. **Impedance at Frequency of Interest:**
   - Check datasheet impedance vs. frequency curve
   - Target: >100Ω at noise frequency

3. **Current Rating:**
   - Must handle DC current without saturation
   - Saturation → impedance drops → ineffective

**Example:**
- Power rail: 3.3V, 500 mA
- Noise at 100 MHz needs suppression
- Select ferrite bead:
  - Rdc = 100 mΩ (V_drop = 0.05V, acceptable)
  - Z @ 100 MHz = 600Ω
  - Irated = 1A

---

#### 6.2.3 Application

**Common Uses:**

1. **Power Line Filtering:**
   - Between power supply and IC
   - Suppresses high-frequency noise from switching regulator
   - Pair with capacitors (LC filter):
     - Cap before ferrite (C1)
     - Ferrite
     - Cap after ferrite (C2)
   - Creates low-pass filter

2. **I/O Line Filtering:**
   - Series ferrite on signal lines
   - Suppresses common-mode noise on cables
   - Does not affect signal integrity (if chosen correctly)

3. **Clock Line Filtering:**
   - Use with caution (can distort signal)
   - Select ferrite with low impedance at clock fundamental, high at harmonics

**Source:** Application notes from ferrite manufacturers

---

### 6.3 LC Filters

#### 6.3.1 Low-Pass LC Filter Design

**Topology:**

**Pi-Filter (Most Common for EMI):**
```
Input → C1 → L → C2 → Output
         |         |
        GND       GND
```

**Purpose:**
- Attenuate high-frequency noise
- Pass DC and low-frequency signals

**Transfer Function:**

Attenuation (dB) = 40 × log₁₀(f / fc) for f >> fc

Where fc = cutoff frequency = 1/(2π√(LC))

**Source:** Filter design textbooks

---

**Design Procedure:**

1. **Determine cutoff frequency (fc):**
   - Set fc below lowest frequency to attenuate
   - Typical: fc = f_noise / 10

2. **Select L and C:**
   - Choose L (consider current rating, DC resistance, size)
   - Calculate C = 1/(4π²fc²L)

3. **Select component values:**
   - Standard values from E12/E24 series
   - Iterate fc calculation

**Example:**
- Suppress noise above 10 MHz on 5V power line
- fc = 1 MHz (10× below noise)
- Select L = 10 μH (rated 1A, Rdc = 50 mΩ)
- C = 1/(4π² × 1MHz² × 10μH) ≈ 2.5 nF
- Use C1 = C2 = 2.2 nF (standard value)

**Expected Attenuation at 10 MHz:**
- Attenuation = 40 × log₁₀(10 MHz / 1 MHz) = 40 dB

---

#### 6.3.2 Common-Mode Choke

**Definition:** Two inductors wound on common magnetic core, with opposite winding sense

**Operating Principle:**

1. **Differential-Mode Current:**
   - Currents in opposite directions (signal current)
   - Magnetic fluxes cancel
   - Low impedance (inductors appear small or zero)

2. **Common-Mode Current:**
   - Currents in same direction (noise current)
   - Magnetic fluxes add
   - High impedance (inductors appear large, 2× single inductor)

**Source:** Magnetics design textbooks, common-mode choke datasheets

---

**Application:**

**Suppressing Common-Mode Noise on Differential Lines:**
- USB data lines
- Ethernet pairs
- CAN bus
- RS-485

**Benefits:**
- Attenuates common-mode noise (which radiates)
- Minimal effect on differential signal (desired signal)

**Selection:**

1. **Impedance:** >100Ω at noise frequency (common-mode)
2. **Leakage Inductance:** Low (to avoid signal distortion)
3. **Current Rating:** Must handle signal current without saturation

**Typical Values:**
- USB 2.0: 100-300Ω @ 100 MHz, Irated = 500 mA
- Ethernet: 100-500Ω @ 100 MHz, Irated = 350 mA

---

### 6.4 Input/Output Filtering

#### 6.4.1 Power Input Filtering

**Purpose:**
- Prevent conducted emissions from traveling to AC mains
- Protect product from transients on mains

**Typical Topology:**

```
AC Input → Fuse → Common-Mode Choke → X-Cap → Rectifier/SMPS
                                      |
                                    Y-Caps
                                      |
                                  Chassis GND
```

**Components:**

1. **Common-Mode Choke:**
   - Suppresses common-mode noise (currents on both L and N in same direction)
   - Typical: 1-10 mH

2. **X-Capacitor (Line-to-Line):**
   - Suppresses differential-mode noise
   - Must be safety-rated (X1, X2 per IEC 60384-14)
   - Typical: 0.1-1 μF, 275VAC rated

3. **Y-Capacitor (Line-to-Ground):**
   - Shunts common-mode noise to chassis/earth
   - Must be safety-rated (Y1, Y2 per IEC 60384-14)
   - Limited capacitance (to limit leakage current per safety standards)
   - Typical: 1-4.7 nF, 250VAC rated

**Safety Constraints:**

- **Leakage Current Limit:** Typically <3.5 mA (for Class I equipment per IEC 60950-1)
- Leakage = 2πfCV (where f = mains frequency, C = total Y-cap capacitance, V = mains voltage)
- Limits total Y-cap capacitance

**Source:** IEC 60950-1, IEC 62368-1 (safety standards)

---

#### 6.4.2 I/O Port Filtering

**Purpose:**
- Prevent high-frequency noise on I/O cables from radiating
- Protect against ESD, EFT, surge on I/O lines

**Typical Components:**

1. **Series Resistor (30-100Ω):**
   - Limits current during transients
   - Forms RC low-pass with cable capacitance

2. **TVS Diode / ESD Protection:**
   - Clamps overvoltage transients
   - Select based on signal voltage and speed

3. **Common-Mode Choke (for differential signals):**
   - As described in Section 6.3.2

4. **Ferrite Bead (for single-ended signals):**
   - Suppresses high-frequency noise

**Example (RS-232 / UART):**
```
MCU TX → Series R (47Ω) → Ferrite Bead → Connector Pin
                                 |
                           TVS Diode to GND
```

**Source:** Interface standard specifications (e.g., RS-232, USB), TVS diode datasheets

---

## 7. POWER INTEGRITY & EMI

### 7.1 Switching Regulators and Noise

**Noise Mechanisms (Revisited with More Detail):**

1. **Switching Node Voltage:**
   - Square wave: 0V to Vin (or 0V to -Vin for inverting topologies)
   - dV/dt: 1-10 V/ns typical
   - Coupled to nearby traces via capacitance: I = C × dV/dt

2. **Input Ripple Current:**
   - Triangular waveform at switching frequency
   - Magnitude depends on topology and inductor value
   - Creates voltage ripple across input capacitor ESR/ESL

3. **Output Ripple Voltage:**
   - Residual AC on output
   - Depends on output cap ESR and ripple current

**Source:** Switching regulator IC datasheets, application notes

---

### 7.2 Power Distribution Network (PDN) Design Basics

#### 7.2.1 Target Impedance

**Concept:** PDN must present low impedance across frequency range to minimize voltage droop/noise

**Calculation:**

Z_target = Noise_Budget / I_transient

**Example:**
- IC requires 3.3V ± 5% (noise budget = 165 mV)
- Transient current: 1A
- Z_target = 165 mV / 1A = 165 mΩ

**PDN must maintain impedance <165 mΩ from DC to highest frequency of concern (e.g., 100 MHz)**

**Source:** Power integrity textbooks, FPGA/processor design guides

---

#### 7.2.2 PDN Impedance vs. Frequency

**Components Contributing to PDN:**

1. **DC - 10 kHz:** Bulk capacitors (electrolytic, >10 μF)
2. **10 kHz - 1 MHz:** Ceramic capacitors (1-10 μF)
3. **1 MHz - 100 MHz:** Ceramic capacitors (0.1 μF, 0.01 μF) + plane capacitance
4. **>100 MHz:** Die capacitance (inside IC)

**Goal:** Overlap impedance regions (parallel capacitors) to avoid resonant peaks

**Verification:**
- Use PDN impedance simulation tools (e.g., ADS, HFSS, Simbeor)
- Plot Z vs. frequency
- Ensure no peaks exceed target impedance

---

### 7.3 Ripple Reduction Techniques

**Methods:**

1. **Increase Output Capacitance:**
   - Reduces ripple voltage: Vripple = Iripple / (C × f)
   - Diminishing returns (cost, size)

2. **Use Low-ESR Capacitors:**
   - Ceramic (ESR <10 mΩ) vs. electrolytic (ESR 100 mΩ - 1Ω)

3. **Add LC Post-Filter:**
   - After switching regulator output
   - Further attenuates ripple
   - Watch for stability (additional pole in control loop)

4. **Two-Stage Regulation:**
   - Switcher (efficient, noisy) → Linear regulator (quiet, inefficient)
   - Linear regulator cleans up switcher noise
   - Used for sensitive analog circuits

**Source:** Power supply design guides

---

### 7.4 Ground Bounce and Its Impact

**Mechanism (Detailed):**

1. **Simultaneous Switching Outputs (SSO):**
   - N outputs switch from LOW to HIGH
   - Current I = N × I_per_output flows from Vcc, through IC, to outputs

2. **Current Path:**
   - Returns through ground pins of IC
   - Ground pins have parasitic inductance (bond wire, package, PCB trace/via)

3. **Voltage Developed:**
   - V_bounce = L_ground × di/dt
   - This voltage appears as noise on ground rail

**Impact on Other Circuits:**

- Logic gates referencing this noisy ground see false voltage levels
- Analog circuits see ground noise as signal
- Common-mode noise radiated via cables connected to PCB

**Mitigation (Summary):**
- Low-inductance packaging (BGA vs. DIP)
- Multiple ground pins/balls
- Ground plane (minimizes inductance)
- Decoupling capacitors (provide local charge, reduce di/dt from supply)

**Source:** Signal integrity textbooks (e.g., Johnson & Graham)

---

## 8. SIGNAL INTEGRITY VS EMI

### 8.1 Relationship Between SI and EMI

**Key Insight:**
**Good signal integrity practices usually lead to good EMI performance.**

**Why:**

1. **Controlled Impedance → Minimal Reflections:**
   - Reflections = ringing
   - Ringing = high-frequency content
   - High-frequency content = emissions

2. **Short Rise Times (For SI) vs. EMI:**
   - SI requires fast edges for timing margin
   - But fast edges → high-frequency harmonics → EMI
   - **Balance needed:** Use fastest edge that meets timing, no faster

3. **Termination:**
   - Source/load termination eliminates reflections (SI)
   - Also reduces ringing and overshoot (EMI)

**Source:** SI/EMI textbooks, industry experience

---

### 8.2 Edge Rates and Harmonics

**Fourier Analysis (Practical Application):**

**Trapezoidal Pulse Spectrum:**

For a digital pulse train:
- Amplitude envelope ∝ 1/f (until f ≈ 1/πTr)
- Then ∝ 1/f² (above f ≈ 1/πTr)

**Practical:**
- **Knee Frequency:** f_knee = 1 / (π × Tr)
- Energy rolls off faster above f_knee
- But significant energy up to several times f_knee

**Example:**
- Clock 25 MHz, rise time 2 ns
- f_knee = 1/(π × 2ns) ≈ 159 MHz
- Harmonics with significant energy: up to ~500 MHz

**EMI Implication:**
- Even though clock is 25 MHz, emissions tested to 1 GHz
- Need to control harmonics far above fundamental frequency

**Design Trade-Off:**
- Slow edges → lower EMI
- But too slow → SI problems (insufficient timing margin)
- **Optimize:** Use SI simulation to find minimum acceptable edge rate

**Source:** Fourier analysis, SI textbooks

---

### 8.3 Impedance Discontinuity Effects

**Impedance Discontinuities:**

Examples:
- Via transition
- Connector
- Trace width change
- Layer change
- Stub (un-terminated branch)

**SI Effect:**
- Reflection: Γ = (Z2 - Z1) / (Z2 + Z1)
- Reflected signal adds to incident signal → overshoot/undershoot/ringing

**EMI Effect:**
- Overshoot/ringing = high-frequency transients
- Radiate more efficiently
- Can violate emissions limits

**Mitigation:**
- Minimize discontinuities (careful design)
- Simulate (use 2D/3D field solver for via models, etc.)
- Terminate stubs (resistor to ground or Vcc)

**Source:** High-speed design textbooks, SI simulation tools

---

## 9. EMI DEBUGGING & TROUBLESHOOTING (EXPERT LEVEL)

### 9.1 How to Identify EMI Sources

#### 9.1.1 Systematic Approach

**Step 1: Review Test Report**
- Identify frequency(ies) where limits exceeded
- Note magnitude of exceedance (e.g., 6 dB over limit)
- Determine if radiated or conducted emissions

**Step 2: Correlate Frequency to Sources**

**Method:**
- Calculate potential sources from PCB:
  - Clock frequencies and harmonics: f, 2f, 3f, ...
  - SMPS switching frequency and harmonics
  - Crystal oscillators
  - Communication interfaces (SPI, I2C, UART clocks)

**Example:**
- Failure at 150 MHz
- PCB has 25 MHz clock
- 150 MHz = 6 × 25 MHz (6th harmonic)
- **Likely source:** 25 MHz clock or its traces/cables

**Step 3: Isolate by Disabling Circuits**

**Procedure:**
- Disable suspected circuit (if possible without full redesign)
  - Remove IC
  - Cut trace with X-ACTO knife
  - Add jumper to disable power
- Re-test emissions
- If emission disappears → source confirmed

---

### 9.2 Near-Field Probing

#### 9.2.1 Equipment Needed

**Probe Types:**

1. **Magnetic Field (H-field) Probe:**
   - Small loop (e.g., 1 cm diameter)
   - Senses magnetic field (current-related)
   - Good for identifying current loops, trace radiation

2. **Electric Field (E-field) Probe:**
   - Monopole or small dipole
   - Senses electric field (voltage-related)
   - Good for identifying high-voltage nodes (e.g., SMPS switching node)

**Spectrum Analyzer:**
- Frequency range covering EMI frequencies (9 kHz - 6 GHz)
- Input: 50Ω
- Connect probe to analyzer via coax cable

**Source:** Near-field probe manufacturer guides (e.g., Beehive Electronics)

---

#### 9.2.2 Probing Technique

**Procedure:**

1. **Setup:**
   - Power on EUT (Equipment Under Test)
   - Configure to mode that exhibited failure
   - Hold H-field probe ~1-5 mm above PCB surface

2. **Scan PCB:**
   - Move probe systematically across PCB
   - Observe spectrum analyzer display
   - Note locations where signal peaks increase

3. **Identify Hotspots:**
   - Areas with strongest magnetic field = strongest current loops
   - Likely radiation sources

4. **Frequency Correlation:**
   - Compare frequencies seen on near-field probe to frequencies that failed compliance
   - Match → confirms source

**Interpretation:**

- Strong signal near trace → trace radiating (or trace is return path for radiating current)
- Strong signal near component → component is source (e.g., clock IC, SMPS)
- Strong signal near connector → cable radiation (common-mode current)

---

### 9.3 Spectrum Analyzer Usage

**Setup for Conducted Emissions (Pre-Compliance):**

1. **LISN (Line Impedance Stabilization Network):**
   - Insert between AC power and EUT
   - LISN output → spectrum analyzer input
   - Provides 50Ω source impedance, isolates EUT from grid variations

2. **Analyzer Settings:**
   - Frequency span: 150 kHz - 30 MHz (for conducted emissions per CISPR 32)
   - Resolution bandwidth (RBW): 9 kHz (per CISPR 16-1-1)
   - Detector: Quasi-peak (QP) and Average (for full compliance)
   - For pre-compliance: Peak detector acceptable (faster, more conservative)

3. **Measurement:**
   - Power on EUT
   - Observe spectrum
   - Compare to limit lines (load limit lines into analyzer if supported)

**Source:** CISPR 16-1-1 (measurement instrumentation specification)

---

**Setup for Radiated Emissions (Pre-Compliance):**

1. **Antenna:**
   - Biconical (30-300 MHz) or log-periodic (200 MHz - 1 GHz)
   - Position 1-3 meters from EUT (full compliance uses 3m or 10m)

2. **Analyzer Settings:**
   - Frequency span: 30 MHz - 1 GHz
   - RBW: 120 kHz (30-1000 MHz per CISPR 16-1-1)
   - Detector: Quasi-peak
   - Antenna polarization: Horizontal and vertical (test both)

3. **Procedure:**
   - Rotate EUT (turntable if available)
   - Adjust antenna height (1-4 meters scan)
   - Find maximum signal at each frequency
   - Compare to limits

**Note:** Pre-compliance setup approximate; full compliance requires calibrated test site

---

### 9.4 Pre-Compliance Testing Methods

**Benefits:**
- Early detection (design phase)
- Iterative fixes (cheaper than post-certification fixes)
- Reduced risk of failure at final testing

**Methods:**

1. **Desktop Measurements:**
   - Near-field probing (as described above)
   - Current probe on cables (clamp-on RF current probe)
   - Spectrum analyzer with simple antenna

2. **TEM Cell / GTEM Cell:**
   - If available (some companies have in-house)
   - More representative than desktop, less than full chamber

3. **Third-Party Pre-Compliance Labs:**
   - Less expensive than full compliance
   - Use actual test setup, but with relaxed procedures
   - Cost: $500 - $2,000 per session

**Recommendations:**
- Perform desktop measurements after each PCB spin
- Perform pre-compliance at lab before final compliance testing

---

### 9.5 Fix Strategies

#### 9.5.1 Decision Tree

**Step 1: Determine Source**
- Use methods from 9.1, 9.2

**Step 2: Categorize Problem**

**A. Conducted Emissions (150 kHz - 30 MHz):**
→ Likely sources: SMPS, high-speed digital noise on power rails
→ Fixes: Input filtering, ferrite beads, layout improvements

**B. Radiated Emissions - Low Frequency (30-200 MHz):**
→ Likely sources: Clock traces, cables (common-mode)
→ Fixes: Layout (return path, grounding), cable filtering, spread spectrum clocking

**C. Radiated Emissions - High Frequency (>200 MHz):**
→ Likely sources: High-speed digital (DDR, PCIe, HDMI), SMPS
→ Fixes: Shielding, edge rate control, layout, cable filtering

---

#### 9.5.2 Layout Changes (Requires PCB Respin)

**When to Use:**
- Early in design phase
- Magnitude of failure large (>10 dB)
- Root cause is fundamental (e.g., broken return path, missing ground plane)

**Examples:**
- Add ground plane layer (4-layer instead of 2-layer)
- Re-route high-speed signals (shorter, over ground plane)
- Fix ground plane splits
- Improve component placement (distance-sensitive circuits)

**Cost:** High (new PCB fabrication, assembly)
**Timeline:** 2-4 weeks typical

---

#### 9.5.3 Filtering (Can Be Added to Existing Board)

**When to Use:**
- Late in design phase (board already fabricated)
- Failure at specific frequencies (narrowband)
- Conducted emissions or cable-radiated emissions

**Examples:**

1. **Add Ferrite Beads:**
   - On power lines (between SMPS and IC)
   - On I/O cables (clamp-on or soldered to PCB)
   - Quick, inexpensive

2. **Add Capacitors:**
   - Decoupling (if insufficient)
   - Y-caps at power input (for conducted emissions to ground)
   - Can often hand-solder to existing board

3. **Add Common-Mode Chokes:**
   - On I/O cables (differential signals)
   - Requires footprint (may need adapter board/connector change)

**Cost:** Low to medium ($10 - $500 for components)
**Timeline:** Days

---

#### 9.5.4 Shielding (Moderate Complexity)

**When to Use:**
- Radiated emissions failure
- Source localized (specific area of PCB)
- Cannot reduce emissions at source (e.g., required clock speed)

**Examples:**

1. **Add Shield Can:**
   - Over clock generator, SMPS, RF section
   - Requires PCB footprint (may need respin) or adhesive-mounted shield

2. **Add Enclosure Shielding:**
   - Conductive coating on plastic enclosure
   - Metal enclosure upgrade
   - Gaskets on seams

3. **Cable Shielding:**
   - Upgrade to shielded cable
   - Ensure proper shield termination (360°)

**Cost:** Medium ($50 - $5,000 depending on scope)
**Timeline:** 1-3 weeks

---

#### 9.5.5 Spread Spectrum Clocking (SSC)

**Technique:**
- Modulate clock frequency slightly (±0.5% to ±2%)
- Modulation rate: 30-120 kHz
- Spreads energy across frequency range instead of sharp peaks

**Effect on Emissions:**
- Peak reduction: 6-15 dB (at spectral peaks)
- Total energy unchanged (but measurement with peak detector shows reduction)

**Applicability:**
- Works for radiated emissions from clocks
- Some clock generators have SSC feature built-in (enable via pin or register)

**Limitations:**
- Not all systems tolerate frequency variation (check timing specs)
- Does NOT help with broadband noise

**Source:** Clock generator datasheets (e.g., IDT, Silicon Labs)

---

## 10. REAL-WORLD DESIGN FLOW

### 10.1 Step-by-Step EMI-Aware PCB Design

#### Step 1: Stackup Planning

**Inputs:**
- Number of signal layers needed (routing density)
- High-speed interfaces (DDR, PCIe, HDMI, etc.)
- Power requirements (number of voltage rails)

**Decisions:**
- Select layer count (4, 6, 8, ...)
- Assign layers:
  - Signal layers adjacent to planes
  - Power/ground plane pairs
- Define dielectric thickness (for impedance control)

**Deliverable:**
- Stackup diagram with layer assignments and thicknesses
- Impedance targets (e.g., 50Ω single-ended, 100Ω differential)

**EMI Considerations:**
- Solid ground plane essential
- Signal layers over ground preferred
- Thin dielectrics (minimize loop area)

**Source:** IPC-2141

---

#### Step 2: Component Placement

**Priorities:**

1. **Functional Grouping:**
   - Place related circuits together (e.g., power supply, microcontroller, peripherals)

2. **Signal Flow:**
   - Input → Processing → Output (left to right or top to bottom flow)
   - Minimizes trace crossings

3. **High-Speed / Sensitive Circuits:**
   - Locate high-speed circuits away from I/O connectors (prevent coupling to cables)
   - Separate analog and digital sections (if mixed-signal design)

4. **Power Supply Placement:**
   - Locate SMPS near power input connector
   - Route noisy power traces away from sensitive signals

**EMI-Specific Rules:**

- **Decoupling capacitors:** Place immediately adjacent to IC power pins
- **Crystals/oscillators:** Keep traces short (<1 cm if possible), guard with ground vias
- **Connectors:** Group similar connectors, consider cable routing (physical)

**Deliverable:**
- Preliminary component placement (reviewed before routing)

---

#### Step 3: Routing Strategy

**Order of Routing:**

1. **Critical high-speed signals:**
   - DDR, PCIe, HDMI, USB 3.x, etc.
   - Follow interface-specific design guides (length matching, spacing, termination)

2. **Clocks:**
   - Route first (highest priority)
   - Minimize length, route over solid ground
   - Avoid vias if possible

3. **Power:**
   - Use planes where possible
   - Wide traces for high-current paths (SMPS input/output)
   - Minimize loop area for SMPS hot loop

4. **General signals:**
   - Route remaining signals
   - Follow general best practices (avoid right-angles, minimize vias, etc.)

**EMI Routing Rules (Summary):**

- Route over solid ground plane
- Minimize trace length (especially high-speed)
- Match lengths for critical signals (DDR address/data, differential pairs)
- Avoid routing across plane splits
- Keep high-speed signals away from board edges
- Add ground stitching vias around perimeter (every 10-15 mm)

**Deliverable:**
- Routed PCB (all signals connected)

---

#### Step 4: Power Design

**Tasks:**

1. **Power Plane Design:**
   - Assign copper areas for each voltage rail
   - Ensure no gaps under high-speed signals
   - Consider plane splits if necessary (e.g., analog/digital), but minimize

2. **Decoupling Capacitor Placement:**
   - Place as per Section 6.1.4
   - Verify adequate decoupling for each IC

3. **Power Integrity Simulation (If Available):**
   - Simulate PDN impedance vs. frequency
   - Ensure target impedance met
   - Iterate capacitor values/placement if needed

**Deliverable:**
- Power distribution design finalized

---

#### Step 5: EMI Review Checklist

**Perform Before Sending to Fab:**

- [ ] Stackup has solid ground plane(s)
- [ ] No high-speed signals routed over plane gaps
- [ ] Ground stitching vias placed (perimeter, around signal vias, near cutouts)
- [ ] Decoupling capacitors placed correctly (close to IC pins)
- [ ] SMPS layout minimizes hot loop area
- [ ] Clock traces short and over ground
- [ ] Differential pairs routed correctly (matched, controlled impedance)
- [ ] I/O filtering components placed (if required)
- [ ] Thermal reliefs NOT used on signal vias (use solid connections)
- [ ] No long stubs on high-speed signals
- [ ] Design rule check (DRC) passed
- [ ] Gerber files reviewed visually

**If All Items Checked:** Proceed to fabrication

**If Any Item Failed:** Revise layout

---

## 11. COMMON DESIGN MISTAKES

### 11.1 Broken Return Paths

**Mistake:**
- Signal trace routed over gap in ground plane
- Signal via without nearby ground via
- Routing across plane split

**Symptom:**
- Radiated emissions failure (often 10-20 dB over limit)
- Crosstalk between unrelated circuits

**Fix:**
- Repair ground plane (restore continuity)
- Add ground stitching vias
- Re-route signal to avoid gap

**Prevention:**
- Design rule check for signals over plane gaps (some PCB tools support this)
- Visual inspection of ground plane layer

---

### 11.2 Poor Decoupling Placement

**Mistake:**
- Decoupling capacitor placed far from IC (>1 cm)
- Long trace between capacitor and IC power pin
- Sharing one capacitor among multiple ICs

**Symptom:**
- Power rail noise (visible on oscilloscope)
- Radiated emissions (noise couples to traces/cables)
- System instability (intermittent)

**Fix:**
- Relocate capacitors adjacent to IC pins
- Use via-in-pad if possible (lowest inductance)

**Prevention:**
- Follow datasheet placement guidelines exactly
- Review placement before routing

---

### 11.3 Floating Grounds

**Mistake:**
- Ground plane isolated (not connected to chassis or other grounds)
- "Islands" of ground copper (disconnected from main ground)

**Symptom:**
- ESD failures (no discharge path)
- Radiated emissions (ground potential undefined, can act as antenna)

**Fix:**
- Connect all ground copper areas
- Connect signal ground to chassis ground (at appropriate location)

**Prevention:**
- DRC check for unconnected copper
- Visual inspection

---

### 11.4 Excessive Vias in High-Speed Paths

**Mistake:**
- Signal changes layers multiple times unnecessarily
- Each via adds inductance and capacitance (impedance discontinuity)

**Symptom:**
- Signal integrity degradation (reflections, ringing)
- Radiated emissions (ringing = high-frequency content)

**Fix:**
- Re-route to minimize vias (ideally zero vias for critical signals)
- If vias necessary, ensure stitching vias nearby

**Prevention:**
- Route high-speed signals on single layer when possible
- Plan layer assignment during placement phase

---

### 11.5 Long Stubs

**Mistake:**
- Trace branches off main signal path, terminates at component pin
- Stub is un-terminated (open or capacitive load)

**Symptom:**
- Reflections from stub create ringing
- Resonance at frequency where stub length = λ/4

**Fix:**
- Minimize stub length (<5 mm for high-speed signals)
- Terminate stub (series resistor)
- Use via-in-pad to eliminate stub (via directly under component pad)

**Prevention:**
- Plan component orientation to minimize stub length
- Use simulation to check stub impact

---

## 12. CHECKLISTS

### 12.1 Pre-Layout EMI Checklist

**Schematic Review:**

- [ ] Decoupling capacitors specified for each IC (per datasheet)
- [ ] Input filtering components included (power input: X-caps, Y-caps, common-mode choke)
- [ ] I/O protection included (TVS diodes, ESD protection, series resistors)
- [ ] Ferrite beads specified where needed (power lines, I/O lines)
- [ ] Proper termination for high-speed signals (source, load, or AC termination)
- [ ] Oscillator/crystal grounding considered (ground pins properly connected)
- [ ] Unused IC pins handled per datasheet (pulled up, down, or left floating as specified)

**Component Selection:**

- [ ] Clock drivers have controlled slew rate (not excessively fast)
- [ ] SMPS frequency selected (avoid conflict with sensitive bands if possible)
- [ ] Capacitor types appropriate (ceramic for high-frequency decoupling, not electrolytic)
- [ ] Safety components rated (X-caps, Y-caps rated for mains voltage)

**Stackup Planning:**

- [ ] Stackup defined with solid ground plane(s)
- [ ] Signal layers adjacent to planes
- [ ] Layer count adequate for routing density
- [ ] Dielectric thickness chosen for impedance control

---

### 12.2 Post-Layout EMI Checklist

**Ground and Power:**

- [ ] Ground plane(s) continuous (no unnecessary splits)
- [ ] Ground stitching vias placed around perimeter (spacing <15 mm)
- [ ] Ground stitching vias near all signal layer transitions
- [ ] Power plane(s) adequate size (no narrow necks that increase inductance)
- [ ] Power and ground planes overlap (for inter-plane capacitance)

**Signal Routing:**

- [ ] High-speed signals routed over solid ground plane
- [ ] No high-speed signals cross plane gaps
- [ ] Clock traces short (<5 cm if possible) and direct
- [ ] Differential pairs matched in length (skew <5-10 mils)
- [ ] Differential pair spacing maintained (impedance control)
- [ ] Trace widths meet impedance targets
- [ ] Stubs minimized (<5 mm on high-speed signals)
- [ ] No signals routed near board edges (>100 mils clearance preferred)

**Decoupling:**

- [ ] Decoupling capacitors placed within 5 mm of IC power pins
- [ ] Via-in-pad used where possible (or via immediately adjacent)
- [ ] Multiple capacitor values used (bulk, 1 μF, 0.1 μF, 0.01 μF)
- [ ] Ground vias for capacitors immediately adjacent to ground pad

**SMPS Layout:**

- [ ] Input capacitor immediately adjacent to IC Vin pin
- [ ] Hot loop area minimized (<1 cm² if possible)
- [ ] Switching node trace short and direct to inductor
- [ ] No sensitive signals near switching node
- [ ] Feedback network placed per datasheet recommendations

**Connectors and I/O:**

- [ ] Filtering components placed at connectors (if required)
- [ ] Shield of shielded connectors connected to chassis/ground (360° termination if possible)
- [ ] Multiple ground pins used in multi-pin connectors

**Manufacturing:**

- [ ] Design rule check (DRC) passed
- [ ] All copper pours solid (no voids due to thermal relief errors)
- [ ] Silkscreen readable and not over pads/vias
- [ ] Gerber files reviewed visually

---

### 12.3 Pre-Compliance Testing Checklist

**Test Setup:**

- [ ] EUT configured in representative end-use configuration
- [ ] All cables attached (per end-use)
- [ ] Peripherals connected (if applicable)
- [ ] EUT operational in mode expected to have highest emissions

**Conducted Emissions (Pre-Compliance):**

- [ ] LISN connected (or simple LC filter for very rough pre-compliance)
- [ ] Spectrum analyzer settings: 150 kHz - 30 MHz, RBW 9 kHz
- [ ] Limit lines loaded (CISPR 32 / FCC Part 15 Class A or B)
- [ ] Both L and N lines measured (if applicable)
- [ ] Screenshot/data saved for comparison after fixes

**Radiated Emissions (Pre-Compliance):**

- [ ] Antenna positioned at representative distance (1-3 m)
- [ ] Spectrum analyzer settings: 30 MHz - 1 GHz, RBW 120 kHz
- [ ] EUT rotated (maximize emissions at each frequency)
- [ ] Antenna height varied (if possible)
- [ ] Both horizontal and vertical polarizations tested
- [ ] Screenshot/data saved

**Immunity (If Pre-Testing):**

- [ ] ESD: Test at least ±4 kV contact discharge on exposed metal, connectors
- [ ] Observe for system crash, reset, malfunction
- [ ] EFT/Surge: If equipment available, apply to power/I/O ports
- [ ] Document any failures

**Documentation:**

- [ ] Test setup photos taken
- [ ] Failures documented (frequency, magnitude over limit, configuration)
- [ ] Comparison to limits calculated/verified

---

## 13. ADDITIONAL RESOURCES

### 13.1 Standards Documents (Mandatory Reading)

**Emission Standards:**
- CISPR 32:2015 - Electromagnetic compatibility of multimedia equipment - Emission requirements
- FCC Part 15 - Radio Frequency Devices (47 CFR Part 15)
- IEC 61000-6-3 - Generic standards - Emission standard for residential, commercial environments
- IEC 61000-6-4 - Generic standards - Emission standard for industrial environments

**Immunity Standards:**
- IEC 61000-4-2 - ESD immunity testing
- IEC 61000-4-3 - Radiated RF immunity
- IEC 61000-4-4 - Electrical fast transient/burst
- IEC 61000-4-5 - Surge immunity
- IEC 61000-4-6 - Conducted RF immunity

**Measurement Standards:**
- CISPR 16-1-1 - Measuring apparatus (spectrum analyzer requirements)
- CISPR 16-1-2 - Coupling devices (LISN specifications)
- CISPR 16-1-4 - Test sites (anechoic chamber, OATS specifications)

**PCB Design Standards:**
- IPC-2221 - Generic Standard on Printed Board Design
- IPC-2141 - Controlled Impedance Circuit Boards

**Safety Standards (Relevant for Grounding/Filtering):**
- IEC 60950-1 - Safety of information technology equipment (being replaced by IEC 62368-1)
- IEC 62368-1 - Audio/video, information and communication technology equipment - Safety requirements

---

### 13.2 Recommended Textbooks

1. **"Electromagnetic Compatibility Engineering" by Henry Ott**
   - Comprehensive, practical
   - Covers theory and application
   - Industry standard reference

2. **"High-Speed Digital Design: A Handbook of Black Magic" by Howard Johnson and Martin Graham**
   - Signal integrity focus, but highly relevant to EMI
   - Practical explanations

3. **"EMI Troubleshooting Cookbook for Product Designers" by Patrick G. André and Kenneth Wyatt**
   - Hands-on debugging techniques
   - Near-field probing, pre-compliance testing

4. **"Grounding and Shielding: Circuits and Interference" by Ralph Morrison**
   - Deep dive into grounding theory
   - Clarifies common misconceptions

5. **"Printed Circuit Board Design Techniques for EMC Compliance" by Mark Montrose**
   - PCB-specific
   - Practical layout guidelines

---

### 13.3 Application Notes and Guides

**Component Manufacturers:**
- Texas Instruments: "PCB Design Guidelines for Reduced EMI"
- Analog Devices: "A Designer's Guide to Instrumentation Amplifiers"
- Murata: "Chip Ferrite Bead Application Guide"
- Würth Elektronik: "EMC Design Guide"

**IC Manufacturers:**
- Intel: "High-Speed Board Design Advisor" (for DDR, PCIe)
- Xilinx: "PCB Design Guide" (for FPGAs, high-speed interfaces)
- STMicroelectronics: "EMC Design Guide for STM32 MCUs"

**Connector/Cable Manufacturers:**
- TE Connectivity: "Shielding and Grounding for EMI Control"
- Amphenol: "EMI Filtered Connector Solutions"

---

### 13.4 Online Resources

**Free Training:**
- IEEE EMC Society: Webinars, tutorials
- Keysight Technologies: EMC Training Videos
- Rohde & Schwarz: EMC Test Fundamentals

**Tools:**
- QUCS (Quite Universal Circuit Simulator) - Free circuit simulator for filter design
- Saturn PCB Toolkit - Free impedance calculator
- AppCAD (Agilent/Keysight) - Free RF/microwave design tool (includes transmission line calculators)

**Forums/Communities:**
- EEVblog Forum - Active community, EMC subforum
- EDN Network - Articles, design tips
- IEEE EMC Society - Professional organization, conferences

---

## 14. FINAL NOTES

### 14.1 Iterative Design

**Key Message:**
- EMC compliance is rarely achieved in first design iteration
- Budget for 2-3 PCB spins in project timeline
- Pre-compliance testing and near-field probing reduce risk

### 14.2 Cost vs. Performance

**Trade-Offs:**
- More layers → better EMI performance, higher cost
- Shielding → better EMI performance, higher cost, assembly complexity
- Filtered connectors → better EMI performance, higher cost

**Optimization:**
- Start with good layout practices (low cost)
- Add filtering as needed (moderate cost)
- Add shielding only if necessary (higher cost)

### 14.3 Keep Learning

**EMC is a Complex Field:**
- Combines EM theory, circuit design, mechanical design, manufacturing
- Standards evolve (stay current)
- Each product category has unique challenges

**Recommended Practice:**
- Join IEEE EMC Society
- Attend EMC symposiums (IEEE International Symposium on EMC, etc.)
- Read application notes from component manufacturers
- Collaborate with compliance test labs (learn from their experience)

---

## DOCUMENT REVISION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Current Date] | Initial release | Senior EMC/EMI Engineer |

---

## DISCLAIMER

This document provides general guidance based on industry standards and best practices. Specific product designs may require additional considerations. Always consult applicable regulatory standards and perform compliance testing before marketing products. The author and publisher assume no liability for designs based on this guide.

---

**END OF DOCUMENT**

Total Sections: 14
Total Subsections: 60+
Total Pages (Estimated): 80-100 when formatted
Target Audience: Beginner → Expert PCB Design Engineers
Primary Standards Referenced: CISPR 32, FCC Part 15, IEC 61000 series, IPC-2221, IPC-2141

---

This guide is designed to be:
✓ Practical and implementation-ready
✓ Based on verified sources (standards, datasheets, EM theory)
✓ Suitable for learning and reference
✓ Useful for passing EMI/EMC compliance testing
