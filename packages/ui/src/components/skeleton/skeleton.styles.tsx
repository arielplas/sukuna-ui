import { tv, type VariantProps } from '../../utils/tv'

export const skeletonStyles = tv({
  base: 'animate-pulse motion-reduce:animate-none bg-surface-2',
  variants: {
    variant: {
      text: 'rounded-sm h-[1em]',
      rectangular: 'rounded-md',
      circular: 'rounded-full',
    },
  },
  defaultVariants: { variant: 'rectangular' },
})

export type SkeletonStyleProps = VariantProps<typeof skeletonStyles>
