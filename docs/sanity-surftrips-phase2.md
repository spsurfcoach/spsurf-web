# Surftrips Phase 2 (Full Figma Parity)

This document defines the phase-2 block extensions required to match the complete surftrip page in the provided Figma.

## Target

- Preserve existing MVP blocks and published documents.
- Add new block types incrementally, without breaking current pages.
- Reach visual/content parity with the complete surftrip layout.

## New Blocks To Add

1. `itineraryBlock`
- title
- days (array of day title + activities + optional media)
- optional summary

2. `inclusionsBlock`
- heading
- includedItems (array of strings)
- excludedItems (array of strings)

3. `statsStripBlock`
- items (array of label + value)
- supports metadata rows like nivel, duracion, cupos, aeropuerto

4. `testimonialGroupBlock`
- heading
- testimonials (quote, author, trip label, optional avatar image)

5. `faqGroupBlock`
- heading
- faqs (question + answer)

6. `bookingPanelBlock`
- heading
- body
- primaryCtaLabel / primaryCtaHref
- secondaryCtaLabel / secondaryCtaHref
- priceNote

7. `mapOrLocationBlock`
- heading
- image or embed URL
- optional location details

## Rendering Strategy

- Keep one renderer switch by `_type`.
- Add one React section component per new block type.
- Keep DS typography and spacing (`ds-*`, section rhythm, responsive paddings).
- Support safe defaults for missing optional fields.

## Migration Strategy

1. Add schemas for new block types.
2. Deploy Studio schema update.
3. Keep old documents valid (no required new blocks).
4. Add blocks to selected trips progressively.
5. Run visual QA by breakpoint and compare to Figma.
