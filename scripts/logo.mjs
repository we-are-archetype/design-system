#!/usr/bin/env node
// Derives the logo family from a single drawn file.
//
//   node scripts/logo.mjs           regenerate the derived SVGs
//   node scripts/logo.mjs --check   report staleness, write nothing
//
// assets/logo/archetype-mark.svg is the ONLY hand-authored logo file. The other
// three are arithmetic on it plus declared typesetting, and used to be
// hand-copies — which is how the standalone wordmark came to ship 0.017em of
// tracking against the lockup's 0.02em, with the spec asking for 0.02em.
//
// Updating the mark is therefore: replace archetype-mark.svg, run this, run the
// build. The build fails if either the derived files or tokens.json's `logo`
// block no longer agree with what was drawn.
//
// The mark's inner content is copied through verbatim rather than parsed into
// shapes. Whatever is drawn — these paths or a future revision's — lands in the
// derived files unchanged, so this script does not need to understand the art.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const T = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8"));

const CHECK_ONLY = process.argv.includes("--check");

const MARK = "assets/logo/archetype-mark.svg";
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

// ── read the source ───────────────────────────────────────────────────────────

/**
 * Pull the viewBox and the inner content out of the drawn mark. Everything
 * between the opening and closing <svg> tags is treated as opaque.
 */
export function parseMark(svg) {
  const vb = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!vb) throw new Error(`${MARK} has no viewBox. It is the coordinate space everything else derives from.`);
  const [minX, minY, width, height] = vb[1].trim().split(/\s+/).map(Number);

  const open = svg.indexOf(">", svg.indexOf("<svg"));
  const close = svg.lastIndexOf("</svg>");
  if (open < 0 || close < 0) throw new Error(`${MARK} is not a well-formed SVG document.`);

  return { minX, minY, width, height, inner: svg.slice(open + 1, close).trim() };
}

/** Geometry the spec makes claims about, for the build to check against tokens.json. */
export function readGeometry(svg) {
  const { width, height } = parseMark(svg);
  const circle = svg.match(/<circle[^>]*>/)?.[0] ?? "";
  const num = (src, attr) => {
    const m = src.match(new RegExp(`${attr}="([\\d.-]+)"`));
    return m ? Number(m[1]) : null;
  };
  const strokes = [...svg.matchAll(/stroke-width="([\d.]+)"/g)].map((m) => Number(m[1]));

  return {
    width,
    height,
    aspect: Number((width / height).toFixed(4)),
    circle: {
      cx: num(circle, "cx"),
      cy: Math.round(num(circle, "cy")),
      r: num(circle, "r"),
      stroke: num(circle, "stroke-width"),
    },
    strokes: [...new Set(strokes)].sort((a, b) => a - b),
  };
}

// ── derive ────────────────────────────────────────────────────────────────────

const round = (n) => Number(n.toFixed(2));

