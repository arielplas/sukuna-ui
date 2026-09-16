# Component: Spinner

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

An indeterminate loading indicator (CSS spin).

## 2. Files

```
src/components/spinner/
├── spinner.styles.tsx
├── spinner.logic.tsx   # forwardRef; NO 'use client'.
├── spinner.test.tsx
├── spinner.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface SpinnerProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  size?: 'sm' | 'md' | 'lg'   // default 'md'
  label?: string              // accessible name, default 'Loading'
}
```

## 4. Variants → tokens

Wrapper: `inline-flex text-accent` (crimson by default; override via `className`). SVG:
`animate-spin` + size sm `size-4` / md `size-5` / lg `size-6`; strokes use `currentColor`.

## 5. States

Static; always spinning while mounted.

## 6. Logic (`spinner.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLSpanElement>`.
- `<span role="status" aria-label={label}>` wrapping an `aria-hidden` spinning `<svg>`.
- Wrapper class = `cn('inline-flex text-accent', className)` so a consumer can recolor via text-*.

## 7. Styles (`spinner.styles.tsx`)

`tv()` on the SVG with a `size` variant (`animate-spin` + `size-*`); `defaultVariants: { size: 'md' }`.

## 8. Accessibility checklist

- [ ] `role="status"` + `aria-label` announces loading; the SVG is `aria-hidden`.
- [ ] Motion is decorative; respect reduced-motion at the app level if needed.

## 9. Tests

`role="status"` + default/custom label; size class on the SVG; ref; `className` recolors; SSR; axe.

## 10. Stories

`Sizes`, `Inline`, `Recolored`.

## 11. Decisions

- Color defaults to `--sk-accent`; recolor by passing a `text-*` utility in `className`.
