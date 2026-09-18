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
      // Guarantee an accessible name: a rendered `label` names it via Base UI's `aria-labelledby`;
      // otherwise fall back to a default so the progressbar is never unlabeled.
      aria-label={ariaLabel ?? (label ? undefined : 'Progress')}
      className={styles.root({ className })}
    >
      {label ? <Base.Label className={styles.label()}>{label}</Base.Label> : null}
      <Base.Track className={styles.track()}>
        <Base.Indicator className={styles.indicator()} />
      </Base.Track>
    </Base.Root>
  )
}
