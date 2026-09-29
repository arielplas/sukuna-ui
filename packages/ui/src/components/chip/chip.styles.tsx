import { tv, type VariantProps } from '../../utils/tv'

export const chipStyles = tv({
  slots: {
    root: 'inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap align-middle select-none',
    dismiss:
      'inline-flex items-center justify-center rounded-sm -mr-1 size-4 opacity-70 hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
  },
  variants: {
    tone: {
      neutral: { root: 'bg-surface-2 text-text-dim border-line' },
      accent: { root: 'bg-gradient-accent text-text border-transparent' },
      success: { root: 'bg-surface-2 text-success border-line' },
      premium: { root: 'bg-surface-2 text-premium border-line' },
    },
    size: {
      sm: { root: 'h-6 px-2 text-xs' },
      md: { root: 'h-7 px-2.5 text-sm' },
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
})

export type ChipStyleProps = VariantProps<typeof chipStyles>
