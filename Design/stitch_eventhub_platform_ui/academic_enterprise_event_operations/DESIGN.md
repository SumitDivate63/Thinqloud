---
name: Academic & Enterprise Event Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-md-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  stat-value:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies a modern, highly utilitarian SaaS aesthetic tailored for academic institutions, collegiate tech symposiums, and enterprise campus recruitment drives. The brand tone communicates institutional trust, operational efficiency, and crystalline clarity. 

The aesthetic is grounded in contemporary SaaS minimalism with high-density data support. It avoids gratuitous decoration in favor of crisp boundaries, systematic typographic hierarchy, and deliberate micro-interactions. The interface delivers an immediate sense of reliability to administrative coordinators, enterprise recruiters, and high-velocity student participants alike.

## Colors

The palette balances authoritative deep slates with precision-engineered operational accents. 

### Structural Surfaces & Canvas
- Canvas Base: `#F8FAFC` (Slate 50) delivers reduced eye strain over long administrative shifts.
- Surface Card: `#FFFFFF` (Pure White) provides elevated contrast for modular surfaces.
- Subtle Subsurfaces: `#F1F5F9` (Slate 100) for table headers, inactive tabs, and segmented controls.
- Hairline Border: `#E2E8F0` (Slate 200) for low-contrast structure across all cards and dividers.
- Emphasized Border: `#CBD5E1` (Slate 300) for active inputs and selected states.

### Core Brand & Interactive Tokens
- Dominant Primary: `#0F172A` (Slate 900) provides decisive authority across navigation headers, key actions, and dominant buttons.
- Interactive Accent: `#2563EB` (Blue 600) drives primary CTAs, links, active tab rules, and selected states.
- Interactive Accent Hover: `#1D4ED8` (Blue 700) for distinct interactive affordance.
- Focus Ring & Glow: `#93C5FD` (Blue 300) applied at 40% alpha with a 3px ring offset.

### Typography Hierarchy Tokens
- Dominant Text: `#0F172A` (Slate 900) for headlines, table cell data, and emphasis.
- Secondary Body: `#334155` (Slate 700) for labels, descriptions, and continuous text.
- Muted Slate: `#64748B` (Slate 500) for timestamps, metadata, placeholders, and inactive icons.

### Status & Feedback Semantics
- Success (Confirmed, Passed, Active): `#059669` (Emerald 600), surface background `#ECFDF5`, border `#A7F3D0`.
- Warning (Waitlist, Flagged, Pending Review): `#D97706` (Amber 600), surface background `#FFFBEB`, border `#FDE68A`.
- Error / Critical (Disqualified, Rejected, Capacity Full): `#E11D48` (Rose 600), surface background `#FFF1F2`, border `#FECDD3`.
- Information (Campus Announcement, Live Session): `#0284C7` (Sky 600), surface background `#F0F9FF`, border `#BAE6FD`.

## Typography

The type system is powered entirely by Inter. It leverages numerical tabular lining figures (`font-variant-numeric: tabular-nums`) across all data grids, timer monitors, and metric modules to prevent visual jitter during real-time event updates.

- Use `display-lg` and `headline-xl` sparingly, restricted to high-level dashboard summaries, event landing headers, and main modal titles.
- `stat-value` is dedicated to numerical KPIs inside dashboard metric cards.
- `body-md` and `body-md-medium` serve as the universal workhorses for table data, form controls, and regular interactive text.
- `label-sm` is styled in uppercase with intentional tracking (`0.04em`) specifically for badges, status chips, and table headers.

## Layout & Spacing

The layout model is constructed on an adaptable 12-column fluid grid system geared for high-density administrative consoles.

- **Breakpoints**:
  - Desktop (Primary): `>= 1280px` (Full 12-column workspace, fixed 256px collapsible left navigation panel, 32px canvas margins).
  - Tablet / Laptop: `768px - 1279px` (8-column workspace, rail or off-canvas navigation, 24px margins).
  - Mobile: `< 768px` (4-column flow, full-width cards, 16px margins, sticky bottom action bars for scanner/check-in operations).

- **Spacing Cadence**:
  - 4px (`space-xs`) for internal micro-spacing (icon to text, input padding adjustments).
  - 8px (`space-sm`) for compact component padding and badge gutters.
  - 16px (`space-md`) for standard card interior padding, list item separation, and input gaps.
  - 24px (`space-lg`) between related functional modules, metric card grids, and section divisions.
  - 32px (`space-xl`) between major architectural page regions.

