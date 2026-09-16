import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../../utils/cn'
import { type SpinnerStyleProps, spinnerStyles } from './spinner.styles'

export interface SpinnerProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'children'>,
    SpinnerStyleProps {
  label?: string
}

/** Indeterminate loading indicator. Static and RSC-safe (no `'use client'`). */
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
