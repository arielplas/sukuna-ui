import { tv, type VariantProps } from '../../utils/tv'

/**
 * Class map for {@link Counter}. Pure and server-safe — no variants, just the numeral rule that
 * keeps the width stable while the value counts. Color and size are inherited from context or a
 * consumer `className`.
 */
export const counterStyles = tv({
  base: 'tabular-nums',
})

export type CounterStyleProps = VariantProps<typeof counterStyles>
