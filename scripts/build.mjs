#!/usr/bin/env node
// Generator and validator for the Archetype design system.
//
// tokens.json is the only place a value is typed. This script turns it into
// build/, and refuses to do so when a rule in tokens.json no longer holds.
//
//   node scripts/build.mjs           regenerate build/
//   node scripts/build.mjs --check   validate only, no writes
//   node scripts/build.mjs --tag v1.0.0   assert the tag matches meta.version
//
// No dependencies, deliberately. A token pipeline that cannot run on a clean
// checkout with nothing installed is a pipeline that stops getting run.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ratio, lum } from "../lib/contrast.mjs";
import { readGeometry, staleFiles } from "./logo.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8"));

const args = process.argv.slice(2);
const CHECK_ONLY = args.includes("--check");
const TAG = args.includes("--tag") ? args[args.indexOf("--tag") + 1] : null;

const errors = [];
const notes = [];
const fail = (msg) => errors.push(msg);

// ── helpers ───────────────────────────────────────────────────────────────────

/** Color token names, minus the `_note` keys that document a group. */
const colorNames = Object.keys(T.color);
const hexOf = (name) => T.color[name]?.value;

/** Semantic entries, minus documentation keys. */
const realKeys = (obj) => Object.keys(obj).filter((k) => !k.startsWith("_"));

/** Resolve a semantic name to a hex, in light or dark mode. */
const resolve = (semantic, mode = "light") => {
  const map = mode === "dark" ? { ...T.semantic, ...T.semanticDark } : T.semantic;
  return hexOf(map[semantic]);
};

const fmt = (n) => n.toFixed(2);

// ── validate ──────────────────────────────────────────────────────────────────

// 1. Every semantic value names a color token that exists, and types no hex of
//    its own. A semantic entry carrying a literal is a second place a value is
//    typed, which is the one thing this file exists to prevent.
for (const [layer, obj] of [["semantic", T.semantic], ["semanticDark", T.semanticDark]]) {
  for (const key of realKeys(obj)) {
    const val = obj[key];
    if (/^#|^rgb|^hsl/i.test(val)) {
      fail(`${layer}.${key} declares its own value "${val}". Semantic entries reference a color token by name.`);
    } else if (!colorNames.includes(val)) {
      fail(`${layer}.${key} points at "${val}", which is not a color token.`);
    }
  }
}

// 2. Every dark override shadows a light entry. A dark-only key produces a
//    variable that exists in one theme and not the other, which reads as a
//    working token until someone switches themes.
for (const key of realKeys(T.semanticDark)) {
  if (!(key in T.semantic)) {
    fail(`semanticDark.${key} has no light-mode counterpart. Dark is an override layer, not a second system.`);
  }
}

// 3. No two color tokens share a value. Two names for one hex means the
//    intent behind each name is no longer recoverable from the file.
const seen = new Map();
for (const name of colorNames) {
  const hex = hexOf(name).toUpperCase();
  if (seen.has(hex)) fail(`${name} and ${seen.get(hex)} are both ${hex}. One of them is redundant.`);
  seen.set(hex, name);
}

// 4. The warm cast: R > G > B at every step of the stone ramp. Neutralizing
//    toward a cool or pure gray is the single change that makes this palette
//    generic, and it happens one step at a time.
for (const name of colorNames.filter((n) => T.color[n].group === T.rules.warmCast.ramp)) {
  const hex = hexOf(name);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  if (!(r > g && g > b)) fail(`${name} (${hex}) is not warm-cast — needs R > G > B, got ${r}/${g}/${b}.`);
}

// 5. Declared contrast minimums still hold.
for (const rule of T.rules.minContrast) {
  const fg = hexOf(rule.fg), bg = hexOf(rule.bg);
  if (!fg) { fail(`minContrast names fg "${rule.fg}", which is not a color token.`); continue; }
  if (!bg) { fail(`minContrast names bg "${rule.bg}", which is not a color token.`); continue; }
  const r = ratio(fg, bg);
  if (r < rule.min) {
    fail(`${rule.fg} on ${rule.bg} is ${fmt(r)}:1, below the declared ${rule.min}:1 — ${rule.why}.`);
  } else {
    notes.push(`  ${rule.fg} on ${rule.bg}  ${fmt(r)}:1  (min ${rule.min})  ${rule.why}`);
  }
}

