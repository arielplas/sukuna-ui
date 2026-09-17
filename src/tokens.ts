/**
 * Sukuna design tokens — the single source of truth.
 *
 * `src/styles/tokens.css` is GENERATED from this file by `scripts/build-tokens.ts`
 * (`bun run tokens:build`). Edit values here, never in the CSS.
 *
 * Dark is the default/brand theme; light is a mode. Themed tokens carry both;
 * everything else is theme-independent. Values come from `docs/tokens.md`.
 */

export type ThemeName = 'dark' | 'light'

/** A value that differs between the two themes. */
export interface Themed<T = string> {
  readonly dark: T
  readonly light: T
}

/** Semantic colors. Keys are the `--sk-*` suffix. All themed. */
export const colors = {
  bg: { dark: '#0A0A0B', light: '#FAF9F5' },
  surface: { dark: '#141416', light: '#FFFFFF' },
  'surface-2': { dark: '#1C1C20', light: '#F1EFE9' },
  well: { dark: '#000000', light: '#E8E5DD' },
  line: { dark: 'rgba(255, 255, 255, 0.1)', light: 'rgba(0, 0, 0, 0.12)' },
  'line-soft': { dark: 'rgba(255, 255, 255, 0.06)', light: 'rgba(0, 0, 0, 0.06)' },
  accent: { dark: '#FF3B4E', light: '#D8253A' },
  'accent-deep': { dark: '#B01221', light: '#9A0E1C' },
  'accent-glow': { dark: 'rgba(255, 59, 78, 0.6)', light: 'rgba(216, 37, 58, 0.35)' },
  premium: { dark: '#E8DCC4', light: '#8A7A55' },
  'premium-dim': { dark: '#B5A98C', light: '#A8996F' },
  text: { dark: '#F4F1EC', light: '#141413' },
  'text-dim': { dark: '#9A948A', light: '#5E5A52' },
  'text-faint': { dark: '#6C665D', light: '#8C877D' },
  success: { dark: '#31C877', light: '#1E9E5A' },
  'gradient-accent': {
    dark: 'linear-gradient(135deg, #FF3B4E, #B01221)',
    light: 'linear-gradient(135deg, #D8253A, #9A0E1C)',
  },
} as const satisfies Record<string, Themed>

/**
 * Elevation. `card` dark is from `docs/tokens.md`; the light value is a PROPOSAL
 * (the doc only says "softer in light") awaiting owner approval — see docs/questions.md Q12.
 */
export const shadows = {
  card: {
    dark: '0 30px 60px -24px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    light: '0 20px 40px -24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.06)',
  },
} as const satisfies Record<string, Themed>

/** Font families. `display` falls back to `sans`; the library does not bundle Archivo. */
export const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  display: '"Archivo", var(--sk-font-sans)',
} as const

/** Type scale (px). Keys map to `--sk-text-*`. */
export const fontSizes = {
  xs: '11px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '24px',
  '3xl': '34px',
} as const

/** Font weights → `--sk-weight-*`. */
export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
  black: 900,
} as const

/** Letter-spacing → `--sk-tracking-*`. */
export const tracking = {
  tight: '-0.02em',
  normal: '0',
  eyebrow: '0.22em',
} as const

/** Line-height → `--sk-leading-*`. */
export const leading = {
  tight: 1.02,
  normal: 1.5,
} as const

/** Spacing scale (px) → `--sk-space-*`. */
export const space = {
  1: '4px',
  2: '6px',
  3: '8px',
  4: '12px',
  5: '16px',
  6: '20px',
  7: '24px',
  8: '32px',
} as const

/** Corner radii → `--sk-radius-*`. */
export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  pill: '999px',
} as const

/** Motion → `--sk-duration-*` and `--sk-ease`. */
export const motion = {
  duration: {
    fast: '120ms',
    base: '200ms',
  },
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const

/**
 * Stacking order → `--sk-z-*`. Higher sits above lower. The scale is monotonic so a surface that
 * can open *inside* a dialog (a Select/Menu/Combobox dropdown, a tooltip) renders above it:
 * `dialog` < `popover` < `toast` < `tooltip`.
 */
export const zIndex = {
  dialog: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const

/** Everything, for consumers who want tokens in JS. */
export const tokens = {
  colors,
  shadows,
  fonts,
  fontSizes,
  fontWeights,
  tracking,
  leading,
  space,
  radius,
  motion,
  zIndex,
} as const

export type Tokens = typeof tokens
