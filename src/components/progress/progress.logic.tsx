import { Progress as Base } from '@base-ui-components/react/progress'
import type { ReactNode } from 'react'
import { type ProgressStyleProps, progressStyles } from './progress.styles'

export interface ProgressProps extends ProgressStyleProps {
  /**
   * Current value in `0..max`, exposed as `aria-valuenow`. `null` or omitted renders the
   * indeterminate state: a pulsing partial bar with no `aria-valuenow`.
   * @default null
   */
  value?: number | null
  /**
   * Upper bound, exposed as `aria-valuemax` and used to compute the indicator width.
   * @default 100
   */
  max?: number
  /**
   * Visible caption rendered above the track. It also names the bar for assistive tech (via
   * `aria-labelledby`), so no `aria-label` is needed alongside it.
   */
  label?: ReactNode
  /**
   * Extra classes for the root element, merged last (tailwind-merge). The root is `w-full`, so
   * constrain the width here (e.g. `max-w-sm`).
   */
  className?: string
  /**
   * Accessible name for a bar without a visible `label`. When a `label` is rendered it already
   * names the bar (`aria-labelledby` wins in the accessible-name computation), so set this only
   * for label-less bars.
   * @default 'Progress' (applied only when `label` is also absent)
   */
  'aria-label'?: string
}

/**
 * A horizontal progress bar, determinate (fills to `value`) or indeterminate (pulsing).
 *
 * @remarks
 * - SSR/RSC: no `'use client'`, display only. Composes Base UI `Progress.Root` / `Label` /
 *   `Track` / `Indicator`. There is no `onChange`; re-render with a new `value` to advance it.
 * - Accessibility: the root is `role="progressbar"` with `aria-valuemin="0"`,
 *   `aria-valuemax={max}` and, when determinate, `aria-valuenow={value}` (omitted while
 *   indeterminate). It always has an accessible name: a visible `label` supplies it via
 *   `aria-labelledby`; otherwise `aria-label` is used and falls back to 'Progress'. Prefer a
 *   specific name ('Upload progress') over the fallback.
 * - Motion: the indicator's width transition and the indeterminate pulse are both disabled
 *   under `prefers-reduced-motion`.
 * - Variants: `size`: 'sm' (track `h-1.5`, 6px) | 'md' (track `h-2`, 8px, default). The track
 *   is `rounded-pill bg-surface-2`, the indicator `bg-accent`; while indeterminate the
 *   indicator is a `w-1/3` pulsing segment.
 * - Props do not extend a native element: only `value`, `max`, `label`, `size`, `className`
 *   and `aria-label` are accepted, and no ref is exposed.
 *
 * @example
 * ```tsx
 * import { Progress } from 'sukuna-ui'
 *
 * // Determinate with a visible label (which also names it for assistive tech).
 * <Progress value={uploaded} max={total} label="Uploading 3 files" />
 *
 * // Determinate, no visible text: give it a specific accessible name and a max width.
 * <Progress value={42} aria-label="Profile completeness" size="sm" className="max-w-sm" />
 *
 * // Indeterminate: `value={null}` (or omitted) renders a pulsing bar with no aria-valuenow.
 * <Progress value={null} aria-label="Preparing download" />
 * ```
 */
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
