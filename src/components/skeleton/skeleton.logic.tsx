import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type SkeletonStyleProps, skeletonStyles } from './skeleton.styles'

/**
 * Props for {@link Skeleton}: every native `<div>` attribute plus the `variant` and `animation`
 * style props. There are no width/height props on purpose; size it with `className` or `style`.
 */
export interface SkeletonProps extends ComponentPropsWithoutRef<'div'>, SkeletonStyleProps {}

/**
 * A pulsing placeholder that reserves space for content while it loads.
 *
 * @remarks
 * - SSR/RSC: static, RSC-safe (no `'use client'`); the pulse is pure CSS.
 * - Accessibility: always `aria-hidden="true"`, a decorative block with no semantics. Signal the
 *   loading state on the container instead (`aria-busy="true"`, or a `role="status"` message)
 *   and never place real content inside a Skeleton.
 * - Motion: both animations are disabled under `prefers-reduced-motion`; the block stays visible.
 * - Variants: `variant`: 'text' (`rounded-sm h-[1em]`, height follows the font size, set only
 *   the width) | 'rectangular' (`rounded-md`, default) | 'circular' (`rounded-full`; give it
 *   equal width and height). Fill is `bg-surface-2`. `animation`: 'pulse' (default, opacity
 *   pulse) | 'shimmer' (a light band sweeping left to right — the same `sk-shine` keyframe as
 *   `ShinyText`).
 * - Sizing is the consumer's: use `className` (`h-4 w-40`) or `style`. Match the dimensions of
 *   the content it stands in for so the layout does not shift when the data arrives.
 * - Ref: `HTMLDivElement`. `className` is merged last (tailwind-merge), so `h-*`/`w-*` and a
 *   different `bg-*` all override the defaults.
 *
 * @example
 * ```tsx
 * import { Skeleton } from 'sukuna-ui'
 *
 * // A card while it loads: 160px image, two text lines, and a 40px avatar circle.
 * <div aria-busy="true" className="flex flex-col gap-3">
 *   <Skeleton style={{ height: 160, width: '100%' }} />
 *   <Skeleton variant="text" style={{ width: '70%' }} />
 *   <Skeleton variant="text" style={{ width: '40%' }} />
 *   <Skeleton variant="circular" style={{ height: 40, width: 40 }} />
 * </div>
 *
 * // Explicit pixel height with Tailwind sizing instead of `style`.
 * <Skeleton className="h-4 w-40" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant, animation, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={skeletonStyles({ variant, animation, className })}
      {...rest}
    />
  )
})
