import { type ComponentPropsWithoutRef, type ElementType, forwardRef, type Ref } from 'react'
import { type ShinyTextStyleProps, shinyTextStyles } from './shiny-text.styles'

export type ShinyTextElement = 'span' | 'p' | 'div' | 'strong'

export interface ShinyTextProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'>,
    ShinyTextStyleProps {
  /**
   * Intrinsic element to render.
   * @default 'span'
   */
  as?: ShinyTextElement
}

/**
 * Sweeps a soft light band across dimmed text — for "New" flags, premium labels and subtle emphasis.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`) — the shimmer is a pure CSS keyframe, no hooks,
 *   no DOM access.
 * - Accessibility: renders real, selectable text; the sheen is decoration. The resting/base color is
 *   `--sk-text-dim` (clears 4.5:1 on `--sk-bg`/`--sk-surface` in both themes), so the text is legible
 *   even where the band isn't. `prefers-reduced-motion: reduce` freezes the animation
 *   (`motion-reduce:animate-none`).
 * - Variants: `speed`: 'slow' | 'normal' (default) | 'fast' — maps to the literal `animate-shine*`
 *   utilities (no interpolated class names).
 * - The `color` native attribute is omitted so it can't fight the clipped sheen. The ref points at
 *   the rendered element; `className` merges last.
 *
 * @example
 * ```tsx
 * import { ShinyText } from 'sukuna-ui'
 *
 * <ShinyText>Limited drop</ShinyText>
 * <ShinyText as="strong" speed="fast">New</ShinyText>
 * ```
 */
export const ShinyText = forwardRef<HTMLElement, ShinyTextProps>(function ShinyText(
  { as, speed, className, ...rest },
  ref,
) {
  const Component = (as ?? 'span') as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={shinyTextStyles({ speed, className })}
      {...rest}
    />
  )
})
