---
name: pcb_dashboard_guidelines
description: Core guidelines and project standards for the PCB Masterclass Dashboard
---

# PCB Dashboard Professional Guidelines

This document outlines the core principles and standards that MUST be followed when working on the PCB Masterclass Dashboard project.

## 1. Git Workflow & Branch Management
- **Branch Restriction**: ALWAYS work only in the current git branch.
- **No Merging**: Never attempt to merge branches (including merging into main/master) without explicit instructions from the USER.
- **Current Branch**: `footprint-creation`

## 2. Design System & SSOT
- **Single Source of Truth**: All UI components and styles must follow the established design system to maintain a Single Source of Truth (SSOT).
- **Styling**: Use the existing design tokens in `src/index.css` and `src/App.css`.
- **Consistency**: Ensure all new components mirror the aesthetic of the existing `ContentViewer`, `Dashboard`, and `Header`.

## 3. Mobile-First Responsiveness
- **Vertical Reflow**: Content must collapse to a single column on mobile. Avoid `min-width` constraints that cause horizontal scrolling.
- **Breakpoints**: 
    - `1024px`: Desktop to Tablet transition (Sidebar becomes a drawer).
    - `768px`: Tablet to Mobile transition (Layout reflows to vertical stack).
    - `480px`: Ultra-mobile optimization (Spacing and font-size reductions).
- **Touch Targets**: Use `--touch-target` (44px) for all interactive buttons.
- **Tables**: Wrap tables in `.table-wrapper` for horizontal scrolling and provide `.table-hint` for mobile users.

## 3. Fact-Based Development (No Assumptions)
- **Research First**: Before implementing a feature or fixing a bug, perform thorough research.
- **Evidence-Based**: All changes must be backed by facts and evidence from the codebase or project documentation.
- **Querying**: If the intent of a piece of code is unclear, research its usage across the project before making changes.

## 4. Professional Folder Structure
- **Organization**: Maintain a clean and organized folder structure.
- **Component Placement**: All new UI components should be placed in `src/components/`.
- **Data Management**: Any static data or content should be managed in `src/data/`.
- **Assets**: Keep images and static assets in `src/assets/`.
- **Naming Conventions**: Use PascalCase for React components and camelCase for logic/utility files.

## Project Context
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Global and Component-based)
- **Icons**: Lucide React
- **Routing**: React Router DOM v7

## Project Learnings & Discoveries

### Architecture & Data
- **Centralized Content**: The `src/data/modules.js` file is the Single Source of Truth for all module content. Any updates to course material should happen here.
- **Content Component (`ContentViewer.jsx`)**:
    - **Progress Tracking**: Uses a sticky `.reading-progress-bar` at the top of the page-content.
    - **TOC Navigation**: Implements an `IntersectionObserver`; hidden on mobile to prioritize read-space.
    - **Interactive Elements**: Includes a "Milestone Checklist" with session-based local state tracking.
- **Dashboard Component (`Dashboard.jsx`)**: Uses a grid layout with dynamic animation delays; reflows from 4 columns (desktop) to 1 column (mobile).

### Design System (Vanilla CSS)
- **Color Palette**: Domain-driven aesthetic using Dark Navy Base (`#0d1b2e`), Solder Mask Green (`#1a6b3a`), and Copper Gold (`#c87533`).
- **Tokens**: Extensive use of CSS variables in `src/index.css`. Standardize on `--space-1` through `--space-20`.
- **Layout Integrity**:
    - Fixed Sidebar width: `280px` (desktop), `0` (closed/mobile).
    - Main scroll container: `.page-content`.
    - Content Layout: Uses CSS Grid with `minmax(0, 1fr) 280px` (Reading column + TOC) on desktop; single column on mobile.
- **Utility Suite**: Use the custom utility classes in `index.css` (e.g., `.zdiff-calc`, `.flex`, `.gap-4`) instead of ad-hoc styles.

### Development Environment
- **Shell**: The user prefers `zsh` with `Oh My Zsh`.
- **Branch**: Currently on `footprint-creation`.
- **Modern Standards**: React 19, Vite, Lucide-React.

### Source Materials
- **Footprint Guides**: `pcb_footprint_guide.html` and `IPC_PCB_Footprint_Design_Guide.pdf` serve as the primary engineering reference.
