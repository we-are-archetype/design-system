# Decisions

Decisions that shaped the system, with the reasoning that produced them.

Rules live in `DESIGN-SYSTEM.md`. This file records **why** a rule has the shape
it does, so a future reader can tell a deliberate constraint from an accident,
and so a decision that gets revisited is revisited on its merits rather than
re-argued from scratch.

Newest first.

---

## 2026-08-25 — Measure the render, not the metrics API

**Decision:** the font metrics in `logo.wordmark.metrics` are measured by
rasterising the lockup at 3x with the real faces loaded and reading the ink out
of the pixels — not from `canvas.measureText()`.

**Why:** because the two disagreed, and the render was right. `measureText()`
reported an ink ascent of 0.6895 em for the wordmark string. The browser
actually drew 0.734. Placing the lockup baseline from the former put the
mark-to-wordmark gap at 0.073 of the diameter against a specified 0.080 —
visible as slightly too tight, and wrong for a reason nothing would have
surfaced.

**The trap that produced a second wrong answer first.** The obvious way to
rasterise an SVG is to load it into an `<img>` and draw it to a canvas. That
returns a measurement of **Helvetica**, because an SVG in an `<img>` is an
isolated document with no access to the page's fonts — the same rule this system
already documents for `currentColor`, applied to webfonts. The measurement has
to come from the SVG inlined in the DOM, screenshotted, and only then read back
as a raster.

**What this says about the lockup file itself:** `archetype-lockup.svg` and
`archetype-wordmark.svg` typeset correctly only when inlined. Delivered through
an `<img>`, both fall back to Helvetica. That is not new — it is the same
irreducible exception §2 already names — but it is now demonstrated rather than
inferred, and it is the strongest argument yet for outlining them.

**Files:** `tokens.json` `logo.wordmark.metrics`, `scripts/logo.mjs`

---

## 2026-08-25 — The lockup's font size is solved for, not chosen

**Decision:** `scripts/logo.mjs` computes the lockup's wordmark font size from
`lockup.widthOfDiameter` and the measured advance ratio, rather than reading a
declared `fontSize`.

**Why:** `widthOfDiameter: 0.76` had been sitting in `tokens.json` since the
generator was written, describing a relationship that nothing read and nothing
enforced. The lockup's actual size was a hand-set 58, which rendered 0.728 of
the diameter. The file and the description of the file disagreed by 4%, in the
direction nobody would notice by eye.

**What it buys:** the lockup now rescales correctly when the mark is redrawn —
which it was, in this same release, from a diameter of 490 to 485. Under the old
arrangement that would have silently drifted the proportion again.

**The limit:** `advanceRatio` is face-dependent and carries a note saying to
re-measure if the display family changes. Text advance genuinely cannot be
computed without rendering a font, so a measured constant with a warning on it
is the honest form. The standalone wordmark keeps a declared size, because it
stands alone and has no diameter to be proportional to.

**Files:** `scripts/logo.mjs`, `tokens.json` `logo.lockup`

---

## 2026-08-25 — One drawn file, three derived

**Decision:** `assets/logo/archetype-mark.svg` is the only hand-authored logo
file. The square mark, wordmark and lockup are generated from it by
`scripts/logo.mjs`, and the build fails if any of them is stale or if
`tokens.json` describes geometry the mark is not drawn at.

**Why:** the mark's path data was byte-identical in three files, and its
geometry was described a fourth time as data in `tokens.json`. That is the exact
condition this repo's central rule exists to prevent — "if a hex appears in two
places, one of them is wrong" — applied to coordinates instead of colour, with
nothing checking it.

**It had already gone wrong.** `archetype-wordmark.svg` shipped
`letter-spacing="1"` and `archetype-lockup.svg` shipped `1.16`. The spec asks
for 0.02em, which at 58px is 1.16 — so the standalone wordmark had been wrong
since the port, silently, in the file most likely to be handed to a printer.
Both now derive it from `scale.tracking.wordmark`.

**Verified, not asserted:** the generator reproduces
`archetype-mark-square.svg` byte-for-byte from the hand-authored version. The
derivation matches what a person did by hand, which is the only real evidence
that it is the same operation.

**What is derived and what is declared.** Geometry is derived: the square's
centring offset, the lockup's gap and baseline. Typesetting is declared: the
wordmark's canvas and font size. Text advance width depends on the face and
cannot be computed without rendering a font, so pretending to derive it would be
a lie with numbers in it. `capHeightRatio` is declared for the same reason and
carries a note saying to re-measure it if the display family changes.

