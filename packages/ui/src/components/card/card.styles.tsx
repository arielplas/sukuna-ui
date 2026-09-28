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
    // A clickable card: lifts on hover, and rings when it (or a link/button inside it) has
    // keyboard focus, so a card wrapping one <a> gets a card-sized focus indicator.
    interactive: {
      true: [
        'cursor-pointer transition-[border-color,box-shadow,translate] motion-reduce:transition-none duration-fast ease-sukuna',
        'hover:border-text-faint hover:shadow-card hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg',
      ],
    },
  },
  defaultVariants: { elevation: 'flat', padding: 'md', radius: 'lg' },
})

export type CardStyleProps = VariantProps<typeof cardStyles>
