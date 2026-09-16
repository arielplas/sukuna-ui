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
  // size comes from your className/style (e.g. className="h-4 w-40")
}
```

## 4. Variants → tokens

Base: `animate-pulse bg-surface-2`. text → `rounded-sm h-[1em]`; rectangular → `rounded-md`;
circular → `rounded-full`.

## 5. States

Static; always pulsing while mounted.

## 6. Logic (`skeleton.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLDivElement>`. `aria-hidden="true"` (decorative); wrap the
  loading region in your own `aria-busy` container.

## 7. Styles (`skeleton.styles.tsx`)

`tv()` with a `variant`; `defaultVariants: { variant: 'rectangular' }`.

## 8. Accessibility checklist

- [ ] Decorative (`aria-hidden`); convey loading via a container `aria-busy`/`role="status"`.

## 9. Tests

Renders each variant class; `aria-hidden`; ref; `className` sizing merges; SSR; axe both themes.

## 10. Stories

`Text`, `Rectangular`, `Circular`, `Card`.

## 11. Decisions

- Size is the consumer's (`className`/`style`); no width/height props.
