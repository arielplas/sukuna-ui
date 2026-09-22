import { tv, type VariantProps } from '../../utils/tv'

// Same tone × variant map as Badge (see badge.styles.tsx for the reasoning). `selected` is a
// `data-selected` visual state so it always beats the compound colors (attribute selector), like
// Tabs' `aria-selected` styling.
export const chipStyles = tv({
  slots: {
    root: [
      'inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap align-middle select-none',
      'data-[selected]:border-accent data-[selected]:text-accent',
    ],
    dismiss:
      'inline-flex items-center justify-center rounded-sm -mr-1 size-4 opacity-70 hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
  },
  variants: {
    tone: { neutral: {}, accent: {}, success: {}, premium: {} },
    variant: { auto: {}, soft: {}, solid: {}, outline: {} },
    size: {
      sm: { root: 'h-6 px-2 text-xs' },
      md: { root: 'h-7 px-2.5 text-sm' },
    },
  },
  compoundVariants: [
    // auto = original look
    { tone: 'neutral', variant: 'auto', class: { root: 'bg-surface-2 text-text-dim border-line' } },
    { tone: 'accent', variant: 'auto', class: { root: 'bg-gradient-accent text-text border-transparent' } },
    { tone: 'success', variant: 'auto', class: { root: 'bg-surface-2 text-success border-line' } },
    { tone: 'premium', variant: 'auto', class: { root: 'bg-surface-2 text-premium border-line' } },
    // soft
    { tone: 'neutral', variant: 'soft', class: { root: 'bg-surface-2 text-text-dim border-line' } },
    { tone: 'accent', variant: 'soft', class: { root: 'bg-surface-2 text-accent border-line' } },
    { tone: 'success', variant: 'soft', class: { root: 'bg-surface-2 text-success border-line' } },
    { tone: 'premium', variant: 'soft', class: { root: 'bg-surface-2 text-premium border-line' } },
    // solid
    { tone: 'neutral', variant: 'solid', class: { root: 'bg-text-dim text-bg border-transparent' } },
    { tone: 'accent', variant: 'solid', class: { root: 'bg-gradient-accent text-text border-transparent' } },
    { tone: 'success', variant: 'solid', class: { root: 'bg-success text-bg border-transparent' } },
    { tone: 'premium', variant: 'solid', class: { root: 'bg-premium text-bg border-transparent' } },
    // outline
    { tone: 'neutral', variant: 'outline', class: { root: 'bg-transparent text-text-dim border-line' } },
    { tone: 'accent', variant: 'outline', class: { root: 'bg-transparent text-accent border-accent' } },
    { tone: 'success', variant: 'outline', class: { root: 'bg-transparent text-success border-success' } },
    { tone: 'premium', variant: 'outline', class: { root: 'bg-transparent text-premium border-premium' } },
  ],
  defaultVariants: { tone: 'neutral', variant: 'auto', size: 'md' },
})

export type ChipStyleProps = VariantProps<typeof chipStyles>
