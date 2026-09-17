# Component: Breadcrumbs

> Follows the `docs/component-button.md` template. Static component — no `'use client'`.

## 1. Purpose

Show the path to the current page and let users jump back up it.

## 2. Files

```
src/components/breadcrumbs/
├── breadcrumbs.styles.tsx   # tv() slots: root, list, item, link, current, separator.
├── breadcrumbs.logic.tsx    # forwardRef<nav>; NO 'use client'.
├── breadcrumbs.test.tsx
├── breadcrumbs.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface BreadcrumbItem { label: ReactNode; href?: string; current?: boolean }

export interface BreadcrumbsProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  items: BreadcrumbItem[]
  separator?: ReactNode   // default '/'
}
```

## 4. Variants → tokens

root: `<nav>`; list: `flex items-center gap-2 text-sm`; link: `text-text-dim hover:text-text
transition-colors focus-visible:ring-2 focus-visible:ring-accent-glow rounded-sm`; current:
`text-text font-medium`; separator: `text-text-faint select-none`.

## 5. States

Static; links hover/focus.

## 6. Logic (`breadcrumbs.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLElement>`. `<nav aria-label>` (default "Breadcrumb") → `<ol>`
  → `<li>` per item: an `<a href>` (or `<span aria-current="page">` for the current) + a separator
  between items.

## 7. Styles

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] `<nav aria-label="Breadcrumb">` around an ordered list.
- [ ] Current page marked `aria-current="page"` and not a link.
- [ ] Separators are decorative (`aria-hidden`).

## 9. Tests

Renders a labelled nav + ordered list; links for `href`, `aria-current` for current; separators
decorative; ref; className; SSR; axe both themes.

## 10. Stories

`Default`, `CustomSeparator`, `LongTrail`.

## 11. Decisions

- Renders plain `<a href>` (not a router Link); wrap items yourself for client routing.
