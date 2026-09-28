import { tv, type VariantProps } from '../../utils/tv'

export const dividerStyles = tv({
  base: 'border-line',
  variants: {
    orientation: {
      horizontal: 'w-full border-t',
      vertical: 'h-full self-stretch border-l',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export type DividerStyleProps = VariantProps<typeof dividerStyles>
