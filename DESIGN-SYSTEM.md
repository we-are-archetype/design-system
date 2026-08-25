# Archetype Design System

The written spec. Prose rules, referencing tokens by name and never by value —
if you find a hex in this file outside a contrast measurement, it is a bug.

`tokens.json` holds the values. `build/` is generated from it. This file
explains what the values are for and which combinations are wrong.

---

## Where this comes from

Read this before applying anything below it.

Archetype is a boutique strategy and product development agency. The brand
premise is in the name — Greek *archē*, origin, and *typos*, pattern: enduring
organizations rest on a pattern you **discover**, not one you invent. Most
companies scale their problems. The work is finding the logic underneath a
business and building brand, product and systems from it.

That premise is why the system looks the way it does. A brand about finding
underlying structure cannot be decorated. Every rule here is a subtraction:
two accent colors instead of six, two typefaces with a hard division of labour,
sharp corners, flat surfaces, hairlines doing the work photography would do
elsewhere, motion that only ever fades. The restraint is not an aesthetic
preference layered on top of the idea. It **is** the idea, expressed in a
medium.

The failure mode this document cannot prevent on its own is pastiche — applying
the rules as a style, producing something that looks Swiss and means nothing.
The rules are downstream of a claim about how organizations work. If you are
making a decision the rules do not cover, decide it from the claim.

The influences are load-bearing rather than cited: **Swiss/International
Typographic Style** (the grid, which is why the spacing scale exists),
**Vignelli** (a small vocabulary used consistently, which is why there are two
accents and not six), **Rams** (longevity over novelty), **editorial and
architectural publishing** (generous margins and strong hierarchy, which is why
the measure caps at 62–70 characters), **systems thinking**, and
**first-principles reasoning** — better stated as understanding over copying.

Held in the brand book and never surfaced publicly: **Plato**, form as the model
the physical world copies, the triangle as the primitive of structure. And the
mark's lineage, which is fact rather than affinity — it is inherited from
**Alchemy Work Club**, where it was the alchemical glyph for Air: intellect,
reason, the invisible medium.

---

## 1. Color

### The ratio is the rule

**90% stone, 8% verdigris, 2% bronze**, measured over painted area. Treat it as
a hard discipline, not an aspiration. It is encoded at `palette.ratio` and it is
the single thing most likely to erode: every individual decision to add a little
more accent is defensible, and the sum of them is a different brand.

### Stone does almost all the work

`stone-50` through `stone-900` — Canvas, Chalk, Limestone, Ash, Pumice, Stone,
Slate, Graphite, Basalt, Ink.

**Warm-cast at every step: R > G > B.** The build enforces this. Neutralizing
toward a cool or pure gray is the one change that would make the palette
generic, and it happens one step at a time.

**Never pure white.** `stone-50` is the page ground. `#FFFFFF` breaks the warm
cast the whole ramp is built on, and the build fails if it reaches the output.

Text tints, and why each one is where it is:

| Role | Token | Reasoning |
|---|---|---|
| Display, headings | `text-primary` → `stone-900` | 16.70:1 on canvas |
| Reading copy | `text-secondary` → `stone-600` | 6.21:1. The lightest tint that carries body text |
| `body-sm`, UI | `text-emphasis` → `stone-700` | 9.67:1 — see §2 |
| Metadata | `text-tertiary` → `stone-500` | 3.72:1. Large display type and rules only |
| Disabled | `text-disabled` → `stone-400` | 2.41:1. Decorative. Never type on a light ground |

`stone-400` fails even the 3:1 large-text threshold, so it is not a display-type
color either. The build blocks it from any light-mode text role except the
disabled states, which are exempt from AA by design — that exemption is the
entire reason the token exists.

### Verdigris is the accent

`verdigris-700` is the primary accent: links, active and selected states, focus
rings, the occasional rule or callout. It is **not** a brand-wide fill color.
`verdigris-500` is a border and icon tint at 4.38:1 — fine for its stated 3:1
role, not for body copy, and the build holds it to 3:1 rather than 4.5:1 so that
the distinction is recorded rather than assumed.

### Bronze is a hairline

`bronze-700` appears as a hairline, a small mark, or a single emphasized word.
**Never a button, a CTA, or a large surface fill** — the build rejects it as any
`background-*`, `action-*` or `*-bg` value. Making bronze prominent turns the
brand corporate-luxury, which is the failure mode. `bronze-500` on `stone-100`
lands at exactly 3.00:1; never set type there.

