# Component: Badge

> Follows the `docs/component-button.md` section template. Static component — no `'use client'`.

## 1. Purpose

A small, pill-shaped label for status and metadata — "LIVE", counts, tags. Not interactive; if a
badge needs to be clickable it belongs inside a Button or Link.

## 2. Files

```
src/components/badge/
├── badge.styles.tsx
├── badge.logic.tsx   # forwardRef; NO 'use client'.
├── badge.test.tsx
├── badge.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  tone?: 'neutral' | 'accent' | 'success' | 'premium'  // default 'neutral'
  size?: 'sm' | 'md'                                    // default 'md'
  dot?: boolean   // leading status dot in currentColor
}
```

Extends `<span>`; adds only `tone`, `size`, `dot`. Pill radius is fixed (not a prop).

## 4. Variants → tokens

| tone | utilities |
|---|---|
| neutral | `bg-surface-2 text-text-dim border border-line` |
| accent | `bg-gradient-accent text-text border border-transparent` |
| success | `bg-surface-2 text-success border border-line` |
| premium | `bg-surface-2 text-premium border border-line` |

| size | utilities |
|---|---|
| sm | `h-5 px-2 text-xs gap-1` |
| md | `h-6 px-2.5 text-sm gap-1.5` |

Base: `inline-flex items-center justify-center rounded-pill font-semibold whitespace-nowrap select-none align-middle`. Dot: `inline-block size-1.5 rounded-full bg-current shrink-0`, `aria-hidden`.

## 5. States

Static; no interactive states.

## 6. Logic (`badge.logic.tsx`)

- No `'use client'`.
- `forwardRef<HTMLSpanElement, BadgeProps>`.
- Destructure `tone`, `size`, `dot`, `className`, `children` out; spread the rest onto `<span>`.
- When `dot`, render a leading `<span aria-hidden="true">` dot before `children`.

## 7. Styles (`badge.styles.tsx`)

`tv()` with `tone` and `size` variants; `defaultVariants: { tone: 'neutral', size: 'md' }`. Dot
class is a static string exported alongside.

## 8. Accessibility checklist

- [ ] The dot is decorative (`aria-hidden`); status is conveyed by the text, never color/dot alone.
- [ ] `accent` text on the crimson gradient meets contrast in both themes (shares the Button
      primary treatment; verify).
- [ ] Not a `button`/`a` — no role, not focusable. Clickable status → wrap in Button/Link.
- [ ] Text contrast ≥ 4.5:1 for every tone in both themes.

## 9. Tests

- Renders every `tone` × `size` on the server without throwing.
- `dot` renders exactly one `aria-hidden` dot; without `dot`, none.
- Variant props never leak to the DOM.
- Forwards `ref` to the `<span>`.
- Native props pass through (`id`, `data-*`, `aria-label`).
- Consumer `className` wins over a conflicting utility.
- Hydrates cleanly; axe passes in both themes.

## 10. Stories

`Playground`, `Tones`, `Sizes`, `WithDot`, `Live`, `InText`. Both themes via toolbar.

## 11. Decisions

- Pill radius fixed (not a prop): badges are always fully rounded in Sukuna.
- `dot` uses `currentColor`, not a separate color prop (kept minimal for v1).
- No `count`/number formatting helper in v1 (pass the string yourself).
