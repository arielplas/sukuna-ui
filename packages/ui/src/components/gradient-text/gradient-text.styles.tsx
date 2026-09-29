import { tv, type VariantProps } from '../../utils/tv'

/**
 * Class map for {@link GradientText}. Pure and server-safe. The gradient shows via
 * `-webkit-text-fill-color: transparent` over a clipped background, while a real `color`
 * (`text-accent`) stays as the accessible / non-supporting-browser fallback.
 *
 * `premium` is intentionally absent until the `--sk-gradient-premium` token + `bg-gradient-premium`
 * utility are approved (see `docs/questions.md` Q13); adding it later is additive.
 */
export const gradientTextStyles = tv({
  base: 'inline-block bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]',
  variants: {
    gradient: {
      accent: 'bg-gradient-accent text-accent',
    },
  },
  defaultVariants: { gradient: 'accent' },
})

export type GradientTextStyleProps = VariantProps<typeof gradientTextStyles>
