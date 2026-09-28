# Theming — sukuna-ui

Design for multi-theme support (owner request 2026-09-27, `docs/questions.md` Q24). **Status:
designed, not built** — roadmap §D7. Values here are the spec; `src/themes/*.ts` becomes the
source of truth once built.

## Goals

- Ship **four built-in themes**: `dark` (default), `light`, and two new ones that keep the Sukuna
  identity (crimson accent, same shape/spacing/type): **`midnight`** (dark, cool) and **`paper`**
  (light, warm).
- A **`system`** mode that follows the OS light/dark preference.
- Let apps **define their own themes** in a typed config file, created on demand and compiled to
  CSS at build time — zero runtime, SSR-safe, contrast-checked.
- No breaking change: every existing `data-theme="dark" | "light"` page renders identically, and a
  page with no `data-theme` stays dark.

## Built-in themes

A theme = `scheme` (`'dark' | 'light'`, drives CSS `color-scheme`) + an optional `extends` (a built-in
theme to inherit from) + the color/shadow tokens it overrides. `dark` and `light` are complete;
`midnight` extends `dark`, `paper` extends `light`.

### midnight — dark, cool blue-black

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `bg` | `#0A0D14` | | `text` | `#EEF1F6` |
| `surface` | `#111520` | | `text-dim` | `#98A0B0` |
| `surface-2` | `#192030` | | `text-faint` | `#8A93A5` |
| `well` | `#05070B` | | `success` | `#34CF80` |
| `line` | `rgba(160, 180, 255, 0.12)` | | `premium` | `#E4DCC8` |
| `line-soft` | `rgba(160, 180, 255, 0.07)` | | `premium-dim` | `#B3AA92` |
| `accent` / `focus-ring` | `#FF4D5E` | | `accent-glow` | `rgba(255, 77, 94, 0.55)` |
| `shadow-card` | `0 30px 60px -24px rgba(0, 4, 16, 0.9), 0 0 0 1px rgba(160, 180, 255, 0.07)` | | | |

Inherited from `dark`: `accent-deep`, `on-accent`, `gradient-accent`.

### paper — light, warm cream

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `bg` | `#F4EEE2` | | `text` | `#1E1A14` |
| `surface` | `#FBF7EF` | | `text-dim` | `#5A5246` |
| `surface-2` | `#EAE2D2` | | `text-faint` | `#6A6254` |
| `well` | `#E0D6C3` | | `success` | `#17733F` |
| `line` | `rgba(60, 40, 10, 0.14)` | | `premium` | `#6E5E3C` |
| `line-soft` | `rgba(60, 40, 10, 0.07)` | | `premium-dim` | `#6D5E3E` |
| `accent` / `focus-ring` | `#C21F33` | | `accent-deep` | `#8E0E1B` |
| `accent-glow` | `rgba(194, 31, 51, 0.3)` | | `gradient-accent` | `linear-gradient(135deg, #C21F33, #8E0E1B)` |
| `shadow-card` | `0 20px 40px -24px rgba(60, 40, 10, 0.3), 0 0 0 1px rgba(60, 40, 10, 0.08)` | | | |

Inherited from `light`: `on-accent`.

**Contrast (WCAG AA, measured at design time):** midnight — text/bg 17.17, text-dim/surface 6.94,
text-faint/surface-2 5.27, accent/bg 5.99, white on gradient 4.95; paper — text/bg 14.98,
text-dim/surface 7.20, text-faint/surface-2 4.68, accent/bg 5.14, white on gradient 5.94. All pass;
the contrast gate enforces it for every theme once built.

## System mode

`data-theme="system"` follows `prefers-color-scheme`: `dark` by default, `light` under an OS light
preference. It is opt-in — **no attribute stays dark** (changing that default would be a visible
change for existing apps, a major on the Q6 table). Apps can pick which pair `system` uses in their
config (`system: { dark: 'midnight', light: 'paper' }`). CSS only: a
`@media (prefers-color-scheme: light) { [data-theme='system'] { … } }` block.

## Architecture (library)

```
src/themes/
├── types.ts        # ThemeDefinition, ColorTokens, ThemeName, defineThemes() (identity + types)
├── dark.ts         # complete palette (moved from src/tokens.ts `colors.*.dark`)
├── light.ts        # complete palette
├── midnight.ts     # { scheme: 'dark', extends: 'dark', colors: {…}, shadows: {…} }
├── paper.ts        # { scheme: 'light', extends: 'light', colors: {…}, shadows: {…} }
├── resolve.ts      # extends → a complete palette; shared by the build script and the CLI
├── contrast.ts     # WCAG math (moved out of tokens.contrast.test.ts); shared by test + CLI
└── index.ts        # builtInThemes registry + public exports
```