// 6. A decorative-only color has not quietly become a text color on a light
//    ground. The exemptions are named in tokens.json, not inferred here.
{
  const { tokens, exceptSemantic } = T.rules.decorativeOnly;
  for (const key of realKeys(T.semantic)) {
    if (!key.startsWith("text-")) continue;
    if (exceptSemantic.includes(key)) continue;
    if (tokens.includes(T.semantic[key])) {
      fail(`semantic.${key} resolves to ${T.semantic[key]}, which is decorative-only on light grounds.`);
    }
  }
}

// 7. Bronze is never a fill. Making bronze prominent turns the brand
//    corporate-luxury, which is the failure mode this rule names.
{
  const { tokens, except } = T.rules.neverFill;
  for (const key of realKeys(T.semantic)) {
    const isFill = key.startsWith("background-") || key.endsWith("-bg") || key.startsWith("action-");
    if (!isFill || except.includes(key)) continue;
    if (tokens.includes(T.semantic[key])) {
      fail(`semantic.${key} fills a surface with ${T.semantic[key]}. Bronze is a hairline, a small mark, or one emphasized word.`);
    }
  }
}

// 8. The optical size boundary is a property of the scale, not a rule anyone
//    has to remember. Nothing sans may land between text-max and display-min.
{
  const { displayMin, textMax } = T.rules.opticalBoundary;
  for (const [name, role] of Object.entries(T.role)) {
    if (name.startsWith("_")) continue;
    const size = T.scale.size[role.size];
    if (role.cut === "serif") continue;
    if (size > textMax && size < displayMin) {
      fail(`role "${name}" is ${size}px, inside the ${textMax}–${displayMin} optical gap. No sans role may sit there.`);
    }
    if (role.cut === "display" && size < displayMin) {
      fail(`role "${name}" uses the display cut at ${size}px, below the ${displayMin}px threshold.`);
    }
    if (role.cut === "text" && size > textMax) {
      fail(`role "${name}" uses the text cut at ${size}px, above the ${textMax}px threshold.`);
    }
  }
}

// 9. Two reading sizes only. There is no 19px step.
for (const [name, role] of Object.entries(T.role)) {
  if (role.cut !== "serif" || name === "quote") continue;
  const size = T.scale.size[role.size];
  if (!T.rules.readingSizes.allowed.includes(size)) {
    fail(`reading role "${name}" is ${size}px. Allowed reading sizes: ${T.rules.readingSizes.allowed.join(", ")}.`);
  }
}

// 10. Every role reference resolves.
for (const [name, role] of Object.entries(T.role)) {
  if (name.startsWith("_")) continue;
  if (!(role.weight in T.weight)) fail(`role "${name}" names weight "${role.weight}", which does not exist.`);
  if (!(role.size in T.scale.size)) fail(`role "${name}" names size "${role.size}", which does not exist.`);
  if (!(role.leading in T.scale.leading)) fail(`role "${name}" names leading "${role.leading}", which does not exist.`);
  if (!(role.tracking in T.scale.tracking)) fail(`role "${name}" names tracking "${role.tracking}", which does not exist.`);
  if (!(role.color in T.semantic)) fail(`role "${name}" names color "${role.color}", which is not a semantic token.`);
}

// 11. Layout references resolve to spacing steps.
for (const key of ["gutter", "section-pad-y"]) {
  const ref = T.layout[key].replace(/^space-/, "");
  if (!(ref in T.space)) fail(`layout.${key} names "${T.layout[key]}", which is not a spacing step.`);
}

