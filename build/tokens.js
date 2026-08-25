/* Archetype design tokens — JavaScript.
   GENERATED FROM tokens.json — DO NOT EDIT BY HAND. Run `npm run build`.
   Prose rules live in DESIGN-SYSTEM.md and reference tokens by name, never by value.
   @archetype/design-system v1.2.0
*/
// For anything that cannot read CSS: document pipelines, canvas rendering,
// email templates, PDF generation, Figma sync.

export const meta = {
  "name": "@archetype/design-system",
  "version": "1.2.0",
  "spec": "DESIGN-SYSTEM.md",
  "note": "This file is the only place a value is typed. Everything in build/ is generated from it by scripts/build.mjs. DESIGN-SYSTEM.md carries prose rules and references tokens by name, never by value. If a hex appears in two places, one of them is wrong."
};

/** Raw ramps. Prefer `semantic` unless you are building the ramp itself. */
export const color = {
  "stone-50": "#FAF8F5",
  "stone-100": "#F1EEE8",
  "stone-200": "#E3DED4",
  "stone-300": "#CFC8BC",
  "stone-400": "#A8A199",
  "stone-500": "#877F76",
  "stone-600": "#635C55",
  "stone-700": "#45403B",
  "stone-800": "#2B2724",
  "stone-900": "#1A1816",
  "verdigris-100": "#DCE6E2",
  "verdigris-300": "#8FAFA5",
  "verdigris-500": "#517D71",
  "verdigris-700": "#2E5349",
  "verdigris-900": "#1B342E",
  "bronze-100": "#EDE0CC",
  "bronze-300": "#CDAF83",
  "bronze-500": "#A9834F",
  "bronze-700": "#7D5C33",
  "bronze-900": "#4A361E"
};

/** Light-mode semantic layer, resolved to hex. */
export const semantic = {
  "background-primary": "#FAF8F5",
  "background-secondary": "#F1EEE8",
  "background-sunken": "#E3DED4",
  "background-inverse": "#1A1816",
  "surface-tint-cool": "#DCE6E2",
  "surface-tint-warm": "#EDE0CC",
  "text-primary": "#1A1816",
  "text-heading": "#2B2724",
  "text-emphasis": "#45403B",
  "text-secondary": "#635C55",
  "text-tertiary": "#877F76",
  "text-disabled": "#A8A199",
  "text-inverse": "#FAF8F5",
  "text-inverse-secondary": "#CFC8BC",
  "text-link": "#2E5349",
  "text-link-hover": "#1B342E",
  "text-on-tint-cool": "#1B342E",
  "text-on-tint-warm": "#4A361E",
  "border-subtle": "#E3DED4",
  "border-strong": "#CFC8BC",
  "border-emphasis": "#A8A199",
  "border-accent": "#517D71",
  "border-hairline-warm": "#7D5C33",
  "border-inverse": "#45403B",
  "accent-primary": "#2E5349",
  "accent-primary-hover": "#1B342E",
  "accent-primary-muted": "#517D71",
  "accent-primary-on-dark": "#8FAFA5",
  "accent-warm": "#7D5C33",
  "accent-warm-on-dark": "#CDAF83",
  "focus-ring": "#2E5349",
  "action-primary-bg": "#1A1816",
  "action-primary-bg-hover": "#2B2724",
  "action-primary-bg-active": "#45403B",
  "action-primary-fg": "#FAF8F5",
  "action-secondary-border": "#CFC8BC",
  "action-secondary-border-hover": "#1A1816",
  "action-secondary-fg": "#1A1816",
  "action-accent-bg": "#2E5349",
  "action-accent-bg-hover": "#1B342E",
  "action-accent-fg": "#FAF8F5",
  "action-disabled-bg": "#E3DED4",
  "action-disabled-fg": "#A8A199"
};

