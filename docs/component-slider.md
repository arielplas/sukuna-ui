# Component: Slider

> Follows the `docs/component-button.md` template. `'use client'` — headless-backed (Base UI
> `slider`). Single value in v1.

## 1. Purpose

Pick a number from a range by dragging or with the keyboard.

## 2. Files

```
src/components/slider/
├── slider.styles.tsx   # tv() slots: root, control, track, indicator, thumb.
├── slider.logic.tsx    # 'use client'; prop-driven wrapper.
├── slider.test.tsx
├── slider.stories.tsx
└── index.tsx
test/browser/slider.test.ts  # Playwright: arrow-key changes value
```

## 3. API

```ts
export interface SliderProps {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number     // default 0
  max?: number     // default 100
  step?: number    // default 1
  disabled?: boolean
  className?: string
  'aria-label'?: string
}
```

## 4. Variants → tokens

track: `h-1.5 w-full rounded-pill bg-surface-2`; indicator: `bg-accent rounded-pill` (Base UI sizes
it); thumb: `size-4 rounded-full bg-text border border-line focus-visible:ring-2
focus-visible:ring-accent-glow`; disabled → `opacity-45`.

## 5. States

default · dragging · focus-visible ring on thumb · disabled.

## 6. Logic (`slider.logic.tsx`)

- `'use client'`. `Base.Root` (value/defaultValue/onValueChange guarding non-number, min/max/step,
  disabled, aria-label) → `Control` → `Track` (`Indicator` + `Thumb`).

## 7. Styles

`tv()` `slots` (no variants).

## 8. Accessibility checklist

- [ ] Thumb exposes `role="slider"` + `aria-valuenow/min/max` (Base UI); give an `aria-label`.
- [ ] Arrow keys adjust by `step`; Home/End jump to min/max.
- [ ] Disabled sliders are not focusable.

## 9. Tests

**Unit:** renders a slider with value; respects min/max; changing fires `onValueChange`; disabled;
SSR; axe. **Browser:** arrow key changes the value.

## 10. Stories

`Default`, `WithValue`, `Steps`, `Disabled`.

## 11. Decisions

- Single value only in v1 (range/multi-thumb deferred).