// 12. A retired name has not come back as a live token. Deleting a retired
//     entry outright loses the record of why it went, which is how values creep
//     back in — so the list only ever grows.
{
  const live = new Set([
    ...colorNames.map((n) => `--color-${n}`),
    ...realKeys(T.semantic).map((n) => `--color-${n}`),
    ...Object.keys(T.role).map((n) => `--text-${n}`),
  ]);
  for (const r of T.retired) {
    if (live.has(r.name)) fail(`retired token ${r.name} is live again. It was replaced by ${r.replacedBy}: ${r.reason}.`);
  }
}

// 13. The font stacks the system is currently set to, and — when those are the
//     production faces — the Adobe kit that actually serves them.
{
  const mode = T.font.use;
  if (!T.font[mode] || !["proxy", "production"].includes(mode)) {
    fail(`font.use is "${mode}". It must be "proxy" or "production".`);
  }

  if (mode === "production") {
    const kit = T.font.kit;
    if (!kit?.url) {
      fail(`font.use is "production" but font.kit declares no url. Consumers have no way to load the faces.`);
    } else {
      // Which family each optical cut resolves to, taken from the stack itself
      // rather than assumed — the first name in the stack is the one the kit
      // has to serve, and everything after it is a fallback.
      const primary = (stack) => (stack.match(/^\s*"?([^",]+)"?/) || [, ""])[1].trim();
      const familyForCut = {
        display: primary(T.font.production.display),
        text: primary(T.font.production.text),
        serif: primary(T.font.production.serif),
      };

      // Every weight the roles actually use must exist in the kit. A missing
      // weight does not error in a browser — it synthesises one, which is how a
      // system silently starts rendering faux-bold.
      const needed = new Map();
      for (const [name, role] of Object.entries(T.role)) {
        if (name.startsWith("_")) continue;
        const family = familyForCut[role.cut];
        if (!needed.has(family)) needed.set(family, new Set());
        needed.get(family).add(T.weight[role.weight]);
      }

      for (const [family, weights] of needed) {
        const has = kit.provides?.[family];
        if (!has) {
          fail(`font.kit does not list "${family}", which the ${[...needed.keys()].indexOf(family) >= 0 ? "production stacks" : "system"} resolve to.`);
          continue;
        }
        for (const w of [...weights].sort((a, b) => a - b)) {
          if (!has.includes(w)) {
            fail(`kit family "${family}" does not ship weight ${w}, which a type role uses. The browser would synthesise it.`);
          }
        }
        notes.push(`  kit ${family.padEnd(26)} needs ${[...weights].sort((a, b) => a - b).join(", ")}  ✓`);
      }
    }
  }
}

// 14. The two SVGs that hard-code a family still name the one in force. An SVG
//     loaded through <img> cannot read a custom property, so the exception
//     cannot be removed without outlining the text — but it can be kept honest.
{
  const { files, cut } = T.assets.liveText;
  const stack = T.font[T.font.use];
  if (stack) {
    const want = (stack[cut].match(/^\s*"?([^",]+)"?/) || [, ""])[1].trim();
    for (const rel of files) {
      let svg;
      try {
        svg = readFileSync(join(ROOT, rel), "utf8");
      } catch {
        fail(`assets.liveText names ${rel}, which does not exist.`);
        continue;
      }
      const declared = svg.match(/font-family="([^"]+)"/);
      if (!declared) {
        fail(`${rel} is listed as carrying live text but declares no font-family.`);
      } else if (!declared[1].startsWith(want)) {
        fail(`${rel} sets font-family "${declared[1].split(",")[0]}" but the system is on "${want}". ${T.assets.outlineNote}`);
      }
    }
  }
}

