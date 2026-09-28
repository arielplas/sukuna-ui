import { Meter as Base } from '@base-ui/react/meter'
import type { ReactNode } from 'react'
import { type MeterStyleProps, meterStyles } from './meter.styles'

/** Props for {@link Meter}. */
export interface MeterProps extends MeterStyleProps {
  /** The measured value, between `min` and `max`. Exposed as `aria-valuenow`. */
  value: number
  /**
   * Lower bound (`aria-valuemin`).
   * @default 0
   */
  min?: number
  /**
   * Upper bound (`aria-valuemax`).
   * @default 100
   */
  max?: number
  /** Visible caption above the track. Also names the meter (`aria-labelledby`). */
  label?: ReactNode
  /**
   * Print the formatted value at the right of the header.
   * @default false
   */
  showValue?: boolean
  /**
   * `Intl.NumberFormat` options for the printed value and `aria-valuetext`, e.g.
   * `{ style: 'unit', unit: 'gigabyte' }`.
   */
  format?: Intl.NumberFormatOptions
  /** Extra classes for the root, merged last. The root is `w-full`; constrain it here. */
  className?: string
  /**
   * Accessible name for a meter without a visible `label`.
   * @default 'Meter' (applied only when `label` is also absent)
   */
  'aria-label'?: string
  /** Override the spoken value, e.g. `"3 of 5 GB used"`. */
  'aria-valuetext'?: string
}

/**
 * A static gauge for a value within a known range — storage used, quota, a strength score.
 *
 * @remarks
 * - SSR/RSC: no hooks and no `'use client'`; Base UI Meter supplies the ARIA wiring.
 * - Accessibility: `role="meter"` with `aria-valuenow/min/max` and a formatted
 *   `aria-valuetext`. Named by `label` or `aria-label` (falls back to "Meter"). Use `Progress`
 *   instead for a task that completes over time — screen readers announce the two differently.
 * - Variants: `size` 'sm' | 'md' (default); `tone` 'accent' (default) | 'success' | 'premium'.
 *   Color is never the only signal — add `showValue` or text when the tone carries meaning.
 *
 * @example
 * ```tsx
 * import { Meter } from 'sukuna-ui'
 *
 * <Meter label="Storage" value={3.2} max={5} showValue format={{ style: 'unit', unit: 'gigabyte' }} />
 * <Meter aria-label="Password strength" value={80} tone="success" size="sm" />
 * ```
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  format,
  size,
  tone,
  className,
  'aria-label': ariaLabel,
  'aria-valuetext': ariaValueText,
}: MeterProps) {
  const styles = meterStyles({ size, tone })
  return (
    <Base.Root
      value={value}
      min={min}
      max={max}
      format={format}
      getAriaValueText={ariaValueText ? () => ariaValueText : undefined}
      aria-label={ariaLabel ?? (label ? undefined : 'Meter')}
      className={styles.root({ className })}
    >
      {label || showValue ? (
        <div className={styles.header()}>
          {label ? <Base.Label className={styles.label()}>{label}</Base.Label> : <span />}
          {showValue ? <Base.Value className={styles.value()} /> : null}
        </div>
      ) : null}
      <Base.Track className={styles.track()}>
        <Base.Indicator className={styles.indicator()} />
      </Base.Track>
    </Base.Root>
  )
}
