# Changelog

All notable changes to this system. Versions are tagged; consumers pin a tag,
never a branch. A tag and `meta.version` in `tokens.json` must agree — CI
enforces it, because a tag that publishes a different version means anyone
pinned to it quietly installed something else.

## 1.4.0 — 2026-08-25

A named hover for the outline action, and the fill check corrected to test
fills.

### Added
- `action-secondary-bg-hover` and `action-secondary-fg-hover`. An outline action
  fills with verdigris on hover and sets its label warm. Light:
  `verdigris-700` under `bronze-100`. Dark: `verdigris-300` under `bronze-900`,
  the accent shifting to its lighter step and the label to its darker one, per
  §1's dark rule.
- Two declared contrast minimums covering that pair, so the combination cannot
  drift out of legibility unnoticed: 6.59:1 light, 4.81:1 dark.

### Changed
- **§1 now permits one warm foreground.** Bronze as a *label on an accent fill*
  is a foreground, not a fill, which is the distinction §1 always drew but could
  not express. It remains barred from every surface.
- **`rules.neverFill` was over-matching.** The check treated the entire
  `action-*` namespace as fills, so it also caught `-fg` and `-border` — a
  foreground and a hairline, both of which §1 allows bronze to be. It now tests
  `background-*` and anything carrying a `bg` segment. No existing token changes
  behaviour: every `action-*-fg` in the system was already stone, which is why
  this never fired.

### Why bronze-100 and not the brand's gold
Forced by measurement, not preference. On `verdigris-700` the actual gold
accent `bronze-700` measures **1.41:1** and `bronze-500` **2.47:1** — both
effectively invisible. `bronze-300`, the warm-on-dark token, reaches 4.10:1,
under the 4.5 floor every role here holds to with no large-text caveat. Only
`bronze-100` clears it. A consumer wanting a richer gold has to raise the label
past the large-text threshold first; at 12px there is no other option.

## 1.3.0 — 2026-08-25

**A new mark.** The first revision of the artwork itself since the system was
created.

### Changed
- `assets/logo/archetype-mark.svg` replaced with the new drawing. Heavier
  strokes (15 and 30, against 10 and 20), a taller canvas, and a wider triangle.
- **The aspect is now 1.19:1, not 1.24:1.** Anything sizing the mark by width
  gets a different result. Consumers following the documented rule — set height,
  let width follow — are unaffected. `logo.aspect` and
  `assets.logo.mark.aspect` both move, and 1.24:1 joins 1.17:1 and 1.28:1 on the
  list of stale figures to grep for.
- The square mark, wordmark and lockup regenerated from it. The lockup canvas
  moves 667×630 → 667×652, so its aspect goes 1.06:1 → 1.02:1.
- §6 of the spec rewritten against the new geometry.

### New in the drawing
- **The triangle's base is now exactly the circle diameter** — 485 — with its
  corners landing on the circle's left and right extremes. The previous revision
  had no such relationship. It is the clearest single thing to check a future
  redraw against.
- The apex clears the arc by 37.5 and each base corner breaks through by 44.5.
  The crossbar still runs the full width, now overhanging by 0.38r, and still
  begins exactly at the circle's left extreme.
- §6's rule that the circle stroke is exactly half the heaviest stroke still
  holds at 15 against 30 — the build confirmed it rather than anyone checking.

### Fixed
- **The lockup never hit its declared proportions.** `logo.lockup.widthOfDiameter`
  claimed 0.76 and nothing enforced it; the hand-set `fontSize: 58` rendered
  0.728. The font size is now solved for from the diameter, so the lockup holds
  its proportion whenever the mark is redrawn.
- The metrics behind that were also wrong. `capHeightRatio` was declared 0.72
  against a real 0.6758, and it was the wrong measurement to be using — the
  visual gap is to the ink, not the cap line. Both ink metrics are now measured
  from a real render.

### Verified
Rasterised at 3x with the Typekit faces loaded, ink read out of the pixels:
wordmark width 0.756 of the diameter against a 0.760 target — the gap is
sidebearings — and the mark-to-wordmark gap exactly 0.080. Nothing clipped.

## 1.2.1 — 2026-08-25

