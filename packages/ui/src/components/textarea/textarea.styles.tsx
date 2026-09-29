import { tv, type VariantProps } from '../../utils/tv'

// Same surface, border, focus ring and invalid treatment as Input, so forms read as one system.
export const textareaStyles = tv({
  base: [
    'block w-full bg-surface-2 text-text border border-line',
    'placeholder:text-text-faint',
    'transition-[border-color,box-shadow] motion-reduce:transition-none duration-fast ease-sukuna',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-accent',
    'disabled:opacity-45 disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'min-h-16 px-3 py-1.5 text-sm rounded-sm',
      md: 'min-h-20 px-3 py-2 text-md rounded-md',
      lg: 'min-h-24 px-4 py-3 text-lg rounded-lg',
    },
    resize: {
      none: 'resize-none',
      vertical: 'resize-y',
      both: 'resize',
    },
    // CSS-only auto-grow: the box sizes to its content (Chromium today); other engines keep the
    // fixed, resizable box. Capped so a long paste never swallows the page.
    autoResize: {
      true: '[field-sizing:content] max-h-80',
    },
    invalid: {
      true: 'border-accent',
    },
  },
  defaultVariants: { size: 'md', resize: 'vertical' },
})

export type TextareaStyleProps = VariantProps<typeof textareaStyles>
