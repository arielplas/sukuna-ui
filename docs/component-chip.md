# Component: Chip

> Follows the `docs/component-button.md` template. Static component — no `'use client'`
> (the optional dismiss button just forwards the consumer's handler; Chip holds no state).

## 1. Purpose

A compact token for filters, selections, or tags — optionally removable. (For a non-removable
status pill, use Badge.)

## 2. Files

```
src/components/chip/
├── chip.styles.tsx   # tv() slots: root, dismiss.
├── chip.logic.tsx    # forwardRef; NO 'use client'.
├── chip.test.tsx
├── chip.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface ChipProps extends ComponentPropsWithoutRef<'span'> {
  tone?: 'neutral' | 'accent' | 'success' | 'premium'   // default 'neutral'
  variant?: 'soft' | 'solid' | 'outline'                 // unset = each tone's original look (same map as Badge)
  selected?: boolean                                     // active filter: accent border + text (visual, via data-selected)
  size?: 'sm' | 'md'                                     // default 'md'
  leadingIcon?: ReactNode
  onDismiss?: () => void      // renders a × remove button
  dismissLabel?: string       // aria-label for the remove button (default 'Remove')
}
```

## 4. Variants → tokens

Root: `inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap` +
`data-[selected]:border-accent data-[selected]:text-accent`. tone × variant → the same literal
compound map as Badge (see `docs/component-badge.md` §4); unset `variant` keeps the original
per-tone look. size sm `h-6 px-2 text-xs` / md `h-7 px-2.5 text-sm`. dismiss button: `rounded-sm
opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-focus-ring`.

## 5. States

| State | Behavior |
|---|---|
| default | static; the dismiss button is a native `<button>` (keyboard/focus for free) |
| selected | `data-selected` → accent border + accent text; the attribute selector beats the tone colors. Visual only — the click/toggle lives on a wrapping Button/Link (or use `ToggleGroup`). |

## 6. Logic (`chip.logic.tsx`)

- No `'use client'`. `forwardRef<HTMLSpanElement>`.
- Renders optional `leadingIcon`, `children`, and — when `onDismiss` is set — a trailing
  `<button aria-label={dismissLabel}>` calling it.

## 7. Styles (`chip.styles.tsx`)

`tv()` with `slots: { root, dismiss }` + `tone`/`size` variants.

## 8. Accessibility checklist

- [ ] Remove button has an `aria-label` (default "Remove"); it's a real `<button>`.
- [ ] Tone conveyed by text, not color alone.
- [ ] Text/border contrast ≥ 4.5:1 / 3:1 in both themes.

## 9. Tests

Renders tone × size; leading icon slot; dismiss button appears only with `onDismiss` and calls it
on click; no leak; ref; className; SSR; axe both themes.

## 10. Stories

`Tones`, `Variants` (tone × soft/solid/outline grid), `Selected (filter chips)`, `Sizes`,
`Dismissible`, `WithIcon`.

## 11. Decisions

- Dismiss is opt-in via `onDismiss` and stateless (consumer owns removal); Chip stays RSC-safe.
- `variant` (post-0.8.0) has no public default — unset keeps the mixed original look, so it's
  non-breaking; same map as Badge.
- `selected` is a visual state, not a toggle: Chip remains a non-focusable span (RSC-safe). A
  real, keyboard-operable toggle is `ToggleGroup`; `selected` serves custom filter UIs where the
  chip sits inside a Button/Link.
