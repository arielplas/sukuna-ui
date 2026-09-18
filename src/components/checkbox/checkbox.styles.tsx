import { tv, type VariantProps } from '../../utils/tv'

export const checkboxStyles = tv({
  base: [
    'accent-accent cursor-pointer rounded-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:opacity-45 disabled:cursor-not-allowed',
  ],
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
    },
  },
  defaultVariants: { size: 'md' },
})

export type CheckboxStyleProps = VariantProps<typeof checkboxStyles>
