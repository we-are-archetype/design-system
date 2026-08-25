# Changelog

All notable changes to this system. Versions are tagged; consumers pin a tag,
never a branch. A tag and `meta.version` in `tokens.json` must agree — CI
enforces it, because a tag that publishes a different version means anyone
pinned to it quietly installed something else.

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

## 1.1.2 — 2026-08-25

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