**The limit, stated:** prose is unchecked. If a future mark changes the aspect,
the build names the new ratio but cannot fix §6, `skill/SKILL.md` or the astro
guide, all of which quote 1.24:1. The spec's own warning that "anything carrying
1.17:1 or 1.28:1 is stale" is the record of that having already happened once.

**Files:** `scripts/logo.mjs`, `scripts/build.mjs`, `tokens.json` `logo`,
`.github/workflows/check.yml`

---

## 2026-08-25 — The kit is the consumer's job, and the URL is not

**Decision:** `font.use` moves to `"production"`. The consumer links the Adobe
Fonts kit stylesheet; the package exports `font.kit.url` so nobody types it.

**Why the consumer links it:** an Adobe Fonts web project is authorised per
domain. A package cannot carry that — bundling the kit would make the design
system undeployable anywhere the project does not cover, including forks and
sandboxes. So the faces are declared here and served there.

**Why the URL still lives here:** "the consumer loads the fonts" is a
responsibility, not a value. The value — `https://use.typekit.net/npe3lvr.css` —
is exactly the kind of string that gets pasted into four layouts and then
changes. It is typed once, in `tokens.json`, and read from `font.kit.url`.

**The cost, stated plainly:** this is the one way to consume the system wrong
that produces no error. Miss the `<link>` and every stack falls through to its
fallback; the site renders in Helvetica and Georgia and nothing warns you. The
mitigations are a comment at the top of the generated CSS where the `@font-face`
block used to be, and making it the second item in the astro guide's "checking
it worked" list. Neither is enforcement. An `@import` inside the system's CSS
*would* be enforcement, and was rejected: it chains a stylesheet request behind
another stylesheet request, which is measurably worse on first paint than a
`<link>` in the head.

**Kept, not deleted:** the proxy stacks. `font.use` flips back to `"proxy"` and
the package serves Archivo and Source Serif 4 itself. A design system that only
renders on authorised domains is one nobody can fork or prototype against.

**Files:** `tokens.json` `font.kit`, `scripts/build.mjs`, `DESIGN-SYSTEM.md` §2 §9

---

## 2026-08-25 — The kit's weight coverage is checked

**Decision:** `font.kit.provides` records the weights each family actually
ships, and the build fails if a type role needs one that is missing.

**Why:** a missing weight does not error in a browser. It synthesises one —
faux-bold, algorithmically slanted — which looks approximately right at a glance
and is wrong everywhere. There is no runtime signal, so the check has to be at
build time or it does not exist.

**What it caught nothing of, yet:** the kit currently ships every weight the
system uses (400 and 500 for both sans cuts, 400 for the serif). The check earns
its place the day someone tidies unused weights out of the Adobe project, which
is a reasonable thing to do and a silent break.

**Files:** `tokens.json` `font.kit.provides`, `scripts/build.mjs`

---

## 2026-08-25 — The system moves to a tokens.json pipeline

**Decision:** `tokens.json` becomes the only place a value is typed. The seven
hand-maintained CSS files that carried the system in Claude Design
(`tokens/colors.css`, `typography.css`, and the rest) are replaced by a single
JSON source and a generator, `scripts/build.mjs`. `build/` is generated and
committed; CI fails if it is stale.

**Why:** the CSS files were the source and the output at the same time. Nothing
could check them. The relationships the system depends on — that `body-sm` sits
on stone-700 *because* 15px serif hairlines need 9.67:1, that eyebrow tracking
is 0.14em *because* it echoes the wordmark, that stone is warm-cast at every
step — lived only in prose next to values that could be edited independently of
it. A design system whose invariants are unenforceable drifts on a timescale of
months, and the drift is invisible until someone reads a contrast ratio.

**What this buys:** sixteen contrast minimums are now measured on every build
rather than asserted once. The optical boundary is checked rather than
remembered. A retired name cannot come back. Change a hex and the build names
the piece of interface that just stopped being legible.

**What it costs:** editing a token is now a two-step operation — edit JSON, run
build. That friction is the point at the boundary between "adjusting a value"
and "making a design decision."

**Files:** `tokens.json`, `scripts/build.mjs`, `lib/contrast.mjs`, `build/`

---

## 2026-08-25 — Tailwind's numeric spacing scale is left alone

**Decision:** the brand spacing steps are **not** emitted into `@theme` as
`--spacing-*`. `--space-1` … `--space-11` ship as plain custom properties for
raw CSS, and the spec carries a mapping table to the Tailwind utilities.