// 15. The logo. archetype-mark.svg is the only drawn file; the other three are
//     derived from it, and tokens.json describes its geometry as data. All three
//     of those can drift from the art, and used to have nothing stopping them —
//     the standalone wordmark shipped 0.017em of tracking against the lockup's
//     0.02em because both were hand-copies.
{
  let g;
  try {
    g = readGeometry(readFileSync(join(ROOT, "assets/logo/archetype-mark.svg"), "utf8"));
  } catch (e) {
    fail(`Could not read the logo geometry: ${e.message}`);
  }

  if (g) {
    const L = T.logo;
    const eq = (a, b) => Math.abs(a - b) < 0.01;
    const cmp = (label, drawn, declared) => {
      if (drawn === null || drawn === undefined) {
        fail(`archetype-mark.svg declares no ${label}, which tokens.json records as ${declared}.`);
      } else if (!eq(drawn, declared)) {
        fail(`logo.${label} says ${declared}, but archetype-mark.svg is drawn at ${drawn}. The file is the source; update tokens.json.`);
      }
    };

    cmp("viewBox.width", g.width, L.viewBox.width);
    cmp("viewBox.height", g.height, L.viewBox.height);
    cmp("aspect", g.aspect, L.aspect);
    cmp("circle.cx", g.circle.cx, L.circle.cx);
    cmp("circle.cy", g.circle.cy, L.circle.cy);
    cmp("circle.r", g.circle.r, L.circle.r);
    cmp("circle.stroke", g.circle.stroke, L.circle.stroke);

    // "The circle stroke is exactly half the triangle and crossbar weight."
    // The spec states it as a rule, so it is checked as one rather than trusted.
    const heavy = Math.max(...g.strokes);
    if (g.strokes.length && !eq(g.circle.stroke * 2, heavy)) {
      fail(`The circle stroke is ${g.circle.stroke} against a heaviest stroke of ${heavy}. §6 requires the circle to be exactly half.`);
    }

    // The aspect is quoted as a string in several places, and a stale one is how
    // 1.17:1 and 1.28:1 survived past the revisions that made them wrong.
    const quoted = `${g.aspect.toFixed(2)}:1`;
    if (T.assets.logo.mark.aspect !== quoted) {
      fail(`assets.logo.mark.aspect is "${T.assets.logo.mark.aspect}" but the mark is drawn at ${quoted}.`);
    }

    notes.push(`  logo  ${g.width}x${g.height}  ${quoted}  circle r${g.circle.r}/${g.circle.stroke} vs ${heavy}  ✓`);
  }

  // Derived files must match the mark as drawn, the same way build/ must match
  // tokens.json. Regenerating is `npm run logo`.
  for (const rel of staleFiles()) {
    fail(`${rel} is stale — it no longer matches archetype-mark.svg. Run \`npm run logo\`.`);
  }
}

// ── generate ──────────────────────────────────────────────────────────────────

