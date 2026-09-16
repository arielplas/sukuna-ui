import { tv, type VariantProps } from '../../utils/tv'

export const radioGroupStyles = tv({
  slots: {
    group: 'flex',
    item: 'inline-flex items-center gap-2 cursor-pointer data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    control:
      'relative inline-flex items-center justify-center shrink-0 rounded-full border border-line bg-surface-2 data-[checked]:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-glow focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    indicator: 'rounded-full bg-accent data-[unchecked]:hidden',
    label: 'text-sm text-text',
  },
  variants: {
    orientation: {
      vertical: { group: 'flex-col gap-3' },
      horizontal: { group: 'flex-row gap-5 flex-wrap' },
    },
    size: {
      sm: { control: 'size-4', indicator: 'size-2' },
      md: { control: 'size-5', indicator: 'size-2.5' },
    },
  },
  defaultVariants: { orientation: 'vertical', size: 'md' },
})

export type RadioGroupStyleProps = VariantProps<typeof radioGroupStyles>