### Reach for the semantic layer

Product code uses `--color-background-primary`, `--color-text-secondary`,
`--color-border-subtle`, `--color-accent-primary`, `--color-focus-ring`. It does
not use the raw ramp. The semantic names are verbose in Tailwind
(`bg-background-primary`) and that verbosity is the cost of one name per
concept — see §11 for the shorter path through the role classes.

### Dark

Set `data-theme="dark"` on any element; it does not have to be the root. Stone
inverts and the accents shift to their **lighter** steps, because
`verdigris-700` on `stone-900` is unreadable. Only the semantic layer moves — no
hex is redefined.

Dark-mode secondary text maps to `stone-300`, not `stone-500`. `stone-500` on
`stone-900` measures 4.49:1, a rounding-margin miss, and a rounding-margin miss
is still a miss.

### No gradients. Flat surfaces only.

The only non-opaque values in the system are `surface-overlay` and its dark
counterpart — a scrim behind a modal. No frosted glass, no backdrop-blur panels,
no tinted-transparent hover steps (those were retired; see `tokens.json`).

---

## 2. Typography

### Two typefaces, a hard division of labour

**Neue Haas Grotesk** carries every heading, label, and piece of interface. It
is also the logo wordmark face, so it carries the identity.

**Freight Text Pro** is for reading only — body copy and pull quotes. **Never** a
label, button, nav item, form field, table header, or piece of metadata.

### The optical boundary is structural

Neue Haas ships as two separately-named optical cuts:

- **Display** at **27px and above**
- **Text** at **20px and below**
- **No sans role between 20 and 27**

This is a property of the scale rather than a rule anyone has to remember. With
`heading-lg` at 27 there is simply nothing in the gap, and the only 24px role is
`quote`, which is serif — so the boundary is never tested. The build fails if a
sans role lands in the gap or uses the wrong cut for its size.

### The scale

**12 · 13 · 15 · 17 · 20 · 24 · 27 · 36 · 48 · 64.**

The display half — 27/36/48/64 — is an exact perfect fourth. 24→27 is 1.125, the
text cluster's own interval, so the two halves join on a real step rather than
an arbitrary one. The text half is a gently widening progression (1.083 →
1.200), deliberately accepted rather than forced onto a single ratio.

### The 13 roles

`display-xl` `display-lg` `display-md` `heading-lg` `heading-md` `heading-sm`
`eyebrow` `body` `body-sm` `quote` `ui` `ui-sm` `caption`.

Each carries size, leading, tracking, weight, cut and a default color pairing.
**All thirteen pass WCAG AA at their own size** — no exceptions, no
large-text-only caveats.

Two of those pairings are decisions worth knowing:

- **`eyebrow` and `caption` sit on `text-secondary` (stone-600), not stone-500.**
  Caps plus 0.14em tracking already carries the register distinction, so the
  lighter tint was redundant rather than load-bearing — and at 12px stone-500
  measures 3.72:1 and fails.
- **`body-sm` sits on `text-emphasis` (stone-700), not stone-600.** At 15px the
  serif hairlines lose apparent weight against a warm off-white ground. Lifting
  the stem ratio from 6.21:1 to 9.67:1 pulls them back.

### Rules that are enforced, not preferences

- **Two weights in normal use: 55 Roman and 65 Medium.** 75 Bold is rare
  emphasis. There is no Light, and never for body-adjacent text.
- **Two reading sizes only: 17px and 15px.** There is no 19px step — `body-lg`
  was removed rather than adjusting the heading ramp around it. The build
  enforces the allowed list.
- **The eyebrow's 0.14em tracking is a systemic echo of the logo wordmark.** Keep
  it exact. It is a relationship, not a style choice.
- **No all-caps anywhere except the eyebrow role and the logo.**
- **No letterspacing on lowercase text.** Tracking is negative on display, zero
  at body, slightly positive on UI and small caps only.
- **Measure capped at 62–70 characters** — `--container-measure`, 64ch.
- **Never `-webkit-font-smoothing: antialiased` on serif body copy.** It is a
  common reset default and it *thins* strokes on macOS — the wrong direction
  against a warm off-white ground, where a sub-pixel hairline already blends
  toward a background darker than white. `build/tokens.css` sets it back to
  `auto` on `body, p, blockquote, li`. Below 17px prefer Freight Text Pro
  **Book** over Regular; it was cut for this problem.

