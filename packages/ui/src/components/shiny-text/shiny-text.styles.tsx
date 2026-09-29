import { tv, type VariantProps } from '../../utils/tv'

/**
 * Class map for {@link ShinyText}. Pure and server-safe. A light band (built from `--sk-text` over a
 * `--sk-text-dim` base) sweeps across the clipped text; `-webkit-text-fill-color: transparent`
 * reveals it while `text-dim` stays as the real, legible fallback color. `motion-reduce:animate-none`
 * freezes the sweep for reduced-motion users (the dimmed text stays fully readable).
 *
 * The `animate-shine*` utilities and the `sk-shine` keyframe are emitted into the generated
 * `theme.css` by `scripts/build-tokens.ts`.
 */
export const shinyTextStyles = tv({
  base: [
    'inline-block bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
    'text-dim',
    'bg-[linear-gradient(110deg,var(--sk-text-dim)_40%,var(--sk-text)_50%,var(--sk-text-dim)_60%)]',
    'bg-[length:200%_100%]',
    'motion-reduce:animate-none',
  ],
  variants: {
    speed: {
      slow: 'animate-shine-slow',
      normal: 'animate-shine',
      fast: 'animate-shine-fast',
    },
  },
  defaultVariants: { speed: 'normal' },
})

export type ShinyTextStyleProps = VariantProps<typeof shinyTextStyles>
