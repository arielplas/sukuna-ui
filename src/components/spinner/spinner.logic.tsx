import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { type SpinnerStyleProps, spinnerStyles } from './spinner.styles'

export interface SpinnerProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    SpinnerStyleProps {
  /**
   * Accessible name, applied as `aria-label` on the `role="status"` wrapper. Make it specific
   * when the context allows (e.g. 'Saving changes') so the announcement says what is loading.
   * @default 'Loading'
   */
  label?: string
}

/**
 * Indeterminate loading indicator: a spinning ring for work of unknown duration.
 *
 * @remarks
 * - SSR/RSC: static, RSC-safe (no `'use client'`); the spin is pure CSS.
 * - Accessibility: renders `<span role="status" aria-label={label}>` around an `aria-hidden`
 *   `<svg>`, so screen readers announce the label once (polite live region) and the graphic
 *   itself is silent. `children` is excluded from the props: the spinner has no visible text.
 * - Motion: the spin is disabled under `prefers-reduced-motion` (`motion-reduce:animate-none`);
 *   the static ring is still shown.
 * - Variants: `size`: 'sm' (16px) | 'md' (20px, default) | 'lg' (24px). The size applies to the
 *   SVG; the wrapper is `inline-flex` and sizes to it.
 * - Colour: strokes use `currentColor` and the wrapper sets `text-accent` (crimson), so pass a
 *   `text-*` utility in `className` to recolour (e.g. `text-text-dim` for a quiet inline spinner).
 * - Ref: `HTMLSpanElement` (the wrapper). Every native `<span>` attribute except `children` is
 *   forwarded; `className` is merged last (tailwind-merge).
 *
 * @example
 * ```tsx
 * import { Spinner } from 'sukuna-ui'
 *
 * // Default: 20px crimson ring announced as 'Loading'.
 * <Spinner />
 *
 * // Specific label, small, recoloured to match muted text.
 * <Spinner size="sm" label="Saving changes" className="text-text-dim" />
 *
 * // Swap content for a spinner while data loads.
 * {isLoading ? <Spinner label="Loading orders" size="lg" /> : <OrderTable rows={orders} />}
 * ```
 */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size, label = 'Loading', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      aria-label={label}
      className={cn('inline-flex text-accent', className)}
      {...rest}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={spinnerStyles({ size })}>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
})
