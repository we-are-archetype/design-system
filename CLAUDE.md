# design-system

Brand tokens, the type system, the voice rules, and the logo spec. Every value
Archetype uses on any surface originates here.

## Archetype

A boutique strategy and product development agency. The premise is in the name:
enduring organizations rest on a pattern you **discover**, not one you invent.

The aesthetic follows from that. Swiss editorial — intelligent, precise, calm,
minimal, timeless. A brand about finding underlying structure cannot be
decorated. Never loud, flashy, corporate, or trendy.

Applying the rules without the premise produces pastiche. If a decision isn't
covered here, decide it from the premise. Full preface: `DESIGN-SYSTEM.md` →
"Where this comes from".

## The three repos

| Repo | Holds | Access |
|---|---|---|
| **design-system** (this) | Tokens, type, voice, mark spec | Public. MIT code; the name and `assets/logo/` are not licensed |
| **foundation** | Method, archetype catalogue, reading library | **Private.** Proprietary method and client-confidential material |
| **website** | The Astro site | Consumes this repo at a pinned tag |

Values flow **outward from here** and never back. A consumer that needs a value
this system doesn't have has found a design-system change, not a local one —
never hardcode around it. Nothing from `foundation` belongs here: method and
client material are that repo's, and this one is public.

## Rules

**`tokens.json` is the only place a value is typed.** Everything in `build/` is
generated. Never edit it — CI fails on a stale diff. Prose rules live in
`DESIGN-SYSTEM.md` and reference tokens by name, never by value. If a value
appears in two places, one of them is wrong.

**Color.** Stone (warm neutral ramp, R > G > B at every step), Verdigris (cool
accent), Bronze (warm accent, **2% maximum** — a hairline, a small mark, one
emphasized word, never a fill). Components use the semantic aliases —
`--color-text-secondary`, not `--color-stone-600`. Never pure white.

**Type.** Thirteen roles. Neue Haas Grotesk **Display at 27px and above**,
**Text at 20px and below**, nothing sans between. Freight Text Pro for reading
passages only — never a label, button, nav item, or piece of metadata.

**The family swap is a single point** — three declarations under `font` in
`tokens.json`. Never name a family in a component. The two live-text SVGs are
the one exception, and the build fails if they drift.

The production faces are wired: a domain-bound Adobe Fonts kit. **Every consumer
must link `font.kit.url`** or the whole system renders in Helvetica and Georgia,
silently. Read the URL from the package; never type it.

**Never apply `-webkit-font-smoothing: antialiased` to serif body copy.** It is
a common reset default and it thins strokes on macOS — the wrong direction on a
warm off-white ground.

**Voice lives here** because it governs microcopy, and microcopy is where a calm
brand usually breaks. `DESIGN-SYSTEM.md` §7.

**The mark.** `assets/logo/archetype-mark.svg` is the only drawn logo file. The
square, wordmark and lockup are generated from it.

## Commands

```
npm run build      regenerate build/ from tokens.json, and validate
npm run check      validate only
npm run logo       regenerate the derived logo files from the mark
npm run specimen   regenerate examples/specimen.html
```

The build refuses to run when a declared rule stops holding. Read what it says —
it names the failure, not just the line.

## What else is here

- `DESIGN-SYSTEM.md` — the spec. §9 is the consumer contract.
- `DECISIONS.md` — why a rule has the shape it does. Newest first.
- `AGENTS.md` — working procedures: updating the mark, releasing, house style.
- `CHANGELOG.md` — pinned tags must match `meta.version`; CI enforces it.
- `examples/specimen.html` — every token at actual size, contrast measured.
- `skill/SKILL.md` — portable skill for agent contexts.
