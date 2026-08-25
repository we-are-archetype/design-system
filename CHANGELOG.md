# Changelog

All notable changes to this system. Versions are tagged; consumers pin a tag,
never a branch. A tag and `meta.version` in `tokens.json` must agree — CI
enforces it, because a tag that publishes a different version means anyone
pinned to it quietly installed something else.

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

## 1.1.0 — 2026-08-25

The production faces. `font.use` moves from `"proxy"` to `"production"`, so the
stacks name `neue-haas-grotesk-display`, `neue-haas-grotesk-text` and
`freight-text-pro`.

**Consumers must link the Adobe Fonts kit.** The web project is bound to a
domain, so the package declares the faces and cannot serve them. A consumer that
forgets the stylesheet renders the whole system in Helvetica and Georgia — the
fastest way to notice is that body copy stops being serif.

### Added
- `font.kit` in `tokens.json` — the web project's id, url, host, and the weights
  it ships per family. Consumers read `font.kit.url` rather than typing it.
- `font` export in `build/tokens.js`, carrying the stacks in force and the kit.
- A thirteenth build check: every weight a type role uses must be present in the
  kit. A missing weight does not error in a browser, it synthesises one — which
  is how a system quietly starts rendering faux-bold.
- `build/tokens.css` emits the required `<link>` as a comment in production mode,
  in place of the proxy `@font-face` block.

### Changed
- `archetype-wordmark.svg` and `archetype-lockup.svg` now name
  `neue-haas-grotesk-display` in their live text. These two files are §2's
  irreducible exception and have to move with the swap; outlining them removes
  the exception permanently.
- `DESIGN-SYSTEM.md` §2, `README.md`, `docs/consumers/astro.md` and
  `examples/specimen.html` rewritten around the kit being a consumer
  requirement rather than a future step.

### Known limits, flagged rather than hidden
- The kit serves `font-display: auto`, which blocks text while the faces load.
  It is a per-project setting in the Adobe Fonts UI and cannot be overridden
  from the URL — a `?display=` parameter is ignored. Set it to `swap` there and
  update `font.kit.fontDisplay`.
- `font.use` can return to `"proxy"` for a fork, a sandbox, or any domain the
  web project does not cover. Archivo and Source Serif 4 remain as that path.

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