/** Dark-mode semantic layer, resolved to hex. Every light key is present. */
export const semanticDark = {
  "background-primary": "#1A1816",
  "background-secondary": "#2B2724",
  "background-sunken": "#45403B",
  "background-inverse": "#FAF8F5",
  "surface-tint-cool": "#1B342E",
  "surface-tint-warm": "#4A361E",
  "text-primary": "#F1EEE8",
  "text-heading": "#FAF8F5",
  "text-emphasis": "#F1EEE8",
  "text-secondary": "#CFC8BC",
  "text-tertiary": "#A8A199",
  "text-disabled": "#877F76",
  "text-inverse": "#1A1816",
  "text-inverse-secondary": "#45403B",
  "text-link": "#8FAFA5",
  "text-link-hover": "#DCE6E2",
  "text-on-tint-cool": "#DCE6E2",
  "text-on-tint-warm": "#EDE0CC",
  "border-subtle": "#45403B",
  "border-strong": "#635C55",
  "border-emphasis": "#877F76",
  "border-accent": "#517D71",
  "border-hairline-warm": "#A9834F",
  "border-inverse": "#CFC8BC",
  "accent-primary": "#8FAFA5",
  "accent-primary-hover": "#DCE6E2",
  "accent-primary-muted": "#517D71",
  "accent-primary-on-dark": "#8FAFA5",
  "accent-warm": "#CDAF83",
  "accent-warm-on-dark": "#CDAF83",
  "focus-ring": "#8FAFA5",
  "action-primary-bg": "#F1EEE8",
  "action-primary-bg-hover": "#FAF8F5",
  "action-primary-bg-active": "#E3DED4",
  "action-primary-fg": "#1A1816",
  "action-secondary-border": "#635C55",
  "action-secondary-border-hover": "#F1EEE8",
  "action-secondary-fg": "#F1EEE8",
  "action-accent-bg": "#8FAFA5",
  "action-accent-bg-hover": "#DCE6E2",
  "action-accent-fg": "#1A1816",
  "action-disabled-bg": "#45403B",
  "action-disabled-fg": "#877F76"
};

