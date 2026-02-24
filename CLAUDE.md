# SP Surf Coach - Design, Framework, and Implementation Guide

This document is the source of truth for how we design, build, and maintain the SP Surf Coach website.

Use this guide before creating new sections, pages, components, or style tokens.

---

## 1) Project Goals

### Primary goals
- Build a premium, editorial surf brand website with strong visual storytelling.
- Keep visual consistency across all pages and breakpoints.
- Make the experience responsive-first and content-driven.
- Maintain a clean, scalable codebase with reusable UI primitives.

### UX goals
- Fast first impression on Home hero.
- Clear navigation to Surftrips, Servicios, Shop, Nosotros, Blog.
- Strong CTA placement in all key sections.
- Accessible readable typography and contrast.

---

## 2) Tech Stack and Web Framework

### Framework
- **Next.js (App Router)**
- **React + TypeScript**
- **Tailwind CSS v4** for utility classes
- Custom design system via `src/styles/design-system.css`

### Why this stack
- App Router gives clear page structure and good long-term scalability.
- TypeScript keeps component/data contracts safer.
- Tailwind speeds layout iteration while still supporting design tokens.
- Design system CSS keeps typography, color, and controls standardized.

### Core directories
- `src/app/` - routes/pages
- `src/components/site/` - global layout UI (header/footer)
- `src/components/sections/` - reusable section blocks
- `src/lib/` - content and shared typed data
- `src/styles/` - design system tokens/utilities
- `public/photos/` - visual assets

---

## 3) Design System Source of Truth

### File
- `src/styles/design-system.css`

### Rule
- New UI must use design system classes/tokens first.
- Avoid hardcoded one-off typography values unless absolutely necessary.
- If a pattern is repeated 2+ times, create/extend a DS utility class.

### Existing typography tokens/classes
- `ds-h1` -> Heading H1 (40px base)
- `ds-h2` -> Heading H2 (32px base)
- `ds-h3` -> Heading H3 (24px base)
- `ds-body-m` -> Body Medium
- `ds-body-s` -> Body Small
- `ds-label` -> Label default
- `ds-chip` -> small chip text
- `ds-brand-title` -> display/brand title utility

### Existing control/surface classes
- `ds-btn`, `ds-btn-primary`, `ds-btn-secondary`
- `ds-link`
- `ds-input`
- `ds-card`
- `ds-nav-link`
- `ds-nav-dark`, `ds-nav-light`

---

## 4) Visual Style Rules

### Color palette usage
- Use design token variables from `:root` in `design-system.css`.
- Primary brand tones for emphasis and section backgrounds.
- Dark sections use white/inverse text.
- Neutral light surfaces for text-heavy sections.

### Typography usage
- Home hero statement must use `ds-h1`.
- Section titles should use `ds-h2`.
- Card/local titles should use `ds-h3`.
- Supporting copy uses `ds-body-s` unless explicitly display-level.
- Labels/kickers use `ds-label`.

### Spacing and rhythm
- Prefer consistent section vertical spacing (`py-14`, `py-16` style rhythm).
- Use horizontal paddings by breakpoint:
  - base: `px-4`
  - sm: `px-6`
  - md: `px-10`
  - lg: `px-16`
- Keep CTA buttons with consistent margin-top in each section.

### Border radius language
- Hero frame: large rounded bottom.
- Cards/images: 18px-24px rounded family.
- Buttons: pill radius.

---

## 5) Responsive System (Non-Negotiable)

### Philosophy
- Mobile-first layout.
- Progressive enhancement at breakpoints.
- Avoid fixed heights tied to one device.

### Breakpoint strategy
- `base` (<640): single column, mobile nav, compact spacing
- `sm` (>=640): denser spacing, larger cards
- `md` (>=768): two-column where meaningful
- `lg` (>=1024): desktop nav, multi-column dense layout
- `xl+` optional refinements only

### Required responsive rules
- No desktop-only absolute placement without responsive fallback.
- Avoid pixel-locked `max-h` constraints for main hero/content blocks.
- Use `vh`, `aspect-*`, and fluid grids for major media containers.
- Validate no horizontal overflow at any breakpoint.

