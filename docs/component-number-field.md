# Component: NumberField

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `number-field`). A numeric input with stepper buttons, keyboard increment, clamping, and locale
> formatting.

## 1. Purpose

Enter a number precisely. Steppers, arrow-key increment, min/max clamping, and `Intl` formatting
(currency, percent, decimals) come from Base UI Number Field — a plain `<input type="number">` gives
none of that and formats inconsistently across browsers.

## 2. Files

```
src/components/number-field/
├── number-field.styles.tsx   # tv() slots: group, decrement, input, increment + `size` variant.
├── number-field.logic.tsx    # 'use client'; forwardRef to the <input>.
├── number-field.test.tsx
├── number-field.stories.tsx
└── index.tsx                 # export { NumberField } + type { NumberFieldProps }
test/browser/number-field.test.ts  # Playwright: step buttons + arrow keys change value
```

## 3. API

```ts
import type { ComponentPropsWithoutRef } from 'react'

interface NumberFieldOwnProps {
  value?: number | null           // controlled; null = empty
  defaultValue?: number           // uncontrolled initial
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number                   // default 1
  largeStep?: number              // Shift+Arrow / PageUp-Down; default 10
  format?: Intl.NumberFormatOptions   // e.g. { style: 'currency', currency: 'USD' }
  variant?: 'filled' | 'outline' | 'ghost'   // default 'filled' (the original look); same map as Input
  size?: 'sm' | 'md' | 'lg'       // default 'md'
  readOnly?: boolean
  allowWheelScrub?: boolean        // default false — scroll wheel over the input changes value
}

// The visible field is a native <input>; own props are consumed, the rest spread onto it.
export type NumberFieldProps = NumberFieldOwnProps &
  Omit<
    ComponentPropsWithoutRef<'input'>,
    'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'
  >
```

Deliberately **not** in v1: a `ScrubArea` drag-to-change cursor (pointer-only, poor a11y; wheel scrub
is opt-in instead), prefix/suffix adornment slots (use `format`), and a `variant` prop (one surface
treatment, matching `Input`).

## 4. Variants → tokens

group: `inline-flex items-stretch rounded-md border focus-within:ring-2 focus-within:ring-focus-ring`
+ `variant` filled `bg-surface-2 border-line` (default) / outline `bg-transparent border-line` /
ghost `bg-transparent border-transparent hover:bg-surface-2` — the shared form-control map (see
Input). input: `min-w-0 flex-1 bg-transparent px-3
text-text tabular-nums outline-none placeholder:text-text-faint`. decrement/increment:
`grid w-9 place-items-center text-text-dim hover:bg-well hover:text-text
data-[disabled]:opacity-45` (decrement gets a right border, increment a left border via
`border-line`).

| Size | Height | Font | Radius |
|---|---|---|---|
| sm | 32px (`h-8`) | `text-sm` | `rounded-sm` |
| md | 40px (`h-10`) | `text-md` | `rounded-md` |
| lg | 48px (`h-12`) | `text-lg` | `rounded-lg` |

No new tokens — reuses `--sk-surface-2`, `--sk-line`, `--sk-well`, `--sk-focus-ring`, text tokens.

## 5. States

| State | Behavior |
|---|---|
| default | steppers enabled within range |
| focus-within | 2px `--sk-focus-ring` ring on the group |
| at-min / at-max | the corresponding stepper is `disabled` (dimmed, not clickable) |
| readOnly | input not editable (native `readonly`), still focusable/selectable; the value can't be changed |
| disabled | whole group `opacity-45`, `cursor-not-allowed`, steppers off |

## 6. Logic (`number-field.logic.tsx`)

- `'use client'` (stateful value + pointer/keyboard handling).
- `forwardRef<HTMLInputElement, NumberFieldProps>` — ref lands on the `<input>`.
- `Base.NumberField.Root` (value/min/max/step/largeStep/format/readOnly/allowWheelScrub) →
  `Group` → `Decrement` + `Input render=<input ref/>` + `Increment`.
- No `useEffect`, no direct DOM access — Base UI owns measurement and clamping.
- Class name via `numberFieldStyles({ size, className })`.

## 7. Styles (`number-field.styles.tsx`)

`tv()` `slots` (group, decrement, input, increment) + a `size` variant applied to `group`/`input`.

## 8. Accessibility checklist

- [ ] Input exposes `role="spinbutton"` with `aria-valuenow/min/max` (Base UI).
- [ ] Stepper buttons have `aria-label` ("Increase"/"Decrease") and `aria-hidden` icons.
- [ ] Arrow keys step; Shift+Arrow / PageUp-Down use `largeStep`; Home/End jump to min/max.
- [ ] Focus ring visible in both themes at ≥3:1 against surface.
- [ ] Pair with `Field` (`Field.Label`) for an associated label; `aria-label` accepted otherwise.

## 9. Tests

**Unit:** renders group + input + two steppers; `defaultValue` shows formatted value; clicking a
stepper calls `onValueChange`; clamps at `min`/`max` (stepper disabled); `readOnly`/`disabled`
render correctly; forwards `ref` to the input; SSR renders the input with its value. **Browser:**
increment/decrement buttons and ArrowUp/Down change the value.

## 10. Stories

`Playground`, `Sizes`, `WithMinMax`, `Currency` (format), `Percent`, `ReadOnly`, `Disabled`. Both
`data-theme` values via the global toolbar.

## 11. Decisions

- Prop-driven single component (not compound) — matches `Input`; the group/steppers are internal.
- Wheel scrub off by default (`allowWheelScrub`) to avoid accidental changes while scrolling a page.
- Drag-scrub cursor deferred (pointer-only, a11y-weak).
