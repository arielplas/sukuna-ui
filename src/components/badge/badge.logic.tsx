import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type BadgeStyleProps, badgeDot, badgeStyles } from './badge.styles'

export interface BadgeProps extends ComponentPropsWithoutRef<'span'>, BadgeStyleProps {
  /**
   * Render a small leading dot in `currentColor` before the children (e.g. a "LIVE" pulse).
   * The dot is `aria-hidden`; the text must still convey the status on its own.
   * @default false
   */
  dot?: boolean
}

/**
 * Small pill-shaped label for status and metadata such as "LIVE", counts or tags.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`).
 * - Accessibility: renders a plain `<span>` with no role and no focus — it is not interactive.
 *   For a clickable status, wrap it in a Button or Link. Never let color or the `dot` alone
 *   carry meaning; the label text does.
 * - Variants:
 *   - `tone`: 'neutral' (default) | 'accent' | 'success' | 'premium'. `accent` uses the crimson
 *     gradient with light text; the others sit on `surface-2` with a tinted label.
 *   - `size`: 'sm' | 'md' (default) — 20px / 24px tall.
 * - The pill radius is fixed; `className` merges last and wins over a conflicting utility.
 * - Theming: colors come from `--sk-*` tokens and flip with `data-theme`.
 *
 * @example
 * ```tsx
 * import { Badge } from 'sukuna-ui'
 *
 * <Badge tone="accent" dot>
 *   Live
 * </Badge>
 * <Badge tone="success" size="sm">
 *   Cleared
 * </Badge>
 * ```
 */
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
