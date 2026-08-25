---
name: archetype-design
description: Design and build interfaces, sites, and assets in the Archetype brand — a boutique strategy and product development agency. Use for production code or throwaway mocks. Carries the tokens, type roles, color rules, voice, and the constraints that are easy to get wrong.
user-invocable: true
---

# Archetype

Read `../DESIGN-SYSTEM.md` for the full spec. Start with its **"Where this comes
from"** preface — the rules are downstream of a claim about how organizations
work, and applying them without it produces pastiche.

`../tokens.json` holds every value. `../build/tokens.css` is the Tailwind v4
theme. Never type a hex; name a token.

## Getting the tokens in

```css
@import "tailwindcss";
@import "@archetype/design-system/css";
```

For a standalone HTML artifact with no build step, inline the contents of
`build/tokens.css` in a `<style>` block and load Tailwind from a CDN, or just
use the `--color-*` and `--type-*` custom properties directly.

## Set text with the role classes

```html
<span class="type-eyebrow">Approach</span>
<h1 class="type-display-lg">Find the pattern. Build with conviction.</h1>
<p class="type-body max-w-measure">Most companies scale their problems.</p>
```

Thirteen roles: `display-xl` `display-lg` `display-md` `heading-lg` `heading-md`
`heading-sm` `eyebrow` `body` `body-sm` `quote` `ui` `ui-sm` `caption`.

Each sets size, leading, tracking, weight, family and default color. The
Tailwind `text-*` utilities set everything **except family** — pair them with
`font-serif` / `font-display` / `font-text`, or use the role class.

## The constraints that are easy to get wrong

- **90% stone, 8% verdigris, 2% bronze.** A hard discipline. Accent creep is the
  main way this brand degrades.
- **Never `#FFFFFF`.** `--color-background-primary` (stone-50) is the ground.
  The neutrals are warm-cast — R > G > B at every step.
- **Bronze is never a button, CTA, or large fill.** A hairline, a small mark, or
  one emphasized word. Prominent bronze reads corporate-luxury, which is the
  failure mode.
- **Serif is for reading only.** Body copy and pull quotes. Never a label,
  button, nav item, form field, table header, or metadata.
- **Sans has two optical cuts:** display at 27px+, text at 20px and below,
  nothing between.
- **Two reading sizes: 17 and 15.** No 19px step.
- **Sharp corners.** Pills only for status badges and radio controls. Do not
  round cards or buttons broadly.
- **Cards rest on a border, never a shadow.** Flat surfaces, no gradients.
- **Motion is fades and color transitions, 120–360ms.** No bounce, no spring, no
  parallax, no scale-on-press.
- **All-caps only for the eyebrow role and the logo.**
- **No emoji, anywhere, on any surface.**

## Voice

Calm, precise, assured. Declarative sentences, short paragraphs. Peer to peer —
never explain down, never flatter, never use urgency or scarcity. "We" about
Archetype, "you" about the reader's organization. Sentence case in UI and
headings.

Never: disruptive, game-changing, cutting-edge, best-in-class, unlock, leverage,
supercharge, revolutionize, seamless, delightful. No exclamation points. No
rhetorical questions as openers.

Microcopy names the state, then the consequence, then what to do. "Start a
project", not "Get started free!". "That email address is incomplete.", not
"Oops! Something went wrong."

Full guidance: `../DESIGN-SYSTEM.md` §7.

## The mark

`../assets/logo/archetype-mark.svg`, on `currentColor` — set `color` on the
parent to recolor, and inline it rather than using `<img>` so that works.

**It is 1.24:1, not square.** Set height and let width follow. Use
`archetype-mark-square.svg` for favicons and app icons. Never clip the crossbar
to the circle — the overhang is the mark's distinguishing move.

## Dark

`data-theme="dark"` on any element, not just the root. A dark footer on a light
page needs no `dark:` variants and no second token set.

## Fonts

The system ships proxies — Archivo for Neue Haas Grotesk, Source Serif 4 for
Freight Text Pro, because the real faces are Adobe Fonts and need a domain-bound
kit. Display line breaks and the two sans optical cuts therefore cannot be
judged by eye yet. Do not "fix" a headline's line breaks against the proxy.
