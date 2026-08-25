// WCAG relative luminance and contrast ratio.
// Shared by scripts/build.mjs and scripts/specimen.mjs so a ratio printed in the
// specimen is the same number the validator enforced. Two copies of this maths is
// two answers to "does this pass", which is the drift the specimen exists to expose.

/** Relative luminance of a #RRGGBB string, per WCAG 2.x. */
export const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

/** Contrast ratio between two #RRGGBB strings, 1..21. Order-independent. */
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