**Why:** every brand step is an exact multiple of Tailwind's 4px base, so the
default utility scale already expresses all eleven — `space-5` is 24px, which is
`p-6`. Emitting named spacing keys would redefine `p-5` to mean 24px instead of
20px, making every Tailwind habit subtly wrong in this codebase and only in this
codebase. A design system that silently changes what a framework's own utilities
mean costs more in confusion than it buys in enforcement.

**The trade-off, stated:** the scale is now a convention rather than a
constraint. Someone can write `p-7` (28px) and nothing stops them. That is a
lint concern, and the honest place to solve it is a lint rule, not a token
redefinition that misleads.

**Files:** `tokens.json` `space`, `scripts/build.mjs`, `DESIGN-SYSTEM.md` §3

---

## 2026-08-25 — The type role shorthand is renamed `--type-*`

**Decision:** the `font:` shorthand for each of the 13 roles is emitted as
`--type-body`, not `--text-body`. Tailwind's `--text-*` namespace carries the
font *size*, with `--text-body--line-height` and friends alongside it.

**Why:** the Claude Design draft used `--text-body` for the shorthand. Tailwind
v4 reads `--text-*` from `@theme` as a font-size namespace, so the two meanings
collide on the same name — and the framework's meaning has to win in a system
whose entire delivery target is Tailwind.

**Consequence:** components authored in Claude Design against `--text-body`,
`--text-heading-lg` and the rest need renaming to `--type-*` when they are
ported here. That is a mechanical find-and-replace across 13 names, and it is
the only breaking rename in the port.

**Better still:** use the generated `.type-body` class, which sets family and
default color too. The bare shorthand cannot carry either.

**Files:** `scripts/build.mjs`, `DESIGN-SYSTEM.md` §2 §9

---

## 2026-08-25 — Semantic colors keep their verbose names

**Decision:** the semantic layer keeps the names it was authored with —
`background-primary`, `text-secondary`, `border-subtle`, `accent-primary` — and
they land in Tailwind as `bg-background-primary` and `text-text-secondary`.

**Why:** the alternative was a second, shorter naming layer for the utility
surface (`--color-canvas`, `--color-ink`). That is two names for one concept,
which is precisely the failure this repo's central rule exists to prevent. The
verbosity is the cost of one name per thing, and it is the cheaper cost.

**Mitigated by:** the `.type-*` role classes already carry the default color
pairing, so the common path never names a color at all. Explicit color
utilities are the exception, and the exception is allowed to be wordy.

**Files:** `tokens.json` `semantic`, `DESIGN-SYSTEM.md` §1

---

## 2026-08-25 — `stone-400` is decorative on light grounds, and text in dark mode

**Decision:** `stone-400` is barred from every light-mode text role except the
disabled states, and permitted as `text-tertiary` in dark mode.

**Why:** the constraint is a ratio, not a color. On `stone-50` it measures
2.41:1 — it misses even the 3:1 large-text threshold, so it is not a
display-type color either, which is the mistake the rule is really preventing.
On `stone-900` the same hex measures 6.93:1 and is unremarkable body text.

**The exemption is named, not inferred.** `text-disabled` and
`action-disabled-fg` are exempt because disabled text is outside WCAG AA by
design, and that exemption is the entire reason a 2.41:1 token exists at all.
The first version of this check had no exemption list and failed the build on
its own disabled state.

**Files:** `tokens.json` `rules.decorativeOnly`, `scripts/build.mjs`

---

## 2026-08-25 — Fonts ship as proxies, and the swap point is three declarations

**Decision:** the package ships **Archivo** and **Source Serif 4**, not Neue
Haas Grotesk and Freight Text Pro. `font.use` toggles between `proxy` and
`production`; nothing else moves.

**Why:** Adobe Fonts requires a Creative Cloud web project ID tied to a domain.
That credential belongs to each consuming build, not to a distributable package
— a design system that cannot render on a clean checkout is a design system
nobody validates.

**Why three declarations and not two:** Neue Haas ships as two separately-named
optical cuts, and both must stay independently addressable. That separation is
exactly what makes the 27/20 boundary enforceable. Two typefaces, three family
strings; collapsing them gives up the optical distinction.

**Known limits, flagged rather than hidden:** Archivo runs wider than Neue Haas,
so every display line will re-break — current line endings are arbitrary.
Archivo is a single optical size, so the Display/Text distinction is declared
and structurally enforced but cannot be judged by eye yet. The 15px serif
hairline mitigation was validated against Source Serif 4, which has *lower*
stroke contrast than Freight; the real face will be more exposed, not less.