### The families are a single swap point

Three declarations in `tokens.json` under `font`, and all 13 roles derive from
them. Nothing else in the system names a family.

It is **three** rather than two because Neue Haas's two optical cuts must stay
independently addressable — that separation is exactly what makes the 27/20
boundary enforceable. Two typefaces, three family strings; collapsing them gives
up the optical distinction.

**The system ships the production faces.** `font.use` is `"production"`, so the
stacks name `neue-haas-grotesk-display`, `neue-haas-grotesk-text` and
`freight-text-pro`.

### The consumer must load the kit

The faces come from an Adobe Fonts web project, which is bound to a domain — so
this package declares them and cannot serve them. **Every consumer links the kit
stylesheet, and a consumer that forgets it renders the entire system in
Helvetica and Georgia.**

```html
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="preconnect" href="https://p.typekit.net" crossorigin>
<link rel="stylesheet" href="https://use.typekit.net/npe3lvr.css">
```

**Two preconnects, not one.** `use.typekit.net` serves the kit stylesheet and
every font binary. The kit CSS then `@import`s `p.typekit.net/p.css` — a second
origin the browser cannot discover until the first stylesheet has arrived, and
render-blocking because an `@import` blocks the sheet that contains it. Warming
both removes a DNS and TLS round trip from that chain.

Read the URL from the package rather than typing it, so it stays a single-source
value like everything else:

```js
import { font } from "@archetype/design-system";
font.kit.url;          // "https://use.typekit.net/npe3lvr.css"
font.kit.preconnect;   // both origins, in document order
```

The build checks that the kit ships every weight the roles use — 400 and 500 for
both sans cuts, 400 for the serif. A weight missing from the Adobe project does
not error in a browser; it synthesises one, which is how a system quietly starts
rendering faux-bold.

**`font-display` is set per family, not per project.** Changing it on one
family in the Adobe Fonts UI leaves the others untouched, and nothing warns you.
`font.kit.fontDisplay` records the state family by family, and the build prints
it next to each family on every run.

A family left on `auto` **blocks**: its text is invisible until the face loads,
rather than showing a fallback. It cannot be overridden from the URL — a
`?display=` parameter is ignored. As recorded, `freight-text-pro` is on
`fallback` and both Neue Haas cuts are still on `auto`, which means every
heading, label, button and nav item blocks while body copy does not.

**`font.use` can go back to `"proxy"`** to render the system anywhere the kit is
not authorised — a fork, a sandbox, a domain the web project does not cover.
**Archivo** and **Source Serif 4** stand in, self-hosted from the Fontsource CDN,
and the package serves them itself.

**One irreducible exception.** `assets/logo/archetype-wordmark.svg` and
`archetype-lockup.svg` carry live text with a `font-family` attribute, because
an SVG loaded through `<img>` cannot read CSS custom properties. They name
`neue-haas-grotesk-display` directly, and the build fails if they drift out of
step with `font.use`. That keeps the exception honest but does not remove it —
supplying them as **outlined vector** does, and is the better fix. A wordmark
should not depend on a webfont loading at all.

### Now testable, and worth testing

These were unverifiable while the system ran on proxies. They are not
outstanding defects; they are the checks the real faces make possible.

- **Headline line breaks.** Archivo ran wider than Neue Haas, so every display
  line re-breaks on the swap. Anything with a hand-placed `<br>` was set against
  the proxy and should be re-judged.
- **The Display/Text optical distinction.** Archivo was a single optical size,
  so the two cuts rendered identically. They no longer do — the 27/20 boundary
  is now visible as well as enforced.
- **The 15px serif hairline mitigation.** It was validated against Source Serif
  4, which has *lower* stroke contrast than Freight, so the real face is more
  exposed rather than less. `body-sm` on `text-emphasis` is the mitigation;
  confirm it still holds at 15px.
- **The Book cut below 17px.** The kit ships freight-text-pro at 300–900. The
  system sets reading copy at 400, which is FreightText's Book weight — confirm
  the naming in the Adobe project before treating this as settled.

---

## 3. Spacing and layout

The scale runs **4px to 192px**: `space-1` … `space-11`.

Generous whitespace is a brand signal, not a default. The large steps exist so
that a big gap between sections reads as intentional confidence rather than an
empty layout. Sections breathe at `space-8` to `space-9` of vertical padding.
Content sits in `--container-site` (1200px) with wide gutters.

