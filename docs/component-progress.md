# Component: Progress

> Follows the `docs/component-button.md` template. Headless-backed (Base UI `progress`). No
> `'use client'` — display only.

## 1. Purpose

A horizontal progress bar, determinate or indeterminate.

## 2. Files

```
src/components/progress/
├── progress.styles.tsx   # tv() slots: root, label, track, indicator.
├── progress.logic.tsx    # composes Base UI parts; no 'use client'.
├── progress.test.tsx
├── progress.stories.tsx
└── index.tsx
```

## 3. API

```ts
export interface ProgressProps {
  value?: number | null   // 0..max; null/omitted → indeterminate
  max?: number            // default 100
  label?: ReactNode
  size?: 'sm' | 'md' | 'lg'   // default 'md'
  className?: string
  'aria-label'?: string
}
```

## 4. Variants → tokens

track: `overflow-hidden rounded-pill bg-surface-2`, size sm `h-1.5` / md `h-2` / lg `h-3`. indicator:
`bg-accent rounded-pill transition-[width]`; indeterminate → `w-1/3 animate-pulse`. label:
`text-sm text-text-dim`. Base UI sizes the indicator width from the value.

## 5. States

determinate (width = value) · indeterminate (pulsing partial bar).

## 6. Logic (`progress.logic.tsx`)

- No `'use client'`. `Base.Root` (value/max, aria-label) → optional `Base.Label` → `Base.Track` →
  `Base.Indicator`.

## 7. Styles (`progress.styles.tsx`)

`tv()` `slots` + `size`.

## 8. Accessibility checklist

- [ ] `role="progressbar"` with `aria-valuenow/min/max` (determinate) from Base UI.
- [ ] Accessible name via `aria-label` or a visible `label`.
- [ ] Indeterminate omits `aria-valuenow`.

## 9. Tests

Renders `progressbar` with value (determinate) and without (indeterminate); label; className; SSR;
axe both themes.

## 10. Stories

`Determinate`, `Indeterminate`, `WithLabel`, `Sizes`.

## 11. Decisions

- Base UI computes the indicator width from `value`; we only style appearance.
