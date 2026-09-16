import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type SkeletonStyleProps, skeletonStyles } from './skeleton.styles'

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'>, SkeletonStyleProps {}

/** Loading placeholder. Static and RSC-safe (no `'use client'`). Decorative (`aria-hidden`). */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={skeletonStyles({ variant, className })}
      {...rest}
    />
  )
})