Every brand step is an exact multiple of Tailwind's 4px base, so the utility
scale already expresses all of them:

| Token | Value | Tailwind |
|---|---|---|
| `space-1` | 4px | `1` |
| `space-2` | 8px | `2` |
| `space-3` | 12px | `3` |
| `space-4` | 16px | `4` |
| `space-5` | 24px | `6` |
| `space-6` | 32px | `8` |
| `space-7` | 48px | `12` |
| `space-8` | 64px | `16` |
| `space-9` | 96px | `24` |
| `space-10` | 128px | `32` |
| `space-11` | 192px | `48` |

The system deliberately does **not** override Tailwind's numeric spacing scale.
Redefining `p-5` to mean 24px instead of 20px would make every Tailwind habit
subtly wrong in this codebase and only in this codebase. Use the steps in the
table; the `--space-*` variables exist for raw CSS and non-Tailwind consumers.

---

## 4. Surface, border, elevation

**Backgrounds** are flat solid fields — `background-primary`, or
`background-inverse` for a dark section, or `background-secondary` for a sunken
callout. No gradients, no photographic textures behind text, no repeating
patterns.

**Borders** do the structural work photography or shadow does elsewhere. Thin
hairlines, `--border-width` (1px) or `--border-width-thick` (1.5px):
`border-subtle` for quiet dividers, `border-strong` for framing,
`border-accent` for rare emphasis.

**Corners are sharp by default.** `radius-none` to `radius-sm` (0–2px) on
buttons, inputs and cards. Corners are structural, not softened. `radius-full`
is reserved for the two places roundness carries meaning: **status badges** and
the **circular radio control**. This restraint is itself a brand signal — do not
round cards or buttons broadly.

**Shadows are flat by default.** Cards rest on a border, never a shadow.
`shadow-raised` appears only on an interactive hover lift; `shadow-overlay` is
reserved for modals and dropdowns sitting above the page. Shadows indicate
elevation and are never decorative.

**Cards** are a bordered rectangle: `border-subtle`, sharp or 4px radius, flat
background, no shadow at rest. An optional image block sits flush at the top
edge with no padding around it; text content below gets standard padding.

**Photography** is used only for real case-study and work imagery, never as
decorative filler, and always in a single flat block. Never overlay a gradient
or scrim for legibility — place the text off the image instead. Where it is
used it should read warm-neutral and considered: natural light, minimal
styling, no oversaturated grading, no heavy grain. Black-and-white is acceptable
for archival and process imagery but is not the default treatment.

---

## 5. Interaction and motion

**Hover.** Solid fills darken slightly (`action-primary-bg-hover`); outline
buttons fill solid. No color-lightening hovers, no glow, no shadow-pop.

**Press.** Solid buttons go a shade darker still
(`action-primary-bg-active`). No scale or shrink transforms — the brand does not
use physical or skeuomorphic feedback.

**Focus.** `--color-focus-ring`, always visible. Never removed.

**Motion is minimal and functional.** Fades, opacity and color transitions only,
120–360ms, on `--ease-standard` or `--ease-out`. **No bounce, no spring
physics, no parallax, no decorative motion.** Restraint is the point.

---

## 6. The mark

`assets/logo/archetype-mark.svg` is the production vector, not a redraw. The
only edit from the supplied file is `black` → `currentColor`, so the mark can
invert on dark surfaces. Every coordinate and stroke width is untouched.

**It is the only hand-authored logo file.** `archetype-mark-square.svg`,
`archetype-wordmark.svg` and `archetype-lockup.svg` are generated from it by
`scripts/logo.mjs` — the square offset, the lockup gap and the wordmark tracking
are all arithmetic on the numbers below. The build reads the geometry back out
of the file and fails if this section's figures, `tokens.json` → `logo`, or any
derived file disagrees with what is actually drawn.

To revise the mark: replace that one file, run `npm run logo`, then `npm run
build` and fix whatever it names. Prose is the part it cannot check — if the
aspect moves, the figures quoted here and in `skill/SKILL.md` and
`docs/consumers/astro.md` need a pass.

Geometry, in the file's own 667×540 coordinate space:

- **Circle** — `cx 333.5, cy 290, r 245`, stroke **10**.
- **Triangle** — stroke **20**, drawn as an outlined path rather than a
  three-point stroke, apex at `(333.5, 20)`, base corners at `(99.68, 425)` and
  `(567.32, 425)`. All three points sit **outside** the circle: the apex clears
  the top of the arc by about 30 units, and each base corner breaks through the
  lower arc by a similar amount. The base is a drawn chord, so the form is a
  closed triangle rather than an open "A".
