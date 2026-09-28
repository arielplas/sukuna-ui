import { tv, type VariantProps } from '../../utils/tv'

export const meterStyles = tv({
  slots: {
    root: 'w-full',
    header: 'mb-1 flex items-baseline justify-between gap-3 text-sm',
    label: 'text-text-dim',
    value: 'text-text tabular-nums',
    track: 'w-full overflow-hidden rounded-pill bg-surface-2',
    indicator:
      // Grows in from the left on mount (@starting-style), then eases between values.
      'h-full rounded-pill origin-left starting:scale-x-0 transition-[width,scale] motion-reduce:transition-none duration-slow ease-sukuna',
  },
  variants: {
    size: {
      sm: { track: 'h-1.5' },
      md: { track: 'h-2' },
    },
    tone: {
      accent: { indicator: 'bg-accent' },
      success: { indicator: 'bg-success' },
      premium: { indicator: 'bg-premium' },
    },
  },
  defaultVariants: { size: 'md', tone: 'accent' },
})

export type MeterStyleProps = VariantProps<typeof meterStyles>
