import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type BadgeStyleProps, badgeDot, badgeStyles } from './badge.styles'

export interface BadgeProps extends ComponentPropsWithoutRef<'span'>, BadgeStyleProps {
  /** Show a leading status dot (decorative, `currentColor`). */
  dot?: boolean
}

/** Small pill label for status/metadata. Static and RSC-safe (no `'use client'`). */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, size, dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={badgeStyles({ tone, size, className })} {...rest}>
      {dot ? <span aria-hidden="true" className={badgeDot} /> : null}
      {children}
    </span>
  )
})
