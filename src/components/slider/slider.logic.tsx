'use client'

import { Slider as Base } from '@base-ui-components/react/slider'
import { sliderStyles } from './slider.styles'

/** Props for {@link Slider}. There are no style variants. */
export interface SliderProps {
  /** Controlled current value. Pair with `onValueChange`; omit to stay uncontrolled. */
  value?: number
  /** Initial value for uncontrolled use. Falls back to `min` when unset. */
  defaultValue?: number
  /**
   * Fires continuously while dragging and on every keyboard step, with the new number already
   * clamped to `min`/`max` and snapped to `step`.
   */
  onValueChange?: (value: number) => void
  /**
   * Lowest selectable value.
   * @default 0
   */
  min?: number
  /**
   * Highest selectable value.
   * @default 100
   */
  max?: number
  /**
   * Increment between selectable values; arrow keys move by one step.
   * @default 1
   */
  step?: number
  /**
   * Dims the slider and removes the thumb from the tab order.
   * @default false
   */
  disabled?: boolean
  /** Extra classes merged onto the root wrapper (e.g. to constrain width). */
  className?: string
  /**
   * Accessible name for the thumb (`role="slider"`). Required: nothing else names the control, so
   * a screen reader would only announce the number.
   */
  'aria-label'?: string
}

/**
 * Single-value range slider: pick a number between `min` and `max` by dragging the thumb or
 * with the keyboard.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because drag handling and value state come from
 *   Base UI hooks. It renders fully on the server (no portal).
 * - Accessibility: the thumb is `role="slider"` with `aria-valuenow`, `aria-valuemin` and
 *   `aria-valuemax` kept in sync by Base UI. Always pass `aria-label`. `ArrowRight`/`ArrowUp`
 *   increase and `ArrowLeft`/`ArrowDown` decrease by `step`, `PageUp`/`PageDown` move by a larger
 *   step, `Home`/`End` jump to `min`/`max`. A disabled slider is not focusable.
 * - Variants: none. The root is `w-full`; use `className` (e.g. `max-w-xs`) to size it.
 * - Behaviour: uncontrolled via `defaultValue`, controlled via `value` + `onValueChange`. Single
 *   thumb only in v1; there is no range (two-thumb) mode, so `value` is always a `number`.
 *   `onValueChange` fires on every intermediate value during a drag, so debounce expensive work.
 *
 * @example
 * ```tsx
 * import { Slider } from 'sukuna-ui'
 *
 * <Slider aria-label="Volume" defaultValue={40} className="max-w-xs" />
 * ```
 *
 * @example
 * ```tsx
 * import { useState } from 'react'
 * import { Slider } from 'sukuna-ui'
 *
 * function OpacityControl() {
 *   const [opacity, setOpacity] = useState(1)
 *   return (
 *     <Slider
 *       aria-label="Opacity"
 *       min={0}
 *       max={1}
 *       step={0.05}
 *       value={opacity}
 *       onValueChange={setOpacity}
 *     />
 *   )
 * }
 * ```
 */
export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  className,
  'aria-label': ariaLabel,
}: SliderProps) {
  const styles = sliderStyles()
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      // Single-value slider: Base UI only emits a number here. Cast avoids a wrapper (keeping the
      // module free of an untestable handler) while forwarding the consumer's callback directly.
      onValueChange={onValueChange as ((value: number | readonly number[]) => void) | undefined}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={styles.root({ className })}
    >
      <Base.Control className={styles.control()}>
        <Base.Track className={styles.track()}>
          <Base.Indicator className={styles.indicator()} />
          <Base.Thumb aria-label={ariaLabel} className={styles.thumb()} />
        </Base.Track>
      </Base.Control>
    </Base.Root>
  )
}
