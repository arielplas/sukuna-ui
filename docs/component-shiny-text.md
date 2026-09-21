# Component: ShinyText

> Follows the `docs/component-button.md` section template. **Static** component — no `'use client'`.
> The shimmer is a pure CSS keyframe; no hooks, no DOM access, RSC-safe.

## 1. Purpose

Sweeps a soft light band across dimmed text — for "New" flags, premium labels, and subtle CTA
emphasis. Pure CSS animation, so it works in Server Components. The base text is legible on its own;
the sheen is decorative and honors `prefers-reduced-motion`.

## 2. Files

```
src/components/shiny-text/
├── shiny-text.styles.tsx   # tv() variant map → Tailwind utilities. Pure. Server-safe.
├── shiny-text.logic.tsx    # forwardRef; NO 'use client' (CSS-only animation, RSC-safe).
├── shiny-text.test.tsx
├── shiny-text.stories.tsx
└── index.tsx               # export { ShinyText } ; export type { ShinyTextProps }
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export type ShinyTextElement = 'span' | 'p' | 'div' | 'strong'

interface ShinyTextOwnProps {
  as?: ShinyTextElement                 // default 'span'
  speed?: 'slow' | 'normal' | 'fast'    // default 'normal' — enum, not a raw duration (rule #7)
  children: ReactNode
}

export type ShinyTextProps =
  ShinyTextOwnProps & Omit<ComponentPropsWithoutRef<'span'>, 'color'>
```

Deliberately **not** in v1: `disabled` (manual freeze — deferred; `animate-shine` is a custom
utility tailwind-merge doesn't know, so a `disabled → animate-none` variant risks an unresolved
cascade conflict; `motion-reduce` already covers the a11y need), arbitrary duration/delay numbers
(enum keeps class names literal), configurable sheen color or angle (fixed to the on-brand light
band), gradient-fill text (that's `GradientText`). `color` omitted so it can't fight the clipped
sheen.

## 4. Variants → tokens

| Variant | Values → utility |
|---|---|
| speed | slow → `animate-shine-slow` · normal → `animate-shine` · fast → `animate-shine-fast` |

Base clips a dim→bright→dim gradient to the text and reveals it with
`-webkit-text-fill-color: transparent`, over a real `text-dim` fallback color. The keyframe + utilities
were added to the theme layer via `scripts/build-tokens.ts` (emitted into the generated `theme.css`),
all with literal class names:

```css
@keyframes sk-shine {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
@utility animate-shine      { animation: sk-shine 3s linear infinite; }
@utility animate-shine-slow { animation: sk-shine 6s linear infinite; }
@utility animate-shine-fast { animation: sk-shine 1.6s linear infinite; }
```

No new **color** token needed — the band is built from `--sk-text-dim` (base) and `--sk-text`
(highlight). Durations are the proposed values in owner question Q13 (tunable, patch pre-1.0).

## 5. States

| State | Behavior |
|---|---|
| default | light band sweeps across the text on a loop (linear). |
| prefers-reduced-motion | `motion-reduce:animate-none` — the sheen freezes; the dimmed base text stays fully legible. |

## 6. Logic (`shiny-text.logic.tsx`)

- No `'use client'` — the animation is CSS; the component is a pure render.
- `forwardRef<HTMLElement, ShinyTextProps>`; `const Component = as ?? 'span'`.
- Destructure `as`/`speed` out of `rest`; spread remaining native props.
- `className` merges last via `shinyTextStyles`.
- No hooks, no `window`/`document`.

## 7. Styles (`shiny-text.styles.tsx`)

```ts
import { tv, type VariantProps } from '../../utils/tv'

export const shinyTextStyles = tv({
  base: [
    'inline-block bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
    'text-dim', // legible fallback + reduced-motion resting color
    'bg-[linear-gradient(110deg,var(--sk-text-dim)_40%,var(--sk-text)_50%,var(--sk-text-dim)_60%)]',
    'bg-[length:200%_100%]',
    'motion-reduce:animate-none',
  ],
  variants: {
    speed: {
      slow: 'animate-shine-slow',
      normal: 'animate-shine',
      fast: 'animate-shine-fast',
    },
  },
  defaultVariants: { speed: 'normal' },
})
export type ShinyTextStyleProps = VariantProps<typeof shinyTextStyles>
```

The gradient never uses a transparent stop (dim → bright → dim), so the full text is always painted —
`-webkit-text-fill-color: transparent` reveals it while `text-dim` stays as the real fallback color.
The arbitrary values are literal strings referencing `--sk-*` (rules #7/#8). `animate-shine*` utilities
come from the theme layer (§4).

## 8. Accessibility checklist

- [ ] Real, selectable text — the sheen is `aria`-neutral decoration, not content.
- [ ] `prefers-reduced-motion` freezes the animation (`motion-reduce:animate-none`); verified in a
      browser test alongside the other reduced-motion components.
- [ ] The resting/base color is `text-dim`, which clears 4.5:1 on `--sk-bg`/`--sk-surface` in both
      themes — text is never below-contrast when the band isn't over it.
- [ ] `-webkit-background-clip: text` prefix included; solid `text-dim` shows if clip is unsupported.
- [ ] No flashing faster than 3/s (WCAG 2.3.1) — the slowest visible cycle is the sweep, not a flash.

## 9. Tests

- Server render (`renderServer`) of each `speed` and `as` without throwing (static).
- Applies `animate-shine*` per `speed`; base always carries `motion-reduce:animate-none`.
- `children` render as real text (`textContent` matches).
- `as`/`speed` never leak to the DOM; native props pass through.
- Forwards `ref`; consumer `className` wins.
- axe: zero violations in both themes.
- (Follow-up) Browser Playwright reduced-motion guard — not yet added; the base carries
  `motion-reduce:animate-none`, asserted in the unit test.

## 10. Stories

`Playground`, `Speeds`, `OnLabel` (an eyebrow/label context). Both themes via the toolbar.

## 11. Decisions

- **CSS-only, no `'use client'`** — keeps it RSC-safe and dependency-free (no GSAP/Framer, unlike the
  React Bits original).
- `speed` is an **enum** mapping to literal `animate-shine*` utilities (rule #7); no raw duration
  prop.
- Keyframe `sk-shine` + `animate-shine*` utilities were added to the theme layer via
  `scripts/build-tokens.ts` (motion utilities, no new color token); durations are the proposed
  values pending owner confirmation (Q13, tunable pre-1.0).
- **`disabled` deferred** — `animate-shine` is a custom utility tailwind-merge doesn't dedupe against
  `animate-none`, so a freeze variant risks a cascade conflict; `motion-reduce` covers the a11y need.
- Base color fixed to `text-dim` for guaranteed contrast at rest.