/** The display family in force, for the two files that carry live text. */
const displayFamily = () =>
  T.font[T.font.use].display.replace(/"/g, "");

/** Letter-spacing in the mark's units. Derived from the type scale, not typed. */
const wordmarkTracking = (fontSize) =>
  round(parseFloat(T.scale.tracking.wordmark) * fontSize);

const textNode = ({ x, y, fontSize, letterSpacing }) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="${displayFamily()}" ` +
  `font-weight="${T.logo.wordmark.fontWeight}" font-size="${fontSize}" ` +
  `letter-spacing="${letterSpacing}" fill="currentColor">${T.logo.wordmark.text}</text>`;

const doc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">${body}</svg>\n`;

/**
 * The mark centred on a square canvas, for favicons and app icons. The offset
 * is the only thing that makes this file different from the mark.
 */
export function buildSquare(mark) {
  const { width, height, inner } = mark;
  const side = Math.max(width, height);
  const dx = round((side - width) / 2);
  const dy = round((side - height) / 2);
  const body = dx || dy ? `<g transform="translate(${dx},${dy})">${inner}</g>` : inner;
  return doc(side, side, body);
}

/** The wordmark alone. Pure typesetting — the mark is not in this file. */
export function buildWordmark() {
  const { fontSize, canvas } = T.logo.wordmark;
  return doc(
    canvas.width,
    canvas.height,
    textNode({ x: canvas.width / 2, y: canvas.baseline, fontSize, letterSpacing: wordmarkTracking(fontSize) })
  ).replace(` width="${canvas.width}" height="${canvas.height}"`, ""); // scales freely; only the ratio matters
}

/**
 * Mark above, wordmark beneath. The gap is a fraction of the circle diameter so
 * the lockup holds its proportions at any size, and the wordmark's cap height
 * places the baseline.
 */
export function buildLockup(mark, geometry) {
  const { width, height, inner } = mark;
  const { widthOfDiameter, gapOfDiameter, bottomPad } = T.logo.lockup;
  const { advanceRatio, inkAscentRatio, inkDescentRatio } = T.logo.wordmark.metrics;

  const diameter = geometry.circle.r * 2;

  // The font size is solved for, not chosen: pick the size whose rendered
  // advance is widthOfDiameter x the circle. This is what makes the declared
  // 0.76 true — it was hand-set to 58 before, which rendered 0.728.
  const fontSize = round((widthOfDiameter * diameter) / advanceRatio);

  // The gap is to the ink, not to the cap line, so the ascent measurement is
  // the one that places the baseline.
  const gap = diameter * gapOfDiameter;
  const baseline = Math.round(height + gap + inkAscentRatio * fontSize);
  const canvasHeight = Math.round(baseline + inkDescentRatio * fontSize + bottomPad);

  return doc(
    width,
    canvasHeight,
    inner + textNode({ x: width / 2, y: baseline, fontSize, letterSpacing: wordmarkTracking(fontSize) })
  );
}

// ── the derived set ───────────────────────────────────────────────────────────

/** What every derived file should contain, given the mark as drawn. */
export function derive() {
  const source = read(MARK);
  const mark = parseMark(source);
  const geometry = readGeometry(source);
  return {
    geometry,
    outputs: [
      ["assets/logo/archetype-mark-square.svg", buildSquare(mark)],
      ["assets/logo/archetype-wordmark.svg", buildWordmark()],
      ["assets/logo/archetype-lockup.svg", buildLockup(mark, geometry)],
    ],
  };
}

/** Derived files whose contents no longer match the mark. */
export function staleFiles() {
  return derive().outputs.filter(([rel, content]) => {
    try {
      return read(rel) !== content;
    } catch {
      return true; // missing counts as stale
    }
  }).map(([rel]) => rel);
}

// ── run ───────────────────────────────────────────────────────────────────────
// Only when invoked directly. scripts/build.mjs imports the functions above to
// check staleness without regenerating anything.

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (!invokedDirectly) {
  // Imported as a library — nothing to do.
} else {
const { geometry, outputs } = derive();
const stale = staleFiles();

if (CHECK_ONLY) {
  if (stale.length) {
    console.error(`\n${stale.length} derived logo file${stale.length > 1 ? "s are" : " is"} stale:\n`);
    for (const s of stale) console.error(`  ✗ ${s}`);
    console.error(`\nRun \`npm run logo\` and commit the result.\n`);
    process.exit(1);
  }
  console.log(`Derived logo files are current. Source: ${MARK} (${geometry.width}x${geometry.height}, ${geometry.aspect}:1).`);
  process.exit(0);
}

for (const [rel, content] of outputs) writeFileSync(join(ROOT, rel), content);

console.log(`Source: ${MARK} — ${geometry.width}x${geometry.height}, aspect ${geometry.aspect}:1, circle r${geometry.circle.r} stroke ${geometry.circle.stroke}.`);
for (const [rel] of outputs) console.log(`  wrote ${rel}${stale.includes(rel) ? "" : "  (unchanged)"}`);
}