## Elevation & Depth

This system intentionally relies on crisp borders and ambient, diffuse shadows rather than heavy layering, preserving high data density without visual clutter.

- **Level 0 (Flat / Canvas)**: Background `#F8FAFC`, no shadow, used for page canvas, nested table containers, and inactive segmented elements.
- **Level 1 (Card / Container)**: Background `#FFFFFF`, border `1px solid #E2E8F0`, shadow `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`. Applied to metric cards, regular content modules, and standard table shells.
- **Level 2 (Dropdown / Popover)**: Border `1px solid #E2E8F0`, shadow `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`. Applied to context menus, filter overlays, multi-select pickers, and tooltips.
- **Level 3 (Modal / Attendance Sheet)**: Border `1px solid #CBD5E1`, shadow `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. Applied to recruitment assessment configuration dialogs, student dossier overlays, and live QR code scanners.

## Shapes

The design uses a clean dual-tier border radius rule:
- `8px` (`0.5rem`) for compact UI elements: buttons, form inputs, segmented control chips, table cell badges, and dropdown menus.
- `12px` (`0.75rem`) for structural containers: stat cards, data panels, modals, camera viewports for QR scanning, and assessment candidate cards.
- Status badges and pill indicators use `9999px` to signify non-interactive status signals.

## Components

### Buttons
- **Primary**: Solid background `#0F172A` with `#FFFFFF` text, 8px border-radius, 40px standard height (`padding: 0 16px`), font weight 500. Hover: `#1E293B`. Focus: 3px outer ring `#93C5FD`.
- **Secondary / Action Accent**: Background `#2563EB`, text `#FFFFFF`. Hover: `#1D4ED8`.
- **Outline / Neutral**: Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: `#F8FAFC` and border `#CBD5E1`.
- **Destructive**: Background `#FFF1F2`, border `1px solid #FECDD3`, text `#E11D48`. Hover: `#FFE4E6`.

### Inputs & Form Controls
- Height 40px, background `#FFFFFF`, border `1px solid #CBD5E1`, padding 0 12px, border-radius 8px.
- Focus: Border `#2563EB`, outline 3px solid rgba(37, 99, 235, 0.15).
- Error: Border `#E11D48`, text `#E11D48` helper message below input.

### Badges & Status Chips
- Height 24px, pill shape (9999px radius), padding 2px 10px, typography `label-sm`.
- Status styles: Success uses green-50 background with green-600 text; Error uses rose-50 with rose-600 text; Pending uses amber-50 with amber-700 text. Includes an optional 6px circular status dot on the leading edge.

### Stat Cards
- Container: Surface `#FFFFFF`, border `1px solid #E2E8F0`, border-radius 12px, padding 20px.
- Structure: Top row contains category label (`label-md` in `#64748B`) and contextual trend badge. Center displays the raw metric using `stat-value` (`#0F172A`). Bottom contains micro-summary comparison against prior cohort or session target.

### SaaS Data Tables
- Table header: Background `#F8FAFC`, height 40px, border-bottom `1px solid #E2E8F0`, text `label-sm` uppercase `#64748B`.
- Row height: 52px for default density; 64px for candidate assessment rows with avatar and meta lines.
- Alternate zebra styling is prohibited; row separation relies on `1px solid #F1F5F9` dividers with `#F8FAFC` hover background across the full row.

### Tab Bars & Segmented Controls
- Horizontal underline tabs: Border-bottom `1px solid #E2E8F0`, active tab features `#2563EB` text and a 2px high underline bar directly anchored to the bottom divider.
- Segmented pills: Background `#F1F5F9`, 4px padding, 8px outer radius. Active item has white background, 6px inner radius, and Level 0 shadow.

### QR Attendance Scanner Pattern
- Mobile & Kiosk viewports: Floating 280x280px scanning frame with 12px corner brackets in `#2563EB`, backed by dark alpha overlay (`rgba(15, 23, 42, 0.6)`).
- Instant verification drawer: Slides up from bottom on mobile or appears as a Level 3 modal on desktop, displaying the student's name, collegiate roll number, registration status badge, and immediate one-tap "Mark Present" or "Admit" action.