### Header/Nav behavior
- Desktop nav at `lg+`.
- Mobile hamburger below `lg`.
- Home overlay header must remain legible over hero image.

---

## 6) Page Architecture Standards

### Home page composition
1. Hero
2. Intro / brand statement
3. Surftrips highlight
4. Destinos
5. Servicios
6. Comunidad
7. Partners
8. Shop teaser
9. Surf Talks CTA
10. Footer

### Internal pages
- Keep same top-level spacing system.
- Reuse shared section primitives.
- Avoid per-page custom style logic when a reusable section can be made.

---

## 7) Component Guidelines

### Reuse first
- Before creating a new component, check `src/components/sections/` and `src/components/site/`.
- Prefer extending existing props over duplicating markup.

### Props and typing
- Define explicit TypeScript types for content blocks.
- Keep data-driven sections in arrays/maps when possible.

### Accessibility
- All images need meaningful `alt`.
- Icon-only buttons require `aria-label`.
- Maintain text contrast in overlays.
- Keep keyboard focus visible.

---

## 8) Content and Asset Rules

### Content
- Spanish-first copy for product context.
- Keep message clear, short, premium tone.
- CTAs should be action-oriented and consistent.

### Assets
- Store web assets in `public/photos/`.
- Use `next/image` for all content images.
- Respect aspect ratio and crop intent by section.

### Allowed visual difference
- If a design comparison is requested, only approved differences should remain (for example, background photo).

---

## 9) Coding Conventions

### Styling
- Use DS classes for typography/buttons/inputs/cards.
- Keep Tailwind classes for layout and responsive structure.
- Minimize inline style objects (except dynamic widths/data-driven UI bars).

### Naming
- Components: PascalCase.
- Utilities/classes in DS: `ds-*`.
- Content constants in `src/lib/content.ts`.

### Maintainability
- Keep sections modular.
- Keep files focused on one responsibility.
- Avoid giant monolithic page components when section extraction is obvious.

---

## 10) QA and Testing Checklist

Run this checklist for every major style/layout update:

### Functional checks
- `npm run dev` runs cleanly.
- Navigation links route correctly.
- Mobile menu opens/closes and links work.
- Buttons/CTAs are clickable and visible.

### Visual checks
- Compare against design references.
- Validate in at least these viewport sets:
  - 390x844 (mobile)
  - 768x1024 (tablet)
  - 1024x768 (small desktop)
  - 1366x768 (desktop)
  - 1512x853 (design target frame)
- Check no clipping/overlap in hero text and nav.
- Check no horizontal scroll unless intentional.

### Code quality checks
- Run lint checks after substantive edits.
- Keep DS usage consistent; remove conflicting inline typography.

---

## 11) Workflow for New Design Requests

When implementing a new design request:

1. Extract exact design constraints (sizes, spacing, order, colors, typography).
2. Verify whether DS already supports those constraints.
3. If not, add DS utilities/tokens first.
4. Implement page/component with mobile-first responsive structure.
5. Validate in browser at multiple viewport sizes.
6. Refine visual parity section-by-section.
7. Run lint and finalize.

---

## 12) What to Avoid

- Pixel-perfect desktop lock that breaks on nearby sizes.
- Repeated hardcoded `text-[...]` sizes when DS class exists.
- Absolute positioning without responsive alternatives.
- Multiple competing sources of truth for typography.
- Styling that bypasses DS for core primitives.

---

## 13) Definition of Done (Design/Frontend Tasks)

A design/frontend task is done when:
- The requested page/section matches approved design intent.
- Responsive behavior works across target breakpoints.
- DS tokens/classes are used consistently.
- No critical visual regressions introduced.
- Lint passes.

---

## 14) Future Enhancements (Planned)

- Add dedicated DS utilities for spacing scale (`ds-space-*`).
- Add CSS custom properties for standardized section heights.
- Add shared responsive test script/snapshots.
- Build UI kit component inventory page (`/styleguide`) from DS classes.

---

If in doubt, optimize for:
1) Consistency with the design system,
2) Responsive reliability,
3) Maintainability for future iterations.
