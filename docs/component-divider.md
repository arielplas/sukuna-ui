# Component: Divider

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

A thin rule that separates content, horizontally or vertically.

## 2. Files

```
src/components/divider/
├── divider.styles.tsx
├── divider.logic.tsx   # forwardRef; NO 'use client'.
├── divider.test.tsx
├── divider.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface DividerProps extends ComponentPropsWithoutRef<'div'> {
  orientation?: 'horizontal' | 'vertical'   // default 'horizontal'
  decorative?: boolean   // if true: aria-hidden, no separator role
}
```

## 4. Variants → tokens

Base: `border-line`. horizontal → `w-full border-t`; vertical → `h-full self-stretch border-l`.

## 5. States

Static; no interactive states.

## 6. Logic (`divider.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLDivElement>`.
- Non-decorative: `role="separator"` + `aria-orientation`. Decorative: `aria-hidden`, no role.

## 7. Styles (`divider.styles.tsx`)

`tv()` with an `orientation` variant; `defaultVariants: { orientation: 'horizontal' }`.

## 8. Accessibility checklist

- [ ] Non-decorative dividers expose `role="separator"` + `aria-orientation`.
- [ ] Purely visual dividers set `decorative` so AT ignores them.
- [ ] Line meets ≥ 3:1 against the surface where it conveys structure.

## 9. Tests

Renders separator role + orientation; `decorative` removes the role and sets `aria-hidden`;
`className` merges; ref forwards; SSR; axe both themes.

## 10. Stories

`Horizontal`, `Vertical`, `InText`, `Decorative`.

## 11. Decisions

- Rendered as a `<div role="separator">` (not `<hr>`) so vertical orientation works uniformly.
