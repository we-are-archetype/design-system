<p align="left">
  <img src="assets/logo/archetype-mark.svg" alt="Archetype" height="96">
</p>

# Archetype Design System

Brand tokens, the written spec, and generated outputs for every surface: the
marketing site, product interfaces, Claude Design, and Figma.

**Start with [Where this comes from](DESIGN-SYSTEM.md#where-this-comes-from).**
It is the preface to the spec and it explains what the brand is doing. Applying
the rules without it produces pastiche — the one outcome the rules name and
cannot prevent on their own.

**`tokens.json` is the only place a value is typed.** Everything in `build/` is
generated. `DESIGN-SYSTEM.md` carries prose rules and references tokens by name,
never by value. If a hex appears in two places, one of them is wrong.

---

## Starting a new consumer

```bash
npm i github:we-are-archetype/design-system#v1.1.0   # pin a tag, never a branch
```

```css
@import "tailwindcss";                      /* 1. framework */
@import "./ui-kit.css";                     /* 2. anything else declaring theme values */
@import "@archetype/design-system/css";     /* 3. the system, so brand values win */
@import "./site.css";                       /* 4. your own overrides, which do win */
```

**Load order decides which values survive** — last wins, so the system goes after
any dependency that declares the same names and before your own overrides.

Then set text with the role classes:

```html
<span class="type-eyebrow">Approach</span>
<h1 class="type-display-lg">Find the pattern. Build with conviction.</h1>
<p class="type-body">Most companies scale their problems.</p>
```

Worked setup: **[docs/consumers/astro.md](docs/consumers/astro.md)**. Full
contract: **[§9 of DESIGN-SYSTEM.md](DESIGN-SYSTEM.md#9-consuming-this-system)**.

## Use

**Tailwind v4.** `@archetype/design-system/css` does not import the framework.
Use `/css/bundled` for a single entry that does — not both.

**JavaScript**, for anything that cannot read CSS — document pipelines, canvas,
email, PDF:

```js
import { color, semantic, role, pxToHalfPt } from "@archetype/design-system";

const ground = semantic["background-primary"];  // "#FAF8F5"
const body   = role.body;                        // { fontSize: 17, lineHeight: 1.65, … }
```

**Claude Design.** Sync from this repo with `/design-sync` in Claude Code, or
upload `tokens.json` and `DESIGN-SYSTEM.md` during setup.

**Figma.** Import `tokens.json` as variables.

**Agents.** `skill/SKILL.md` is a portable skill file for Claude Code and
similar contexts.

## The short version of the rules

Enough to not get it wrong on the first day. Everything here is expanded in the
spec, and most of it is enforced by the build.

- **90% stone, 8% verdigris, 2% bronze.** A hard discipline, not an aspiration.
- **Never pure white.** `stone-50` is the ground. The neutral ramp is warm-cast
  at every step and the build fails if a step stops being.
- **Bronze is a hairline**, never a button or a fill.
- **Two typefaces with a hard division of labour.** Neue Haas for everything
  structural, Freight Text Pro for reading only — never a label, button, nav
  item or form field.
- **Display at 27px and above, Text at 20px and below, nothing sans between.**
- **Two reading sizes: 17 and 15.** There is no 19px step.
- **Sharp corners.** Pills are reserved for status badges and radio controls.
- **Cards rest on a border, never a shadow.**
- **Fades only.** No bounce, no spring, no parallax.
- **No emoji, anywhere, on any surface.**

## Fonts — every consumer must load the kit

The system ships the production faces: **Neue Haas Grotesk** in two optical cuts
and **Freight Text Pro**. They come from an Adobe Fonts web project, which is
bound to a domain — so this package declares them and cannot serve them.

**Link the kit stylesheet, or the whole system renders in Helvetica and
Georgia.**

```html
<link rel="stylesheet" href="https://use.typekit.net/npe3lvr.css">
```

Read the URL from the package rather than typing it:

```js
import { font } from "@archetype/design-system";
font.kit.url;   // "https://use.typekit.net/npe3lvr.css"
```

The build checks the kit ships every weight the roles use. A missing weight does
not error in a browser — it synthesises one, which is how a system quietly
starts rendering faux-bold.

**One setting still to change:** the kit serves `font-display: auto`, which
blocks text while the faces load. It is a per-project setting in the Adobe Fonts
UI and cannot be overridden from the URL. Set it to `swap` there.

`font.use` can go back to `"proxy"` — **Archivo** and **Source Serif 4**,
self-hosted — to render the system anywhere the kit is not authorised. The swap
is three declarations under `font` in `tokens.json`; no role, token or component
names a family. The one exception is the two SVGs that carry live text, and the
build fails if they drift. See [§2](DESIGN-SYSTEM.md#2-typography).

## Build

```bash
npm run build     # regenerate build/ from tokens.json
npm run check     # validate only, no writes
```

`build/` is committed so a git install needs no build step. CI fails if it is
stale, so run `npm run build` and commit the result whenever `tokens.json`
changes.

## What the build checks

The validator encodes the failure modes a system like this actually has:

- A semantic entry typing its own hex instead of naming a token
- A dark override with no light-mode counterpart
- Two color tokens sharing one value
- A stone step that is no longer warm-cast
- Any declared contrast minimum no longer holding
- A decorative-only color used as text on a light ground
- Bronze used as a fill
- A sans role landing in the 20–27 optical gap, or using the wrong optical cut
- A third reading size appearing
- A retired name coming back as a live token
- Pure white or pure black reaching a generated declaration
- The Adobe kit not shipping a weight the type roles use
- The two live-text SVGs naming a family the system is no longer set to
- `font.use` naming a stack that does not exist
- `tokens.json` describing geometry the mark is not actually drawn at
- A derived logo file no longer matching the mark
- The circle stroke ceasing to be exactly half the triangle and crossbar weight

Change a value and the build tells you which piece of the interface just stopped
being legible, with the ratio.

## Rules for changing things

**Adding a token** is a design decision. Add it to `tokens.json`, give it a real
`use` string, and add a contrast rule if it carries text.

**Retiring a token** means moving it to the `retired` array with a replacement
and a reason. Deleting it outright loses the record of why it went, which is how
values creep back in.

**Never edit `build/`.** It is regenerated and your change will vanish.

## Layout

```
tokens.json            the only place a value is typed
DESIGN-SYSTEM.md       the written spec; §9 is the consumer contract
DECISIONS.md           why the rules have the shape they do
scripts/build.mjs      generator and validator, no dependencies
scripts/logo.mjs       derives the logo family from archetype-mark.svg
lib/contrast.mjs       WCAG maths, shared so one ratio has one answer
build/tokens.css       generated: Tailwind v4 @theme, dark block, role classes
build/tokens.js        generated: resolved values for non-CSS pipelines
build/tokens.d.ts      generated: declarations, with literal key unions
assets/logo/           archetype-mark.svg is drawn; the other three are generated
docs/consumers/        worked setups for consuming projects
skill/SKILL.md         portable agent skill
```

## License

MIT for the code — the token pipeline, build scripts, and generated output.

**The Archetype name and the files in `assets/logo/` are not covered by it.**
Fork this to build your own system and you are welcome to, but replace the brand
assets and the name when you do. See [LICENSE](LICENSE).