- **Crossbar** — stroke **20**, spanning `y 280–300`, centred exactly on the
  circle's horizontal centreline, running the **full width, 0 to 667** — an
  overhang of 0.34r on each side. Ends are chamfered with the bottom edge
  longer than the top.

Rules:

- **The circle stroke is exactly half the triangle and crossbar weight** — 10
  against 20.
- **Never clip the crossbar to the circle.** The overhang is the mark's
  distinguishing move.
- **The triangle breaking the circle at all three points is deliberate** and is
  the current revision. An earlier version had the vertices sitting on the arc.
  The circle contains the form without quite holding it.
- **Aspect is 1.24:1, not square.** Set height and let width follow. Anything
  carrying 1.17:1 or 1.28:1 is stale.
- **Wordmark tracking is near-zero (0.02em), not wide.** Set in Neue Haas
  Grotesk Display 75 Bold. Wide tracking belongs to the `eyebrow` role, which is
  a deliberate systemic echo of the wordmark rather than the same treatment.
- In the lockup the wordmark is about **0.76× the circle diameter**, set close
  beneath the mark at a gap of about 0.08× diameter.

All files use `currentColor`. Set `color` on the parent to recolor; there is no
`fill` attribute to override. `archetype-mark-square.svg` exists for favicons
and app icons only.

---

## 7. Voice

**Tone (constant).** Calm, precise, assured. Intellectually serious without
being academic. We state rather than sell. We are never eager.

**Timbre (texture).** Declarative sentences. Short paragraphs. White space in
the writing itself, so the prose rhythm matches the layout rhythm. Single-line
statements for weight, used rarely enough to land. Concrete nouns over abstract
ones, verbs over adjectives.

**Tenor (the reader).** Peer to peer. Founders and executives are equals who can
handle a direct answer. Never explain down, never flatter, never use urgency or
scarcity. Assume intelligence and reward attention.

**Person.** "We" about Archetype, "you" about the reader's organization. Avoid
third-person distancing — not "Archetype believes…" in body copy.

**Never.** Marketing clichés (disruptive, game-changing, cutting-edge,
best-in-class, unlock, leverage, supercharge, revolutionize, seamless,
delightful). Hype mechanics — exclamation points, urgency, scarcity, CTA
pressure. Buzzword stacks. More than one aside per sentence. Rhetorical
questions as openers. Our own name as a verb, adjective or filler. **Emoji,
anywhere, on any surface.**

**Always.** Lead with the reader's situation, not our credentials. State the
trade-off — if something costs something, say so. Be specific enough to be
wrong; unfalsifiable claims read as empty. Sentence case in UI and headings;
Title Case only in formal document titles.

**Earn it or leave it out.** Philosophy is load-bearing, not decorative. The
homepage and marketing speak to methods, approaches and outcomes; the depth
lives in the About page, the brand book and the conversation. A first-time
reader should understand what we do without meeting a single classical
reference. And always choose the second register on mysticism — "sacred
geometry" reads as crystals, "proportional system" reads as rigor.

**Microcopy** is where a calm brand usually breaks. Name the state, then the
consequence, then what to do. No apology, no exclamation, no personality where
a fact will do.

> "Start a project", not "Get started free!"
> "That email address is incomplete.", not "Oops! Something went wrong."
> "Loading" is a complete sentence in an interface.

Reference lines: **"Find the pattern. Build with conviction."** —
**"Most companies scale their problems. We help founders find the logic
underneath the business, then build brand, product and systems from it."** —
**"Six to ten weeks. Two partners. No deck."**

---

## 8. Iconography

**Lucide**, selected as the closest widely-available match to the
geometric-minimal aesthetic: thin, consistent stroke weight, no fill, no rounded
joins. **This is a substitution, flagged as one.** If Archetype commissions its
own set, replace it.

Icons are used sparingly and functionally — chevrons, close, check, arrow, link.
Never decoratively, never as a substitute for real photography, and never as
emoji. Stroke 1.5 on a 24px grid.

---

## 9. Consuming this system

### Install

```bash
npm i github:we-are-archetype/design-system#v1.2.1   # pin a tag, never a branch
```

`build/` is committed, so a git install needs no build step.

