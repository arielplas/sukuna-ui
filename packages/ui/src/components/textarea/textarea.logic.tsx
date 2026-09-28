import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { type TextareaStyleProps, textareaStyles } from './textarea.styles'

/**
 * Props for {@link Textarea}: every native `<textarea>` attribute plus the style variants below.
 */
export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  /**
   * Text size, padding and minimum height: `sm` 64px, `md` 80px, `lg` 96px — matching `Input`.
   * @default 'md'
   */
  size?: TextareaStyleProps['size']
  /**
   * Error state: crimson border and `aria-invalid="true"`. Pair with `Field.Error` for the message.
   * @default false
   */
  invalid?: boolean
  /**
   * Which way the user can drag-resize the box.
   * @default 'vertical'
   */
  resize?: TextareaStyleProps['resize']
  /**
   * Grow with the content via CSS `field-sizing: content` (no JavaScript), capped at 320px.
   * Browsers without support keep a fixed, resizable box.
   * @default false
   */
  autoResize?: boolean
}

/**
 * A multi-line text field — the `Input` counterpart for comments, descriptions and messages.
 *
 * @remarks
 * - SSR/RSC: a server component — no hooks, no DOM access, no `'use client'`.
 * - Accessibility: a native `<textarea>`; name it with `<label htmlFor>`, `Field.Label` or
 *   `aria-label`. `invalid` sets `aria-invalid="true"` (omitted otherwise).
 * - Variants: `size` 'sm' | 'md' (default) | 'lg'; `resize` 'none' | 'vertical' (default) | 'both';
 *   `autoResize` boolean; `invalid` boolean.
 * - `rows` defaults to 3. A consumer `className` is merged last (tailwind-merge).
 *
 * @example
 * ```tsx
 * import { Field, Textarea } from 'sukuna-ui'
 *
 * <Field>
 *   <Field.Label>Description</Field.Label>
 *   <Field.Control render={<Textarea placeholder="What is this project about?" autoResize />} />
 * </Field>
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size, invalid, resize, autoResize, rows = 3, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={textareaStyles({ size, invalid, resize, autoResize, className })}
      {...rest}
    />
  )
})
