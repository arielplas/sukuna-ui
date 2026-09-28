import { tv, type VariantProps } from '../../utils/tv'

export const meterStyles = tv({
  slots: {
    root: 'w-full',
    header: 'mb-1 flex items-baseline justify-between gap-3 text-sm',
    label: 'text-text-dim',
    value: 'text-text tabular-nums',
    track: 'w-full overflow-hidden rounded-pill bg-surface-2',
    indicator:
      'h-full rounded-pill transition-[width] motion-reduce:transition-none duration-base ease-sukuna',
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
