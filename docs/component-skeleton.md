# Component: Skeleton

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

A placeholder shimmer shown while content loads.

## 2. Files

```
src/components/skeleton/
├── skeleton.styles.tsx
├── skeleton.logic.tsx   # forwardRef; NO 'use client'.
├── skeleton.test.tsx
├── skeleton.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'text' | 'rectangular' | 'circular'   // default 'rectangular'
  animation?: 'pulse' | 'shimmer'                 // default 'pulse'
  // size comes from your className/style (e.g. className="h-4 w-40")
}
```

## 4. Variants → tokens

Base: `motion-reduce:animate-none bg-surface-2`. text → `rounded-sm h-[1em]`; rectangular →
`rounded-md`; circular → `rounded-full`.

| animation | utilities |
|---|---|
| pulse | `animate-pulse` (default — the original) |
| shimmer | `animate-shine-fast` (ShinyText's `sk-shine` keyframe) + `bg-linear-[110deg] from-transparent from-40% via-on-accent/15 via-50% to-transparent to-60% bg-[length:200%_100%]` — the band is `on-accent` (white in both themes) so it reads as a highlight on light and dark |

The animation class lives in the variant, not the base, because tailwind-merge can't dedupe the
custom `animate-shine-fast` against `animate-pulse`.

## 5. States

Static; animating while mounted (pulse or shimmer), frozen under `prefers-reduced-motion`.

## 6. Logic (`skeleton.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLDivElement>`. `aria-hidden="true"` (decorative); wrap the
  loading region in your own `aria-busy` container.

## 7. Styles (`skeleton.styles.tsx`)

`tv()` with `variant` + `animation`; `defaultVariants: { variant: 'rectangular', animation: 'pulse' }`.

## 8. Accessibility checklist

- [ ] Decorative (`aria-hidden`); convey loading via a container `aria-busy`/`role="status"`.

## 9. Tests

Renders each variant class; `aria-hidden`; ref; `className` sizing merges; SSR; axe both themes.

## 10. Stories

`Text`, `Rectangular`, `Circular`, `Shimmer`, `Card`.

## 11. Decisions

- Size is the consumer's (`className`/`style`); no width/height props.
- `animation: 'shimmer'` (post-0.8.0) reuses the `sk-shine` keyframe shipped for ShinyText rather
  than adding a second one; `pulse` stays the default.
