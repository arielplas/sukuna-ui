import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type DividerStyleProps, dividerStyles } from './divider.styles'

export interface DividerProps extends ComponentPropsWithoutRef<'div'>, DividerStyleProps {
  /** Purely visual: hidden from assistive tech, no separator role. */
  decorative?: boolean
}

/** A separating rule. Static and RSC-safe (no `'use client'`). */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', decorative, className, ...rest },
  ref,
) {
  // Keep role + aria-orientation together (a separator supports aria-orientation; a bare div
  // does not), and hide entirely when decorative.
  const a11y = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'separator', 'aria-orientation': orientation } as const)
  return <div ref={ref} className={dividerStyles({ orientation, className })} {...a11y} {...rest} />
})
