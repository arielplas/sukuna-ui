import { tv, type VariantProps } from '../../utils/tv'

export const skeletonStyles = tv({
  // The animation class lives in the `animation` variant (not the base) so the custom
  // `animate-shine-fast` utility never co-exists with `animate-pulse` — tailwind-merge doesn't know
  // the custom utility, so it couldn't dedupe the pair.
  base: 'motion-reduce:animate-none bg-surface-2',
  variants: {
    variant: {
      text: 'rounded-sm h-[1em]',
      rectangular: 'rounded-md',
      circular: 'rounded-full',
    },
    animation: {
      pulse: 'animate-pulse',
      // Reuses ShinyText's `sk-shine` keyframe (background-position sweep). The band is
      // `on-accent` (white in both themes) at 15%, so it reads as a highlight on light and dark.
      shimmer:
        'animate-shine-fast bg-linear-[110deg] from-transparent from-40% via-on-accent/15 via-50% to-transparent to-60% bg-[length:200%_100%]',
    },
  },
  defaultVariants: { variant: 'rectangular', animation: 'pulse' },
})

export type SkeletonStyleProps = VariantProps<typeof skeletonStyles>
