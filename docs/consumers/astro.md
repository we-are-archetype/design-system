# Astro + Tailwind v4

The setup [we-are-archetype/website](https://github.com/we-are-archetype/website)
runs. Astro 7, Tailwind v4 through the Vite plugin, this system pinned to a tag.

## Install

```bash
npm i github:we-are-archetype/design-system#v1.0.0
npm i -D tailwindcss @tailwindcss/vite
```

Pin a tag, never a branch. `build/` is committed in this repo, so the install
needs no build step on your side.

## Wire Tailwind into Astro

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

## The stylesheet

```css
/* src/styles/site.css */
@import "tailwindcss";
@import "@archetype/design-system/css";

/* Your overrides go below the import, never above it. */
```

**Load order decides which values survive.** Last wins. If you add a UI kit or
any other dependency that declares theme values, it goes *between* the framework
and this system — the system after it, so brand values win, and your own
overrides after that.

Keep both `@import` lines above any `@source` or `@plugin` directive. CSS
requires `@import` to precede other rules, and putting a directive between them
is a silent failure rather than a loud one.

Nothing here needs a `@source` entry pointing at the package. The 13 `.type-*`
role classes ship in a `@layer components` block inside `build/tokens.css`,
which Tailwind emits verbatim — they are not subject to content scanning and
will not be purged when unused. The theme block is `@theme static`, so every
`--color-*` and `--text-*` variable is emitted whether or not a utility
references it, which is what makes `var(--color-text-secondary)` safe to use in
hand-written CSS.

## Layout

```astro
---
// src/layouts/Base.astro
import "../styles/site.css";
const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>{title}</title>
  </head>
  <body class="bg-background-primary text-text-secondary">
    <slot />
  </body>
</html>
```

## Setting text

Reach for the role classes. Each sets size, leading, tracking, weight, family
and the default color pairing in one place:

```astro
<section class="mx-auto max-w-site px-6 py-24">
  <span class="type-eyebrow">Approach</span>
  <h1 class="type-display-lg mt-4 max-w-narrow">
    Find the pattern. Build with conviction.
  </h1>
  <p class="type-body mt-6 max-w-measure">
    Most companies scale their problems. We help founders find the logic
    underneath the business, then build brand, product and systems from it.
  </p>
</section>
```

`max-w-measure` is the 62–70 character cap. `max-w-site` is the 1200px
container. `py-24` is `space-9`, the section rhythm — see the mapping table in
[§3](../../DESIGN-SYSTEM.md#3-spacing-and-layout).

The Tailwind text utilities work too, but **`text-body` does not set the
family** — pair it with `font-serif`, `font-display` or `font-text`. Forgetting
the family is the most common way to end up with body copy in the wrong
typeface, which is why the role classes exist.

## Dark mode

`data-theme="dark"` on any element, not necessarily the root:

```astro
<footer data-theme="dark" class="bg-background-primary text-text-secondary">
  <!-- every semantic token inside this element resolves to its dark value -->
</footer>
```

That is the useful property: a dark footer or a dark callout on an otherwise
light page needs no separate token set and no `dark:` variants.

For a whole-site toggle, set it on `<html>` and persist the choice:

```html
<script is:inline>
  const t = localStorage.getItem("theme");
  if (t) document.documentElement.dataset.theme = t;
  else if (matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.dataset.theme = "dark";
</script>
```

Put it in `<head>` as `is:inline` so it runs before first paint. Anything later
flashes the light theme.

## Assets

Import what components render, so the bundler fingerprints and inlines it:

```astro
---
import mark from "@archetype/design-system/assets/logo/archetype-mark.svg?raw";
---
<span class="text-text-primary" set:html={mark} />
```

Inlining is what makes `currentColor` work — the mark takes the `color` of its
parent, so it inverts on a dark surface with no second file. An SVG loaded
through `<img>` cannot do that.

Copy only what needs a fixed URL — favicons, social cards — and generate those
at build time rather than committing a second copy that drifts:

```json
{ "scripts": { "prebuild": "node scripts/favicons.mjs" } }
```

Use `archetype-mark-square.svg` for favicons. The primary mark is **1.24:1, not
square**, and squashing it into a square viewport is the most common way this
brand gets broken.

## The real typefaces

The system ships proxies. When the Adobe Fonts web project exists, add its link
to the layout `<head>`:

```html
<link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
```

Then set `font.use` to `"production"` in `tokens.json`, rebuild, and cut a new
tag. The consumer changes nothing except that `<link>`.

## Fonts and the CDN

The proxy faces load from the Fontsource CDN, which means a third-party request
on first paint. If that is not acceptable — a strict CSP, an offline build, or
a measurable LCP cost — self-host instead:

```bash
npm i @fontsource/archivo @fontsource-variable/source-serif-4
```

```css
@import "@fontsource/archivo/latin-400.css";
@import "@fontsource/archivo/latin-500.css";
@import "@fontsource/archivo/latin-700.css";
@import "@fontsource-variable/source-serif-4";
@import "tailwindcss";
@import "@archetype/design-system/css";
```

The `@font-face` rules in the system are additive, so the local files win on
being already present. This becomes moot once the Adobe kit is wired in.

## Checking it worked

```bash
npm run dev
```

Three things to look at, in order:

1. **The page ground is `#FAF8F5`, not white.** If it is white, the stylesheet
   is not loading or something is overriding it below the import.
2. **Body copy is serif.** If it is sans, you used `text-body` without
   `font-serif`. The role class `.type-body` sets the family itself and cannot
   have this problem, which is the reason to prefer it.
3. **A `data-theme="dark"` element inverts.** If it does not, the system CSS is
   loading after something that redeclares the same custom properties.
