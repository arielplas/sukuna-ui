import { tv, type VariantProps } from '../../utils/tv'

export const progressStyles = tv({
  slots: {
    root: 'w-full',
    label: 'mb-1 block text-sm text-text-dim',
    track: 'w-full overflow-hidden rounded-pill bg-surface-2',
    indicator: [
      // Determinate: grows in from the left on mount (@starting-style), then eases between values.
      'h-full rounded-pill origin-left starting:scale-x-0 transition-[width,scale] motion-reduce:transition-none duration-slow ease-sukuna',
      // Indeterminate: a 40% bar sliding across the track; static partial bar under reduced motion.
      // The reduce override must carry the same data- variant: [data-indeterminate] outranks a bare
      // motion-reduce: class (that is why the old pulse kept running under reduced motion).
      'data-[indeterminate]:w-2/5 data-[indeterminate]:animate-indeterminate motion-reduce:data-[indeterminate]:animate-none',
    ],
  },
  variants: {
    size: {
      sm: { track: 'h-1.5' },
      md: { track: 'h-2' },
      lg: { track: 'h-3' },
    },
    tone: {
      accent: { indicator: 'bg-accent' },
      success: { indicator: 'bg-success' },
      premium: { indicator: 'bg-premium' },
    },
  },
  defaultVariants: { size: 'md', tone: 'accent' },
})

export type ProgressStyleProps = VariantProps<typeof progressStyles>
