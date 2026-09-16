import { Progress as Base } from '@base-ui-components/react/progress'
import type { ReactNode } from 'react'
import { type ProgressStyleProps, progressStyles } from './progress.styles'

export interface ProgressProps extends ProgressStyleProps {
  /** Current value (0..max). `null`/omitted → indeterminate. */
  value?: number | null
  max?: number
  label?: ReactNode
  className?: string
  'aria-label'?: string
}

/** Determinate/indeterminate progress bar (Base UI). No `'use client'` — display only. */
export function Progress({
  value,
  max = 100,
  label,
  size,
  className,
  'aria-label': ariaLabel,
}: ProgressProps) {
  const styles = progressStyles({ size })
  return (
    <Base.Root
      value={value ?? null}
      max={max}
      aria-label={ariaLabel}
      className={styles.root({ className })}
    >
      {label ? <Base.Label className={styles.label()}>{label}</Base.Label> : null}
      <Base.Track className={styles.track()}>
        <Base.Indicator className={styles.indicator()} />
      </Base.Track>
    </Base.Root>
  )
}
