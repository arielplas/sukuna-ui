import { tv, type VariantProps } from '../../utils/tv'

export const inputStyles = tv({
  base: [
    'w-full text-text border',
    'placeholder:text-text-faint',
    'transition-[border-color,box-shadow] duration-fast ease-sukuna',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:border-accent',
    'disabled:opacity-45 disabled:cursor-not-allowed',
  ],
  variants: {
    // Shared form-control surface treatment (Input, Select, Combobox, NumberField use the same map).
    // `filled` is the original look, so the default is unchanged.
    variant: {
      filled: 'bg-surface-2 border-line',
      outline: 'bg-transparent border-line',
      ghost: 'bg-transparent border-transparent hover:bg-surface-2',
    },
    size: {
      sm: 'h-8 px-3 text-sm rounded-sm',
      md: 'h-10 px-3 text-md rounded-md',
      lg: 'h-12 px-4 text-lg rounded-lg',
    },
    // Declared after `variant` so the crimson border wins even on `ghost`.
    invalid: {
      true: 'border-accent focus-visible:ring-focus-ring',
    },
  },
  defaultVariants: { variant: 'filled', size: 'md' },
})

export type InputStyleProps = VariantProps<typeof inputStyles>
