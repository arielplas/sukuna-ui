import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type CardStyleProps, cardStyles } from './card.styles'

export interface CardProps extends ComponentPropsWithoutRef<'div'>, CardStyleProps {}

/** Surface container. Static and RSC-safe (no `'use client'`). */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { elevation, padding, radius, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cardStyles({ elevation, padding, radius, className })} {...rest} />
  )
})
