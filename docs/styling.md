# Styling — `sukuna-ui`

Zero-runtime styling with **Tailwind v4 + `tailwind-variants`**, mapped to `--sk-*` tokens.
No CSS-in-JS, no per-component `.css` files. Themes switch with `data-theme`, not `dark:`.

## The engine decision

Chosen for a published, SSR-capable library: works with one CSS import, SSRs with zero runtime,
tokens overridable via CSS vars, and RSC-safe (static components carry no `'use client'`).

| # | Option | Runtime | SSR/RSC | Consumer setup | Token override | Verdict |
|---|---|---|---|---|---|---|
| 1 | Plain CSS + vars + `cva` | 0 | ✅ | one CSS import | ✅ redefine `--sk-*` | Safe; not chosen |
| 2 | Vanilla Extract | 0 | ✅ | one CSS import | ✅ typed contract | Strong alt; `*.css.ts` |
| 3 | **Tailwind v4 + `tailwind-variants`** | 0 | ✅ | Tailwind + `@import`/`@source`, or precompiled fallback | ✅ `@theme` + `--sk-*` | **CHOSEN** |
| 4 | Panda CSS | 0 | ✅ | Panda in consumer build | ⚠️ | Poor library story |
| 5 | StyleX | 0 | ✅ | compiler plugin | ⚠️ | Poor library story |
| 6 | Linaria / Pigment | 0 | ✅ | one CSS import | ⚠️ | Viable, small ecosystem |
| 7 | styled-components / Emotion | JS runtime | ⚠️ registry, forces `'use client'` | per-framework | ❌ Reject |

## How consumers use it

**Tailwind consumers (primary path)** — two lines in their global CSS:

```css
@import "tailwindcss";
@import "sukuna-ui/theme.css";                 /* @theme tokens + data-theme palettes */
@source "../node_modules/sukuna-ui/dist";      /* so their build emits our utilities */
```

We ship no compiled component CSS on this path; their Tailwind generates exactly the classes used.

**Non-Tailwind consumers (fallback path)** — import the precompiled sheet:

```css
@import "sukuna-ui/styles.css";
```

Second-class: not purged, tokens overridable only via `--sk-*` vars.

**Raw tokens only** — `@import "sukuna-ui/tokens.css";` for the plain `--sk-*` custom properties.

Switch theme at runtime by setting `data-theme="dark"` (default) or `"light"` on any ancestor.
Override any token by redefining `--sk-*` under your own selector.

## Files

| File | Role |
|---|---|
| `src/tokens.ts` | Source of truth (typed). |
| `src/styles/tokens.css` | **Generated.** Raw `--sk-*` palettes (dark + light). Plain CSS. |
| `src/styles/theme.css` | **Generated.** Palettes + `@theme inline` mapping + `bg-gradient-accent` utility. Ships as `sukuna-ui/theme.css`. |
| `src/styles/reset.css` | Minimal, `:where()`-scoped under `[data-theme]`. |
| `src/styles/index.css` | Raw path aggregate: tokens + reset. |
| `src/styles/fallback.css` | Compiled by `css:build` → `dist/styles.css`. |
| `src/styles/storybook.css` | Tailwind + theme for the Storybook preview. |
| `src/utils/tw-merge-config.ts` | Shared `tailwind-merge` extension (font-size group). |
| `src/utils/cn.ts` | `twMerge(clsx(...))`. |
| `src/utils/tv.ts` | `tailwind-variants` `tv` + `VariantProps`, using the same merge config. |

`bun run tokens:build` regenerates `tokens.css` + `theme.css`; `bun run css:build` compiles the
fallback and copies both to `dist/`. `bun run build` runs both.

## The `.styles.tsx` pattern

Every component's styles file looks identical: import `tv`, enumerate variants as **static**
class strings, export the map and its `VariantProps`. Pure and server-safe — no hooks, no DOM,
no `'use client'`.

```tsx
import { tv, type VariantProps } from '../../utils/tv'

export const buttonStyles = tv({
  base: ['inline-flex items-center justify-center', 'font-display font-bold tracking-tight'],
  variants: {
    variant: { primary: 'bg-gradient-accent text-text', secondary: 'bg-surface-2 text-text border border-line' },
    size: { sm: 'h-8 px-3 text-sm rounded-sm', md: 'h-10 px-5 text-md rounded-md' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
export type ButtonStyleProps = VariantProps<typeof buttonStyles>
```

Rules:

- **Never interpolate class names** (`bg-${x}`). Tailwind scans source text; every utility must
  appear literally. Enumerate them in `tv()` variants.
- Colors/radius/shadow/duration/tracking come from the `@theme` mapping (`bg-surface`, `text-text`,
  `rounded-lg`, `duration-fast`, `ease-sukuna`, `shadow-card`, `tracking-tight`). Never raw hex.
- Spacing uses Tailwind's default numeric scale (`h-10`, `px-5`, `gap-2`) — see the note below.
- A consumer `className`/`class` merges last and wins (`tv` runs `tailwind-merge` via our config).

### Spacing is Tailwind's default scale, not `--sk-space`

The `@theme` mapping deliberately does **not** remap Tailwind's spacing namespace. Component
specs (e.g. the Button doc) use Tailwind's default numeric utilities — `h-8`/`h-10`/`h-12`
(= 32/40/48px), `px-3`/`px-5`, `gap-2` — which already hit the Sukuna pixel targets. Remapping
`--spacing` to the 1–8 token scale would break those. The `--sk-space-*` tokens remain available
as CSS variables for the rare case that needs them. (See `docs/ai-decisions.md`.)
