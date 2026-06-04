---
version: "alpha"
name: "Polyglow"
description: "A multilingual editorial Astro theme with borderless typography-first surfaces, compact archives, dark mode, Astro view transitions, Pagefind search, and long-form prose."
colors:
  background: "#FFFFFF"
  foreground: "#18181B"
  card: "#FFFFFF"
  cardForeground: "#18181B"
  popover: "#FFFFFF"
  popoverForeground: "#18181B"
  primary: "#27272A"
  primaryForeground: "#FAFAFA"
  secondary: "#F4F4F5"
  secondaryForeground: "#27272A"
  muted: "#F4F4F5"
  mutedForeground: "#71717A"
  accent: "#F4F4F5"
  accentForeground: "#27272A"
  destructive: "#DC2626"
  border: "#E4E4E7"
  input: "#E4E4E7"
  ring: "#A1A1AA"
  darkBackground: "#18181B"
  darkForeground: "#FAFAFA"
  darkCard: "#27272A"
  darkPopover: "#27272A"
  darkPrimary: "#E4E4E7"
  darkPrimaryForeground: "#27272A"
  darkSecondary: "#3F3F46"
  darkSecondaryForeground: "#FAFAFA"
  darkMuted: "#3F3F46"
  darkMutedForeground: "#A1A1AA"
  darkAccent: "#3F3F46"
  darkAccentForeground: "#FAFAFA"
  darkBorder: "#FFFFFF"
  darkInput: "#FFFFFF"
  darkRing: "#71717A"
typography:
  sans:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.5"
    letterSpacing: "0px"
  heading:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: "1.15"
    letterSpacing: "-0.035em"
  heroTitle:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "-0.035em"
  articleBody:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "2rem"
    letterSpacing: "0px"
  nav:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0px"
  label:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.25"
    letterSpacing: "0.12em"
  small:
    fontFamily: "Inter, SF Pro Text, PingFang SC, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.5"
    letterSpacing: "0px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  card: "14px"
  hero: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  page-x: "16px"
  page-x-sm: "20px"
  page-x-md: "24px"
  section-y: "40px"
components:
  page:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.sans}"
  page-dark:
    backgroundColor: "{colors.darkBackground}"
    textColor: "{colors.darkForeground}"
    typography: "{typography.sans}"
  post-card:
    backgroundColor: "transparent"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.card}"
    padding: "0"
  article-hero:
    backgroundColor: "transparent"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.hero}"
    padding: "0"
  text-card:
    backgroundColor: "transparent"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  taxonomy-card:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.mutedForeground}"
    typography: "{typography.nav}"
  primary-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  secondary-button:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
  search-input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "{spacing.md}"
  meta-pill:
    backgroundColor: "transparent"
    textColor: "{colors.mutedForeground}"
    rounded: "{rounded.pill}"
    padding: "0"
  destructive-button:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.md}"
    padding: "12px"
---

## Overview

Polyglow is a multilingual editorial publishing interface built on Astro static
output. The live visual system is implemented in `src/styles/global.css`; this
file records the same system as tokens and design rules so later UI work keeps
the current theme intact.

The current interface is neutral, content-first, image-led, and compact. It
uses strong real imagery, typography-led post surfaces, quiet navigation, dense
archive rows, readable prose, Pagefind search styling, Astro view transitions,
and a light/dark theme switcher.

## Theme Model

Runtime theming lives in `src/styles/global.css`. Tailwind v4 token namespaces
map to semantic CSS variables, then `:root` and `.dark` provide the live light
and dark values.

`DESIGN.md` stores sRGB approximations of the current OKLCH runtime tokens.
`src/styles/design-theme.css` is a Tailwind-compatible token reference generated
from this file. The generated file does not replace the runtime dark-mode
variables by itself.

## Color System

The palette is a neutral publishing palette:

- `background` and `foreground` define the main reading surface.
- `card`, `popover`, `secondary`, `muted`, and `accent` exist for compatibility
  with Tailwind utility names, but visible hierarchy should come from spacing,
  type scale, and font weight before surfaces.
- `primary` and `primaryForeground` define high-emphasis actions and inverted
  text.
- `border`, `input`, and `ring` define focus affordances and third-party UI
  compatibility. Do not use them to reintroduce boxed post lists or cards.
- `destructive` is reserved for destructive or error states.

Dark mode keeps the same neutral hierarchy with darker surfaces and lighter
text. Use the dark tokens as design references; runtime switching stays in CSS.

## Typography

The project prioritizes Inter, SF Pro Text, and PingFang SC, then falls back to
system sans families with broad multilingual support.

Article prose uses `17px` type with relaxed line height. Chinese, Japanese, and
Korean prose uses justified text where supported. Arabic pages rely on the
document `dir="rtl"` value and start-aligned prose. Headings are compact and
strong. Navigation and metadata stay small, with normal or slight positive
tracking only where the current UI already uses uppercase labels.

Do not use viewport-scaled font sizes. Negative letter spacing is reserved for
large editorial headings through the `tightest` token.

## Layout

The standard page frame is `max-w-6xl` with responsive horizontal padding.
Most pages use 16px on mobile and 24px on wider screens.

Article prose centers at `max-w-3xl`. Article media stays within the article
content width unless a page template intentionally gives it a wider surface.
Archive, taxonomy, and search pages favor scanning density and compact rows
over promotional composition.

The homepage has three code-supported modes in `SITE_CONFIG.homepage.layout`:
`cover`, `archive`, and `text`. The default implementation currently uses
`cover`.

## Image And Text Surfaces

Post cover surfaces use full-bleed imagery with a simple gradient for text
legibility. Text sits directly on the image layer and relies on weight, scale,
tracking, and whitespace instead of panels, borders, or shadows.

Article heroes use the same image-first language. Header, dropdown, and mobile
navigation use translucent theme backgrounds with blur, but they do not use
decorative borders or shadow.

Text cards, taxonomy links, and archives stay quiet: transparent backgrounds,
small radius only where hit targets need it, and physical active states instead
of hover color blocks.

Do not create cards inside cards. Do not turn full page sections into floating
cards.

## Shapes

The base runtime radius is 10px. Small controls use 6px, standard buttons and
dropdown items use 8px, regular repeated surfaces use 10px to 14px, image
surfaces use 12px to 16px, and metadata labels avoid visible pill backgrounds.

## Component Guidance

- **Header and nav:** compact height, theme background, subtle border, grouped
  category dropdowns, search, language switcher, theme switcher, and mobile nav.
- **Post cards:** image-first with readable gradient text and real imagery.
- **Article page:** image hero, compact metadata, centered readable prose,
  typography-first MDX elements, and related posts.
- **Archive list:** dense rows, tabular dates, truncated titles where needed,
  and no oversized cards.
- **Taxonomy pages:** compact link grids, pills, and paginated post grids.
- **Search:** Pagefind controls follow background, foreground, and focus tokens,
  with result hierarchy from typography and spacing rather than boxed cards.
- **Widgets:** GTM, AdSense, and x402 remain visually silent unless enabled by
  configuration.
- **Icons:** use `src/components/ui/Icon.astro` and the Lucide allowlist in
  `astro.config.mjs`.

The prose wrapper class is `polyglow-prose`. Treat it as a stable CSS API
unless the rename is part of a deliberate cleanup across components, CSS, and
tests.

## Visual Constraints

- Keep UI text inside its container at mobile, tablet, and desktop sizes.
- Preserve multilingual and RTL layout behavior.
- Preserve real image-led surfaces for post cards and article heroes.
- Keep `Polyglow` as the theme brand unless a task explicitly asks for a rename.
- Avoid decorative background blobs, one-note color palettes, and nested cards.
- Avoid visible UI text that explains implementation details.