/** Print collected errors and stop. */
const bail = () => {
  console.error(`\n${errors.length} problem${errors.length > 1 ? "s" : ""} in tokens.json:\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("");
  process.exit(1);
};

// Everything below derives from the selected font stacks, so a bad font.use
// cannot be carried into generation. Reported here rather than at the end,
// because the generator would otherwise crash on undefined with a stack trace
// instead of saying which key is wrong.
if (!T.font[T.font.use]) bail();

const fam = T.font[T.font.use];
const familyFor = (cut) => (cut === "serif" ? "var(--font-serif)" : cut === "display" ? "var(--font-display)" : "var(--font-text)");

const banner = (what) => `/* ${what}
   GENERATED FROM tokens.json — DO NOT EDIT BY HAND. Run \`npm run build\`.
   Prose rules live in DESIGN-SYSTEM.md and reference tokens by name, never by value.
   ${T.meta.name} v${T.meta.version}
*/`;

// --- build/tokens.css ---
let css = `${banner("Archetype design tokens — Tailwind v4 theme.")}

/* CONTRACT: the consumer imports tailwindcss FIRST, then this file. This file
   does not import the framework. Use "/css/bundled" for one entry that does —
   not both. Load order decides which values survive: last wins, so this goes
   after any dependency that declares the same names and before your overrides. */

`;

// Faces. In proxy mode the package serves them itself; in production the Adobe
// kit does, and the package cannot — the web project is bound to a domain.
if (T.font.use === "proxy") {
  css += `/* Proxy faces, served by this package. */\n`;
  for (const f of T.font.webfont.faces) {
    const url = `${T.font.webfont.host}/${f.slug}@latest/latin-${f.weight}-${f.style}.woff2`;
    css += `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url(${url}) format('woff2')}\n`;
  }
  css += `\n`;
} else {
  css += `/* REQUIRED: this file declares the production faces but cannot serve them.
   The Adobe Fonts web project is bound to a domain, so the consumer loads it:

     <link rel="stylesheet" href="${T.font.kit.url}">

   Import the URL from this package rather than typing it —
   \`import { font } from "@archetype/design-system"\` → \`font.kit.url\`.

   Without that stylesheet every stack falls through to its fallback and the
   whole system renders in Helvetica and Georgia. The fastest way to notice is
   that body copy stops being serif. */\n\n`;
}

css += `@theme static {\n\n`;

// color ramps
let group = null;
for (const name of colorNames) {
  const t = T.color[name];
  if (t.group !== group) { group = t.group; css += `  /* ---------- ${group} ---------- */\n`; }
  const label = t.name ? `${t.name}. ` : "";
  css += `  ${`--color-${name}:`.padEnd(30)} ${t.value};  /* ${label}${t.use} */\n`;
}

// semantic layer
css += `\n  /* ---------- semantic ---------- */\n`;
css += `  /* Reach for these in product code, never the raw ramp above. Each is a\n     var() reference, so the dark block below re-points them without redefining\n     a single hex. */\n`;
for (const key of realKeys(T.semantic)) {
  css += `  ${`--color-${key}:`.padEnd(30)} var(--color-${T.semantic[key]});\n`;
}
for (const key of realKeys(T.overlay)) {
  css += `  ${`--color-${key}:`.padEnd(30)} ${T.overlay[key]};\n`;
}

// type
css += `\n  /* ---------- families ---------- */\n`;
css += `  /* THE SWAP POINT — currently "${T.font.use}". Three declarations, and all\n     ${realKeys(T.role).length} roles derive from them. Nothing else names a family. */\n`;
css += `  ${"--font-display:".padEnd(30)} ${fam.display};\n`;
css += `  ${"--font-text:".padEnd(30)} ${fam.text};\n`;
css += `  ${"--font-serif:".padEnd(30)} ${fam.serif};\n`;
css += `  ${"--font-sans:".padEnd(30)} var(--font-text);\n`;
css += `  ${"--font-mono:".padEnd(30)} ${T.font.mono};\n`;

css += `\n  /* ---------- weights ---------- */\n`;
for (const [k, v] of Object.entries(T.weight)) {
  if (k.startsWith("_")) continue;
  css += `  ${`--font-weight-${k}:`.padEnd(30)} ${v};\n`;
}

css += `\n  /* ---------- roles ---------- */\n`;
css += `  /* Tailwind reads the paired --line-height / --letter-spacing / --font-weight\n     properties, so \`text-body\` sets all four at once. Family is separate:\n     \`text-body font-serif\`, or use the .type-body class from the components\n     layer, which sets family and default color too. */\n`;
for (const [name, role] of Object.entries(T.role)) {
  if (name.startsWith("_")) continue;
  css += `  ${`--text-${name}:`.padEnd(30)} ${T.scale.size[role.size]}px;\n`;
  css += `  ${`--text-${name}--line-height:`.padEnd(30)} ${T.scale.leading[role.leading]};\n`;
  css += `  ${`--text-${name}--letter-spacing:`.padEnd(30)} ${T.scale.tracking[role.tracking]};\n`;
  css += `  ${`--text-${name}--font-weight:`.padEnd(30)} ${T.weight[role.weight]};\n`;
}

css += `\n  /* ---------- tracking ---------- */\n`;
for (const k of realKeys(T.scale.tracking)) {
  const why = k === "eyebrow" ? "  /* A systemic echo of the logo wordmark. Do not change. */" : "";
  css += `  ${`--tracking-${k}:`.padEnd(30)} ${T.scale.tracking[k]};${why}\n`;
}

css += `\n  /* ---------- leading ---------- */\n`;
for (const k of realKeys(T.scale.leading)) {
  css += `  ${`--leading-${k}:`.padEnd(30)} ${T.scale.leading[k]};\n`;
}

css += `\n  /* ---------- containers ---------- */\n`;
css += `  ${"--container-site:".padEnd(30)} ${T.layout["container-max"]};\n`;
css += `  ${"--container-measure:".padEnd(30)} ${T.measure.body};   /* max-w-measure — the 62–70 character cap */\n`;
css += `  ${"--container-narrow:".padEnd(30)} ${T.measure.narrow};\n`;

css += `\n  /* ---------- radius ---------- */\n`;
for (const k of realKeys(T.radius)) {
  css += `  ${`--radius-${k}:`.padEnd(30)} ${T.radius[k]};\n`;
}

css += `\n  /* ---------- shadow ---------- */\n`;
for (const k of realKeys(T.shadow)) {
  css += `  ${`--shadow-${k}:`.padEnd(30)} ${T.shadow[k]};\n`;
}

css += `\n  /* ---------- motion ---------- */\n`;
for (const k of realKeys(T.motion.ease)) {
  css += `  ${`--ease-${k}:`.padEnd(30)} ${T.motion.ease[k]};\n`;
}
css += `}\n`;

// dark theme
css += `
/* ---------- dark ----------
   Stone inverts and the accents shift to their lighter steps, because
   verdigris-700 on stone-900 is unreadable. Only the semantic layer moves —
   no hex is redefined here. Set data-theme="dark" on any element; it does not
   have to be the root. */
[data-theme="dark"] {
`;
for (const key of realKeys(T.semanticDark)) {
  css += `  ${`--color-${key}:`.padEnd(30)} var(--color-${T.semanticDark[key]});\n`;
}
css += `  ${"--color-surface-overlay:".padEnd(30)} ${T.overlay["surface-overlay-dark"]};\n`;
css += `}\n`;

// spacing + raw-CSS conveniences
css += `
/* ---------- spacing ----------
   Every brand step is an exact multiple of Tailwind's 4px base, so the utility
   scale already expresses all of them — p-6 is space-5. These variables exist
   for raw CSS and for consumers that are not running Tailwind. The mapping
   table is in DESIGN-SYSTEM.md §5. */
:root {
`;
for (const k of realKeys(T.space)) {
  css += `  ${`--space-${k}:`.padEnd(30)} ${T.space[k]}px;\n`;
}
css += `  ${"--gutter:".padEnd(30)} var(--${T.layout.gutter});\n`;
css += `  ${"--section-pad-y:".padEnd(30)} var(--${T.layout["section-pad-y"]});\n`;
css += `  ${"--border-width:".padEnd(30)} ${T.borderWidth.default};\n`;
css += `  ${"--border-width-thick:".padEnd(30)} ${T.borderWidth.thick};\n`;
for (const k of realKeys(T.motion.duration)) {
  css += `  ${`--duration-${k}:`.padEnd(30)} ${T.motion.duration[k]};\n`;
}

css += `\n  /* Role shorthands, for raw CSS. The \`font:\` shorthand cannot carry\n     letter-spacing, so always set both:\n       font: var(--type-body); letter-spacing: var(--tracking-none);\n     Or use .type-body below, which does it for you. */\n`;
for (const [name, role] of Object.entries(T.role)) {
  if (name.startsWith("_")) continue;
  const w = T.weight[role.weight], s = T.scale.size[role.size], l = T.scale.leading[role.leading];
  css += `  ${`--type-${name}:`.padEnd(30)} ${w} ${s}px/${l} ${familyFor(role.cut)};\n`;
}
css += `  ${"--type-quote-italic:".padEnd(30)} italic var(--type-quote);\n`;
css += `}\n`;

// role classes
css += `
/* ---------- role classes ----------
   The 13 roles as one class each: size, leading, tracking, weight, family and
   the default color pairing. This is the short path — .type-body is the whole
   contract for reading copy. Override the color with a utility when a specific
   surface needs it. */
@layer components {
`;
for (const [name, role] of Object.entries(T.role)) {
  if (name.startsWith("_")) continue;
  const casing = role.casing ? ` text-transform: ${role.casing};` : "";
  css += `  .type-${name} { font: var(--type-${name}); letter-spacing: var(--tracking-${role.tracking}); color: var(--color-${role.color});${casing} }\n`;
}
css += `}\n`;

// the serif rendering rule
css += `
/* ---------- serif rendering ----------
   Never apply -webkit-font-smoothing:antialiased to serif body copy. It is a
   common reset default and it THINS strokes on macOS — the wrong direction
   against a warm off-white ground, where a sub-pixel hairline already blends
   toward a background darker than pure white. Below 17px prefer the Book cut;
   it was drawn for exactly this problem. */
body, p, blockquote, li {
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: auto;
}
`;

// --- build/tokens.bundled.css ---
const bundled = `${banner("Archetype design tokens — bundled entry.")}

/* One import that pulls the framework in with the system. Use this OR
   "@archetype/design-system/css", never both. */

@import "tailwindcss";
@import "./tokens.css";
`;

// --- build/tokens.js ---
const jsColor = Object.fromEntries(colorNames.map((n) => [n, hexOf(n)]));
const jsSemantic = Object.fromEntries(realKeys(T.semantic).map((k) => [k, hexOf(T.semantic[k])]));
const jsSemanticDark = Object.fromEntries(
  realKeys(T.semantic).map((k) => [k, hexOf(T.semanticDark[k] ?? T.semantic[k])])
);
const jsRole = Object.fromEntries(
  realKeys(T.role).map((name) => {
    const r = T.role[name];
    return [name, {
      fontSize: T.scale.size[r.size],
      lineHeight: T.scale.leading[r.leading],
      letterSpacing: T.scale.tracking[r.tracking],
      fontWeight: T.weight[r.weight],
      cut: r.cut,
      family: r.cut === "serif" ? fam.serif : r.cut === "display" ? fam.display : fam.text,
      color: hexOf(T.semantic[r.color]),
      ...(r.casing ? { textTransform: r.casing } : {}),
    }];
  })
);

const js = `${banner("Archetype design tokens — JavaScript.")}
// For anything that cannot read CSS: document pipelines, canvas rendering,
// email templates, PDF generation, Figma sync.

export const meta = ${JSON.stringify(T.meta, null, 2)};

/** Raw ramps. Prefer \`semantic\` unless you are building the ramp itself. */
export const color = ${JSON.stringify(jsColor, null, 2)};

/** Light-mode semantic layer, resolved to hex. */
export const semantic = ${JSON.stringify(jsSemantic, null, 2)};

/** Dark-mode semantic layer, resolved to hex. Every light key is present. */
export const semanticDark = ${JSON.stringify(jsSemanticDark, null, 2)};

/** The ${realKeys(T.role).length} type roles, fully resolved. */
export const role = ${JSON.stringify(jsRole, null, 2)};

/** Font stacks in force, plus the Adobe kit that serves them.
 *  Consumers link \`font.kit.url\` rather than typing it — see build/tokens.css. */
export const font = ${JSON.stringify(
  {
    use: T.font.use,
    display: fam.display,
    text: fam.text,
    serif: fam.serif,
    mono: T.font.mono,
    ...(T.font.use === "production" && T.font.kit
      ? { kit: { id: T.font.kit.id, url: T.font.kit.url, host: T.font.kit.host } }
      : {}),
  },
  null,
  2
)};

export const space = ${JSON.stringify(T.space, null, 2)};
export const radius = ${JSON.stringify(T.radius, null, 2)};
export const shadow = ${JSON.stringify(T.shadow, null, 2)};
export const motion = ${JSON.stringify(T.motion, null, 2)};
export const logo = ${JSON.stringify(T.logo, null, 2)};
export const palette = ${JSON.stringify(T.palette, null, 2)};

/** px → half-points, for docx pipelines. */
export const pxToHalfPt = (px) => Math.round((px * 0.75) * 2);

/** px → twips, for docx geometry. */
export const pxToTwips = (px) => Math.round(px * 15);
`;

// --- build/tokens.d.ts ---
// Without declarations, importing this package under a strict tsconfig is an
// implicit `any` — an error, not a warning. The key unions are generated from
// the same source as the values, so a typo in semantic["backgruond-primary"]
// fails at the keystroke rather than resolving to undefined at runtime.
const union = (keys) => keys.map((k) => `"${k}"`).join("\n  | ");

const dts = `${banner("Archetype design tokens — type declarations.")}

export type ColorName =
  ${union(colorNames)};

export type SemanticName =
  ${union(realKeys(T.semantic))};

export type RoleName =
  ${union(realKeys(T.role))};

export type SpaceStep =
  ${union(realKeys(T.space))};

export interface Meta {
  name: string;
  version: string;
  spec: string;
  note: string;
}

export interface Role {
  /** px */
  fontSize: number;
  lineHeight: number;
  /** em, or "0" */
  letterSpacing: string;
  fontWeight: number;
  /** Which optical cut the role uses. */
  cut: "display" | "text" | "serif";
  /** The resolved family stack. */
  family: string;
  /** The default colour pairing, as hex. */
  color: string;
  textTransform?: string;
}

export interface Font {
  use: "proxy" | "production";
  display: string;
  text: string;
  serif: string;
  mono: string;
  /** Present only when \`use\` is "production". The consumer must link kit.url. */
  kit?: { id: string; url: string; host: string };
}

export const meta: Meta;
export const color: Record<ColorName, string>;
export const semantic: Record<SemanticName, string>;
export const semanticDark: Record<SemanticName, string>;
export const role: Record<RoleName, Role>;
export const font: Font;
export const space: Record<SpaceStep, number>;
export const radius: Record<string, string>;
export const shadow: Record<string, string>;
export const motion: {
  duration: Record<string, string>;
  ease: Record<string, string>;
};
export const logo: Record<string, unknown>;
export const palette: { ratio: Record<string, number> };

/** px → half-points, for docx pipelines. */
export function pxToHalfPt(px: number): number;

/** px → twips, for docx geometry. */
export function pxToTwips(px: number): number;
`;

// --- barred values check, on the generated output rather than the source ---
// Declarations only. Prose is allowed to name a barred value — the rule against
// pure white is worth stating in the file it governs, and the first version of
// this check failed the build over its own explanation.
{
  const declarations = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[^:]*:/gm, "");
  for (const bad of T.rules.barredValues.hex) {
    if (new RegExp(`${bad}\\b`, "i").test(declarations)) {
      fail(`A generated declaration uses ${bad}. ${T.rules.barredValues._note}`);
    }
  }
}

// ── report ────────────────────────────────────────────────────────────────────

if (TAG) {
  const want = `v${T.meta.version}`;
  if (TAG !== want) {
    console.error(`Tag ${TAG} does not match meta.version (${want}).`);
    console.error(`A tag and the version it publishes must agree, or a pinned install resolves to something else.`);
    process.exit(1);
  }
  console.log(`Tag ${TAG} matches meta.version.`);
  process.exit(0);
}

if (errors.length) bail();

console.log(`Contrast, all declared minimums:`);
for (const n of notes) console.log(n);

if (CHECK_ONLY) {
  console.log(`\ntokens.json is valid. ${colorNames.length} colors, ${realKeys(T.semantic).length} semantic, ${realKeys(T.role).length} roles.`);
  process.exit(0);
}

mkdirSync(join(ROOT, "build"), { recursive: true });
writeFileSync(join(ROOT, "build/tokens.css"), css);
writeFileSync(join(ROOT, "build/tokens.bundled.css"), bundled);
writeFileSync(join(ROOT, "build/tokens.js"), js);
writeFileSync(join(ROOT, "build/tokens.d.ts"), dts);

console.log(`\nWrote build/tokens.css, build/tokens.bundled.css, build/tokens.js, build/tokens.d.ts`);
console.log(`${colorNames.length} colors, ${realKeys(T.semantic).length} semantic, ${realKeys(T.role).length} roles, families: ${T.font.use}.`);
