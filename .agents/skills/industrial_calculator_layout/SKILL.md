---
name: industrial_calculator_layout
description: Standards for the "Great" Industrial Calculator Layout approved by the user.
---

# Industrial Calculator Layout Guideline

This skill defines the structural and visual standards for all engineering calculators within the PCB Design Hub. Adherence to these guidelines ensures a consistent, professional, and industrial-grade user experience.

## 1. Core Structural Layout
Every calculator must follow the **Two-Column Layout Module**:

- **Header**:
    - `bg-primary` container with a clean icon (`Zap`, `Calculator`, etc.).
    - Title (e.g., "IPC-7351B Solver") and Subtitle (Engineering Protocol).
    - **Unit Selection Toggle**: Mandatory `.zdiff-toggle-group` for `mm/mil` selection in the top right.
- **Body Section** (`zdiff-body`):
    - **Architecture**: Must use a single-column reflow for widths `< 1000px`.
    - **Left Column (Analysis)**:
        - **Interactive Diagram**: High-fidelity SVG cross-section inside a `zdiff-diagram-box`.
        - **Input Grid**: 2-column grid (`zdiff-input-grid`) of numeric inputs with clear parameter labels (H, W, S, T, Dk).
    - **Right Column (Intelligence)**:
        - **Hero Result Card**: Large primary value (`zdiff-result-num`) followed by a technical sub-grid of secondary metrics.
        - **Compliance Verdict**: A high-contrast alert box (`zdiff-verdict`) providing technical feedback (e.g., IPC-7351B Verdict).
        - **Presets/Metrics**: A grid for metrics like Solder Fillet Goals or standard presets.

## 2. Visual System
- **Contrast**: Use Dark Navy Base (`#0d1b2e`) for foundations. Avoid generic white backgrounds.
- **Color Palette**:
    - **Solder Mask Green**: `#1a6b3a` (Primary indicator/Success).
    - **Copper Gold**: `#c87533` (Secondary accents/Warnings).
    - **Signal Red**: `#ef4444` (Critical errors/High-speed traces).
- **Aesthetics**:
    - **Subtle Glassmorphism**: Use `backdrop-filter: blur(12px)` and thin borders.
    - **Rounded Corners**: Use `var(--radius-2xl)` for main calculator cards.
    - **Typography**: Inter (sans-serif) for UI, monospaced fonts for numeric output values.

## 3. UI/UX Principles
- **Immediate Feedback**: Results must update in real-time as inputs change.
- **Standards Driven**: Always provide an "Engineering Reference" or "IPC Docs" popover.
- **Cleanliness**: No neon glows, holographic console aesthetics, or over-engineered animations unless explicitly requested.

## 4. CSS Classes
Always utilize the optimized `zdiff-` class suite defined in `index.css`:
- `.zdiff-calc`, `.zdiff-header`, `.zdiff-body`
- `.zdiff-left`, `.zdiff-right`
- `.zdiff-input-grid`, `.zdiff-result-card`
- `.zdiff-presets-box`
