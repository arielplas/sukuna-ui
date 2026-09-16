import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { type ChipStyleProps, chipStyles } from './chip.styles'

export interface ChipProps extends ComponentPropsWithoutRef<'span'>, ChipStyleProps {
  leadingIcon?: ReactNode
  onDismiss?: () => void
  dismissLabel?: string
}

const DismissIcon = () => (
  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

/** Compact, optionally-removable token. Static and RSC-safe (no `'use client'`). */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone, size, leadingIcon, onDismiss, dismissLabel = 'Remove', className, children, ...rest },
  ref,
) {
  const styles = chipStyles({ tone, size })
  return (
    <span ref={ref} className={styles.root({ className })} {...rest}>
      {leadingIcon}
      {children}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          className={styles.dismiss()}
          onClick={onDismiss}
        >
          <DismissIcon />
        </button>
      ) : null}
    </span>
  )
})
