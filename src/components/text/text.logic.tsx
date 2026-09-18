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
  /**
   * Intrinsic element to render; pick the tag for its semantics (`'h2'` for a heading,
   * `'label'` for a form label), not for its size.
   * @default 'p'
   */
  as?: TextElement
}

/**
 * Typographic primitive for body copy, labels, eyebrows and headings on the Sukuna type scale.
 *
 * @remarks
 * - SSR/RSC: static and RSC-safe (no `'use client'`); every variant prop is stripped before the
 *   native props are spread, so nothing leaks onto the DOM element.
 * - Accessibility: `as` sets the real element — use `as="h1"`..`"h6"` for headings rather than
 *   faking hierarchy with `size`. `tone="faint"` may fall below 4.5:1 contrast, so reserve it
 *   for placeholder or decorative text. `tracking="eyebrow"` uppercases visually only; never
 *   rely on it to carry meaning. With `as="label"`, pass `htmlFor` to associate a control.
 * - Variants (defaults from `textStyles`):
 *   - `font`: 'sans' (default) | 'display' — `display` is the Archivo headline face.
 *   - `size`: 'xs' | 'sm' | 'md' (default) | 'lg' | 'xl' | '2xl' | '3xl'.
 *   - `weight`: 'regular' (default) | 'semibold' | 'bold' | 'black' (400/600/700/900).
 *   - `tone`: 'default' (default) | 'dim' | 'faint' | 'accent' | 'success' | 'premium'.
 *   - `align`: 'start' | 'center' | 'end' (no default — inherits).
 *   - `leading`: 'tight' | 'normal' (default).
 *   - `tracking`: 'tight' | 'normal' (default) | 'eyebrow' (adds `uppercase`).
 *   - `truncate`: boolean — single-line ellipsis; the element needs a bounded width.
 *   - `numeric`: boolean — `tabular-nums` so figures align in columns.
 * - The native `color` attribute is omitted so it cannot fight `tone`. `className` merges last
 *   and wins over a conflicting utility.
 * - Theming: sizes come from `--sk-text-*` and tones from `--sk-*` color tokens, which flip
 *   automatically with `data-theme`.
 *
 * @example
 * ```tsx
 * import { Text } from 'sukuna-ui'
 *
 * <Text as="span" size="xs" tracking="eyebrow" tone="accent">
 *   Season 2
 * </Text>
 * <Text as="h2" font="display" size="2xl" weight="black" tracking="tight">
 *   Malevolent Shrine
 * </Text>
 * <Text tone="dim">
 *   Domain expansion that slashes everything within its radius.
 * </Text>
 * <Text as="span" numeric truncate className="max-w-40">
 *   1,204,880 cursed spirits exorcised
 * </Text>
 * ```
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
