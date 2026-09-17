# Component: Pagination

> Follows the `docs/component-button.md` template. Static component — no `'use client'`
> (controlled via `page` + `onPageChange`; holds no state).

## 1. Purpose

Navigate between pages of results, with first/last always shown and ellipses in between.

## 2. Files

```
src/components/pagination/
├── pagination.styles.tsx   # tv() slots: root, list, item, page, ellipsis, nav.
├── pagination.logic.tsx    # forwardRef<nav>; NO 'use client'. Range helper.
├── pagination.test.tsx
├── pagination.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  page: number            // current page, 1-based
  count: number           // total pages
  onPageChange?: (page: number) => void
  siblingCount?: number   // pages shown around current (default 1)
}
```

## 4. Variants → tokens

page button: `size-9 rounded-md text-sm text-text-dim hover:bg-line-soft data-[active]:bg-surface-2
data-[active]:text-text focus-visible:ring-2 focus-visible:ring-accent-glow`; nav (prev/next):
same + `disabled:opacity-45`; ellipsis: `text-text-faint`.

## 5. States

page: default · hover · active (`aria-current="page"`). prev/next disabled at the bounds.

## 6. Logic (`pagination.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLElement>`. `<nav aria-label>` (default "Pagination") → `<ul>`
  with Previous, page buttons / ellipses (via a pure range helper), Next. Buttons call
  `onPageChange`.

## 7. Styles

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] `<nav aria-label="Pagination">`; current page `aria-current="page"`.
- [ ] Prev/Next have labels and are `disabled` at the ends.
- [ ] Ellipses are inert text, not buttons.

## 9. Tests

Renders page buttons + prev/next; clicking a page / prev / next calls `onPageChange`; prev disabled
on page 1, next disabled on last; ellipses appear for large counts (range helper branches); current
marked; SSR; axe.

## 10. Stories

`Default`, `ManyPages`, `FirstPage`, `LastPage`.

## 11. Decisions

- Controlled only (`page` + `onPageChange`); no internal state → stays RSC-safe.
