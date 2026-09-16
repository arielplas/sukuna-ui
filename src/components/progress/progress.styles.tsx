import { tv, type VariantProps } from '../../utils/tv'

export const progressStyles = tv({
  slots: {
    root: 'w-full',
    label: 'mb-1 block text-sm text-text-dim',
    track: 'w-full overflow-hidden rounded-pill bg-surface-2',
    indicator:
      'h-full rounded-pill bg-accent transition-[width] duration-base ease-sukuna data-[indeterminate]:w-1/3 data-[indeterminate]:animate-pulse',
  },
  variants: {
    size: {
      sm: { track: 'h-1.5' },
      md: { track: 'h-2' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type ProgressStyleProps = VariantProps<typeof progressStyles>
