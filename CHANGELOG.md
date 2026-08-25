# Changelog

All notable changes to this system. Versions are tagged; consumers pin a tag,
never a branch. A tag and `meta.version` in `tokens.json` must agree — CI
enforces it, because a tag that publishes a different version means anyone
pinned to it quietly installed something else.

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
