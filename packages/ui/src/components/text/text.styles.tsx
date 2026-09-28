import { tv, type VariantProps } from '../../utils/tv'

export const textStyles = tv({
  base: 'm-0',
  variants: {
    font: {
      sans: 'font-sans',
      display: 'font-display',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    weight: {
      regular: 'font-normal',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    },
    tone: {
      default: 'text-text',
      dim: 'text-text-dim',
      faint: 'text-text-faint',
      accent: 'text-accent',
      success: 'text-success',
      premium: 'text-premium',
    },
    align: {
      start: 'text-start',
      center: 'text-center',
      end: 'text-end',
    },
    leading: {
      tight: 'leading-tight',
      normal: 'leading-normal',
    },
    tracking: {
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      eyebrow: 'tracking-eyebrow uppercase',
    },
    truncate: { true: 'truncate' },
    numeric: { true: 'tabular-nums' },
  },
  defaultVariants: {
    font: 'sans',
    size: 'md',
    weight: 'regular',
    tone: 'default',
    leading: 'normal',
    tracking: 'normal',
  },
})

export type TextStyleProps = VariantProps<typeof textStyles>
