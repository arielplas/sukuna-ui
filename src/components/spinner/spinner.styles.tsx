import { tv, type VariantProps } from '../../utils/tv'

export const spinnerStyles = tv({
  base: 'animate-spin',
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
    },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerStyleProps = VariantProps<typeof spinnerStyles>