Preconnect hints as a single-source value, and `font-display` recorded per
family — because Adobe sets it per family, which is easy to get half-done.

### Added
- `font.kit.preconnect` — the origins a consumer should warm, in document
  order, exported through `font` and typed in `tokens.d.ts`. **Two, not one.**
  `use.typekit.net` serves the kit stylesheet and every font binary; the kit CSS
  then `@import`s `p.typekit.net/p.css`, a second origin the browser cannot
  discover until the first sheet has arrived, and render-blocking because an
  `@import` blocks the sheet containing it. Consumers map the array rather than
  typing hosts.
- The consumer comment in `build/tokens.css` now shows the preconnects
  alongside the stylesheet link, generated from that same array.

### Changed
- `font.kit.fontDisplay` is now a map of family → value, replacing the single
  `fontDisplayNote` string. Adobe sets `font-display` **per family**, not once
  per project, so changing it on one family silently leaves the others on
  `auto`. The flat field could not express the state and quietly implied the
  setting was global.
- `npm run build` prints each family's recorded `font-display` next to its
  weight check, and marks the ones that block. Not a build failure: the fix is
  a click in a third-party UI, and a build that cannot pass until someone else
  clicks a button is a bad build.
- The pinned install version in `README.md`, `DESIGN-SYSTEM.md` and
  `docs/consumers/astro.md` was still `v1.1.0`.

### Still outstanding
- **Both Neue Haas cuts are on `font-display: auto`**; only `freight-text-pro`
  is on `fallback`. Every heading, label, button, nav item and the wordmark is
  therefore invisible until its face loads, while body copy is not. Fix it per
  family in the Adobe Fonts web project, then update `font.kit.fontDisplay`.
- Outlining the two live-text SVGs would remove their webfont dependency, and
  with it the wordmark's share of this problem.

## 1.2.0 — 2026-08-25

The logo family gets a single source, the way the tokens already had one.

### Added
- `scripts/logo.mjs` — derives `archetype-mark-square.svg`,
  `archetype-wordmark.svg` and `archetype-lockup.svg` from
  `archetype-mark.svg`. `npm run logo` regenerates, `npm run check:logo` reports
  staleness.
- `logo.wordmark` and `logo.lockup` in `tokens.json` — the typesetting the two
  live-text files need. `letterSpacing` is not among them: it is derived from
  `scale.tracking.wordmark`, so the wordmark's tracking now has one source.
- Build checks: `tokens.json` → `logo` must match the geometry actually drawn in
  the mark; the circle stroke must be exactly half the heaviest stroke, which §6
  states as a rule and nothing previously enforced; no derived logo file may be
  stale. CI regenerates `assets/logo/` and fails on a diff, same contract as
  `build/`.

### Fixed
- **`archetype-wordmark.svg` shipped `letter-spacing="1"` — 0.017em — against
  the lockup's `1.16` and a spec that asks for 0.02em.** The two files were
  hand-copies of each other and had drifted. Both now derive it.

### Changed
- `archetype-lockup.svg`'s baseline moves 620 → 621, because it is now computed
  from the gap and cap height rather than typed. 0.15% of the coordinate space;
  the canvas is unchanged at 667×630.
- `archetype-mark-square.svg` regenerated **byte-identical** to the hand-authored
  file, which is the evidence that the derivation matches the original intent.

### Note
`archetype-mark.svg` is untouched. This release changes how the other three are
produced, not what the mark is.

## 1.1.1 — 2026-08-25

### Added
- `build/tokens.d.ts`, generated alongside `tokens.js`, and a `types` entry in
  the package exports. Without declarations, importing this package under a
  strict tsconfig is an implicit `any` — an error, not a warning — which the
  website hit the moment it read `font.kit.url`.
- `ColorName`, `SemanticName`, `RoleName` and `SpaceStep` are literal unions
  generated from the same source as the values, so `semantic["backgruond-primary"]`
  fails at the keystroke rather than resolving to `undefined` at runtime.

## 1.1.0 — 2026-08-25

The production typefaces. `font.use` is now `"production"`, so the system
declares Neue Haas Grotesk (both optical cuts) and Freight Text Pro rather than
their proxies.

