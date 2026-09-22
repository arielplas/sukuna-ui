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
    // Visual affordance only: no role/tabIndex. Wrap the Card in (or put) a Link/Button so the
    // `focus-within` ring lights when that control is focused.
    interactive: {
      true: [
        'transition-[transform,box-shadow,border-color] duration-fast ease-sukuna motion-reduce:transition-none',
        'hover:-translate-y-0.5 hover:border-text-faint motion-reduce:hover:translate-y-0',
        'focus-within:ring-2 focus-within:ring-focus-ring focus-within:ring-offset-2 focus-within:ring-offset-bg',
      ],
    },
    glow: {
      true: 'transition-shadow duration-fast ease-sukuna motion-reduce:transition-none hover:shadow-[0_0_22px_4px_var(--sk-accent-glow)]',
    },
  },
  defaultVariants: { elevation: 'flat', padding: 'md', radius: 'lg', tone: 'default' },
})

export type CardStyleProps = VariantProps<typeof cardStyles>