### Load order decides which values survive

```css
@import "tailwindcss";                      /* 1. framework */
@import "./ui-kit.css";                     /* 2. anything else declaring theme values */
@import "@archetype/design-system/css";     /* 3. the system, so brand values win */
@import "./site.css";                       /* 4. your own overrides, which do win */
```

Last wins. The system goes **after** any dependency that declares the same names
and **before** your own overrides. `@archetype/design-system/css` does not
import the framework; use `/css/bundled` for a single entry that does — not
both.

### Load the fonts

Not optional. The package declares the production faces and cannot serve them:

```html
<link rel="stylesheet" href="https://use.typekit.net/npe3lvr.css">
```

Take the URL from `font.kit.url` rather than typing it. Skip this and every
stack falls through to its fallback — the whole system renders in Helvetica and
Georgia. See §2.

### The short path is the role classes

```html
<p class="type-body">Reading copy.</p>
<h2 class="type-heading-lg">A heading.</h2>
<span class="type-eyebrow">Approach</span>
```

Each `.type-*` class sets size, leading, tracking, weight, family and the
default color pairing in one place. This is the whole contract for text — reach
for utilities only when a specific surface needs a different color.

The Tailwind equivalents exist too: `text-body` sets size, leading, tracking and
weight from the paired theme properties, but **not family** — pair it with
`font-serif`, `font-display` or `font-text`. Forgetting the family is the most
common way to get body copy set in the wrong typeface.

### JavaScript

```js
import { color, semantic, role, space, pxToHalfPt } from "@archetype/design-system";

const ground = semantic["background-primary"];   // "#FAF8F5"
const body   = role.body;                         // { fontSize: 17, lineHeight: 1.65, … }
const halfPt = pxToHalfPt(17);                    // docx
```

### Assets

Import what components render. Copy only what needs a fixed URL — favicons,
social cards — and generate those at build time rather than committing a second
copy that drifts.

### Other surfaces

- **Claude Design** — sync from this repo with `/design-sync` in Claude Code, or
  upload `tokens.json` and this file during setup.
- **Figma** — import `tokens.json` as variables.
- **Agents** — `skill/SKILL.md` is a portable skill file.

---

## 10. What is not in this repo

The boundary, written down rather than assumed. Scope test: **would a marketing
site and a client-facing tool both need it?** If not, it belongs to the
consumer.

| Not here | Where it lives |
|---|---|
| Page layouts and routing | Each consumer |
| React/Astro component implementations | Each consumer, built against these tokens |
| Container widths beyond `--container-site` | Each consumer |
| SEO and analytics | Each consumer |
| Case-study photography | A DAM or object storage |
| Product and marketing copy | Written against §7, not stored here |
| The Adobe Fonts web project | The consuming build — see §2 |

Voice, terminology and naming **are** here, because every consumer needs the
same answer and would otherwise invent its own.

---

## 11. Changing this system

**Adding a token** is a design decision. Add it to `tokens.json`, give it a real
`use` string, and add a contrast rule if it carries text.

**Changing a ramp value** is not a small edit. Run `npm run build` and read what
the validator says: it will tell you which piece of the interface just stopped
being legible, with the ratio.

**Retiring a token** means moving it to the `retired` array with a replacement
and a reason. Deleting it outright loses the record of why it went, which is
how values creep back in. The list only ever grows.

**Never edit `build/`.** It is regenerated and your change will vanish. CI fails
if it is stale, so run `npm run build` and commit the result whenever
`tokens.json` changes.

### What the build checks

Each rule encodes a failure this system can actually have:

- A semantic entry typing its own hex instead of naming a token
- A dark override with no light-mode counterpart
- Two color tokens sharing one value
- A stone step that is no longer warm-cast
- Any declared contrast minimum no longer holding
- A decorative-only color used as text on a light ground
- Bronze used as a fill
- A sans role landing in the 20–27 optical gap, or using the wrong cut
- A third reading size appearing
- A role naming a weight, size, leading, tracking or color that does not exist
- A retired name coming back as a live token
- Pure white or pure black reaching a generated declaration
- The Adobe kit not shipping a weight the type roles use
- The two live-text SVGs naming a family the system is no longer set to
- `font.use` naming a stack that does not exist
- `tokens.json` describing geometry the mark is not actually drawn at
- A derived logo file no longer matching the mark
- The circle stroke ceasing to be exactly half the triangle and crossbar weight
