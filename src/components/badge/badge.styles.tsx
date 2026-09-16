import { tv, type VariantProps } from '../../utils/tv'

export const badgeStyles = tv({
  base: 'inline-flex items-center justify-center rounded-pill font-semibold whitespace-nowrap select-none align-middle',
  variants: {
    tone: {
      neutral: 'bg-surface-2 text-text-dim border border-line',
      accent: 'bg-gradient-accent text-text border border-transparent',
      success: 'bg-surface-2 text-success border border-line',
      premium: 'bg-surface-2 text-premium border border-line',
    },
    size: {
      sm: 'h-5 px-2 text-xs gap-1',
      md: 'h-6 px-2.5 text-sm gap-1.5',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
})

/** Leading status dot. Decorative — always paired with `aria-hidden`. */
export const badgeDot = 'inline-block size-1.5 rounded-full bg-current shrink-0'

export type BadgeStyleProps = VariantProps<typeof badgeStyles>
