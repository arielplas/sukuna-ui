import { tv, type VariantProps } from '../../utils/tv'

export const cardStyles = tv({
  base: 'block text-text',
  variants: {
    elevation: {
      flat: 'bg-surface border border-line',
      raised: 'bg-surface border border-line shadow-card',
      sunken: 'bg-well border border-line',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    radius: {
      md: 'rounded-md',
      lg: 'rounded-lg',
    },
  },
  defaultVariants: { elevation: 'flat', padding: 'md', radius: 'lg' },
})

export type CardStyleProps = VariantProps<typeof cardStyles>