**The irreducible exception:** `archetype-wordmark.svg` and
`archetype-lockup.svg` carry live text with a `font-family` attribute, because
an SVG loaded through `<img>` cannot read custom properties. Supplying them as
outlined vector removes the exception permanently and is the better fix.

**Files:** `tokens.json` `font`, `DESIGN-SYSTEM.md` §2

---

## 2026-08-25 — Two accent colors, and bronze can never be a fill

**Decision:** verdigris and bronze, at a target ratio of 90% stone / 8%
verdigris / 2% bronze. Bronze is machine-barred from every `background-*`,
`action-*` and `*-bg` semantic.

**Why the ratio is encoded:** it is the single rule most likely to erode.
Every individual decision to add a little more accent is defensible; the sum of
them is a different brand. Writing it as a number makes the erosion visible.

**Why bronze is barred rather than discouraged:** bronze prominent turns the
brand corporate-luxury, which is the failure mode — and it is a failure that
arrives through a sequence of small, reasonable-looking changes, each one a
button here and a panel there. A rule the build enforces survives that sequence.
A guideline does not.

**Files:** `tokens.json` `palette.ratio` `rules.neverFill`, `DESIGN-SYSTEM.md` §1

---

## 2026-08-25 — Two reading sizes, and the 19px step stays gone

**Decision:** 17px and 15px. `body-lg` at 19px was removed rather than adjusting
the heading ramp to accommodate it, and the build enforces the allowed list.

**Why:** three reading sizes means every long-form layout carries a decision
that has no answer — the third size gets used when a paragraph "feels" like it
needs to be bigger, which is not a reason. Removing it also let the display
cluster stay an exact perfect fourth (27/36/48/64) instead of bending to make
room.

**Files:** `tokens.json` `rules.readingSizes`, `DESIGN-SYSTEM.md` §2

---

## 2026-08-25 — The eyebrow's tracking is a relationship, not a style

**Decision:** `--tracking-eyebrow` is 0.14em and is marked "do not change" in
the generated CSS.

**Why:** it is a deliberate systemic echo of the logo wordmark, which is caps in
Neue Haas Grotesk Display 75 Bold. The wordmark itself is set at **near-zero**
tracking (0.02em) — the wide tracking belongs to the eyebrow, which echoes the
wordmark's register rather than repeating its treatment. Anyone reading the two
values without this note would reasonably conclude one of them is a typo and
"fix" it.

**Files:** `tokens.json` `scale.tracking`, `logo.rules`, `DESIGN-SYSTEM.md` §2 §6

---

## 2026-08-25 — Contrast is measured, not asserted

**Decision:** sixteen `minContrast` rules ship in `tokens.json`, each with a
`why`, and the build prints every measured ratio on every run.

**Why:** the readme this system was ported from stated its ratios in prose —
6.21:1, 9.67:1, 4.38:1, 3.72:1. Every one of them proved correct when measured,
which is the good case. The bad case is a value edited six months later by
someone who never reads the prose, and a prose ratio has no way to notice.

**Design consequence, not a fix:** two pairings that look like defects are
deliberate and are recorded as such. `eyebrow` and `caption` sit on stone-600
rather than stone-500 — caps plus 0.14em tracking already carries the register
distinction, so the lighter tint was redundant, and at 12px stone-500 measures
3.72:1 and fails. `body-sm` sits on stone-700 rather than stone-600 because at
15px serif hairlines lose apparent weight against a warm off-white ground.

**Dark mode moved because of a measurement:** stone-500 on stone-900 is 4.49:1,
a rounding-margin miss. Dark secondary text maps to stone-300 and tertiary to
stone-400 instead. A rounding-margin miss is still a miss.

**Files:** `tokens.json` `rules.minContrast`, `lib/contrast.mjs`

---

## 2026-08-25 — The repository is public, the brand assets are not licensed

**Decision:** MIT for the pipeline and generated output. The Archetype name and
`assets/logo/` are carved out explicitly in `LICENSE`.

**Why:** the useful, reusable thing here is the method — a JSON source, a
validator that encodes real failure modes, a Tailwind v4 theme generated from
it. That is worth being public and worth being copyable. A logo is not, and an
MIT header over a repository containing a trademark reads as a grant of it.

**Files:** `LICENSE`, `README.md`
