# Component: Meter

> Follows the `docs/component-button.md` template. **Server component** (no hooks, no directive) —
> backed by Base UI `meter` for the ARIA wiring, like `Progress`.

## 1. Purpose

Show a scalar measurement within a known range: storage used, quota, password strength, a score.
`Progress` is for *task completion over time* (`role="progressbar"`, has an indeterminate state);
Meter is a *static gauge* (`role="meter"`) and is announced as such. Using the right one tells
screen-reader users what the bar means.

## 2. Files

```
packages/ui/src/components/meter/
├── meter.styles.tsx   # tv() slots root/header/label/value/track/indicator + size & tone.
├── meter.logic.tsx    # Base UI Meter parts. No hooks → no 'use client'.
├── meter.test.tsx
├── meter.stories.tsx
└── index.tsx
```

## 3. API

```ts
import type { ReactNode } from 'react'

export interface MeterProps {
  value: number                         // required — a meter always has a value
  min?: number                          // default 0
  max?: number                          // default 100
  label?: ReactNode                     // visible caption; also names the meter
  showValue?: boolean                   // default false — prints the formatted value on the right
  format?: Intl.NumberFormatOptions     // e.g. { style: 'percent' } or { style: 'unit', unit: 'gigabyte' }
  size?: 'sm' | 'md'                    // default 'md'
  tone?: 'accent' | 'success' | 'premium'   // default 'accent'
  className?: string
  'aria-label'?: string                 // required when there is no `label`
  'aria-valuetext'?: string             // override the spoken value ("3 of 5 GB")
}
```

Deliberately **not** in v1: low/high/optimum thresholds that auto-switch the tone (pick `tone`
yourself), segmented meters, a vertical orientation.

## 4. Variants → tokens

Track `bg-surface-2 rounded-pill w-full overflow-hidden`; indicator `h-full rounded-pill`.

| size | track height | | tone | indicator |
|---|---|---|---|---|
| sm | `h-1.5` | | accent | `bg-accent` |
| md | `h-2` | | success | `bg-success` |
| | | | premium | `bg-premium` |

Header row: `mb-1 flex justify-between text-sm`; label `text-text-dim`, value
`text-text tabular-nums`. No new tokens (success/premium already exist and pass AA for UI, D22).

## 5. States

Static — no hover/focus (not interactive). Indicator width transition on value change
(`transition-[width] motion-reduce:transition-none`).

**Motion (v1.3, `docs/motion.md`):** the bar grows in from the left on mount (`starting:scale-x-0`, `duration-slow`) and eases between values. Reduced motion: instant.

## 6. Logic (`meter.logic.tsx`)

- No `'use client'` (no hooks). Base UI `Meter.Root` (value/min/max/format/aria) → optional
  `Meter.Label` + `Meter.Value` → `Meter.Track` → `Meter.Indicator`.
- Guarantees a name: `aria-label` fallback `'Meter'` only when neither `label` nor `aria-label`.

## 7. Styles (`meter.styles.tsx`)

`tv()` slots + `size` and `tone` variants; defaults `size: 'md'`, `tone: 'accent'`.

## 8. Accessibility checklist

- [ ] `role="meter"` with `aria-valuenow/min/max`; `aria-valuetext` from `format` or override.
- [ ] Named by `label` (`aria-labelledby`) or `aria-label`.
- [ ] Indicator color is not the only signal — pair with `showValue` or text when tone matters.

## 9. Tests

Renders `role="meter"` with value/min/max; `label` names it; fallback name; `showValue` prints the
formatted value (`format` percent); each tone/size class; `className` merges; server render;
hydrate; axe both themes.

## 10. Stories

`Playground`, `Tones`, `Storage` (unit format + `showValue`), `Sizes`. Both themes.

## 11. Decisions

- Separate from `Progress` on purpose (different role, no indeterminate state).
- `tone` is manual; threshold auto-toning is a later, additive feature.