/** The 13 type roles, fully resolved. */
export const role = {
  "display-xl": {
    "fontSize": 64,
    "lineHeight": 1.05,
    "letterSpacing": "-0.025em",
    "fontWeight": 400,
    "cut": "display",
    "family": "\"neue-haas-grotesk-display\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "display-lg": {
    "fontSize": 48,
    "lineHeight": 1.1,
    "letterSpacing": "-0.02em",
    "fontWeight": 400,
    "cut": "display",
    "family": "\"neue-haas-grotesk-display\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "display-md": {
    "fontSize": 36,
    "lineHeight": 1.15,
    "letterSpacing": "-0.015em",
    "fontWeight": 400,
    "cut": "display",
    "family": "\"neue-haas-grotesk-display\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "heading-lg": {
    "fontSize": 27,
    "lineHeight": 1.25,
    "letterSpacing": "-0.01em",
    "fontWeight": 500,
    "cut": "display",
    "family": "\"neue-haas-grotesk-display\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "heading-md": {
    "fontSize": 20,
    "lineHeight": 1.3,
    "letterSpacing": "0",
    "fontWeight": 500,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "heading-sm": {
    "fontSize": 17,
    "lineHeight": 1.4,
    "letterSpacing": "0",
    "fontWeight": 500,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#1A1816"
  },
  "eyebrow": {
    "fontSize": 12,
    "lineHeight": 1.4,
    "letterSpacing": "0.14em",
    "fontWeight": 500,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#635C55",
    "textTransform": "uppercase"
  },
  "body": {
    "fontSize": 17,
    "lineHeight": 1.65,
    "letterSpacing": "0",
    "fontWeight": 400,
    "cut": "serif",
    "family": "\"freight-text-pro\", Georgia, \"Times New Roman\", serif",
    "color": "#635C55"
  },
  "body-sm": {
    "fontSize": 15,
    "lineHeight": 1.6,
    "letterSpacing": "0",
    "fontWeight": 400,
    "cut": "serif",
    "family": "\"freight-text-pro\", Georgia, \"Times New Roman\", serif",
    "color": "#45403B"
  },
  "quote": {
    "fontSize": 24,
    "lineHeight": 1.45,
    "letterSpacing": "0",
    "fontWeight": 400,
    "cut": "serif",
    "family": "\"freight-text-pro\", Georgia, \"Times New Roman\", serif",
    "color": "#635C55"
  },
  "ui": {
    "fontSize": 15,
    "lineHeight": 1.4,
    "letterSpacing": "0",
    "fontWeight": 400,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#45403B"
  },
  "ui-sm": {
    "fontSize": 13,
    "lineHeight": 1.4,
    "letterSpacing": "0.01em",
    "fontWeight": 400,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#45403B"
  },
  "caption": {
    "fontSize": 12,
    "lineHeight": 1.4,
    "letterSpacing": "0.02em",
    "fontWeight": 400,
    "cut": "text",
    "family": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "color": "#635C55"
  }
};

/** Font stacks in force, plus the Adobe kit that serves them.
 *  Consumers link `font.kit.url` rather than typing it — see build/tokens.css. */
export const font = {
  "use": "production",
  "display": "\"neue-haas-grotesk-display\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
  "text": "\"neue-haas-grotesk-text\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
  "serif": "\"freight-text-pro\", Georgia, \"Times New Roman\", serif",
  "mono": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  "kit": {
    "id": "npe3lvr",
    "url": "https://use.typekit.net/npe3lvr.css",
    "host": "https://use.typekit.net"
  }
};

export const space = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 24,
  "6": 32,
  "7": 48,
  "8": 64,
  "9": 96,
  "10": 128,
  "11": 192,
  "_note": "4px to 192px. The large steps exist so a generous gap reads as intentional confidence rather than an empty layout. Sections breathe at space-8 to space-9."
};
export const radius = {
  "_note": "Sharp by default. Corners are structural, not softened. `full` is reserved for the two places roundness carries meaning: status badges and the circular radio control. Rounding cards or buttons broadly is off-brand.",
  "none": "0px",
  "sm": "2px",
  "md": "4px",
  "lg": "6px",
  "full": "999px"
};
export const shadow = {
  "_note": "Flat by default. Cards rest on a border, never a shadow. Shadows indicate elevation and are never decorative.",
  "none": "none",
  "card": "0 1px 2px rgba(28,28,28,0.06)",
  "raised": "0 4px 16px rgba(28,28,28,0.08)",
  "overlay": "0 16px 48px rgba(28,28,28,0.16)"
};
export const motion = {
  "_note": "Minimal and functional. Fades and color transitions only. No bounce, no spring, no parallax, no decorative motion.",
  "duration": {
    "fast": "120ms",
    "standard": "200ms",
    "slow": "360ms"
  },
  "ease": {
    "standard": "cubic-bezier(0.4,0,0.2,1)",
    "out": "cubic-bezier(0,0,0.2,1)"
  }
};
export const logo = {
  "_note": "Geometry read from assets/logo/archetype-mark.svg, which is the only hand-authored logo file. mark-square, wordmark and lockup are generated from it by scripts/logo.mjs; the build fails if this block and the file disagree, or if a generated file is stale.",
  "aspect": 1.2352,
  "viewBox": {
    "width": 667,
    "height": 540
  },
  "circle": {
    "cx": 333.5,
    "cy": 290,
    "r": 245,
    "stroke": 10
  },
  "triangle": {
    "stroke": 20,
    "apex": [
      333.5,
      20
    ],
    "base": [
      [
        99.68,
        425
      ],
      [
        567.32,
        425
      ]
    ]
  },
  "crossbar": {
    "stroke": 20,
    "spanY": [
      280,
      300
    ],
    "spanX": [
      0,
      667
    ],
    "topInset": [
      11.02,
      655.97
    ]
  },
  "rules": [
    "The circle stroke is exactly half the triangle and crossbar weight — 10 against 20.",
    "All three triangle points sit outside the circle. That is the current revision, not a drafting error.",
    "The crossbar runs the full width and overhangs the circle by 0.34r each side. Never clip the bar to the circle — the overhang is the mark's distinguishing move.",
    "Aspect is 1.24:1, not square. Set height and let width follow. Anything carrying 1.17:1 or 1.28:1 is stale.",
    "Wordmark tracking is near-zero (0.02em), not wide. Wide tracking belongs to the eyebrow role, which echoes the wordmark rather than repeating it."
  ],
  "wordmark": {
    "_note": "Typesetting for the two files that carry live text. Declared, not derived — text advance width depends on the face and cannot be computed without rendering, so the canvas is a measured choice. letterSpacing IS derived: scale.tracking.wordmark x fontSize. Both files read it from here so they cannot disagree, which they did — the standalone wordmark shipped 1 against the lockup's 1.16, and 1.16 is the one the spec asks for.",
    "text": "ARCHETYPE",
    "fontSize": 58,
    "fontWeight": 700,
    "capHeightRatio": 0.72,
    "capHeightNote": "Cap height as a fraction of font size, for Neue Haas Grotesk Display 75 Bold. Face-dependent: re-measure if the display family changes.",
    "canvas": {
      "width": 420,
      "height": 60,
      "baseline": 46
    }
  },
  "lockup": {
    "_note": "The stacked lockup: mark above, wordmark beneath. Both figures are fractions of the circle diameter, so the lockup rescales with the mark rather than with a fixed pixel gap.",
    "widthOfDiameter": 0.76,
    "gapOfDiameter": 0.08,
    "bottomPad": 9,
    "bottomPadNote": "All-caps has no descenders, so the baseline is the visual bottom. This is breathing room below it, in the mark's own coordinate space."
  }
};
export const palette = {
  "_note": "The discipline, not an aspiration. Measured over painted area on any given surface.",
  "ratio": {
    "stone": 0.9,
    "verdigris": 0.08,
    "bronze": 0.02
  }
};

/** px → half-points, for docx pipelines. */
export const pxToHalfPt = (px) => Math.round((px * 0.75) * 2);

/** px → twips, for docx geometry. */
export const pxToTwips = (px) => Math.round(px * 15);