### Added
- `font.kit` in `tokens.json` — the Adobe Fonts web project id, URL, host, and
  the weights each family ships.
- `font` export in `build/tokens.js`, carrying the stacks in force plus
  `kit.url` and `kit.host`, so consumers link the kit from a single-source value
  instead of typing it.
- Three checks: the kit must ship every weight the roles use; the two live-text
  SVGs must name the family the system is set to; `font.use` must name a stack
  that exists.
- `assets.liveText` in `tokens.json`, naming the two files that hard-code a
  family so the check has something to read.

### Changed
- **Consumers must now link the kit stylesheet.** The web project is bound to a
  domain, so the package cannot serve the faces. A consumer that forgets renders
  the entire system in Helvetica and Georgia — `build/tokens.css` says so at the
  top, where the `@font-face` block used to be.
- `assets/logo/archetype-wordmark.svg` and `archetype-lockup.svg` now name
  `neue-haas-grotesk-display`. They are the one irreducible exception to the
  single-point family swap, and the new check keeps them in step.
- Errors that make generation impossible are reported before it runs. A typo in
  `font.use` used to crash the generator with a `TypeError` instead of naming
  the bad key.
- `tokens.json` is now formatted by `JSON.stringify`, not by hand. The diff is
  large and the content is unchanged; hand alignment does not survive
  programmatic edits.

### Not changed
- Every colour value, contrast minimum, spacing step, radius and shadow.
- The 13 roles: sizes, leading, tracking, weights, cuts and colour pairings are
  identical. Only the families underneath them moved.

### Still outstanding
- **The kit serves `font-display: auto`**, which blocks text while the faces
  load. It is a per-project setting in the Adobe Fonts UI and cannot be
  overridden from the URL. Set it to `swap` and update `font.kit.fontDisplay`.
- Headline line breaks set against Archivo will re-break — Neue Haas is
  narrower. Anything with a hand-placed `<br>` needs re-judging.
- Outlining the two live-text SVGs would remove the exception permanently.

## 1.0.0 — 2026-08-25

First release. Ported from the Archetype design system authored in Claude
Design, and restructured onto a single-source token pipeline.

### Added
- `tokens.json` as the only place a value is typed: 20 colors, 43 semantic
  entries, a dark override layer, 13 type roles, spacing, radii, shadows,
  motion, logo geometry, and the machine-checkable rules.
- `scripts/build.mjs` — dependency-free generator and validator. Twelve classes
  of check; see README.
- `build/tokens.css` — Tailwind v4 `@theme static`, the `[data-theme="dark"]`
  block, `--space-*` and `--type-*` custom properties, and the 13 `.type-*`
  role classes.
- `build/tokens.bundled.css` — single entry that imports the framework too.
- `build/tokens.js` — resolved values for pipelines that cannot read CSS.
- `DESIGN-SYSTEM.md` — the written spec, including the "Where this comes from"
  preface and the §7 voice rules.
- `DECISIONS.md` — the reasoning behind the rules.
- `assets/logo/` — mark, square mark, wordmark, lockup. All on `currentColor`.
- `skill/SKILL.md` — portable agent skill.
- CI: token validation, a stale-`build/` check, and tag/version agreement.

### Changed from the Claude Design source
- The type role shorthand is `--type-body`, not `--text-body`. Tailwind v4 owns
  the `--text-*` namespace for font sizes. Mechanical rename across 13 names —
  the only breaking change in the port.
- Semantic colors are exposed as `--color-<semantic>` so Tailwind generates
  utilities for them. Raw CSS uses `var(--color-text-secondary)`.
- Spacing steps are not emitted into `@theme`; Tailwind's numeric scale already
  expresses every one of them. See DECISIONS.

### Known limits, flagged rather than hidden
- Fonts are proxies (Archivo, Source Serif 4). Display line breaks and the
  Display/Text optical distinction cannot be judged until the real faces land.
- `archetype-wordmark.svg` and `archetype-lockup.svg` carry live text and are
  the one exception to the single-point family swap. Outlining them fixes it
  permanently.
- Lucide is a flagged substitution for a commissioned icon set.