- `src/tokens.ts` keeps the theme-independent tokens (type, spacing, radius, motion, z-index); the
  `colors` / `shadows` `Themed` records move into the theme files.
- `scripts/build-tokens.ts` emits, for `tokens.css` and `theme.css`: the default block
  `:root, [data-theme='dark']` (static tokens + dark colors), then one **fully resolved** block per
  other theme (`[data-theme='light'] { color-scheme: light; … }`, `midnight`, `paper`), then the
  `system` media block. Resolved blocks (not cascade-dependent) so nested `data-theme` regions
  always work. The Tailwind `@theme inline` mapping is unchanged.
- `src/tokens.contrast.test.ts` iterates `builtInThemes` instead of `['dark', 'light']`.

## Custom themes (apps)

### The config file

`sukuna.themes.ts` at the app root (also accepted: `.mts`, `.js`, `.mjs`):

```ts
import { defineThemes } from 'sukuna-ui/themes'

export default defineThemes({
  // Optional: which themes data-theme="system" switches between.
  system: { dark: 'midnight', light: 'paper' },
  // Optional: where `themes build` writes the CSS (relative to this file).
  out: './sukuna-themes.css',
  themes: {
    brand: {
      extends: 'dark', // any built-in: dark | light | midnight | paper
      colors: { accent: '#7C5CFF', 'focus-ring': '#7C5CFF', 'accent-glow': 'rgba(124, 92, 255, 0.55)' },
    },
  },
})
```

`defineThemes` is a typed identity function: the `colors` keys autocomplete and a typo fails
type-checking. `sukuna-ui/themes` is a new, side-effect-free subpath (types + built-in theme data).

### The CLI (`sukuna-ui` bin)

| Command | Does |
|---|---|
| `bunx sukuna-ui themes init` | Writes a commented starter `sukuna.themes.ts` **only if none exists** (never overwrites; says so and exits 0). |
| `bunx sukuna-ui themes build` | Loads the config, resolves each theme via `extends`, writes `sukuna-themes.css` with one `[data-theme='<name>']` block per theme (+ the `system` block if configured), and **warns** for every token pair below AA using the same contrast rules as the library gate. `--strict` turns warnings into a non-zero exit (for CI). |

Consumers then `@import "sukuna-ui/theme.css"; @import "./sukuna-themes.css";` (or the non-Tailwind
`styles.css` + the generated file) and set `<html data-theme="brand">`.

Runtime note: the bin is plain ESM JS (built by tsup) so it runs under `bunx` or `npx`. Loading a
`.ts` config needs Bun or Node ≥ 22.18 (native type stripping); on older Node use `.mjs`.
`// DECISION(open)` — revisit if consumers need older Node + TS configs (would add a loader dep).

## Consumer-facing surface (semver)

| Added | Kind |
|---|---|
| `data-theme="midnight" \| "paper" \| "system"` | new CSS entries → minor |
| `sukuna-ui/themes` subpath: `defineThemes`, `ThemeDefinition`, `ColorTokens`, `builtInThemes` | new export → minor |
| `sukuna-ui` bin: `themes init`, `themes build` | new → minor |
| `color-scheme` set per theme block | fix toward native controls matching the theme → patch-level, folded into the minor |

Nothing renamed or removed; `dark`/`light` values are byte-identical.

## Also updated when built

Storybook theme toolbar (all four + system), the showcase theme toggle (becomes a picker),
`docs/tokens.md` (midnight/paper columns), README theming section, `docs:build` output.

## Tests (gate)

- Unit: resolver (`extends` chains, override wins, unknown base errors); generator emits a block per
  theme with `color-scheme`; contrast gate passes for all four; `defineThemes` types (tsd-style
  `@ts-expect-error` on a bad key); CLI `init` creates once and never overwrites; `build` writes the
  expected selectors, applies `system`/`out`, warns on a failing color, `--strict` exits non-zero.
- Browser: a story under `data-theme="midnight"` / `"paper"` renders the palette background;
  `data-theme="system"` flips with emulated `prefers-color-scheme`.
- `check:pkg` covers the new `./themes` subpath and the bin.
