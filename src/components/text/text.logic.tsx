import { type ComponentPropsWithoutRef, type ElementType, forwardRef, type Ref } from 'react'
import { type TextStyleProps, textStyles } from './text.styles'

export type TextElement =
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'strong'
  | 'em'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'

export interface TextProps extends Omit<ComponentPropsWithoutRef<'p'>, 'color'>, TextStyleProps {
  /** Intrinsic element to render. Default `'p'`. */
  as?: TextElement
}

/**
 * Typographic primitive. Static and RSC-safe (no `'use client'`). Every variant prop is pulled
 * out of `rest` so it never lands on the DOM element.
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as, font, size, weight, tone, align, leading, tracking, truncate, numeric, className, ...rest },
  ref,
) {
  const Component = (as ?? 'p') as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={textStyles({
        font,
        size,
        weight,
        tone,
        align,
        leading,
        tracking,
        truncate,
        numeric,
        className,
      })}
      {...rest}
    />
  )
})
