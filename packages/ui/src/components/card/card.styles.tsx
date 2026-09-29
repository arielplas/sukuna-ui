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
    // Declared after `elevation` so its border/background win the tailwind-merge conflict.
    // DECISION(open): premium = border + a subtle tint (owner may prefer border-only or tint-only).
    // The tint mixes 6% of the premium token into the surface token — no raw hex.
    tone: {
      default: '',
      premium: 'border-premium-dim bg-[color-mix(in_oklab,var(--sk-premium)_6%,var(--sk-surface))]',
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
    // Crimson halo on hover. Declared after `interactive` so its shadow wins over `shadow-card`.
    glow: {
      true: 'transition-shadow duration-fast ease-sukuna motion-reduce:transition-none hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]',
    },
  },
  defaultVariants: { elevation: 'flat', padding: 'md', radius: 'lg', tone: 'default' },
})

export type CardStyleProps = VariantProps<typeof cardStyles>
