import { tv, type VariantProps } from '../../utils/tv'

// Wrapper color; the svg strokes use currentColor. 'current' inherits (e.g. inside a Button).
export const spinnerToneStyles = tv({
  base: 'inline-flex',
  variants: {
    tone: {
      accent: 'text-accent',
      success: 'text-success',
      premium: 'text-premium',
      current: '',
    },
  },
  defaultVariants: { tone: 'accent' },
})

export const spinnerStyles = tv({
  base: 'animate-spin motion-reduce:animate-none',
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerStyleProps = VariantProps<typeof spinnerStyles> &
  VariantProps<typeof spinnerToneStyles>
