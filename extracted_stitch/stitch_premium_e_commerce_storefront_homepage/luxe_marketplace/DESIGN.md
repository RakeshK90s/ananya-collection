---
name: Luxe Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-xl:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a high-tier digital storefront that refines high-density marketplace patterns (such as those seen in Amazon, Flipkart, and Meesho) into an uncluttered, premium shopping experience. The visual language blends intentional minimalism with refined tactile affordances, avoiding marketplace visual fatigue while retaining high transactional clarity.

- **Audience:** Discerning shoppers seeking velocity, trust, and premium curation alongside value-focused retail mechanics (flash deals, curated departments, and rapid checkout).
- **Aesthetic Tone:** Curated, luminous, streamlined, and dependable.
- **Design Paradigm:** Clean architectural surfaces, generous structural breathing room, hyper-focused transactional accents, and subtle glassmorphic floating utility layers.

## Colors

The palette balances structural authority with energetic transactional clarity:
- **Canvas & Surface Tier:** Pure white (`#FFFFFF`) forms interactive cards and modals. A luminous slate-tinted canvas (`#F8FAFC`) anchors the page backdrop, while subtle divider borders leverage `#E2E8F0`.
- **Primary Brand (Deep Indigo - `#4F46E5`):** Reserved for category filters, brand markers, selected states, verified vendor badges, and secondary navigational interactive items.
- **Transactional Secondary (Warm Orange - `#F97316`):** Dedicated exclusively to high-conversion moments—direct conversion triggers, “Add to Bag”, “Buy Now”, sale countdown counters, and promotional discount badges.
- **Typography & Neutrals:** Deep slate (`#0F172A`) commands high-contrast headlines and primary pricing; slate grey (`#475569`) manages metadata, secondary specifications, and product variants; subtle slate (`#94A3B8`) handles inactive states and placeholders.

## Typography

The type scale combines Outfit’s geometric, open structure for headlines with Inter’s utilitarian rhythm for high-density transactional text:
- **Display & Headings:** Use Outfit for marketing banners, collection titles, and product detail view headers. Maintain tight, deliberate tracking (`-0.02em`) on sizes above 24px to ensure a polished luxury-editorial feel.
- **Body & Specs:** Inter delivers tabular clarity across product descriptions, reviews, pricing grids, and checkout flows.
- **Numbers & Prices:** Set price figures in Outfit SemiBold or Bold to anchor visual value hierarchy across search result grids.

## Layout & Spacing

A fluid 12-column grid system governs desktop views (max container width: 1440px), stepping down to an 8-column layout for tablets and a 4-column system for mobile viewports.

- **Margins & Gutters:** Desktop uses 32px (`2rem`) outer margins and 24px (`1.5rem`) gutters between card columns. Mobile drops outer margins to 16px (`1rem`) with compact 12px (`0.75rem`) gutters to balance breathing room with item visibility.
- **Rhythm Rules:** Product grids default to 4 columns on large desktop, 3 columns on standard desktop, 2 columns on tablet/mobile. Department carousels preserve negative space by leaving half an element exposed at the right edge to invite horizontal exploration.
- **Whitespace Integrity:** Generous vertical module gaps (`space-xl` / 40px) enforce clean separation between promotional hero areas, product rails, and curated showcases.

## Elevation & Depth

Visual depth is achieved through ambient, non-muddy shadows and subtle translucent boundaries:
- **Base Canvas:** Flat `#F8FAFC` base provides chromatic contrast beneath pure `#FFFFFF` cards.
- **Product & Content Cards:** Resting elevation uses a featherlight tinted shadow (`0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)`) paired with a micro-border of `1px solid rgba(226, 232, 240, 0.8)`. Hover states translate `-2px` vertically with an elevated soft shadow (`0 12px 24px -6px rgba(15, 23, 42, 0.08)`).
- **Navigation & Sticky Headers:** Employs a glassmorphic surface: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(226, 232, 240, 0.7)`.
- **Modals & Drawers (Cart/Checkout):** Highest elevation layer using deep ambient attenuation (`0 20px 40px -12px rgba(15, 23, 42, 0.16)`) coupled with a neutral slate backdrop scrim (`rgba(15, 23, 42, 0.4)`).

## Shapes

The interface balances welcoming curves with structural integrity:
- **Base Curve:** Elements use an 8px (`0.5rem`) radius for small inputs, badges, and controls.
- **Cards & Visual Containers (`rounded-xl`):** Product tiles, collection banners, and modals apply a consistent 12px to 16px radius, creating smooth silhouettes without veering into toy-like softness.
- **Interactive Micro-Shapes:** Circular buttons (1:1 aspect ratio) are reserved exclusively for wishlist toggles and carousel pagination arrows.

## Components

- **Primary Conversion Buttons (CTAs):**
  - Use Warm Orange (`#F97316`) for primary transactional triggers ("Add to Cart", "Proceed to Checkout"). Text is high-contrast `#FFFFFF` with `label-lg` styling. Apply `0.5rem` radius and subtle hover lift.
  - Secondary actions ("Explore Collection", "View Details") use transparent backgrounds with an Indigo (`#4F46E5`) micro-border or faint slate fill (`#F1F5F9`).

- **Product Cards:**
  - White surface (`#FFFFFF`) with 12px corner radius (`rounded-xl`).
  - Image area maintains a 4:5 or 1:1 aspect ratio with an off-white baseline background (`#F8FAFC`).
  - Contains floating wishlist icon button (frosted glass circle) on the top right and an optional top-left promotional pill badge.
  - Typography stack within the card: Subdued department label (`label-sm`), bold item name (`headline-sm`), followed by inline pricing (Outfit Bold in `#0F172A` with struck-through original price in `#94A3B8`).

- **Badges & Offer Chips:**
  - High-urgency badges ("50% OFF", "Limited Deal") use Warm Orange backgrounds with crisp white text.
  - Category and status tags ("Express Shipping", "Verified") use faint indigo tint (`#EEF2FF`) with deep indigo text (`#4F46E5`).

- **Search & Filter Controls:**
  - Universal top search input is framed with a 1px border (`#E2E8F0`), active focus state transitioning to a 2px Indigo ring (`#4F46E5`) with zero interior shift.
  - Filter chips use clean pill shapes with `#F1F5F9` neutral fills, switching to solid `#4F46E5` with `#FFFFFF` text when active.

- **Form Fields & Checkouts:**
  - Standard inputs leverage an 8px border radius, clear floating label typography, and subtle validation states (emerald for verified inputs, carmine for input errors).