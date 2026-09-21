import { type ComponentPropsWithoutRef, type ElementType, forwardRef, type Ref } from 'react'
import { type GradientTextStyleProps, gradientTextStyles } from './gradient-text.styles'

export type GradientTextElement = 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface GradientTextProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'>,
    GradientTextStyleProps {
  /**
   * Intrinsic element to render — pick it for semantics (`'h1'` for a hero heading).
   * @default 'span'
   */
  as?: GradientTextElement
}

/**
 * Fills text with an on-brand gradient for wordmarks, hero headings and accent phrases.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`) — pure CSS, no hooks, no DOM access.
 * - How it works: the gradient is clipped to the text (`background-clip: text`) and revealed with
 *   `-webkit-text-fill-color: transparent`; a real `color` (the accent token) remains as the
 *   fallback for the rare browser without `background-clip: text` and as the color assistive-tech
 *   contrast tooling reads.
 * - Accessibility: renders real, selectable text — never an image. Reserve it for **large display
 *   text** (headings, ≥ 24px/bold) so the 3:1 large-text contrast floor applies; don't use it for
 *   body copy. Use real heading tags via `as`.
 * - Variants: `gradient`: 'accent' (default). `premium` is pending token approval (see
 *   `docs/questions.md` Q13).
 * - The `color` native attribute is omitted so it can't fight the clipped fill. The ref points at
 *   the rendered element; `className` merges last.
 *
 * @example
 * ```tsx
 * import { GradientText } from 'sukuna-ui'
 *
 * <GradientText as="h1" className="text-3xl font-display font-black">
 *   Malevolent Shrine
 * </GradientText>
 * ```
 */
export const GradientText = forwardRef<HTMLElement, GradientTextProps>(function GradientText(
  { as, gradient, className, ...rest },
  ref,
) {
  const Component = (as ?? 'span') as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={gradientTextStyles({ gradient, className })}
      {...rest}
    />
  )
})
