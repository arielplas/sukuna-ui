import { tv, type VariantProps } from '../../utils/tv'

export const radioGroupStyles = tv({
  slots: {
    group: 'flex',
    // The whole row is the Radio.Root (role=radio), so clicking the label text selects it too.
    // `group` lets the circle read the root's checked/focus state.
    item: 'group inline-flex items-center gap-2 cursor-pointer rounded-md focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45',
    control:
      'relative inline-flex items-center justify-center shrink-0 rounded-full border border-line bg-surface-2 group-data-[checked]:border-accent group-focus-visible:ring-2 group-focus-visible:ring-focus-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg',
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
