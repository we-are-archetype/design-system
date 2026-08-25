# Changelog

All notable changes to this system. Versions are tagged; consumers pin a tag,
never a branch. A tag and `meta.version` in `tokens.json` must agree — CI
enforces it, because a tag that publishes a different version means anyone
pinned to it quietly installed something else.

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
