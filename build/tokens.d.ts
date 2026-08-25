/* Archetype design tokens — type declarations.
   GENERATED FROM tokens.json — DO NOT EDIT BY HAND. Run `npm run build`.
   Prose rules live in DESIGN-SYSTEM.md and reference tokens by name, never by value.
   @archetype/design-system v1.1.1
*/

export type ColorName =
  "stone-50"
  | "stone-100"
  | "stone-200"
  | "stone-300"
  | "stone-400"
  | "stone-500"
  | "stone-600"
  | "stone-700"
  | "stone-800"
  | "stone-900"
  | "verdigris-100"
  | "verdigris-300"
  | "verdigris-500"
  | "verdigris-700"
  | "verdigris-900"
  | "bronze-100"
  | "bronze-300"
  | "bronze-500"
  | "bronze-700"
  | "bronze-900";

export type SemanticName =
  "background-primary"
  | "background-secondary"
  | "background-sunken"
  | "background-inverse"
  | "surface-tint-cool"
  | "surface-tint-warm"
  | "text-primary"
  | "text-heading"
  | "text-emphasis"
  | "text-secondary"
  | "text-tertiary"
  | "text-disabled"
  | "text-inverse"
  | "text-inverse-secondary"
  | "text-link"
  | "text-link-hover"
  | "text-on-tint-cool"
  | "text-on-tint-warm"
  | "border-subtle"
  | "border-strong"
  | "border-emphasis"
  | "border-accent"
  | "border-hairline-warm"
  | "border-inverse"
  | "accent-primary"
  | "accent-primary-hover"
  | "accent-primary-muted"
  | "accent-primary-on-dark"
  | "accent-warm"
  | "accent-warm-on-dark"
  | "focus-ring"
  | "action-primary-bg"
  | "action-primary-bg-hover"
  | "action-primary-bg-active"
  | "action-primary-fg"
  | "action-secondary-border"
  | "action-secondary-border-hover"
  | "action-secondary-fg"
  | "action-accent-bg"
  | "action-accent-bg-hover"
  | "action-accent-fg"
  | "action-disabled-bg"
  | "action-disabled-fg";

export type RoleName =
  "display-xl"
  | "display-lg"
  | "display-md"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "eyebrow"
  | "body"
  | "body-sm"
  | "quote"
  | "ui"
  | "ui-sm"
  | "caption";

export type SpaceStep =
  "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11";

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
  /** Present only when `use` is "production". The consumer must link kit.url. */
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
