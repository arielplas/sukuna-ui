'use client'

import { NumberField as Base } from '@base-ui-components/react/number-field'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type NumberFieldStyleProps, numberFieldStyles } from './number-field.styles'

/**
 * Props for {@link NumberField}: the own props below plus every native `<input>` attribute except
 * the ones the component owns (`value`, `defaultValue`, `onChange`, `type`, `min`, `max`, `step`)
 * and the numeric `size` (replaced by the variant `size`). `disabled`, `name`, `id` and `required`
 * are applied to the field root; all other extra props spread onto the `<input>`.
 */
export interface NumberFieldProps
  extends NumberFieldStyleProps,
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'value' | 'defaultValue' | 'onChange' | 'size' | 'type' | 'min' | 'max' | 'step'
    > {
  /** Controlled value. `null` represents an empty field. Pair with `onValueChange`. */
  value?: number | null
  /** Initial value for uncontrolled use. */
  defaultValue?: number
  /** Fires with the parsed value (or `null` when cleared) on every change. */
  onValueChange?: (value: number | null) => void
  /** Smallest allowed value; the decrement stepper disables at this bound. */
  min?: number
  /** Largest allowed value; the increment stepper disables at this bound. */
  max?: number
  /**
   * Amount added/subtracted per step (arrow key, stepper click).
   * @default 1
   */
  step?: number
  /**
   * Amount used for `Shift`+Arrow and `PageUp`/`PageDown`.
   * @default 10
   */
  largeStep?: number
  /**
   * `Intl.NumberFormat` options controlling display (currency, percent, decimals, grouping).
   * @example { style: 'currency', currency: 'USD' }
   */
  format?: Intl.NumberFormatOptions
  /**
   * Renders the value un-editable while keeping it focusable/selectable.
   * @default false
   */
  readOnly?: boolean
  /**
   * Lets the mouse wheel change the value while the input is focused.
   * @default false
   */
  allowWheelScrub?: boolean
}

/**
 * Numeric input with stepper buttons, keyboard increment, range clamping and locale formatting.
 * Use it wherever a precise number is entered (quantity, price, percentage) instead of a bare
 * `<input type="number">`, which formats inconsistently and has no large-step or clamp behaviour.
 *
 * @remarks
 * - SSR/RSC: a client component (`'use client'`) because value parsing, clamping and pointer
 *   interactions come from Base UI hooks. The `<input>` still server-renders with its value.
 * - Accessibility: the input is a `role="spinbutton"` with `aria-valuenow/min/max`; the steppers
 *   carry `aria-label` ("Increase"/"Decrease") and decorative icons. Arrow keys step; `Shift`+Arrow
 *   and `PageUp`/`PageDown` use `largeStep`; `Home`/`End` jump to `min`/`max`. It renders no label —
 *   pass `aria-label`, `aria-labelledby`, or wrap it in `Field`.
 * - Variants: `size`: 'sm' (32px) | 'md' (40px, default) | 'lg' (48px).
 * - Behaviour: controlled via `value`/`onValueChange` or uncontrolled via `defaultValue`. The
 *   stepper at a reached `min`/`max` bound is disabled. Wheel scrubbing is opt-in
 *   (`allowWheelScrub`) to avoid changing the value while scrolling the page.
 * - The ref points at the `<input>` element.
 *
 * @example
 * ```tsx
 * import { NumberField } from 'sukuna-ui'
 *
 * <label htmlFor="qty">Quantity</label>
 * <NumberField id="qty" defaultValue={1} min={1} max={99} aria-label="Quantity" />
 * ```
 *
 * @example
 * ```tsx
 * import { NumberField } from 'sukuna-ui'
 *
 * // Controlled currency field.
 * <NumberField
 *   value={price}
 *   onValueChange={setPrice}
 *   min={0}
 *   step={0.5}
 *   format={{ style: 'currency', currency: 'USD' }}
 *   aria-label="Price"
 * />
 * ```
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    step,
    largeStep,
    format,
    size,
    readOnly,
    allowWheelScrub,
    className,
    disabled,
    name,
    id,
    required,
    ...rest
  },
  ref,
) {
  const styles = numberFieldStyles({ size })
  return (
    <Base.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      min={min}
      max={max}
      step={step}
      largeStep={largeStep}
      format={format}
      readOnly={readOnly}
      allowWheelScrub={allowWheelScrub}
      disabled={disabled}
      name={name}
      id={id}
      required={required}
      className={styles.group({ className })}
    >
      <Base.Decrement
        aria-label="Decrease"
        className={styles.stepper({ className: 'border-r border-line' })}
      >
        <span aria-hidden>−</span>
      </Base.Decrement>
      <Base.Input ref={ref} className={styles.input()} {...rest} />
      <Base.Increment
        aria-label="Increase"
        className={styles.stepper({ className: 'border-l border-line' })}
      >
        <span aria-hidden>+</span>
      </Base.Increment>
    </Base.Root>
  )
})
